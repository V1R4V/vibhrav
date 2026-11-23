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
  clamp,
  Heading,
  lerpRect,
  Pointer,
  Reveal,
  Screen,
  travel,
} from "./system";

const Mark = ({ dark = false }: { dark?: boolean }) => (
  <div
    style={{
      position: "absolute",
      left: 96,
      top: 49,
      display: "flex",
      alignItems: "center",
      gap: 13,
      color: dark ? "#22202c" : "#f0eef5",
      fontFamily: "Editorial",
      fontSize: 42,
      lineHeight: 1,
    }}
  >
    <CanvasImage
      src={staticFile("brand/vyaya-mark.svg")}
      style={{ width: 38, height: 38 }}
    />
    Vyaya
  </div>
);

const Opening = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#f1efe9" }}>
      <Mark dark />
      <Interactive.Div
        name="Vyaya spending promise"
        style={{
          position: "absolute",
          left: 96,
          top: 177,
          fontSize: 104,
          fontWeight: 450,
          letterSpacing: "-.06em",
          lineHeight: 1.08,
          color: "#24222c",
          translate: interpolate(f, [0, 30], ["0px 24px", "0px 0px"], {
            ...clamp,
            easing: arrive,
          }),
        }}
      >
        Your spending,{" "}
        <span
          style={{
            fontFamily: "Editorial",
            fontSize: 137,
            fontWeight: 400,
            color: "#716093",
          }}
        >
          in view.
        </span>
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 334,
          fontSize: 26,
          color: "#797180",
        }}
      >
        Budget &amp; spending tracker
      </div>
      <Screen
        src="vyaya/overview.png"
        rect={{ x: 96, y: 422, w: 1728, h: 527 }}
        crop={{ x: 272, y: 194, w: 1136, h: 347 }}
      />
    </AbsoluteFill>
  );
};

const Money = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 38], [0, 1], { ...clamp, easing: travel });
  return (
    <Reveal kind="cut" bg="#0b1015">
      <Mark />
      <Heading accent="#b7a4ea" label="Everyday · June–November">
        Follow the money.
      </Heading>
      <Screen
        src="vyaya/spending-flow.png"
        rect={lerpRect(
          { x: 160, y: 274, w: 1600, h: 710 },
          { x: 160, y: 245, w: 1600, h: 710 },
          p,
        )}
        crop={{ x: 272, y: 449, w: 1136, h: 504 }}
      />
    </Reveal>
  );
};

const Purchases = () => {
  const f = useCurrentFrame();
  return (
    <Reveal kind="cut" bg="#0b1015">
      <Mark />
      <Heading accent="#b7a4ea" label="Groceries · every logged purchase">
        From category to purchase.
      </Heading>
      {f < 60 ? (
        <Screen
          src="vyaya/category-groceries.png"
          rect={{ x: 96, y: 345, w: 1728, h: 365 }}
          crop={{ x: 272, y: 259, w: 1136, h: 240 }}
        />
      ) : (
        <Screen
          src="vyaya/category-purchases.png"
          rect={{ x: 160, y: 390, w: 1600, h: 324 }}
          crop={{ x: 272, y: 218, w: 1136, h: 230 }}
        />
      )}
    </Reveal>
  );
};

const Entry = () => {
  const f = useCurrentFrame();
  const saved = f >= 132;
  const p = interpolate(f, [25, 72], [0, 1], { ...clamp, easing: travel });
  return (
    <Reveal bg="#0b1015">
      <Mark />
      {saved ? (
        <>
          <Heading accent="#b7a4ea" label="Everyday · $5.25 added to spending">
            Recorded. In view.
          </Heading>
          <Screen
            src="vyaya/overview-saved.png"
            rect={{ x: 96, y: 422, w: 1728, h: 527 }}
            crop={{ x: 272, y: 194, w: 1136, h: 347 }}
          />
        </>
      ) : (
        <>
          <Heading accent="#b7a4ea" label="A $5.25 café purchase">
            Log it while it's fresh.
          </Heading>
          <div
            style={{
              position: "absolute",
              left: 102,
              top: 321,
              fontSize: 86,
              lineHeight: 1.12,
              letterSpacing: "-.05em",
              color: "#f0eef5",
            }}
          >
            A purchase.
            <br />A category.
            <br />
            <span
              style={{
                fontFamily: "Editorial",
                fontWeight: 400,
                fontSize: 110,
                color: "#c0adef",
              }}
            >
              Accounted for.
            </span>
          </div>
          <Screen
            src="vyaya/entry-filled.png"
            rect={{ x: 1068, y: 235, w: 756, h: 722 }}
            crop={lerpRect(
              { x: 440, y: 70, w: 560, h: 535 },
              { x: 440, y: 400, w: 560, h: 535 },
              p,
            )}
          />
          <Pointer x={1399} y={887} at={125} />
        </>
      )}
    </Reveal>
  );
};

