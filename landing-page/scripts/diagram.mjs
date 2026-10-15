// Builds app/diagram-svg.ts: an isometric machine for the landing hero (no text), via the anatomy kit.
// A console of six panes stands on posts over a daemon box; shell cartridges sit in its drive bays,
// a keyboard and a power supply plug into it, and a drum keeps state. Run: node scripts/diagram.mjs
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SKILL = "C:/Users/Bhakti Kulkarni/.claude/skills/anatomy/kit/";
const k = await import(pathToFileURL(SKILL + "iso-kit.mjs").href);
const G = await import(pathToFileURL(SKILL + "lathe.mjs").href);
const T = await import(pathToFileURL(SKILL + "tube.mjs").href);
const HERE = dirname(fileURLToPath(import.meta.url));

const W = 600, H = 470;
const PLATE = { x: -150, y: -124, w: 300, d: 248, r: 10 };
const PLATE_H = 12, FOOT_H = 5;
const BOX = { x: -60, y: -45, w: 120, d: 90, r: 5 };
const BOX_TOP = 40;
const CON = { x: -78, y: -58, w: 156, d: 116, r: 7 };
const CON_Z = 84, CON_T = 11;

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0), ...k.boxCorners(CON, CON_Z, CON_Z + CON_T + 2)],
  W, H, { pad: 12, azimuth: 40 },
);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const depth = (p) => k.depthOf([p[0], p[1], 0], P);
const f1 = (n) => Math.round(n * 10) / 10;
const delay = (s) => `animation-delay:${s}s`;
const byDepth = (items) => items.sort((a, b) => a.d - b.d).map((e) => e.s).join("");
const dot = (p, r, cls, extra = "") => {
  const [x, y] = at(p);
  return `<circle class="${cls}" ${extra} cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="var(--accent)"/>`;
};
const halo = (plan, z, h, blur = 4) => `<path class="iso-halo" d="${k.haloOf(plan, z, h, P)}" style="filter:blur(${blur}px)"/>`;

// A routed, corrugated cable: filleted route -> depth-sortable chunks, plus a spark that rides it.
function cable(route, r, { bend = 5, spark = 0, dur = 2.6, pieces = 10 } = {}) {
  const pts = G.fillet(route, bend, 7, { P, tube: r });
  const chunks = T.tubePieces(pts, r, P, { maxLength: pieces, rings: { pitch: 2.2, tone: "lo" } })
    .map((c) => ({ d: depth(c.mid), s: T.tubeSvg(c, { tone: "mid" }) }));
  let path = "";
  if (spark !== null) {
    const screen = pts.map((p) => at(p).map(f1).join(" "));
    path = `M${screen.join("L")}`;
  }
  const sparkSvg = spark === null ? "" :
    `<circle class="spark" r="1.9" fill="var(--accent)"><animateMotion dur="${dur}s" begin="${spark}s" repeatCount="indefinite" path="${path}" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/></circle>`;
  return { chunks, spark: sparkSvg };
}

// ---------- plate ----------
function plate() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const feet = k.corners(PLATE, 22).sort((a, b) => depth(a) - depth(b));
  for (const [x, y] of feet) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -PLATE_H + 4, P, 8), { tone: "faint" }) }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  // ruler strip along the back edge
  const strip = { x: -126, y: PLATE.y + 12, w: 252, d: 7, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const t = k.topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P);
  out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  out.push(D([at([strip.x + 2, strip.y + 3.5, 0.6]), at([strip.x + strip.w - 2, strip.y + 3.5, 0.6])], { size: 0.45 }));
  // blank maker's plate, front-left: three engraved rules, two screws
  const tag = { x: -136, y: 92, w: 22, d: 30, r: 1.5 };
  out.push(S(k.slabOf(tag, 0, 0.8, P, 3, 0.3), { tone: "lo", crease: "none" }));
  out.push(L([0, 1, 2].map((i) => k.lineOnTop([tag.x + 7 + i * 4.5, tag.y + 5], [tag.x + 7 + i * 4.5, tag.y + tag.d - 5 - i * 5], 0.8, P)).join(""), { tone: "lo", free: "end" }));
  out.push(D([at([tag.x + 3, tag.y + 3, 0.8]), at([tag.x + tag.w - 3, tag.y + tag.d - 3, 0.8])], { size: 0.4 }));
  return out.join("");
}

