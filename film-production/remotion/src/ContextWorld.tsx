import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import {
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import data from "./context-data.json";
const C = {
  pine: "#172b23",
  lime: "#83ae40",
  lilac: "#9580c4",
  teal: "#397a65",
  peach: "#cc835e",
  ivory: "#e8edda",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const move = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.65, 0, 0.22, 1),
  });
const mix = THREE.MathUtils.lerp;
const positions = data.series.map(
  (d, i) =>
    new THREE.Vector3((i / 27 - 0.5) * 12, ((d.day ?? 0) / 100) * 3.8 - 1.9, 0),
);
function arcGeometry(
  radius: number,
  width: number,
  arc: number,
  start: number,
) {
  const s = new THREE.Shape(),
    r = radius + width / 2,
    q = radius - width / 2;
  s.absarc(0, 0, r, start, start + arc, false);
  s.lineTo(Math.cos(start + arc) * q, Math.sin(start + arc) * q);
  s.absarc(0, 0, q, start + arc, start, true);
  s.closePath();
  return new THREE.ExtrudeGeometry(s, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.055,
    bevelSize: 0.045,
    bevelSegments: 5,
    steps: 1,
    curveSegments: 100,
  });
}
const Band: React.FC<{
  radius: number;
  width?: number;
  arc?: number;
  color?: string;
  start?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  metal?: number;
}> = ({
  radius,
  width = 0.35,
  arc = Math.PI * 1.78,
  color = C.lime,
  start = 0.36,
  position,
  rotation,
  metal = 0.62,
}) => {
  const geometry = useMemo(
    () => arcGeometry(radius, width, arc, start),
    [radius, width, arc, start],
  );
  return (
    <mesh
      geometry={geometry}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={color}
        metalness={metal}
        roughness={0.28}
        clearcoat={0.85}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
};
const Tube: React.FC<{
  points: THREE.Vector3[];
  radius?: number;
  color: string;
}> = ({ points, radius = 0.05, color }) => {
  const geometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points),
        Math.max(80, points.length * 3),
        radius,
        8,
        false,
      ),
    [points, radius],
  );
  return (
    <mesh geometry={geometry} castShadow>
      <meshPhysicalMaterial
        color={color}
        roughness={0.3}
        metalness={0.35}
        clearcoat={0.5}
      />
    </mesh>
  );
};
const Camera: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    let x = 0,
      y = 0,
      z = 18,
      tx = 0,
      ty = 0;
    if (t < 7.5) {
      const p = move(t, 0, 3.3);
      x = mix(1.9, 0, p);
      y = mix(-0.7, 0, p);
      z = mix(7, 18, p);
      tx = mix(3.7, 0, p);
    } else if (t < 16) {
      y = mix(0, 0.4, move(t, 7.5, 10));
    } else if (t < 24) {
      const p = move(t, 16, 18.6),
        q = move(t, 21.7, 24);
      x = q * 1.6;
      y = mix(0.4, 3.9, p);
      z = mix(18, 17.5, p) - q * 3;
      ty = mix(0, -0.2, p);
    } else if (t < 33) {
      const p = move(t, 24, 26.5);
      x = mix(1.6, 0, p);
      y = mix(3.9, 1, p);
      z = mix(14.5, 18, p);
      ty = -0.6;
    } else if (t < 42) {
      const p = move(t, 33, 35);
      x = mix(2, 0, p);
      y = mix(1.3, 0, p);
    } else if (t < 48) {
      const p = move(t, 42, 46);
      x = mix(3.2, 0, p);
      y = mix(4.8, 2, p);
      z = mix(17, 18, p);
      ty = -0.3;
    } else {
      const p = move(t, 48, 51.5);
      x = 0;
      y = mix(2, 0, p);
      z = 18;
      ty = mix(-0.3, 0, p);
    }
    camera.position.set(x, y, z);
    camera.lookAt(tx, ty, 0);
    camera.updateProjectionMatrix();
  }, [camera, t]);
  return null;
};
const Lens: React.FC<{ t: number; end?: boolean }> = ({ t, end = false }) => {
  const p = end ? move(t, 48, 51) : move(t, 0, 3.6),
    a = end ? move(t, 48, 50) : move(t, 3.8, 7.5);
  return (
    <group
      position={[end ? 3.3 : 3.2, end ? -0.05 : 0, 0]}
      rotation={[mix(0.65, 0.15, p), mix(-0.7, -0.13, p), mix(-0.5, -0.12, p)]}
    >
      <Band radius={2.65} width={0.52} color={C.lime} />
      <Band
        radius={2.65}
        width={0.025}
        color={C.ivory}
        position={[0, 0, 0.24]}
      />
      <Band
        radius={2.04}
        width={0.1}
        arc={5.75}
        color={C.teal}
        rotation={[0, mix(0.25, -0.2, a), -0.25]}
      />
      <Band
        radius={1.75}
        width={0.08}
        arc={5.1}
        color={C.lilac}
        rotation={[mix(0.4, 0.2, a), 0, 0.35]}
      />
      <mesh position={[0, 0, 0.3]} castShadow>
        <sphereGeometry args={[0.28, 48, 32]} />
        <meshPhysicalMaterial
          color={C.ivory}
          metalness={0.15}
          roughness={0.22}
          clearcoat={1}
        />
      </mesh>
      {Array.from({ length: 56 }, (_, i) => {
        const ang = (i / 56) * Math.PI * 1.76 + 0.4;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * 3.12, Math.sin(ang) * 3.12, 0]}
            rotation={[0, 0, ang]}
          >
            <boxGeometry args={[i % 7 === 0 ? 0.16 : 0.065, 0.012, 0.018]} />
            <meshStandardMaterial color={C.teal} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
};
const Anatomy: React.FC<{ t: number }> = ({ t }) => {
  const p = move(t, 7.5, 10),
    out = move(t, 14.8, 16),
    scores = [0.7823, 0.9333, 0.7062, 0.825],
    colors = [C.lilac, C.lime, C.teal, C.peach];
  return (
    <group
      position={[3.15, 0, 0]}
      rotation={[
        mix(0.15, 0.48, p),
        mix(-0.13, -0.32, p),
        mix(-0.12, -0.25, p),
      ]}
      scale={1 - out * 0.13}
    >
      {scores.map((s, i) => (
        <group
          key={i}
          position={[
            0,
            mix(0, (1.5 - i) * 0.34, p),
            mix(0, (1.5 - i) * 0.65, p),
          ]}
        >
          <Band
            radius={2.8 - i * 0.54}
            width={0.34}
            color={C.pine}
            arc={6.15 * (1 - s)}
            start={0.05 + s * 6.15}
            metal={0.15}
          />
          <Band
            radius={2.8 - i * 0.54}
            width={0.34}
            color={colors[i]}
            arc={s * 6.15}
            start={0.05}
            position={[0, 0, 0]}
          />
        </group>
      ))}
    </group>
  );
};
const Landscape: React.FC<{ t: number }> = ({ t }) => {
  const p = move(t, 16, 18.2),
    reveal = move(t, 16.4, 19.8);
  const points = useMemo(
    () =>
      positions.map((v, i) => {
        const a = (i / 27) * Math.PI * 1.78 + 0.35;
        return new THREE.Vector3(
          mix(Math.cos(a) * 2.7, v.x, p),
          mix(Math.sin(a) * 2.7, v.y, p),
          mix(0, 0.25, p),
        );
      }),
    [p],
  );
  const line = useMemo(
    () =>
      data.series.map(
        (d, i) =>
          new THREE.Vector3(
            (i / 27 - 0.5) * 12,
            ((d.month ?? 0) / 100) * 3.8 - 1.9,
            0.5,
          ),
      ),
    [],
  );
  return (
    <group
      position={[3.15 * (1 - p), -0.7 * p, 0]}
      rotation={[0.05, -0.12 * (1 - p), -0.025]}
    >
      <Tube points={points} radius={mix(0.19, 0.065, p)} color={C.lime} />
      {p > 0.1 &&
        positions.map((v, i) => {
          const h =
            (v.y + 1.9) *
            move(
              reveal,
              Math.max(0, i / 42 - 0.05),
              Math.min(0.99, i / 42 + 0.22),
            );
          return (
            <mesh
              key={i}
              position={[v.x, -1.9 + h / 2, -0.1]}
              scale={[1, Math.max(0.003, h), 1]}
              castShadow
            >
              <primitive object={BAR} attach="geometry" />
              <meshPhysicalMaterial
                color={i === 27 ? C.lime : C.teal}
                roughness={0.3}
                metalness={0.28}
                clearcoat={0.5}
              />
            </mesh>
          );
        })}
      {p > 0.8 && <Tube points={line} radius={0.045} color={C.ivory} />}
      <mesh position={[0, -1.94, -0.4]} receiveShadow>
        <boxGeometry args={[13, 0.04, 2.1]} />
        <meshStandardMaterial
          color={C.pine}
          roughness={0.8}
          transparent
          opacity={move(p, 0.6, 0.95)}
        />
      </mesh>
    </group>
  );
};
const Effort: React.FC<{ t: number }> = ({ t }) => {
  const p = move(t, 24, 26.2),
    zone = move(t, 28.5, 31),
    reveal = move(t, 24, 27);
  const points = useMemo(
      () =>
        data.workout.series.map(
          ([m, hr]) =>
            new THREE.Vector3((m / 48 - 0.5) * 12, (hr / 200) * 4.3 - 2.7, 0),
        ),
      [],
    ),
    colors = [C.teal, C.lime, "#dfd399", C.peach, "#c97564"];
  return (
    <group
      position={[0, -0.85, 0]}
      rotation={[mix(0.45, 0.06, p), mix(-0.3, 0, p), 0]}
    >
      <group scale={[1, 1 - zone * 0.86, 1]} position={[0, zone * 0.4, 0]}>
        <Tube
          points={points.slice(
            0,
            Math.max(3, Math.floor(points.length * reveal)),
          )}
          radius={0.048}
          color={C.peach}
        />
        {data.workout.series
          .filter((_, i) => i % 2 === 0)
          .map(([m, hr], i) => {
            const h =
              (hr / 200) * 4.3 * move(t, 24 + i * 0.012, 25.2 + i * 0.012);
            return (
              <mesh
                key={i}
                position={[(m / 48 - 0.5) * 12, -2.7 + h / 2, -0.22]}
              >
                <boxGeometry args={[0.055, Math.max(0.01, h), 0.38]} />
                <meshPhysicalMaterial
                  color={hr > 165 ? "#da9978" : C.teal}
                  metalness={0.24}
                  roughness={0.32}
                />
              </mesh>
            );
          })}
      </group>
      {zone > 0.01 &&
        data.workout.zonesMin.map((v, i) => (
          <group
            key={i}
            position={[(i - 2) * 3.63, -1.0, -0.1]}
            scale={[zone, zone, zone]}
          >
            <Band
              radius={0.65}
              width={0.23}
              color={C.pine}
              arc={6.1 - Math.max(0.06, (v / 48) * 6.1)}
              start={0.36 + Math.max(0.06, (v / 48) * 6.1)}
            />
            <Band
              radius={0.65}
              width={0.23}
              color={colors[i]}
              arc={Math.max(0.06, (v / 48) * 6.1)}
              position={[0, 0, 0]}
            />
          </group>
        ))}
    </group>
  );
};
const Baseline: React.FC<{ t: number }> = ({ t }) => {
  const p = move(t, 33, 35.2),
    sleep = move(t, 37.7, 40);
  return (
    <group position={[3.4, -0.05, 0]} rotation={[0.12, -0.28, 0]}>
      <group position={[0, sleep * 0.6, 0]} scale={1 - sleep * 0.18}>
        <Band
          radius={2.65}
          width={0.26}
          arc={5.8}
          color={C.ivory}
          rotation={[0.3, 0, mix(-0.4, 0.1, p)]}
        />
        <Band
          radius={2.25}
          width={0.13}
          arc={5.15}
          color={C.lilac}
          rotation={[-0.25, 0.2, mix(0.6, 0, p)]}
        />
        <Band
          radius={1.85}
          width={0.1}
          arc={4.8}
          color={C.teal}
          rotation={[0.2, -0.2, -0.2]}
        />
      </group>
      {sleep > 0.01 &&
        data.night.segments.map((s, i) => {
          const duration = (s.e - s.s) / 60000,
            total = (data.night.end - data.night.start) / 60000,
            start = (s.s - data.night.start) / 60000,
            stageColors: Record<string, string> = {
              core: C.lilac,
              deep: "#7d6fa9",
              rem: "#bcd9a0",
              awake: C.peach,
            };
          return (
            <mesh
              key={i}
              position={[
                ((start + duration / 2) / total) * 6.5 - 3.25,
                -2.3,
                0.3,
              ]}
              scale={[sleep, 1, 1]}
            >
              <boxGeometry
                args={[(duration / total) * 6.5 - 0.012, 0.22, 0.33]}
              />
              <meshPhysicalMaterial
                color={stageColors[s.stage]}
                roughness={0.28}
                metalness={0.25}
              />
            </mesh>
          );
        })}
    </group>
  );
};
const BAR = new RoundedBoxGeometry(0.22, 1, 0.7, 3, 0.035);
const CARD = new RoundedBoxGeometry(1.14, 1.45, 0.09, 4, 0.07);
function dayTexture(date: string, value: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 480;
  const c = canvas.getContext("2d")!;
  c.fillStyle = "#172d24";
  c.fillRect(0, 0, 384, 480);
  c.strokeStyle = "#a2c48b33";
  c.lineWidth = 2;
  c.strokeRect(22, 22, 340, 436);
  c.fillStyle = "#a3b39e";
  c.font = "22px Inter";
  c.fillText(date.slice(5, 7) === "10" ? "OCT" : "NOV", 40, 68);
  c.fillStyle = "#e9eedd";
  c.font = "105px Inter";
  c.fillText(date.slice(-2), 34, 205);
  c.strokeStyle = "#c5df8b";
  c.lineWidth = 8;
  c.beginPath();
  c.arc(295, 365, 37, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * value) / 100);
  c.stroke();
  c.fillStyle = "#c5df8b";
  c.font = "25px Inter";
  c.fillText(String(Math.round(value)), 36, 383);
  c.fillStyle = "#819e89";
  c.font = "17px Inter";
  c.fillText("HEALTH", 36, 416);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
const History: React.FC<{ t: number }> = ({ t }) => {
  const p = move(t, 42, 44.3),
    out = move(t, 46.2, 48);
  const textures = useMemo(
    () => data.series.map((d) => dayTexture(d.date, d.day ?? 0)),
    [],
  );
  return (
    <group position={[0, -1.05, -0.8]} rotation={[-0.08, -0.12, 0]}>
      {data.series.map((d, i) => {
        const a = (i / 27) * 5.5 + 0.4,
          sel = i === 27,
          gx = ((i % 7) - 3) * 1.37,
          gy = (1.5 - Math.floor(i / 7)) * 1.63;
        return (
          <group
            key={d.date}
            position={[
              mix(gx, Math.cos(a) * 2.6 + 3.2, out),
              mix(gy, Math.sin(a) * 2.6, out),
              mix((1 - p) * (i - 27) * 0.14, 0, out),
            ]}
            rotation={[0, 0, (1 - p) * (i - 14) * 0.02]}
            scale={mix(0.88, 0.4, out)}
          >
            <mesh geometry={CARD} castShadow>
              <meshPhysicalMaterial
                color={sel ? "#96b965" : "#244234"}
                roughness={0.35}
                metalness={0.28}
              />
            </mesh>
            <mesh position={[0, 0, 0.052]}>
              <planeGeometry args={[1.08, 1.38]} />
              <meshBasicMaterial map={textures[i]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
export const ContextWorld: React.FC = () => {
  const f = useCurrentFrame(),
    { fps, width, height } = useVideoConfig(),
    t = f / fps,
    light = t >= 33 && t < 42;
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 35, near: 0.1, far: 100, position: [0, 0, 18] }}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true,
      }}
      dpr={1}
    >
      <Camera t={t} />
      <ambientLight intensity={light ? 0.5 : 0.18} />
      <Environment
        files={staticFile("context/studio_small_09_1k.hdr")}
        environmentIntensity={light ? 0.65 : 0.72}
        environmentRotation={[0, 0.7, 0]}
      />
      <directionalLight
        position={[-5, 7, 8]}
        intensity={light ? 1.7 : 1.9}
        color="#fff5db"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-normalBias={0.06}
        shadow-radius={8}
        shadow-blurSamples={16}
      />
      <directionalLight position={[7, 2, -4]} intensity={1.1} color="#b4d1bb" />
      <spotLight
        position={[0, -2, 8]}
        angle={0.7}
        penumbra={1}
        intensity={12}
        color="#d6d2f1"
      />
      {t < 7.5 ? (
        <Lens t={t} />
      ) : t < 16 ? (
        <Anatomy t={t} />
      ) : t < 24 ? (
        <Landscape t={t} />
      ) : t < 33 ? (
        <Effort t={t} />
      ) : t < 42 ? (
        <Baseline t={t} />
      ) : t < 48 ? (
        <History t={t} />
      ) : (
        <Lens t={t} end />
      )}
      {[7.5, 33].map((at, i) => {
        const phase = move(t, at - 0.48, at + 0.48);
        return phase > 0 && phase < 1 ? (
          <Band
            key={at}
            radius={20}
            width={16}
            arc={1.3}
            start={Math.PI - 0.65}
            position={[20 + mix(-26, 26, phase), 0, 9]}
            rotation={[0, 0, 0.08]}
            color={i ? "#e1e6d0" : "#45704b"}
            metal={0.55}
          />
        ) : null;
      })}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.6, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={light ? 0.08 : 0.12} />
      </mesh>
    </ThreeCanvas>
  );
};
