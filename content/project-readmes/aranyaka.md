# Aranyaka — Wildlife Intelligence Pipeline

> *Āraṇyaka* (आरण्यक) — “of the forest.”  
> Ancient Vedic texts composed in the forest by those who watched and listened.

A microservices pipeline that turns camera-trap images into structured biodiversity records. Researchers upload photos, an async worker classifies the species, and observations are stored, filtered, reviewed, and visualized through a small React frontend.

**Website:** [aranyaka.vercel.app](https://aranyaka.vercel.app)  
**Demo Video:** [YouTube](https://youtu.be/Jjva60X1lYo?si=Ge50ePWtlQp9PGm3)
---

## Table of contents

1. [What it does](#what-it-does)
2. [Architecture](#architecture)
3. [Why services were separated](#why-services-were-separated)
4. [Async / event-driven workflow](#async--event-driven-workflow)
5. [AI model choices](#ai-model-choices)
6. [Model deployment approach](#model-deployment-approach)
7. [Data model](#data-model)
8. [API surface](#api-surface)
9. [Local setup](#local-setup)
10. [Production deployment](#production-deployment)
11. [Scaling considerations](#scaling-considerations)
12. [Limitations and future improvements](#limitations-and-future-improvements)

---

## What it does

A field researcher logs in, uploads a camera-trap image, picks a classifier, and watches the status flip `queued → processing → done` in real time. The result is a structured observation row containing species, confidence, top-5 alternatives, timestamp, the chosen model, and a signed link to the original image.

Five things a user can do once logged in:

- **Upload** one or many images (drag-drop or file picker, with client-side previews).
- **Monitor** processing status per upload.
- **Browse** observations, filter by species, minimum confidence, and review status.
- **Review** low-confidence detections in a dedicated queue, correct the species, and mark them human-verified.
- **Analyse** their own data — species distribution, confidence scores, daily counts.

Every action is scoped to the logged-in user. Two researchers using the same deployment never see each other's data.

---

## Architecture

```
                                      ┌─────────────────────────────┐
                                      │  Supabase (managed)         │
                                      │  • Postgres (metadata)      │
                                      │  • Storage  (originals)     │
                                      │  • Auth     (JWT, OAuth)    │
                                      └──────────────▲──────────────┘
                                                     │
   browser                                           │
   ┌──────────────┐         JWT          ┌───────────┴───────────┐
   │ React + Vite │ ───────────────────► │   upload-svc          │
   │  (Vercel)    │                      │   FastAPI :8001       │
   └──────┬───────┘                      │   - validates image   │
          │                              │   - stores to storage │
          │  JWT                         │   - enqueues job      │
          │                              └────────────┬──────────┘
          │                                           │ Celery task
          │                                           ▼
          │                              ┌───────────────────────┐
          │                              │   Upstash Redis       │
          │                              │   (broker)            │
          │                              └────────────┬──────────┘
          │                                           │ consumes
          │                              ┌────────────▼──────────┐         ┌──────────────────┐
          │                              │   inference-worker    │  HTTPS  │  HuggingFace     │
          │                              │   Celery (HTTP only)  │ ──────► │  Inference API   │
          │                              │   - downloads image   │ ◄────── │  (model host)    │
          │                              │   - calls HF API      │ predict └──────────────────┘
          │                              │   - POSTs result      │
          │                              └────────────┬──────────┘
          │                                           │ shared-secret
          │                                           ▼
          │                              ┌───────────────────────┐
          └────────────────────────────► │   observation-svc     │
                          JWT            │   FastAPI :8002       │
                                         │   - CRUD              │
                                         │   - filtering         │
                                         │   - analytics         │
                                         │   - review queue      │
                                         └───────────────────────┘
```

Four moving parts that we own (`upload-svc`, `observation-svc`, `inference-worker`, `frontend`), plus three managed dependencies (Supabase, Upstash Redis, the underlying HuggingFace model weights). The three backend services are the "≥ 3 independently running services" requirement; the React app is a thin client over the two HTTP services.

---

## Why services were separated

A monolithic FastAPI app would be shorter to write but worse to operate. The three concerns are genuinely different:

| Concern | What it needs |
|---|---|
| Upload | Fast HTTP, large multipart bodies, low CPU, high I/O. Wants to scale on request count. |
| Inference | Slow, CPU/memory heavy (PyTorch + ViT ≈ 1 GB resident). Wants to scale on queue depth, **not** request count. |
| Read / query | Cheap, mostly SELECTs and aggregations. Wants to scale independently of either of the above. |

Mixing them in one process means:

- The model fights uvicorn for memory on every request — cold starts get worse, OOMs become possible.
- A slow inference run blocks the event loop and stalls the next upload.
- You can't horizontally scale uploads without also paying to spin up another copy of the model.
- Deploying a model change forces redeploying the HTTP API, and vice versa.

**Splitting them lets each service pick its own runtime, instance size, scaling policy, and dependency footprint. Concretely:**

- `upload-svc` is on Render's free tier (small instance, mostly idle, scales on traffic).
- `inference-worker` is on Render's Starter tier (always-on, sized for the model). It has zero public HTTP surface — the only way to reach it is by enqueueing a job.
- `observation-svc` is on free tier alongside `upload-svc` because its workload is similar (small, fast HTTP), but it has its own deploy and rollback lifecycle.

A second benefit shows up in the auth model. `upload-svc` and `observation-svc` accept Supabase JWTs from end-users. The worker has no user session — it acts on jobs from the queue — so the worker-to-`observation-svc` call uses a separate shared-secret header (`WORKER_INTERNAL_TOKEN`). Splitting services made this dual auth model natural; in a monolith you'd have to invent the same boundary internally.

---

## Async / event-driven workflow

The flow of how the service works

1. **User uploads** an image to `POST /uploads` on `upload-svc`.
2. **upload-svc** validates the image (MIME, dimensions, decompression-bomb guard), uploads the original and a small client-rendered preview to Supabase Storage, writes an `uploads` row with `status = 'queued'`, and **enqueues a Celery task** on Redis: `run_inference(upload_id, user_id, model_id)`.
3. Upload-svc returns `{upload_id, status: "queued", model_id}` **immediately** — the user's HTTP request never waits for inference.
4. **inference-worker** pulls the task off the queue, fetches the upload row, marks `status = 'processing'`, downloads the image bytes from Storage.
5. Worker POSTs the JPEG bytes to the HuggingFace Inference API for the chosen model and gets back the top-5 predictions. If HF returns `503 model loading`, the worker honours the `estimated_time` hint and retries.
6. Worker decides `review_status`: `auto_approved` if top-1 confidence ≥ 0.6, else `needs_review`.
7. Worker **POSTs the structured observation** to `observation-svc/observations` with the shared-secret header. observation-svc inserts (or no-ops on conflict — the upload_id is unique).
8. Worker marks the upload `status = 'done'`. On exception it retries up to 2× with exponential backoff and jitter; final failure flips `status = 'failed'` with an error message.
9. **Frontend** polls `GET /uploads/{id}` while a job is in flight and refreshes the observations list when status reaches `done`.

A few details worth calling out:

- **At-least-once delivery, idempotent insert.** Celery's `task_acks_late=True` + `task_reject_on_worker_lost=True` means a job that crashes mid-execution will be re-delivered. To survive that safely, `observations.upload_id` is a unique index and the insert catches `IntegrityError` and returns the existing row instead of double-writing. The user sees the same observation either way.
- **Backpressure.** `upload-svc` checks Redis queue depth (`LLEN inference_jobs`) before accepting a new upload. If the queue exceeds `MAX_PENDING_UPLOAD_JOBS` (default 100), it returns 503 instead of letting jobs pile up unbounded. Per-user rate limiting (10 uploads/min by default) lives in a Redis counter keyed by `(user_id, minute_bucket)`.
- **Why Redis/Celery and not Kafka/RabbitMQ.** This is a hackathon-scale system: low throughput, small number of producers and consumers, single queue. Kafka's strengths (partitioned ordering, replay, multi-consumer fan-out) aren't needed. Celery on Redis gives us retries, visibility timeouts, ack-late semantics, and a managed broker (Upstash) in 20 lines of config. The trade-off is documented in [Limitations](#limitations-and-future-improvements).

---

## AI model choices

We expose **two interchangeable classifiers**, selected per-upload from a dropdown in the UI:

| ID | Model | Why it's here |
|---|---|---|
| `vit-imagenet` | `google/vit-base-patch16-224` | General ImageNet-1k classifier. Strong baseline, ~100 animal classes among 1000 total. Good for diverse inputs but can mislabel unusual wildlife as the nearest ImageNet category. |
| `convnext-tiny` | `facebook/convnext-tiny-224` | Modern CNN architecture trained on ImageNet-1k. Different family from ViT (CNN vs Transformer) — useful as a cross-check on the first model's prediction. |

We don't load them locally as they're served by HuggingFace's Inference API and the worker is an HTTP client (see [Model deployment approach](#model-deployment-approach) below). The worker process stays at ~120 MB; swapping or adding models is a one-line change in the registry.

**Why two general classifiers instead of a dedicated wildlife model?** Two real constraints shape this:

1. **SpeciesNet isn't on HF Inference.** Google's SpeciesNet ships as a TensorFlow Python package (~500 MB weights). Using it would mean self-hosting on the worker (won't fit Render Starter's 512 MB) or paying for a dedicated HF Inference Endpoint (~$45/mo minimum). Neither fits a hackathon budget.
2. **Community wildlife fine-tunes on HF Hub are not on the auto-serving provider.** As of 2025, HuggingFace's free Inference API (`provider: hf-inference`) only auto-serves a curated set of well-known models — community fine-tunes like `dima806/animal_151_types_image_detection` return `400 "Model not supported by provider hf-inference"`. We discovered this the hard way; the README's `vit-animals-151` slot is now ConvNeXt-Tiny.

So the picker offers **two architectures over the same ImageNet-1k label set**: a Transformer (ViT) and a CNN (ConvNeXt). ImageNet-1k contains ~100 animal classes (leopard, gazelle, panda, gorilla, zebra, …), so wildlife photos still classify reasonably — just with ImageNet labels rather than finer species. Pedagogically, comparing predictions from two different model families on the same image is actually more interesting than running one fine-tuned model.

If I had budget for it, the natural next step would be a dedicated wildlife model on an HF Inference Endpoint, the architecture supports it: add the entry to the `MODELS` registry, set the endpoint URL via env, ship.

**Structured output** matches the PDF spec, plus what we found we actually needed:

```json
{
  "id": "8e7…",
  "upload_id": "abc123",
  "species": "Cheetah",
  "confidence": 0.568,
  "top_k": [
    {"label": "Cheetah", "score": 0.568},
    {"label": "Leopard", "score": 0.182},
    {"label": "Cougar",  "score": 0.094}
  ],
  "timestamp": "2026-05-20T10:20:00Z",
  "review_status": "needs_review",
  "preview_url": "https://…signed-supabase-url…"
}
```

`top_k` is what powers the human-review queue — a reviewer can see "the model wasn't sure, here are its other guesses" and pick the right label without retyping.

---

## Model deployment approach

The inference-worker **calls the HuggingFace Inference API** (`router.huggingface.co/hf-inference/models/<model_id>`) over HTTPS. The model is genuinely deployed independently — on HuggingFace's infrastructure — and the worker is a thin orchestrator that fetches the image from Storage, posts it to HF, parses the prediction, and writes the observation. This matches the PDF's "HuggingFace Inference Endpoints" deployment option literally.

Why this over self-hosted PyTorch in the worker:

- **No model weights in worker RAM.** A ViT-base in memory is ~340 MB plus PyTorch's ~250 MB runtime overhead. Render's Starter plan (512 MB) OOMs on first inference. Moving the model off the worker drops its steady-state RAM to ~120 MB, which fits comfortably.
- **Higher concurrency for free.** Each Celery task is now an HTTP call instead of a CPU-bound forward pass. The worker runs `--concurrency=4`, so up to 4 images classify in parallel from the same instance.
- **No torch / transformers in the dependency tree.** Container builds finish in ~15s instead of ~3 minutes, and the image is ~150 MB instead of ~2 GB.
- **Same interface from the queue's perspective.** Producers don't know or care that inference is remote. Switching back to self-hosted (or to a dedicated HF Inference Endpoint, or to Vertex AI) is a change to one file — `classify()` in [`inference-worker/model.py`](inference-worker/model.py) — and nothing else moves.

On Render the worker is deployed as a **Background Worker** (no public URL, no HTTP port, just a long-running process consuming Redis). Its only outbound dependencies are Redis (Upstash), Supabase Storage, observation-svc, and the HF router.

**Cold-start behaviour.** When a model on HF has been idle for a while, the first request returns `503` with an `estimated_time` field indicating warmup duration (usually 15-20 s for ViT-class models). The worker handles this with a small retry loop in `_call_hf()`: it backs off by `estimated_time` and tries again, up to `HF_WARMUP_RETRIES` times. Subsequent inferences on the same warm model are sub-second.

**Authentication.** A read-scoped HF API token (`HF_API_TOKEN` env var) is required — the router rejects anonymous requests with `401`. Free-tier rate limits are generous enough for a demo; for production you'd either upgrade to a paid HF tier or move to a dedicated Inference Endpoint with no shared rate limit.

---

## Data model

Two tables, both keyed by `user_id` so a single deployment cleanly serves multiple researchers.

```
uploads
  id              uuid pk
  user_id         uuid not null   -- references auth.users
  filename        text
  storage_path    text            -- supabase storage object path
  status          text            -- queued | processing | done | failed
  error_message   text
  uploaded_at     timestamptz

observations
  id              uuid pk
  upload_id       uuid not null unique   -- one observation per upload (idempotency)
  user_id         uuid not null
  species         text
  confidence      double precision       -- 0..1
  top_k           jsonb                  -- [{label, score} × 5]
  review_status   text                   -- auto_approved | needs_review | human_verified
  model_id        text                   -- which classifier produced this row
  timestamp       timestamptz
```

Indexes in [`supabase/migrations/20260520000000_prod_guardrails.sql`](supabase/migrations/20260520000000_prod_guardrails.sql) cover the query patterns the UI uses: `(user_id, uploaded_at desc)`, `(user_id, status)`, `(user_id, timestamp desc)`, `(user_id, review_status)`, `(user_id, species)`. CHECK constraints enforce the status enums at the DB level so a bug in either service can't write an invalid value.

Per-user scoping is enforced at the application layer today: every query in [`observation-svc/app/routes.py`](observation-svc/app/routes.py) filters `Observation.user_id == jwt.sub`, and the worker stamps `user_id` on the row from the queue payload. Row-level security (Postgres RLS) is a follow-up that would move this guarantee from the application to the database itself — see [Limitations](#limitations-and-future-improvements).

---

## API surface

### `upload-svc`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/uploads` | user JWT | Multipart upload: `file`, optional `preview`, optional `model_id`. Returns `{upload_id, status, model_id}`. |
| GET | `/uploads/{id}` | user JWT | Status of one upload (scoped to the caller). |
| GET | `/uploads` | user JWT | Recent uploads for the caller, newest first. |
| GET | `/models` | none | Lists the available classifiers and their descriptions for the UI picker. |
| GET | `/health`, `/ready` | none | Liveness + dependency check. |

### `observation-svc`

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/observations` | worker shared-secret | Insert a new observation. Idempotent on `upload_id`. |
| GET | `/observations` | user JWT | List with filters: `species`, `min_confidence`, `review_status`, pagination. |
| GET | `/observations/{id}` | user JWT | One observation, with a signed preview URL. |
| PATCH | `/observations/{id}/review` | user JWT | Correct the species and/or mark as `human_verified`. |
| DELETE | `/observations/{id}` | user JWT | Remove an observation. |
| GET | `/analytics/summary` | user JWT | Per-user species counts, confidence buckets, daily counts (30-day window). |
| GET | `/health`, `/ready` | none | Liveness + dependency check. |

---

## Local setup

Prereqs: Python 3.11, Node 20, Docker (for Redis), a Supabase project, a HuggingFace read-scoped API token (https://huggingface.co/settings/tokens).

```bash
# 1. clone + env
cp .env.example .env
# fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, DATABASE_URL, etc.

# 2. database migrations (in Supabase SQL editor or psql)
psql "$DATABASE_URL" -f supabase/migrations/20260520000000_prod_guardrails.sql

# 3. virtualenvs (once)
for d in upload-svc observation-svc inference-worker; do
  (cd $d && python3.11 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt)
done

# 4. redis
docker compose up redis -d

# 5. backend (all 3 services with tagged logs)
./scripts/dev.sh

# 6. frontend (separate terminal)
cd frontend && npm install && npm run dev
```

Open http://localhost:5173, sign up, upload an image. You should see it move `queued → processing → done` within a few seconds, and the resulting observation will appear in the catalogue and review queue.

Alternative one-shot: `docker compose up --build` boots all four (Redis + 3 services) in containers. Frontend still runs separately with `npm run dev`.

---

## Production deployment

The blueprint in [`render.yaml`](render.yaml) deploys all three backend services to [Render](https://render.com) in one click:

- `aranyaka-upload-svc` → free web service
- `aranyaka-observation-svc` → free web service
- `aranyaka-inference-worker` → **Starter** background worker (paid, $7/mo flat — needed so the model process never sleeps)

Managed dependencies:

- **Postgres + Storage + Auth** — Supabase free tier.
- **Redis broker** — Upstash free tier (10 k commands/day, 256 MB).
- **Inference** — HuggingFace Inference API (free tier, rate-limited but ample for a demo).
- **Frontend** — Vercel free tier.

Free Render web services sleep after 15 min of idle. To keep the demo responsive during the eval window, [`.github/workflows/keep-warm.yml`](.github/workflows/keep-warm.yml) pings `/health` on both free services every 10 minutes via GitHub Actions cron.

Step-by-step deployment notes live in the [render.yaml comments](render.yaml). The short version:

1. Provision Upstash Redis, copy the `rediss://` URL.
2. Push to GitHub, point Render at the repo, paste the `sync: false` secrets when prompted.
3. Deploy the frontend to Vercel with `VITE_UPLOAD_API_URL` and `VITE_OBSERVATION_API_URL` pointing at the Render URLs.
4. Update `CORS_ALLOWED_ORIGINS` on both Render services to include the Vercel URL.
5. Add the Vercel URL to Supabase Auth's redirect allowlist (and to your Google OAuth client if you're using it).

---

## Scaling considerations

What this design buys you and what it doesn't.

**Scales naturally:**

- **Upload throughput.** `upload-svc` is stateless. Add more instances behind a load balancer and they'll all share the same Redis queue and Postgres. Free tier is one instance, but the architecture doesn't change at any size.
- **Inference throughput.** Add more worker instances and Celery distributes tasks across them automatically. Each worker is one model copy on one CPU; doubling workers doubles throughput linearly until you saturate the broker. For higher per-instance throughput, raise Celery concurrency (and the per-instance memory budget) so a single process can hold multiple model copies, or switch to GPU instances.
- **Read traffic.** `observation-svc` queries are all indexed by `(user_id, …)` and bounded by `limit`. Pagination is already in the API. Postgres on Supabase can handle orders of magnitude more reads than this app generates.
- **Different model in the loop.** Drop in a new entry in the `MODELS` registry, ship the worker, and it shows up in the UI dropdown automatically (both services share the same model list).

**Has clear next steps when you outgrow the current setup:**

- **Storage cost.** Originals live in Supabase Storage forever today. At scale you'd add a lifecycle policy that moves originals to cold storage after N days, keeping only the preview JPEG hot.
- **Queue durability.** Redis is configured as the Celery broker; for higher durability guarantees you'd move to RabbitMQ or Kafka and use the broker's persistent-storage modes. The Celery API stays the same.
- **Auth scope.** RLS in Postgres would mean even a compromised service couldn't read another user's rows. Today the boundary is enforced in application code only.

---

## Limitations and future improvements

Honest list of what's not done and what we'd change with more time.

**Operational gaps**
- **No structured logging or tracing.** Each service prints to stdout. Production-grade observability (OpenTelemetry traces from upload-svc → Celery → observation-svc) is a clear next step.
- **No dead-letter queue.** A Celery task that fails its retry budget marks the upload `failed` and stops. There's no separate inspection path; an operator has to read worker logs.
- **No webhook to the frontend.** The UI polls `GET /uploads/{id}` while a job is in flight. A Supabase Realtime channel or a server-sent events stream from `observation-svc` would replace polling with a push.

**Security**
- **RLS not enabled yet.** Per-user isolation is enforced in application code (every query filters by JWT `sub`). Postgres row-level security would move that guarantee into the database. Migration is straightforward but deferred to keep the eval scope tight.
- **CORS is permissive on dev.** Locked down to the Vercel origin in production via `CORS_ALLOWED_ORIGINS`.
- **The `WORKER_INTERNAL_TOKEN` is a shared secret.** For an internal-only call between Render services this is acceptable; a longer-lived deployment would migrate to mTLS or a service-account JWT.

**Model**
- **Shared HF Inference API.** Free tier is rate-limited and shares warm pools with everyone else on HF. Acceptable for a demo; for production you'd move to a dedicated HF Inference Endpoint (≈$45+/mo) or self-host on a GPU instance. Either is a one-file change in [`inference-worker/model.py`](inference-worker/model.py).
- **No SpeciesNet.** Google's SpeciesNet isn't on HF's auto-serving roster and self-hosting it doesn't fit our memory budget. Two ViTs cover the same use case at zero inference cost. See [AI model choices](#ai-model-choices).
- **No detection / cropping.** We classify the whole image. A real wildlife pipeline would run a detector first (e.g. MegaDetector) and feed cropped animal boxes to the species classifier. The architecture supports this — it's a second model in the same registry, called sequentially in the worker — but we shipped without it.
- **No active learning loop.** The "human_verified" reviews aren't fed back to fine-tune the model. The data structure is ready (`top_k` plus the corrected `species`) but the training pipeline doesn't exist.

**Frontend**
- **Polling cadence is fixed.** It backs off only mildly.
- **No mobile layout pass.** Designed for desktop / tablet first.

**Cost ceiling**
- Render Starter on the worker is $7/mo flat. Everything else is on free tiers. The total spend ceiling on this setup, with a Render workspace spend cap, is bounded at ~$15/mo even under burst.

---

## Project layout

```
.
├── frontend/                  React + Vite + Tailwind UI
├── upload-svc/                FastAPI — uploads, queue producer
├── observation-svc/           FastAPI — observations CRUD, analytics
├── inference-worker/          Celery worker, multi-model registry
├── supabase/migrations/       SQL schema + guardrails
├── scripts/dev.sh             boot all 3 services locally
├── docker-compose.yml         local stack incl. Redis
├── render.yaml                production blueprint (Render)
└── .github/workflows/         keep-warm cron for free services
```

---