// ---------- power supply (back-left), its cable runs behind the daemon ----------
const PSU = { x: -140, y: -22, w: 44, d: 58, r: 3 };
const PSU_H = 22;
function psu() {
  const out = [halo(PSU, 0, PSU_H, 5)];
  out.push(S(k.slabOf(PSU, 0, PSU_H, P, 4, 0.7), { tone: "mid", inner: L(k.sideSeam(PSU, 4, P, 4), { tone: "faint" }) }));
  // cooling fins on top, back to front
  const fins = [];
  for (let i = 0; i < 7; i++) {
    const y = PSU.y + 6 + i * 6.8;
    fins.push({ d: depth([0, y]), s: S(k.slabOf({ x: PSU.x + 5, y, w: PSU.w - 10, d: 2.2, r: 0.6 }, PSU_H, 3.4, P, 2), { tone: "mid", crease: "none" }) });
  }
  out.push(byDepth(fins));
  // +y face: mains socket; +x face: power LED and output boss
  const sx = PSU.x + 14, fy = PSU.y + PSU.d;
  out.push(L(k.sideRing([sx, fy, 11], 4.2, "y", P, 20), { tone: "mid" }), L(k.sideRing([sx, fy, 11], 2.6, "y", P, 16), { tone: "lo" }));
  out.push(dot([PSU.x + PSU.w, PSU.y + PSU.d - 8, 16], 1.3, "led"));
  // output lead: leaves a boss on the +x face and runs under the daemon's back
  const ox = PSU.x + PSU.w, oy = PSU.y + 16;
  const c = cable([[ox + 3, oy, 10], [ox + 14, oy, 10], [ox + 16, oy, 2.4], [-58, oy, 2.4]], 2, { spark: null });
  out.push(byDepth(c.chunks));
  out.push(S(G.disc(0, 3, 3.6, G.frameAlong([ox, oy, 10], [1, 0, 0]), P), { tone: "mid" }));
  return out.join("");
}

// ---------- daemon box ----------
const BAYS = [-22, 0, 22]; // y centres of the three drive bays on the +x face
const BAY_Z = [8, 27];
function daemon() {
  const out = [halo(BOX, 0, BOX_TOP, 5)];
  out.push(S(k.slabOf(BOX, 0, 28, P, 6, 0.8), { tone: "mid", inner: L(k.sideSeam(BOX, 4, P, 6), { tone: "faint" }) }));
  const lid = k.insetPlan(BOX, 1.6);
  out.push(S(k.slabOf(lid, 28, BOX_TOP - 28, P, 6, 0.8), { tone: "hi", crease: "lo" }));
  out.push(L(k.planOutline(k.insetPlan(BOX, 7), BOX_TOP, P), { tone: "faint" }));
  out.push(D(k.corners(lid, 3.5).map(([x, y]) => at([x, y, BOX_TOP])), { size: 0.45 }));
  // +y face: closed vent slots, status LEDs
  const fy = BOX.y + BOX.d;
  const vents = [];
  for (let x = -48; x <= 6; x += 6) vents.push(k.segment([x, fy, 8], [x, fy, 20], P));
  out.push(L(vents.join(""), { tone: "lo" }));
  out.push(D([24, 31, 38].map((x) => at([x, fy, 14])), { size: 0.6, tone: "hi" }));
  [24, 31, 38].forEach((x, i) => out.push(dot([x, fy, 14], 1.1, "led", `style="${delay(i * 0.6)}"`)));
  out.push(L(k.sideRing([48, fy, 14], 2.6, "y", P, 16), { tone: "mid" }));
  // +x face: three recessed drive bays
  const fx = BOX.x + BOX.w;
  for (const c of BAYS) {
    const q = [[fx, c - 10.5, BAY_Z[0]], [fx, c + 10.5, BAY_Z[0]], [fx, c + 10.5, BAY_Z[1]], [fx, c - 10.5, BAY_Z[1]]].map(at);
    out.push(`<path class="bay" d="M${q.map((p) => p.map(f1).join(" ")).join("L")}Z"/>`);
  }
  // keyboard socket on the +x face
  out.push(L(k.sideRing([fx, -40, 12], 4.4, "x", P, 20), { tone: "mid" }));
  // lid port for the drum's cable
  out.push(S(k.cylinder(-28, 30, 4.6, BOX_TOP, 2.6, P, 24, 0.3), { tone: "mid" }));
  return out.join("");
}