const Lanes = () => {
  const f = useCurrentFrame();
  const lane = f < 75 ? 0 : f < 150 ? 1 : 2;
  const files = ["overview-saved", "fees-funding", "settlements"];
  const names = ["Everyday", "Fees & Funding", "Settlements"];
  const colors = ["#477da6", "#8f78bf", "#9b824c"];
  return (
    <Reveal bg="#f1efe9">
      <Mark dark />
      <div
        style={{
          position: "absolute",
          left: 96,
          top: 145,
          fontSize: 84,
          letterSpacing: "-.055em",
          lineHeight: 1.05,
          color: "#24222c",
        }}
      >
        Three lanes.
        <br />
        <span
          style={{ fontFamily: "Editorial", fontWeight: 400, fontSize: 106 }}
        >
          Different money.
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 105,
          top: 235,
          textAlign: "right",
          color: colors[lane],
          fontSize: 42,
          letterSpacing: "-.03em",
        }}
      >
        <span style={{ fontSize: 23, marginRight: 26 }}>0{lane + 1}</span>
        {names[lane]}
      </div>
      <Screen
        src={`vyaya/${files[lane]}.png`}
        rect={{ x: 1140, y: 328, w: 640, h: 64 }}
        crop={{ x: 968, y: 24, w: 440, h: 44 }}
        radius={32}
        shadow={false}
      />
      <Screen
        src={`vyaya/${files[lane]}.png`}
        rect={{ x: 245, y: 444, w: 1430, h: [437, 368, 509][lane] }}
        crop={{
          x: 272,
          y: lane === 0 ? 194 : 195,
          w: 1136,
          h: [347, 292, 404][lane],
        }}
      />
    </Reveal>
  );
};

const Ending = () => {
  const f = useCurrentFrame();
  return (
    <Reveal kind="cut" bg="#0b1015">
      <Mark />
      <Interactive.Div
        name="Vyaya wordmark close"
        style={{
          position: "absolute",
          left: 96,
          top: 196,
          fontFamily: "Editorial",
          fontSize: 220,
          fontWeight: 400,
          letterSpacing: "-.045em",
          lineHeight: 1,
          color: "#e0d5f4",
          translate: interpolate(f, [0, 33], ["0px 26px", "0px 0px"], {
            ...clamp,
            easing: arrive,
          }),
        }}
      >
        Vyaya.
      </Interactive.Div>
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 479,
          fontSize: 68,
          letterSpacing: "-.04em",
          color: "#f0eef5",
        }}
      >
        Your money, in view.
      </div>
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 703,
          fontSize: 30,
          color: "#bdaadd",
        }}
      >
        Explore Vyaya <span style={{ marginLeft: 55 }}>↗</span>
      </div>
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 924,
          width: 1707,
          height: 1,
          background: "#3d3849",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 956,
          fontSize: 21,
          color: "#8c8896",
        }}
      >
        Spending, income and three lanes.
      </div>
    </Reveal>
  );
};

export const Vyaya = () => (
  <AbsoluteFill style={{ fontFamily: "Inter", background: "#0b1015" }}>
    <Sequence name="Spending overview opening" durationInFrames={142}>
      <Opening />
    </Sequence>
    <Sequence
      name="Native income and category flow"
      from={120}
      durationInFrames={202}
    >
      <Money />
    </Sequence>
    <Sequence name="Category purchases" from={300} durationInFrames={172}>
      <Purchases />
    </Sequence>
    <Sequence
      name="Real purchase entry and saved total"
      from={450}
      durationInFrames={202}
    >
      <Entry />
    </Sequence>
    <Sequence name="Three native money lanes" from={630} durationInFrames={262}>
      <Lanes />
    </Sequence>
    <Sequence name="Vyaya end card" from={870} durationInFrames={150}>
      <Ending />
    </Sequence>
    <Audio
      name="Vyaya voice and score"
      src={staticFile("audio/vyaya-mix.wav")}
    />
  </AbsoluteFill>
);
