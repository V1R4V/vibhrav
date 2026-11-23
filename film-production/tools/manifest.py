"""Record exact source assets and completed deliverables; no private input data."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
def record(p):return {'file':str(p.relative_to(ROOT.parent)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
assets=[]
for folder in ['public','capture']:
 for p in sorted((ROOT/folder).rglob('*')):
  if p.is_file() and '/audio/' not in str(p):assets.append(record(p))
exports=[]
for slug in ['nura','studyflow','vyaya']:
 for name in ['master.mp4','captions.vtt','script.txt','poster.png']:
  p=ROOT/'deliverables'/slug/name
  if p.exists():exports.append(record(p))
for p in sorted((ROOT.parent/'public/cinematic/films').glob('*v3*')):exports.append(record(p))
manifest={'format':1,'capture':'Native app UI, fictional coherent records; per-screen routes/state are in capture/{product} manifests.','compositions':'film-production/remotion/src/Root.tsx','licensing':'docs/product-films/licenses.md','sources':{'nura':'878caedee17e0544cc855558b3669374ab7b900e','studyflow':'47c1e61d1045338e31f043b2d52e2751b2f91d6d','vyaya':'c4f1fc28a338e81575f050ec97fd60dc0289b734'},'assets':assets,'exports':exports}
(ROOT.parent/'docs/product-films/asset-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(len(assets),'source assets,',len(exports),'exports')