// ---------- shell cartridges (sessions) in the drive bays ----------
function cartridge(c, i) {
  const x0 = BOX.x + BOX.w, len = 16;
  const pl = { x: x0, y: c - 9, w: len, d: 18, r: 1.2 };
  const out = [S(k.slabOf(pl, 9, 16, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(pl, 13, P, 3), { tone: "faint" }) })];
  const top = 25, fx = x0 + len;
  out.push(L(k.lineOnTop([x0 + 3, c - 6], [fx - 2, c - 6], top, P), { tone: "faint" }));
  out.push(L(k.lineOnTop([x0 + 3, c + 6], [fx - 2, c + 6], top, P), { tone: "faint" }));
  // grip ribs on the front face, ending on the seam and a top rule
  const ribs = [];
  for (let y = c - 6; y <= c + 6; y += 2) ribs.push(k.segment([fx, y, 14], [fx, y, 21], P));
  out.push(L(ribs.join(""), { tone: "lo" }));
  out.push(L(k.segment([fx, c - 7, 21], [fx, c + 7, 21], P), { tone: "faint" }));
  // pull tab
  out.push(S(k.slabOf({ x: fx, y: c - 3.5, w: 2.4, d: 7, r: 0.8 }, 10, 2.4, P, 2), { tone: "mid", crease: "none" }));
  out.push(dot([fx - 2.5, c + 5.5, top], 1.2, "led", `style="${delay(i * 0.8)}"`));
  return out.join("");
}

// ---------- keyboard (input), right side ----------
const KB = { x: 90, y: -98, w: 50, d: 126, r: 4 };
function keyboard() {
  const out = [halo(KB, 0, 5, 4)];
  const kc = cable([[64, -40, 12], [76, -40, 12], [78, -40, 2.4], [KB.x - 3, -40, 2.4]], 1.8, { spark: 0, dur: 1.6, pieces: 8 });
  out.push(S(G.disc(0, 4, 3.2, G.frameAlong([BOX.x + BOX.w, -40, 12], [1, 0, 0]), P), { tone: "mid" }));
  out.push(byDepth(kc.chunks), kc.spark);
  out.push(S(G.disc(0, 3, 2.8, G.frameAlong([KB.x, -40, 2.6], [-1, 0, 0]), P), { tone: "mid" }));
  out.push(S(k.slabOf(KB, 0, 5, P, 6, 0.8), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(KB, 2.4), 5, P, 4), { tone: "faint" }));
  const keys = [];
  const rows = 4, cols = 12, px = (KB.w - 8) / rows, py = (KB.d - 8) / cols;
  const hot = new Set(["0-2", "1-7", "2-4", "0-9", "1-3", "2-10", "1-5", "0-6", "3-0", "2-1", "1-11"]);
  let n = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let span = 1;
      if (i === rows - 1 && j === 3) span = 6;
      else if (i === rows - 1 && j > 3 && j < 9) continue;
      const plan = { x: KB.x + 4 + i * px + 0.8, y: KB.y + 4 + j * py + 0.7, w: px - 1.6, d: py * span - 1.4, r: 0.8 };
      const paths = k.slabOf(plan, 5, 2, P, 2, 0.3);
      let s = S(paths, { tone: "mid", crease: "lo" });
      if (hot.has(`${i}-${j}`) || span > 1) s += `<path class="key" style="${delay(n++ * 0.38)}" d="${paths.top}"/>`;
      keys.push({ d: depth([plan.x + plan.w / 2, plan.y + plan.d / 2]), s });
    }
  }
  out.push(byDepth(keys));
  return out.join("");
}

