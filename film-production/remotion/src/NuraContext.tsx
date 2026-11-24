import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import { ContextWorld, move } from "./ContextWorld";
import data from "./context-data.json";
const ink = "#edf1e3",
  muted = "#a1b2a6",
  lime = "#c5df8b",
  lilac = "#baa9e9",
  teal = "#73b8a5",
  peach = "#e7a17b";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const Meta: React.FC<{
  children: React.ReactNode;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, color = muted, style }) => (
  <div
    style={{
      fontSize: 19,
      letterSpacing: ".11em",
      textTransform: "uppercase",
      fontWeight: 500,
      color,
      ...style,
    }}
  >
    {children}
  </div>
);
const Head: React.FC<{
  children: React.ReactNode;
  top?: number;
  width?: number;
  dark?: boolean;
  size?: number;
}> = ({ children, top = 228, width = 900, dark = false, size = 102 }) => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig();
  return (
    <Interactive.Div
      name="Editorial headline"
      style={{
        position: "absolute",
        left: 108,
        top,
        width,
        fontSize: size,
        lineHeight: 1.02,
        letterSpacing: "-.065em",
        fontWeight: 430,
        color: dark ? "#1a3027" : ink,
        opacity: interpolate(f, [0, 0.6 * fps], [0, 1], clamp),
        translate: interpolate(f, [0, 0.9 * fps], ["0px 30px", "0px 0px"], {
          ...clamp,
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      {children}
    </Interactive.Div>
  );
};
const Beat: React.FC<{ children: React.ReactNode; duration: number }> = ({
  children,
  duration,
}) => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          f,
          [0, 0.3 * fps, (duration - 0.4) * fps, duration * fps],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
const Opening = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig();
  return (
    <Beat duration={7.5}>
      <div style={{ opacity: move(f / fps, 0.8, 2) }}>
        <Meta style={{ position: "absolute", left: 112, top: 180 }}>
          Apple Watch analytics
        </Meta>
        <Head top={268} width={940} size={126}>
          Your health.
          <br />
          <span style={{ color: lime }}>In context.</span>
        </Head>
        <p
          style={{
            position: "absolute",
            left: 114,
            top: 622,
            width: 620,
            fontSize: 28,
            lineHeight: 1.5,
            color: muted,
          }}
        >
          The signals you collect.
          <br />
          The bigger picture they belong to.
        </p>
      </div>
      <div
        style={{
          position: "absolute",
          left: 114,
          top: 887,
          display: "flex",
          gap: 40,
          opacity: move(f / fps, 3.1, 4.4),
        }}
      >
        <Meta>Daily summary</Meta>
        <span style={{ color: teal }}>—</span>
        <Meta>Longer-term perspective</Meta>
      </div>
    </Beat>
  );
};
const Anatomy = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps,
    list = [
      ["Sleep", "7h 23m", "25%", lilac],
      ["Activity", "11,247 steps", "30%", lime],
      ["Cardio fitness", "47.8 VO₂ max", "35%", teal],
      ["Resting heart", "57 bpm", "10%", peach],
    ];
  return (
    <Beat duration={8.5}>
      <Meta style={{ position: "absolute", left: 112, top: 166 }}>
        01 / Look inside the estimate
      </Meta>
      <Head top={219} size={80} width={900}>
        One score.
        <br />
        Four contributing signals.
      </Head>
      <div
        style={{
          position: "absolute",
          left: 1190,
          top: 453,
          width: 170,
          textAlign: "center",
          color: ink,
          opacity: move(t, 0.4, 1.2),
        }}
      >
        <div
          style={{ fontSize: 128, fontWeight: 400, letterSpacing: "-.07em" }}
        >
          81
        </div>
        <Meta style={{ fontSize: 16, color: lime }}>Daily health</Meta>
      </div>
      <div style={{ position: "absolute", left: 114, top: 482, width: 800 }}>
        {list.map(([label, value, weight, color], i) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              height: 83,
              borderBottom: "1px solid #afc8aa26",
              opacity: move(t, 0.5 + i * 0.15, 1.3 + i * 0.15),
              translate: `${(1 - move(t, 0.5 + i * 0.15, 1.3 + i * 0.15)) * 25}px 0px`,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 9,
                background: color,
                marginRight: 21,
              }}
            />
            <div style={{ width: 236, fontSize: 25, color: ink }}>{label}</div>
            <div style={{ fontSize: 27, color, width: 300 }}>{value}</div>
            <span style={{ fontSize: 18, color: muted, marginLeft: "auto" }}>
              {weight} weight
            </span>
          </div>
        ))}
      </div>
      <Meta
        style={{
          position: "absolute",
          left: 114,
          top: 924,
          fontSize: 15,
          letterSpacing: ".04em",
        }}
      >
        Nov 22 · Health score is an app estimate · Recovery is separate
      </Meta>
    </Beat>
  );
};
const Perspective = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps;
  return (
    <Beat duration={8}>
      <Meta style={{ position: "absolute", left: 112, top: 166 }}>
        02 / Change the time scale
      </Meta>
      <Head top={220} size={90} width={1100}>
        A day is a snapshot.
        <br />
        <span style={{ color: lime }}>A pattern takes time.</span>
      </Head>
      <div
        style={{
          position: "absolute",
          right: 114,
          top: 220,
          display: "flex",
          gap: 70,
        }}
      >
        {[
          ["81", "Daily"],
          ["77", "Trailing 28 days"],
        ].map(([v, l], i) => (
          <div
            key={l}
            style={{
              textAlign: "right",
              minWidth: 160,
              opacity: move(t, 0.4 + i * 0.3, 1.2 + i * 0.3),
            }}
          >
            <div
              style={{
                fontSize: 85,
                letterSpacing: "-.065em",
                color: i ? ink : lime,
              }}
            >
              {v}
            </div>
            <Meta style={{ fontSize: 16 }}>{l}</Meta>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 180,
          right: 164,
          top: 861,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 19,
          color: muted,
        }}
      >
        <span>Oct 26</span>
        <span>28 days of context</span>
        <span>Nov 22</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 114,
          bottom: 80,
          display: "flex",
          gap: 50,
          fontSize: 20,
          color: muted,
        }}
      >
        <span>
          <i
            style={{
              display: "inline-block",
              background: teal,
              width: 10,
              height: 15,
              marginRight: 13,
            }}
          />
          Daily health estimates
        </span>
        <span>
          <i
            style={{
              display: "inline-block",
              background: ink,
              width: 35,
              height: 3,
              verticalAlign: "middle",
              marginRight: 13,
            }}
          />
          Trailing 28-day score
        </span>
      </div>
    </Beat>
  );
};
const Workout = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps,
    z = move(t, 4.3, 5.7);
  return (
    <Beat duration={9}>
      <Meta style={{ position: "absolute", left: 112, top: 166, color: peach }}>
        03 / Read the effort
      </Meta>
      <Head top={225} size={96}>
        Not just how long.
        <br />
        <span style={{ color: peach }}>How hard.</span>
      </Head>
      <div
        style={{
          position: "absolute",
          right: 114,
          top: 233,
          textAlign: "right",
        }}
      >
        <div style={{ fontSize: 93, letterSpacing: "-.07em", color: ink }}>
          48
          <span style={{ fontSize: 30, letterSpacing: 0, color: muted }}>
            {" "}
            min
          </span>
        </div>
        <Meta>Running · Nov 19</Meta>
        <p style={{ fontSize: 24, color: muted }}>145 bpm average · 174 peak</p>
      </div>
      <div
        style={{
          position: "absolute",
          left: 114,
          top: 459,
          color: muted,
          fontSize: 19,
          opacity: (1 - z) * move(t, 2.3, 2.6),
        }}
      >
        Heart rate · bpm
      </div>
      <div
        style={{
          position: "absolute",
          left: 400,
          top: 818,
          right: 400,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          color: muted,
          opacity: (1 - z) * move(t, 2.3, 2.6),
        }}
      >
        <span>0 min</span>
        <span>24 min</span>
        <span>48 min</span>
      </div>
      <div
        style={{
          opacity: move(t, 5.7, 6.3),
          position: "absolute",
          left: 100,
          top: 762,
          width: 1720,
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {data.workout.zonesMin.map((m, i) => (
          <div key={i} style={{ width: 210, textAlign: "center" }}>
            <Meta style={{ fontSize: 17 }}>Zone {i + 1}</Meta>
            <div style={{ fontSize: 29, color: ink, marginTop: 12 }}>
              {Math.floor(m)}m {Math.round((m % 1) * 60)}s
            </div>
          </div>
        ))}
      </div>
      <Meta
        style={{
          position: "absolute",
          left: 114,
          top: 946,
          fontSize: 16,
          letterSpacing: ".04em",
        }}
      >
        {t < 4.8
          ? "A recorded heart-rate trace, over the whole session."
          : "Time in heart-rate-reserve zones · 7m 15s below zone 1"}
      </Meta>
    </Beat>
  );
};
const Baseline = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps;
  return (
    <Beat duration={9}>
      <Meta
        color="#5b7562"
        style={{ position: "absolute", left: 112, top: 166 }}
      >
        04 / Understand your usual
      </Meta>
      <Head dark top={224} size={93} width={1050}>
        Recovery is personal.
        <br />
        <span style={{ color: "#648646" }}>So is the baseline.</span>
      </Head>
      <div style={{ position: "absolute", left: 114, top: 514, width: 800 }}>
        {[
          ["Overnight HRV · SDNN", "43 ms", "50 ms usual"],
          ["Sleeping heart rate", "58 bpm", "55 bpm usual"],
        ].map(([label, now, base], i) => (
          <div
            key={label}
            style={{
              padding: "22px 0",
              borderBottom: "1px solid #24402a33",
              opacity: move(t, 0.5 + i * 0.2, 1.3 + i * 0.2),
            }}
          >
            <div style={{ fontSize: 21, color: "#5b7562", marginBottom: 15 }}>
              {label}
            </div>
            <div style={{ display: "flex", gap: 75, alignItems: "baseline" }}>
              <span
                style={{
                  fontSize: 47,
                  color: "#243e2e",
                  letterSpacing: "-.04em",
                }}
              >
                {now}
              </span>
              <span style={{ fontSize: 25, color: "#6b7a65" }}>{base}</span>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 1140,
          top: 461,
          width: 300,
          textAlign: "center",
          color: "#213a2b",
        }}
      >
        <div style={{ fontSize: 88, letterSpacing: "-.06em" }}>7h 23m</div>
        <Meta color="#5b7562" style={{ fontSize: 17 }}>
          Asleep · latest night
        </Meta>
      </div>
      <div
        style={{
          position: "absolute",
          left: 1030,
          top: 846,
          width: 650,
          opacity: move(t, 5.2, 6.3),
        }}
      >
        <div style={{ fontSize: 20, color: "#5b7562", marginBottom: 19 }}>
          7h 38m in bed <span style={{ padding: "0 16px" }}>·</span> 15m awake
        </div>
        <div
          style={{ display: "flex", gap: 27, fontSize: 16, color: "#53664d" }}
        >
          {[
            ["Core", "#9580c4"],
            ["Deep", "#7d6fa9"],
            ["REM", "#bcd9a0"],
            ["Awake", "#cc835e"],
          ].map(([label, color]) => (
            <span key={label}>
              <i
                style={{
                  display: "inline-block",
                  width: 9,
                  height: 9,
                  background: color,
                  borderRadius: 2,
                  marginRight: 8,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
      <Meta
        color="#5b7562"
        style={{
          position: "absolute",
          left: 114,
          top: 943,
          fontSize: 16,
          letterSpacing: ".035em",
        }}
      >
        Readings compared with your own history · Scores remain estimates
      </Meta>
    </Beat>
  );
};
const History = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps;
  return (
    <Beat duration={6}>
      <Meta style={{ position: "absolute", left: 112, top: 166 }}>
        05 / Return to any day
      </Meta>
      <Head top={222} size={78} width={1250}>
        The day. <span style={{ color: lime }}>And what led up to it.</span>
      </Head>
      <div
        style={{
          position: "absolute",
          right: 114,
          top: 239,
          textAlign: "right",
          color: ink,
        }}
      >
        <Meta style={{ color: lime }}>Selected day</Meta>
        <div style={{ fontSize: 59, letterSpacing: "-.05em", marginTop: 17 }}>
          Nov 22
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 114,
          bottom: 110,
          display: "flex",
          gap: 104,
          opacity: move(t, 0.9, 1.7),
        }}
      >
        {[
          ["Health", "81", lime],
          ["Sleep", "78", lilac],
          ["Recovery", "32", peach],
        ].map(([label, value, color]) => (
          <div key={label}>
            <Meta>{label} estimate</Meta>
            <div
              style={{
                fontSize: 62,
                color,
                letterSpacing: "-.04em",
                marginTop: 12,
              }}
            >
              {value}
              <span style={{ fontSize: 22, color: muted, letterSpacing: 0 }}>
                {" "}
                /100
              </span>
            </div>
          </div>
        ))}
      </div>
    </Beat>
  );
};
const Closing = () => (
  <Beat duration={7}>
    <Head top={299} size={150} width={900}>
      Nura<span style={{ color: lime }}>.</span>
    </Head>
    <div
      style={{
        position: "absolute",
        left: 117,
        top: 500,
        width: 850,
        fontSize: 57,
        letterSpacing: "-.055em",
        lineHeight: 1.13,
        color: ink,
      }}
    >
      See what's behind
      <br />
      the number.
    </div>
    <Meta style={{ position: "absolute", left: 120, top: 807 }}>
      Apple Watch analytics
    </Meta>
  </Beat>
);
const Backdrop = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps,
    p = move(t, 32.6, 33.1) * (1 - move(t, 41.8, 42.2));
  return (
    <AbsoluteFill style={{ background: "#101d17" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 74% 40%,#314b3650,transparent 65%),linear-gradient(120deg,#182a2230,transparent)",
          opacity: 1 - p,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 74% 40%,#f3f3e8,#d9e0cc)",
          opacity: p,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          borderRadius: "50%",
          border: "1px solid #c5df8b0b",
          right: -130,
          top: -85,
        }}
      />
    </AbsoluteFill>
  );
};
const Identity = () => {
  const f = useCurrentFrame(),
    { fps } = useVideoConfig(),
    t = f / fps,
    dark = t >= 33 && t < 42;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 108,
          top: 64,
          display: "flex",
          alignItems: "center",
          gap: 15,
          color: dark ? "#233a2b" : ink,
        }}
      >
        <CanvasImage
          src={staticFile("brand/nura-mark.svg")}
          style={{ width: 42, height: 42 }}
        />
        <span
          style={{ fontSize: 31, fontWeight: 550, letterSpacing: "-.05em" }}
        >
          Nura
        </span>
      </div>
      <Meta
        color={dark ? "#61765c" : muted}
        style={{
          position: "absolute",
          right: 112,
          top: 82,
          fontSize: 15,
          letterSpacing: ".16em",
        }}
      >
        Health, in context
      </Meta>
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 112,
          right: 112,
          height: 1,
          background: dark ? "#1b3b2923" : "#d9ecc71c",
        }}
      />
    </>
  );
};
export const NuraContext: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{ fontFamily: "Inter", overflow: "hidden", background: "#101d17" }}
    >
      <Backdrop />
      <ContextWorld />
      <Sequence name="01 — The lens" durationInFrames={7.5 * fps}>
        <Opening />
      </Sequence>
      <Sequence
        name="02 — Score anatomy"
        from={7.5 * fps}
        durationInFrames={8.5 * fps}
      >
        <Anatomy />
      </Sequence>
      <Sequence
        name="03 — Day and perspective"
        from={16 * fps}
        durationInFrames={8 * fps}
      >
        <Perspective />
      </Sequence>
      <Sequence
        name="04 — Workout and intensity"
        from={24 * fps}
        durationInFrames={9 * fps}
      >
        <Workout />
      </Sequence>
      <Sequence
        name="05 — Personal baseline"
        from={33 * fps}
        durationInFrames={9 * fps}
      >
        <Baseline />
      </Sequence>
      <Sequence name="06 — History" from={42 * fps} durationInFrames={6 * fps}>
        <History />
      </Sequence>
      <Sequence
        name="07 — Resolution"
        from={48 * fps}
        durationInFrames={6 * fps}
      >
        <Closing />
      </Sequence>
      <Identity />
      <Audio
        src={staticFile("context/mix.wav")}
        name="Original score, narration and designed sound"
      />
    </AbsoluteFill>
  );
};
