// Isometric machine for the hero, drawn with the anatomy kit (scripts/diagram.mjs), on the gradient card. No text.
import { DIAGRAM_INNER, DIAGRAM_LABEL } from "./diagram-svg";
import "./iso.css";

const CARD = "M112 0H578A22 22 0 0 1 600 22V498A22 22 0 0 1 578 520H22A22 22 0 0 1 0 498V212A22 22 0 0 1 22 190H68A22 22 0 0 0 90 168V22A22 22 0 0 1 112 0Z";

export default function Diagram() {
  return (
    <svg viewBox="0 0 600 520" className="diagram" role="img" aria-label={DIAGRAM_LABEL}>
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
        <clipPath id="card"><path d={CARD} /></clipPath>
        <pattern id="grid" width="34" height="34" patternUnits="userSpaceOnUse"
          patternTransform="translate(300 470) matrix(.866 .5 -.866 .5 0 0)">
          <path d="M34 0H0V34" fill="none" className="gridline" />
        </pattern>
        <linearGradient id="fadeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".2" stopColor="#000" />
          <stop offset=".8" stopColor="#fff" />
        </linearGradient>
        <mask id="fade"><rect width="600" height="520" fill="url(#fadeG)" /></mask>
      </defs>
      <path d={CARD} fill="url(#bg)" />
      <g clipPath="url(#card)">
        <rect width="600" height="520" fill="url(#grid)" mask="url(#fade)" />
        <ellipse cx={300} cy={300} rx={260} ry={200} fill="url(#glow)" />
      </g>
      <g transform="translate(0 30)" dangerouslySetInnerHTML={{ __html: DIAGRAM_INNER }} />
    </svg>
  );
}