// ---------- database drum (state), front-left ----------
const DRUM = [-28, 92];
let drumTop = 0;
function drum() {
  const [cx, cy] = DRUM;
  const out = [halo({ x: cx - 28, y: cy - 28, w: 56, d: 56, r: 28 }, 0, 34, 5)];
  out.push(S(k.cylinder(cx, cy, 28, 0, 3, P, 64, 0.4), { tone: "lo" }));
  let z = 3;
  for (let n = 0; n < 3; n++) {
    out.push(S(k.cylinder(cx, cy, 24, z, 8, P, 64, 0.6), { tone: "mid" }));
    out.push(L(k.knurl(cx, cy, 24, z + 1.2, z + 6.8, 48, P), { tone: "lo" }));
    out.push(L(k.sideArc(cx, cy, 24, z + 1.2, P, 40) + k.sideArc(cx, cy, 24, z + 6.8, P, 40), { tone: "faint" }));
    z += 8;
    out.push(S(k.cylinder(cx, cy, 21, z, 2.4, P, 56), { tone: "lo", crease: "none" }));
    z += 2.4;
  }
  out.push(S(k.cylinder(cx, cy, 24, z, 5, P, 64, 0.7), { tone: "hi", crease: "lo" }));
  const top = z + 5;
  drumTop = top;
  out.push(L(k.ring(cx, cy, 20.5, top, P, 64), { tone: "lo" }));
  const tk = k.radialTicks(cx, cy, 20.5, 48, 6, top, [1.2, 2.6], P);
  out.push(L(tk.minor, { tone: "lo" }), L(tk.major, { tone: "mid" }));
  out.push(L(k.ring(cx, cy, 9, top, P, 40), { tone: "faint" }));
  // writer arm sweeps the platter
  const m = k.topMatrix([cx, cy], top + 0.2, P);
  out.push(`<g transform="${m}"><g class="spin slow"><rect x="-1" y="-18" width="2" height="18" rx="1" fill="var(--accent)"/><circle cx="0" cy="-18" r="1.9" fill="var(--accent)"/></g></g>`);
  out.push(S(k.cylinder(cx, cy, 4.6, top, 3, P, 24, 0.3), { tone: "mid" }));
  // write LEDs on the base ring
  [-0.5, 0, 0.5].forEach((a, i) => out.push(dot([cx + Math.sin(a + 0.7) * 28, cy + Math.cos(a + 0.7) * 28, 1.5], 1.1, "led", `style="${delay(i * 0.45)}"`)));
  return out.join("");
}

