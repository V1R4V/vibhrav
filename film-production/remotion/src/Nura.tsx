import {
  AbsoluteFill,
  CanvasImage,
  Interactive,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  arrive,
  Brand,
  clamp,
  Heading,
  lerpRect,
  Pointer,
  Reveal,
  Screen,
  travel,
} from "./system";

const Opening = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [112, 153], [0, 1], { ...clamp, easing: travel });
  return (
    <AbsoluteFill style={{ background: "#101d17" }}>
      <Brand slug="nura" name="Nura" />
      <Interactive.Div
        name="Opening promise"
        style={{
          position: "absolute",
          left: 96,
          top: 256,
          width: 670,
          fontSize: 106,
          fontWeight: 450,
          letterSpacing: "-.065em",
          lineHeight: 1.02,
          color: "#eef3e8",
          opacity: interpolate(f, [0, 22, 106, 123], [0.05, 1, 1, 0], clamp),
          translate: interpolate(f, [0, 27], ["0px 28px", "0px 0px"], {
            ...clamp,
            easing: arrive,
          }),
        }}
      >
        Your health,
        <br />
        in context.
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 101,
          top: 540,
          fontSize: 28,
          lineHeight: 1.5,
          color: "#adbdab",
          opacity: interpolate(f, [14, 33, 103, 121], [0, 1, 1, 0], clamp),
        }}
      >
        Apple Watch analytics.
        <br />
        One connected view.
      </div>
      <div style={{ opacity: interpolate(f, [121, 144], [0, 1], clamp) }}>
        <Heading label="Daily summary · Nov 22">Start with today.</Heading>
      </div>
      <Screen
        src="nura/overview.png"
        rect={lerpRect(
          { x: 794, y: 188, w: 1030, h: 756 },
          { x: 96, y: 240, w: 1100, h: 696 },
          p,
        )}
        crop={lerpRect(
          { x: 292, y: 45, w: 1092, h: 800 },
          { x: 300, y: 55, w: 638.4, h: 404 },
          p,
        )}
      />
      <div
        style={{
          position: "absolute",
          left: 1310,
          top: 352,
          fontSize: 49,
          lineHeight: 1.4,
          letterSpacing: "-.035em",
          color: "#c5d6b5",
          opacity: interpolate(f, [158, 179], [0, 1], clamp),
        }}
      >
        The readings.
        <br />
        The weights.
        <br />
        The context.
      </div>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 980,
          fontSize: 22,
          color: "#aebda9",
          opacity: interpolate(f, [155, 174], [0, 1], clamp),
        }}
      >
        Sleep · activity · cardio fitness · resting heart rate
      </div>
    </AbsoluteFill>
  );
};

const Period = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [22, 58], [0, 1], { ...clamp, easing: travel });
  return (
    <Reveal>
      <Brand slug="nura" name="Nura" />
      <Heading label="Oct 24 – Nov 22 · selected period">
        A longer view.
      </Heading>
      <div
        style={{
          position: "absolute",
          left: 99,
          top: 360,
          color: "#bad77b",
          fontSize: 35,
          lineHeight: 1.5,
        }}
      >
        30 days.
        <br />
        <span style={{ color: "#a5b2a0", fontSize: 27 }}>One period.</span>
      </div>
      <Screen
        src="nura/health-month.png"
        rect={lerpRect(
          { x: 546, y: 237, w: 1278, h: 732 },
          { x: 546, y: 225, w: 1278, h: 732 },
          p,
        )}
        crop={{ x: 298, y: 176, w: 1075, h: 615 }}
      />
    </Reveal>
  );
};

const Trend = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [20, 52], [0, 1], { ...clamp, easing: travel });
  return (
    <Reveal kind="cut">
      <Brand slug="nura" name="Nura" />
      <Heading label="Daily score ≠ selected-period score">
        Read the pattern.
      </Heading>
      <Screen
        src="nura/health-trend.png"
        rect={lerpRect(
          { x: 96, y: 305, w: 1728, h: 565 },
          { x: 96, y: 275, w: 1728, h: 565 },
          p,
        )}
        crop={{ x: 300, y: 568, w: 1072, h: 350 }}
      />
      <div
        style={{
          position: "absolute",
          left: 99,
          top: 913,
          display: "flex",
          gap: 50,
          fontSize: 28,
          color: "#c6d7b5",
        }}
      >
        <span>Daily bars</span>
        <span style={{ color: "#eef3e8" }}>28-day score line</span>
      </div>
    </Reveal>
  );
};

const Workout = () => {
  const f = useCurrentFrame();
  const detail = f >= 58;
  const zones = f >= 130;
  return (
    <Reveal kind="cut">
      <Brand slug="nura" name="Nura" />
      <Heading
        label={
          detail ? "Running · Nov 19 · 48 minutes" : "Workouts · selected month"
        }
      >
        Behind every session.
      </Heading>
      {!detail ? (
        <Screen
          src="nura/workouts.png"
          rect={{ x: 96, y: 246, w: 1728, h: 714 }}
          crop={{ x: 298, y: 116, w: 1076, h: 445 }}
        />
      ) : !zones ? (
        <Screen
          src="nura/workout-zones.png"
          rect={{ x: 96, y: 284, w: 1728, h: 582 }}
          crop={{ x: 300, y: 144, w: 1072, h: 360 }}
        />
      ) : (
        <>
          <Screen
            src="nura/workout-zones.png"
            rect={{ x: 96, y: 285, w: 1060, h: 485 }}
            crop={{ x: 300, y: 516, w: 530, h: 243 }}
          />
          <div
            style={{
              position: "absolute",
              left: 1250,
              top: 335,
              color: "#e4b07f",
              fontSize: 66,
              letterSpacing: "-.045em",
              lineHeight: 1.1,
            }}
          >
            Intensity,
            <br />
            unpacked.
            <div
              style={{
                fontSize: 26,
                color: "#a7b39f",
                marginTop: 40,
                letterSpacing: "-.02em",
              }}
            >
              48-minute run · HR reserve
              <div style={{ fontSize: 22, marginTop: 18 }}>
                7m 15s below zone 1
              </div>
            </div>
          </div>
        </>
      )}
      <Pointer x={220} y={918} at={50} />
    </Reveal>
  );
};

