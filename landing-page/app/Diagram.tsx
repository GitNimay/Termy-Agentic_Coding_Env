// Isometric, animated stack of Termy's real architecture:
// desktop UI (split panes) -> background daemon (ConPTY sessions) -> host (shells + SQLite state).
import type { CSSProperties, ReactNode } from "react";

const K = 0.866; // cos 30deg
const S = 2 - Math.SQRT2; // rounded-corner inset factor
const CX = 300; // diagram axis x
const W = 170; // layer edge (plane units)
const ZA = 34, ZB = ZA + 112, ZC = ZB + 112; // layer heights (screen y)
const PLANE = `matrix(${K} .5 ${-K} .5 0 0)`; // flat (x,y) -> isometric top face
const CARD = "M112 0H578A22 22 0 0 1 600 22V498A22 22 0 0 1 578 520H22A22 22 0 0 1 0 498V212A22 22 0 0 1 22 190H68A22 22 0 0 0 90 168V22A22 22 0 0 1 112 0Z";
const ACCENT = "#2f7cf6";
const INK = "#1b1d22";

const plane = (z: number) => `translate(${CX} ${z}) ${PLANE}`;
const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

type SlabProps = {
  id: string; z: number; x?: number; y?: number; w: number; t: number; r: number;
  top?: string; sides?: [string, string]; children?: ReactNode;
};

// Extruded rounded square: two-tone body (left/right faces split at the front corner) + top face.
function Slab({ id, z, x = 0, y = 0, w, t, r, top = "#2a2c31", sides = ["#202227", "#131417"], children }: SlabProps) {
  const Lp = [CX + K * (x - y - w) + K * r * S, z + (x + y + w) / 2];
  const R = [CX + K * (x + w - y) - K * r * S, z + (x + y + w) / 2];
  const F = CX + K * (x - y);
  const f = (F - Lp[0]) / (R[0] - Lp[0]);
  return (
    <g>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={Lp[0]} x2={R[0]} y1={0} y2={0}>
          <stop offset={0} stopColor={sides[0]} />
          <stop offset={f} stopColor={sides[0]} />
          <stop offset={f} stopColor={sides[1]} />
          <stop offset={1} stopColor={sides[1]} />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        <polygon points={`${Lp} ${R} ${R[0]},${R[1] + t} ${Lp[0]},${Lp[1] + t}`} />
        <rect transform={plane(z + t)} x={x} y={y} width={w} height={w} rx={r} />
      </g>
      <rect transform={plane(z)} x={x} y={y} width={w} height={w} rx={r} fill={top}
        stroke="#ffffff22" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      {children && <g transform={plane(z)}>{children}</g>}
    </g>
  );
}

const Glass = () => <rect x={10} y={10} width={150} height={150} rx={11} fill="url(#glass)" />;

// Top layer: the desktop window with six split panes typing away.
function UiLayer() {
  const widths = [22, 14, 26, 18, 10];
  return (
    <Slab id="sa" z={ZA} w={W} t={10} r={18}>
      <Glass />
      {[18, 24, 30].map((cx) => <circle key={cx} cx={cx} cy={21} r={2} fill={INK} opacity={0.35} />)}
      <text x={38} y={23.5} className="dlabel" fill={INK} opacity={0.6}>termy · workspace</text>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const px = 16 + (i % 3) * 48, py = 31 + Math.floor(i / 3) * 64;
        return (
          <g key={i}>
            <rect x={px} y={py} width={42} height={58} rx={3} fill={INK} />
            {[0, 1, 2, 3].map((j) => (
              <g key={j}>
                <rect x={px + 5} y={py + 8 + j * 8} width={4} height={3} rx={1} fill={ACCENT} />
                <rect className="type" style={delay(i * 0.45 + j * 0.6)} x={px + 11} y={py + 8 + j * 8}
                  width={widths[(i + j) % 5]} height={3} rx={1} fill="#8d96a6" />
              </g>
            ))}
            <rect className="cursor" x={px + 5} y={py + 44} width={4} height={6} fill="#e8eef8" />
            <rect className="focus" style={delay(i * 2)} x={px - 1.5} y={py - 1.5} width={45} height={61} rx={4}
              fill="none" stroke={ACCENT} strokeWidth={2} vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
    </Slab>
  );
}

// Middle layer: the daemon that owns the ConPTY sessions.
function DaemonLayer() {
  const pills = ["pwsh", "cmd", "pwsh7"];
  return (
    <Slab id="sb" z={ZB} w={W} t={10} r={18}>
      <Glass />
      <circle className="spin" cx={85} cy={85} r={28} fill="none" stroke="#fff" strokeWidth={1.5}
        strokeDasharray="3 6" vectorEffect="non-scaling-stroke" />
      <circle className="ripple" cx={85} cy={85} r={20} fill="none" stroke={ACCENT} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      <circle className="ripple" style={delay(1.4)} cx={85} cy={85} r={20} fill="none" stroke={ACCENT} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      <circle cx={85} cy={85} r={20} fill="#fff" />
      {[77, 83.5, 90].map((y, i) => (
        <rect key={y} x={75} y={y} width={20} height={3.5} rx={1.5} fill={i === 1 ? ACCENT : INK} />
      ))}
      <clipPath id="pills">
        {pills.map((_, j) => <rect key={j} x={16 + j * 48} y={134} width={42} height={16} rx={2.5} />)}
      </clipPath>
      {pills.map((p, j) => (
        <g key={p}>
          <rect x={16 + j * 48} y={134} width={42} height={16} rx={2.5} fill={INK} />
          <text x={22 + j * 48} y={144.5} className="dlabel" fill="#e8eef8">{p}</text>
        </g>
      ))}
      <g clipPath="url(#pills)">
        <rect className="shimmer" x={16} y={134} width={30} height={16} fill="url(#shine)" />
      </g>
      <text transform="rotate(-90 149 128)" x={149} y={128} className="dlabel" fill={INK} opacity={0.6}>
        conpty daemon
      </text>
      {[24, 32, 40].map((y, i) => (
        <circle key={y} className="led" style={delay(i * 0.5)} cx={146} cy={y} r={2.2} fill={ACCENT} />
      ))}
    </Slab>
  );
}

// Bottom layer: the host box. Shells on top, local SQLite state inside.
function HostLayer() {
  const tiles: [number, number, string][] = [[16, 16, "PS"], [92, 16, "C:\\"], [16, 92, ">_"], [92, 92, "db"]];
  return (
    <g>
      <Slab id="sc" z={ZC} w={W} t={58} r={18}>
        <rect x={7} y={7} width={156} height={156} rx={13} fill="none" stroke="#ffffff12"
          strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </Slab>
      {/* left face: port + status LEDs */}
      <g transform={`matrix(${K} .5 0 1 ${CX - K * W} ${ZC + W / 2})`}>
        <rect x={24} y={17} width={40} height={24} rx={3} fill="#0d0e10" stroke="#ffffff14" />
        <rect x={30} y={23} width={28} height={3} rx={1} fill="#2a2c31" />
        <rect x={30} y={30} width={28} height={3} rx={1} fill="#2a2c31" />
        {[118, 128, 138].map((u, i) => (
          <circle key={u} className="led" style={delay(i * 0.4)} cx={u} cy={29} r={2.4} fill={i === 1 ? "#34d399" : ACCENT} />
        ))}
      </g>
      {/* right face: label + vents */}
      <g transform={`matrix(${K} -.5 0 1 ${CX} ${ZC + W})`}>
        <text x={24} y={33} className="dlabel" fill="#ffffff66" letterSpacing="2">TERMY</text>
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <rect key={j} x={92 + j * 8} y={16} width={3} height={26} rx={1.5} fill="#0b0c0e" />
        ))}
      </g>
      {tiles.map(([tx, ty, label], i) => {
        const on = label === "db";
        return (
          <g key={label} className="lift" style={delay(i * 1.6)}>
            <Slab id={`st${i}`} z={ZC - 8} x={tx} y={ty} w={62} t={8} r={9}
              top={on ? ACCENT : "#383b42"} sides={on ? ["#2366d6", "#1a4fa6"] : ["#2a2c32", "#1c1d21"]}>
              <text x={tx + 31} y={ty + 35} textAnchor="middle" className="dglyph" fill="#fff">{label}</text>
            </Slab>
          </g>
        );
      })}
    </g>
  );
}