// ---------- cooling fan, front-right ----------
const FAN = [114, 92];
function fan() {
  const [cx, cy] = FAN;
  const frame = { x: cx - 22, y: cy - 22, w: 44, d: 44, r: 6 };
  const out = [halo(frame, 0, 9, 4)];
  out.push(S(k.slabOf(frame, 0, 9, P, 5, 0.6), { tone: "mid", inner: L(k.sideSeam(frame, 3, P, 5), { tone: "faint" }) }));
  out.push(D(k.corners(frame, 3.5).map(([x, y]) => at([x, y, 9])), { size: 0.45 }));
  out.push(L(k.ring(cx, cy, 18, 9, P, 48), { tone: "mid" }));
  out.push(S(k.cylinder(cx, cy, 16.5, 5, 1, P, 48), { tone: "faint", crease: "none", flat: true }));
  const m = k.topMatrix([cx, cy], 9, P);
  const blades = [0, 1, 2, 3, 4, 5, 6].map((n) => `<path d="M0 0C4 -4 11 -9 15 -3.5C10 -3 5 -1 0 0Z" class="blade" transform="rotate(${n * 360 / 7})"/>`).join("");
  out.push(`<g transform="${m}"><g class="spin fast">${blades}</g></g>`);
  // guard wires across the opening
  out.push(L([-1, 1].map((s) => k.lineOnTop([cx - 17.9, cy + s * 1.5], [cx + 17.9, cy + s * 1.5], 9.1, P)).join(""), { tone: "lo" }));
  out.push(S(k.cylinder(cx, cy, 3.4, 9, 2.4, P, 20, 0.3), { tone: "hi", crease: "lo" }));
  return out.join("");
}

// ---------- posts, data cables, console ----------
const POSTS = k.corners(k.insetPlan(BOX, 6), 0);
const LINKS = [];
for (const y of [-16, 16]) for (const x of [-30, 0, 30]) LINKS.push([x, y]);
const GAP = CON_Z - BOX_TOP;

function post([x, y]) {
  const out = [S(k.cylinder(x, y, 4.8, BOX_TOP, 3, P, 24, 0.3), { tone: "mid" })];
  out.push(S(k.cylinder(x, y, 3, BOX_TOP + 3, GAP - 6, P, 24), { tone: "mid", crease: "none" }));
  out.push(L(k.sideArc(x, y, 3, BOX_TOP + 16, P, 12) + k.sideArc(x, y, 3, CON_Z - 16, P, 12), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, 4.8, CON_Z - 3, 3, P, 24, 0.3), { tone: "mid" }));
  return out.join("");
}

function link([x, y], i) {
  const out = [S(k.cylinder(x, y, 2.8, BOX_TOP, 4, P, 20, 0.3), { tone: "mid" })];
  out.push(S(k.cylinder(x, y, 1.7, BOX_TOP + 4, GAP - 8, P, 16), { tone: "lo", crease: "none" }));
  out.push(L([12, 20, 28].map((h) => k.sideArc(x, y, 1.7, BOX_TOP + h, P, 8)).join(""), { tone: "faint" }));
  out.push(S(k.cylinder(x, y, 2.8, CON_Z - 4, 4, P, 20, 0.3), { tone: "mid" }));
  const [sx, sy] = at([x, y, BOX_TOP + 6]);
  const dist = f1(k.screenRise(GAP - 12, P));
  out.push(`<g class="pulse ${i % 2 ? "up" : "down"}" style="--d:${dist}px;${delay(i * 0.55)}"><circle cx="${f1(sx)}" cy="${f1(sy)}" r="1.9" fill="var(--accent)"/></g>`);
  return out.join("");
}

