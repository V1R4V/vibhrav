import {
  AbsoluteFill,
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
  Pointer,
  Reveal,
  Screen,
} from "./system";

const Start = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 33], [30, 0], { ...clamp, easing: arrive });
  return (
    <AbsoluteFill style={{ background: "#101522" }}>
      <Brand slug="studyflow" name="StudyFlow" />
      <Interactive.Div
        name="StudyFlow opening"
        style={{
          position: "absolute",
          left: 96,
          top: 230,
          fontSize: 114,
          lineHeight: 1.05,
          letterSpacing: "-.065em",
          fontWeight: 500,
          color: "#edf1ff",
          translate: `0px ${p}px`,
        }}
      >
        Make time.
        <br />
        <span style={{ color: "#b1c2ff" }}>See it count.</span>
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 102,
          top: 551,
          fontSize: 29,
          lineHeight: 1.55,
          color: "#a5b2d1",
        }}
      >
        Study planning, focus and progress.
        <br />
        Connected to the work you do.
      </div>
      <Screen
        src="studyflow/dashboard.png"
        rect={{ x: 1430, y: 153, w: 380, h: 817 }}
        crop={{ x: 284, y: 376.3, w: 269, h: 578.4 }}
      />
      <Screen
        src="studyflow/dashboard.png"
        rect={{ x: 988, y: 305, w: 390, h: 255 }}
        crop={{ x: 1139, y: 175, w: 269, h: 176 }}
      />
      <Screen
        src="studyflow/dashboard.png"
        rect={{ x: 988, y: 610, w: 390, h: 255 }}
        crop={{ x: 284, y: 175, w: 269, h: 176 }}
      />
    </AbsoluteFill>
  );
};

const Week = () => (
  <Reveal bg="#e4eaff">
    <Brand slug="studyflow" name="StudyFlow" color="#1b2648" />
    <Heading dark accent="#536baf" label="Nov 15–21 · three subjects">
      Give the week a shape.
    </Heading>
    <Screen
      src="studyflow/planner.png"
      rect={{ x: 210, y: 251, w: 1500, h: 705 }}
      crop={{ x: 304, y: 339.6, w: 1084, h: 509.5 }}
    />
    <div
      style={{
        position: "absolute",
        left: 215,
        top: 983,
        fontSize: 24,
        color: "#526184",
      }}
    >
      14h planned · 9h 45m studied
    </div>
  </Reveal>
);

const Focus = () => {
  const f = useCurrentFrame();
  const running = f >= 75,
    paused = f >= 150 && f < 195,
    resumed = f >= 195;
  const name = resumed
    ? "timer-resumed"
    : paused
      ? "timer-paused"
      : running
        ? "timer-started"
        : "timer-ready";
  return (
    <Reveal bg="#101522">
      <Brand slug="studyflow" name="StudyFlow" />
      <Heading accent="#afc1ff" label="Custom timer · Algorithms">
        One subject. One session.
      </Heading>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 323,
          fontSize: 99,
          lineHeight: 1.1,
          letterSpacing: "-.055em",
          color: "#e8edff",
        }}
      >
        Algorithms.
        <br />
        <span style={{ color: "#b2c3ff" }}>45 minutes.</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 634,
          fontSize: 29,
          color: "#a5b2ce",
        }}
      >
        {paused
          ? "12 minutes later · paused"
          : resumed
            ? "Resume the same session."
            : running
              ? "The timer is running."
              : "Choose your subject. Start when ready."}
      </div>
      <Screen
        src={`studyflow/${name}.png`}
        rect={{ x: 1120, y: 238, w: 620, h: running ? 736 : 692 }}
        crop={{ x: 568, y: 136.3, w: 556, h: running ? 660 : 620 }}
      />
      <Pointer x={1404} y={825} at={68} />
      <Pointer x={1404} y={825} at={143} />
      <Pointer x={1404} y={825} at={188} />
    </Reveal>
  );
};

const Reflection = () => {
  const f = useCurrentFrame();
  return (
    <Reveal kind="cut" bg="#101522">
      <Brand slug="studyflow" name="StudyFlow" />
      <Heading accent="#afc1ff" label="Session complete · 45 minutes">
        Keep a record.
      </Heading>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 306,
          fontSize: 88,
          lineHeight: 1.13,
          letterSpacing: "-.055em",
          color: "#edf1ff",
        }}
      >
        Time.
        <br />
        Focus.
        <br />
        What you worked on.
      </div>
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 706,
          fontSize: 28,
          color: "#a5b2ce",
        }}
      >
        Your focus rating.
        <br />
        Your own notes.
      </div>
      <Screen
        src="studyflow/session-review.png"
        rect={{ x: 1110, y: 240, w: 680, h: 728 }}
        crop={{ x: 470, y: 430, w: 500, h: 535 }}
      />
      <Pointer x={1640} y={916} at={171} />
      <div
        style={{
          position: "absolute",
          left: 1108,
          top: 995,
          color: "#afc1ff",
          fontSize: 22,
          opacity: interpolate(f, [10, 25], [0, 1], clamp),
        }}
      >
        Algorithms · Nov 20, 1:30–2:15 PM
      </div>
    </Reveal>
  );
};

