// Isometric stack of Termy's real architecture: UI -> daemon (ConPTY) -> SQLite.
const W = 160; // slab edge
const T = 14; // slab thickness
const CX = 200; // diagram center x
const K = 0.866; // cos 30deg
const PLANE = `matrix(${K} .5 ${-K} .5 0 0)`; // flat (x,y) -> isometric

const pt = (x: number, y: number, z = 0) => `${CX + (x - y) * K},${z + (x + y) * 0.5}`;

function Slab({ z, children }: { z: number; children: React.ReactNode }) {
  const poly = (pts: number[][], cls: string) => (
    <polygon className={cls} points={pts.map(([x, y, h]) => pt(x, y, z + h)).join(" ")} />
  );
  return (
    <g>
      {poly([[0, W, 0], [W, W, 0], [W, W, T], [0, W, T]], "side-l")}
      {poly([[W, 0, 0], [W, W, 0], [W, W, T], [W, 0, T]], "side-r")}
      {poly([[0, 0, 0], [W, 0, 0], [W, W, 0], [0, W, 0]], "top")}
      <g transform={`translate(${CX} ${z}) ${PLANE}`}>{children}</g>
    </g>
  );
}

const Tile = ({ x, y, w, h, on }: { x: number; y: number; w: number; h: number; on?: boolean }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx={3} className={on ? "tile on" : "tile"} />
    <text x={x + 5} y={y + 12} className="glyph">{">_"}</text>
  </g>
);

export default function Diagram() {
  const tw = 40, th = 64;
  return (
    <svg viewBox="0 0 400 640" role="img" aria-label="Termy architecture: desktop UI, background daemon with ConPTY shells, SQLite state" className="diagram">
      <g className="link">
        <line x1={CX} y1={W + T + 6} x2={CX} y2={215 + 6} />
        <line x1={CX} y1={215 + W + T + 6} x2={CX} y2={430 + 6} />
      </g>

      <Slab z={430}>
        <text x={14} y={30} className="glyph">SQLITE</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={14} y={44 + i * 26} width={i === 3 ? 70 : 132} height={14} rx={3} className="tile" />
        ))}
      </Slab>

      <Slab z={215}>
        <text x={14} y={26} className="glyph">DAEMON · CONPTY</text>
        {["pwsh", "pwsh core", "cmd"].map((s, i) => (
          <g key={s}>
            <rect x={14} y={42 + i * 36} width={132} height={26} rx={3} className={i === 0 ? "tile on" : "tile"} />
            <text x={22} y={59 + i * 36} className="glyph">{s}</text>
          </g>
        ))}
      </Slab>

      <Slab z={0}>
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => (
            <Tile key={`${c}${r}`} x={12 + c * (tw + 8)} y={12 + r * (th + 8)} w={tw} h={th} on={c === 0 && r === 0} />
          ))
        )}
      </Slab>
    </svg>
  );
}