function consoleTop() {
  const out = [halo(CON, CON_Z, CON_T, 7)];
  out.push(S(k.slabOf(CON, CON_Z, CON_T, P, 8, 1), { tone: "mid", inner: L(k.sideSeam(CON, CON_Z + 4, P, 8), { tone: "faint" }) }));
  const top = CON_Z + CON_T;
  const bezel = k.insetPlan(CON, 5);
  out.push(S(k.slabOf(bezel, top, 1.2, P, 6, 0.4), { tone: "lo", crease: "none", flat: true }));
  const cw = (bezel.w - 8 - 2 * 5) / 3, ch = (bezel.d - 8 - 5) / 2;
  const sm = k.topMatrix([0, 0], top + 2.6, P);
  const widths = [17, 11, 23, 14, 8, 19];
  let planes = "";
  let n = 0;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
    const sx = bezel.x + 4 + c * (cw + 5), sy = bezel.y + 4 + r * (ch + 5);
    out.push(S(k.slabOf({ x: sx, y: sy, w: cw, d: ch, r: 2 }, top + 1.2, 1.4, P, 3, 0), { tone: "hi", crease: "none" }));
    const i = n++;
    let g = `<rect x="${f1(sx)}" y="${f1(sy)}" width="${f1(cw)}" height="${f1(ch)}" rx="2" class="pane"/>`;
    g += `<path d="M${f1(sx)} ${f1(sy + 6)}H${f1(sx + cw)}" class="pane-rule"/>`;
    for (const d of [0, 1, 2]) g += `<circle cx="${f1(sx + 3.4 + d * 3)}" cy="${f1(sy + 3)}" r=".9" class="pane-dot"/>`;
    for (let j = 0; j < 5; j++) {
      const ly = sy + 10 + j * 5.6;
      g += `<rect x="${f1(sx + 3)}" y="${f1(ly)}" width="2.4" height="1.9" rx=".5" fill="var(--accent)"/>`;
      g += `<rect class="type ink" style="${delay(i * 0.5 + j * 0.6)}" x="${f1(sx + 7)}" y="${f1(ly)}" width="${widths[(i + j) % 6]}" height="1.9" rx=".5"/>`;
    }
    g += `<rect class="cursor" x="${f1(sx + 3)}" y="${f1(sy + ch - 6)}" width="3" height="3.4"/>`;
    g += `<rect class="focus" style="${delay(i * 2)}" x="${f1(sx - 1)}" y="${f1(sy - 1)}" width="${f1(cw + 2)}" height="${f1(ch + 2)}" rx="2.6" fill="none" stroke="var(--accent)" stroke-width="1.2"/>`;
    planes += g;
  }
  // the window "closes": screens go dark while the daemon keeps running below
  planes += `<rect class="dim" x="${f1(bezel.x + 4)}" y="${f1(bezel.y + 4)}" width="${f1(bezel.w - 8)}" height="${f1(bezel.d - 8)}" rx="2"/>`;
  out.push(`<g transform="${sm}">${planes}</g>`);
  out.push(D(k.corners(CON, 3.4).map(([x, y]) => at([x, y, top])), { size: 0.45 }));
  // +y face: indicator row
  out.push(D([-20, -14, -8].map((x) => at([x, CON.y + CON.d, CON_Z + 7])), { size: 0.55, tone: "hi" }));
  return out.join("");
}

// ---------- assemble, back to front ----------
const draw = [plate(), psu(), daemon()];
draw.push(BAYS.map((c, i) => ({ d: depth([70, c]), s: cartridge(c, i) })).sort((a, b) => a.d - b.d).map((e) => e.s).join(""));
draw.push(keyboard());
draw.push(byDepth([{ d: depth(DRUM), s: drum() }, { d: depth(FAN), s: fan() }]));
const lk = cable([[DRUM[0], DRUM[1], drumTop + 3], [DRUM[0], DRUM[1], 56], [-28, 30, 56], [-28, 30, BOX_TOP + 2.6]], 2.2, { bend: 7, spark: 0.8, dur: 2.4, pieces: 8 });
draw.push(byDepth([
  ...POSTS.map((p) => ({ d: depth(p), s: post(p) })),
  ...LINKS.map((p, i) => ({ d: depth(p), s: link(p, i) })),
  ...lk.chunks,
]), lk.spark);
draw.push(consoleTop());

const label = "Isometric machine: a console with six screens stands on posts above a daemon box; shell cartridges sit in its drive bays, a keyboard and a power supply plug into it, a drum stores state and a fan spins.";
const svg = k.figureSvg({ width: W, height: H, label: "", body: draw });
const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
writeFileSync(join(HERE, "..", "app", "diagram-svg.ts"), `// generated by scripts/diagram.mjs\nexport const DIAGRAM_LABEL = ${JSON.stringify(label)};\nexport const DIAGRAM_INNER = ${JSON.stringify(inner)};\n`);
console.log("wrote app/diagram-svg.ts", inner.length, "bytes");