// Data flowing between layers: input down the left edge, output back up the right edge.
function Beams() {
  const off = K * 18 * S;
  const xs = [CX - K * W + off, CX + K * W - off];
  const segs = [ZA, ZB].map((z) => [z + W / 2 + 14, z + 112 + W / 2 - 4]);
  return (
    <g>
      {xs.map((x, side) =>
        segs.map(([y0, y1], k) => (
          <g key={`${side}${k}`}>
            <line x1={x} y1={y0} x2={x} y2={y1} className="beam" />
            {[0, 1].map((n) => (
              <circle key={n} className={side ? "packet up" : "packet down"} style={delay(n * 1.3 + k * 0.65 + side * 0.4)}
                cx={x} cy={side ? y1 : y0} r={2.6} fill={ACCENT} />
            ))}
          </g>
        ))
      )}
    </g>
  );
}

export default function Diagram() {
  return (
    <svg viewBox="0 0 600 520" className="diagram" role="img"
      aria-label="Termy architecture: desktop window with split panes, a background daemon owning ConPTY sessions, and a local host with shells and SQLite state">
      <defs>
        <linearGradient id="bg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" className="bg0" />
          <stop offset=".5" className="bg1" />
          <stop offset="1" className="bg2" />
        </linearGradient>
        <radialGradient id="glow" cx=".5" cy=".55" r=".5">
          <stop offset="0" className="glow0" />
          <stop offset="1" className="glow1" />
        </radialGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" className="glass0" />
          <stop offset="1" className="glass1" />
        </linearGradient>
        <linearGradient id="shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fadeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".2" stopColor="#000" />
          <stop offset=".8" stopColor="#fff" />
        </linearGradient>
        <mask id="fade"><rect width="600" height="520" fill="url(#fadeG)" /></mask>
        <clipPath id="card"><path d={CARD} /></clipPath>
        <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse"
          patternTransform={`translate(${CX} ${ZC + 58}) ${PLANE}`}>
          <path d="M34 0H0V34" fill="none" className="gridline" />
        </pattern>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id="drop" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="16" stdDeviation="12" floodColor="#0b2a5c" floodOpacity=".35" />
        </filter>
      </defs>

      <path d={CARD} fill="url(#bg)" />
      <g clipPath="url(#card)">
        <rect width="600" height="520" fill="url(#grid)" mask="url(#fade)" />
        <ellipse cx={CX} cy={330} rx={260} ry={200} fill="url(#glow)" />
      </g>

      {/* floor shadow */}
      <rect transform={plane(ZC + 66)} x={-6} y={-6} width={182} height={182} rx={26}
        fill="#123a7a" opacity=".35" filter="url(#soft)" />

      <g className="in" style={delay(0)}><HostLayer /></g>
      <g className="in" style={delay(0.6)}><Beams /></g>
      <g className="in" style={delay(0.15)}>
        <g className="float-b" filter="url(#drop)"><DaemonLayer /></g>
      </g>
      <g className="in" style={delay(0.3)}>
        <g className="float-a" filter="url(#drop)"><UiLayer /></g>
      </g>
    </svg>
  );
}
