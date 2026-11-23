import React from "react";
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";

export const fontsReady = Promise.all([
  loadFont({
    family: "Inter",
    url: staticFile("brand/inter.ttf"),
    weight: "100 900",
  }),
  loadFont({
    family: "Jakarta",
    url: staticFile("brand/jakarta.ttf"),
    weight: "100 900",
  }),
  loadFont({
    family: "Editorial",
    url: staticFile("brand/serif.ttf"),
    weight: "400",
  }),
]);
export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const travel = Easing.bezier(0.65, 0, 0.22, 1);
export const arrive = Easing.bezier(0.16, 1, 0.3, 1);
export type Rect = { x: number; y: number; w: number; h: number };
export const lerpRect = (a: Rect, b: Rect, p: number): Rect => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
  w: a.w + (b.w - a.w) * p,
  h: a.h + (b.h - a.h) * p,
});

/** Source coordinates are CSS pixels from each capture manifest, never invented UI. */
export const Screen: React.FC<{
  src: string;
  rect: Rect;
  crop: Rect;
  radius?: number;
  shadow?: boolean;
}> = ({ src, rect, crop, radius = 18, shadow = true }) => {
  const scale = rect.w / crop.w;
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        overflow: "hidden",
        borderRadius: radius,
        background: "#15201c",
        boxShadow: shadow ? "0 24px 70px #0005,0 2px 5px #0005" : "none",
        outline: "1px solid #ffffff22",
      }}
    >
      <CanvasImage
        src={staticFile(src)}
        style={{
          position: "absolute",
          width: 1440 * scale,
          height: 1000 * scale,
          maxWidth: "none",
          left: -crop.x * scale,
          top: -crop.y * scale,
        }}
      />
    </div>
  );
};

export const Reveal: React.FC<{
  children: React.ReactNode;
  kind?: "wipe" | "cut";
  bg?: string;
}> = ({ children, kind = "wipe", bg = "#101d17" }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: bg,
        overflow: "hidden",
        clipPath:
          kind === "cut"
            ? undefined
            : `inset(0 ${interpolate(frame, [0, 22], [100, 0], { ...clamp, easing: travel })}% 0 0)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Brand: React.FC<{
  slug: string;
  name: string;
  color?: string;
}> = ({ slug, name, color = "#edf3e8" }) => (
  <div
    style={{
      position: "absolute",
      left: 96,
      top: 51,
      display: "flex",
      alignItems: "center",
      gap: 13,
      color,
      fontSize: 28,
      fontWeight: 550,
      letterSpacing: "-.04em",
    }}
  >
    <CanvasImage
      src={staticFile(`brand/${slug}-mark.svg`)}
      style={{ width: 38, height: 38 }}
    />
    {name}
  </div>
);

export const Heading: React.FC<{
  children: React.ReactNode;
  label?: string;
  accent?: string;
  dark?: boolean;
}> = ({ children, label, accent = "#bad77b", dark = false }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Interactive.Div
        name="Feature heading"
        style={{
          position: "absolute",
          left: 96,
          top: 125,
          fontSize: 64,
          lineHeight: 1.12,
          fontWeight: 500,
          letterSpacing: "-.05em",
          color: dark ? "#17241b" : "#edf3e8",
          opacity: interpolate(frame, [0, 17], [0.1, 1], clamp),
          translate: interpolate(frame, [0, 22], ["0px 18px", "0px 0px"], {
            ...clamp,
            easing: arrive,
          }),
        }}
      >
        {children}
      </Interactive.Div>
      {label && (
        <div
          style={{
            position: "absolute",
            right: 96,
            top: 151,
            maxWidth: 700,
            textAlign: "right",
            fontSize: 24,
            color: accent,
            lineHeight: 1.35,
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};

export const Pointer: React.FC<{
  x: number;
  y: number;
  at: number;
  end?: number;
}> = ({ x, y, at, end = at + 22 }) => {
  const f = useCurrentFrame();
  if (f < at - 13 || f > end) return null;
  return (
    <svg
      width={40}
      height={48}
      viewBox="0 0 32 40"
      style={{
        position: "absolute",
        left: x,
        top: y,
        filter: "drop-shadow(0 2px 3px #0008)",
        opacity: interpolate(
          f,
          [at - 13, at - 7, end - 5, end],
          [0, 1, 1, 0],
          clamp,
        ),
        scale: interpolate(f, [at - 2, at + 1, at + 6], [1, 0.88, 1], clamp),
      }}
    >
      <path
        d="M4 3v28l7-6 5 11 5-2-5-11 10-1z"
        fill="#fff"
        stroke="#17241b"
        strokeWidth="1.8"
      />
    </svg>
  );
};