const History = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [77, 108], [0, 1], { ...clamp, easing: travel });
  return (
    <Reveal bg="#edf1e5">
      <Brand slug="nura" name="Nura" color="#15241a" />
      <Heading
        dark
        label={
          f >= 110
            ? "Nov 19 · historical daily summary"
            : "Explore a day and the weeks before it"
        }
        accent="#53713a"
      >
        Go back. Find the pattern.
      </Heading>
      <div style={{ opacity: interpolate(f, [97, 110], [1, 0], clamp) }}>
        <Screen
          src="nura/calendar.png"
          rect={lerpRect(
            { x: 1016, y: 258, w: 731, h: 650 },
            { x: 1098, y: 258, w: 649, h: 650 },
            p,
          )}
          crop={{ x: 916, y: 29, w: 457, h: 407 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 325,
          width: 800,
          color: "#203121",
          opacity: interpolate(f, [15, 32, 73, 93], [0, 1, 1, 0], clamp),
        }}
      >
        <div
          style={{ fontSize: 100, lineHeight: 1.04, letterSpacing: "-.055em" }}
        >
          A date.
          <br />
          Its context.
        </div>
        <div style={{ fontSize: 29, marginTop: 40, color: "#62705d" }}>
          Daily health scores
          <br />
          inside the calendar.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${interpolate(f, [79, 110], [100, 0], { ...clamp, easing: travel })}% 0 0)`,
        }}
      >
        <Screen
          src="nura/historical-summary.png"
          rect={{ x: 96, y: 247, w: 1728, h: 651 }}
          crop={{ x: 300, y: 55, w: 1072, h: 404 }}
        />
      </div>
      <Pointer x={1231} y={708} at={78} />
    </Reveal>
  );
};

const Signals = () => {
  const f = useCurrentFrame();
  const recovery = f >= 96;
  return (
    <Reveal kind="cut">
      <Brand slug="nura" name="Nura" />
      <Heading label="App estimates · inputs shown">
        Sleep. Then recovery.
      </Heading>
      <Screen
        src={recovery ? "nura/recovery.png" : "nura/sleep.png"}
        rect={{ x: 156, y: 239, w: 1608, h: recovery ? 725 : 673 }}
        crop={{ x: 300, y: 311, w: 1072, h: recovery ? 483 : 448 }}
      />
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 992,
          fontSize: 24,
          color: "#bbc6b5",
        }}
      >
        {recovery
          ? "Recovery · averages of own-baseline comparisons"
          : "Sleep · selected-period average and latest night"}
      </div>
    </Reveal>
  );
};

const Ending = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 35], [0, 1], { ...clamp, easing: arrive });
  return (
    <Reveal bg="#edf1e5">
      <Brand slug="nura" name="Nura" color="#17271b" />
      <Interactive.Div
        name="Nura closing promise"
        style={{
          position: "absolute",
          left: 96,
          top: 234,
          fontSize: 100,
          fontWeight: 450,
          lineHeight: 1.06,
          letterSpacing: "-.06em",
          color: "#17271b",
          translate: interpolate(f, [15, 40], ["0px 22px", "0px 0px"], {
            ...clamp,
            easing: arrive,
          }),
        }}
      >
        Health data,
        <br />
        made understandable.
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 102,
          top: 570,
          fontSize: 29,
          color: "#5f725c",
        }}
      >
        Explore Nura <span style={{ marginLeft: 45 }}>↗</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 128,
          top: 690,
          scale: 0.92 + 0.08 * p,
        }}
      >
        <CanvasImage
          src={staticFile("brand/nura-mark.svg")}
          style={{ width: 210, height: 210 }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 101,
          top: 924,
          fontSize: 23,
          color: "#66765f",
        }}
      >
        Apple Watch data. A clearer view.
      </div>
    </Reveal>
  );
};

export const Nura = () => (
  <AbsoluteFill
    style={{ fontFamily: "Inter", color: "#edf3e8", background: "#101d17" }}
  >
    <Sequence name="Unified daily overview" durationInFrames={322}>
      <Opening />
    </Sequence>
    <Sequence
      name="Selected-period health score"
      from={300}
      durationInFrames={202}
    >
      <Period />
    </Sequence>
    <Sequence
      name="Daily bars and 28-day line"
      from={480}
      durationInFrames={172}
    >
      <Trend />
    </Sequence>
    <Sequence name="Workout record and zones" from={630} durationInFrames={232}>
      <Workout />
    </Sequence>
    <Sequence
      name="Native historical calendar"
      from={840}
      durationInFrames={202}
    >
      <History />
    </Sequence>
    <Sequence
      name="Supporting sleep and recovery"
      from={1020}
      durationInFrames={232}
    >
      <Signals />
    </Sequence>
    <Sequence name="Nura end card" from={1230} durationInFrames={150}>
      <Ending />
    </Sequence>
    <Audio name="Nura voice and score" src={staticFile("audio/nura-mix.wav")} />
  </AbsoluteFill>
);