const Counted = () => {
  const f = useCurrentFrame();
  const saved = f >= 12;
  return (
    <Reveal kind="cut" bg="#e4eaff">
      <Brand slug="studyflow" name="StudyFlow" color="#1b2648" />
      <Interactive.Div
        name="Study result"
        style={{
          position: "absolute",
          left: 96,
          top: 178,
          fontSize: 100,
          lineHeight: 1.08,
          letterSpacing: "-.06em",
          fontWeight: 500,
          color: "#1b2648",
          translate: interpolate(f, [0, 28], ["0px 18px", "0px 0px"], {
            ...clamp,
            easing: arrive,
          }),
        }}
      >
        45 minutes,
        <br />
        added to your week.
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 103,
          top: 456,
          display: "flex",
          gap: 44,
          alignItems: "center",
          fontSize: 64,
          letterSpacing: "-.05em",
        }}
      >
        <span style={{ color: "#7d8cad" }}>9h 45m</span>
        <span style={{ fontSize: 42, color: "#7d8cad" }}>→</span>
        <span style={{ color: "#3f5cb1", opacity: saved ? 1 : 0 }}>
          10h 30m
        </span>
      </div>
      <Screen
        src={
          saved ? "studyflow/dashboard-saved.png" : "studyflow/dashboard.png"
        }
        rect={{ x: 96, y: 634, w: 1728, h: 270 }}
        crop={{ x: 284, y: 175, w: 1123, h: 175.5 }}
      />
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 950,
          fontSize: 27,
          color: "#54678f",
        }}
      >
        Saved once. Reflected in your plan and session log.
      </div>
    </Reveal>
  );
};

const Review = () => {
  const f = useCurrentFrame();
  const stats = f >= 105;
  return (
    <Reveal bg="#101522">
      <Brand slug="studyflow" name="StudyFlow" />
      <Heading
        accent="#afc1ff"
        label={
          stats ? "The same 41 saved sessions" : "Algorithms · session history"
        }
      >
        See where the time went.
      </Heading>
      {stats ? (
        <Screen
          src="studyflow/statistics.png"
          rect={{ x: 160, y: 295, w: 1600, h: 570 }}
          crop={{ x: 284, y: 394.65625, w: 1123, h: 400 }}
        />
      ) : (
        <Screen
          src="studyflow/history-algorithms.png"
          rect={{ x: 96, y: 284, w: 1728, h: 630 }}
          crop={{ x: 285, y: 489, w: 1122, h: 410 }}
        />
      )}
    </Reveal>
  );
};

const End = () => {
  const f = useCurrentFrame();
  return (
    <Reveal bg="#101522">
      <Brand slug="studyflow" name="StudyFlow" />
      <Interactive.Div
        name="StudyFlow closing"
        style={{
          position: "absolute",
          left: 96,
          top: 250,
          fontSize: 112,
          lineHeight: 1.06,
          letterSpacing: "-.06em",
          fontWeight: 500,
          color: "#edf1ff",
          translate: interpolate(f, [12, 39], ["0px 30px", "0px 0px"], {
            ...clamp,
            easing: arrive,
          }),
        }}
      >
        Plan. Focus.
        <br />
        <span style={{ color: "#b3c5ff" }}>Follow through.</span>
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 601,
          fontSize: 31,
          color: "#becaf2",
        }}
      >
        Try StudyFlow <span style={{ marginLeft: 55 }}>↗</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 133,
          top: 763,
          fontSize: 25,
          color: "#7e90b7",
        }}
      >
        Your time. Accounted for.
      </div>
      <div
        style={{
          position: "absolute",
          left: 102,
          top: 924,
          width: 1716,
          height: 2,
          background: "#2a3550",
        }}
      />
    </Reveal>
  );
};

export const StudyFlow = () => (
  <AbsoluteFill style={{ fontFamily: "Jakarta", background: "#101522" }}>
    <Sequence name="Native weekly progress opening" durationInFrames={142}>
      <Start />
    </Sequence>
    <Sequence name="Plan the week" from={120} durationInFrames={202}>
      <Week />
    </Sequence>
    <Sequence name="Custom focus session" from={300} durationInFrames={262}>
      <Focus />
    </Sequence>
    <Sequence
      name="Actual completion and reflection"
      from={540}
      durationInFrames={202}
    >
      <Reflection />
    </Sequence>
    <Sequence
      name="Saved time counts toward goals"
      from={720}
      durationInFrames={232}
    >
      <Counted />
    </Sequence>
    <Sequence
      name="History and derived progress"
      from={930}
      durationInFrames={232}
    >
      <Review />
    </Sequence>
    <Sequence name="StudyFlow end card" from={1140} durationInFrames={180}>
      <End />
    </Sequence>
    <Audio
      name="Male narration and score"
      src={staticFile("audio/studyflow-mix.wav")}
    />
  </AbsoluteFill>
);
