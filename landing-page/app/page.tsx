import { siGithub, siRust, siSqlite, siWgpu } from "simple-icons";
import Diagram from "./Diagram";
import ThemeToggle from "./ThemeToggle";

const REPO = "https://github.com/GitNimay/Termy-Agentic_Coding_Env";
const RELEASE = `${REPO}/releases/latest`;
const WINDOWS = "M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z";

// egui has no official mark, so it is listed by name only.
const stack: [string, string | null][] = [
  ["Rust", siRust.path],
  ["wgpu", siWgpu.path],
  ["egui", null],
  ["ConPTY", WINDOWS],
  ["SQLite", siSqlite.path],
];

const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={d} /></svg>
);

export default function Home() {
  return (
    <div className="page">
      <header className="nav">
        <a href="#top" className="brand">
          <img src="/icon.png" alt="" width={20} height={20} /> Termy
        </a>
        <nav>
          <a href={`${REPO}/blob/main/docs/features.md`}>Docs</a>
          <a href={`${REPO}/blob/main/docs/architecture.md`}>Architecture</a>
          <a href={`${REPO}/releases`}>Releases</a>
        </nav>
        <div className="nav-end">
          <ThemeToggle />
          <a href={REPO} className="btn dark"><Icon d={siGithub.path} size={14} /> Star</a>
        </div>
      </header>

      <main id="top" className="hero">
        <div className="copy">
          <div>
            <a href={RELEASE} className="badge"><span>New</span> Latest release on GitHub</a>
            <h1>Open-source terminal workspace for Windows</h1>
            <p className="lead">
              Split panes, project workspaces, and shells that keep running after you close the window.
            </p>
            <div className="row">
              <a href={RELEASE} className="btn dark">Download <span aria-hidden="true">→</span></a>
              <a href={REPO} className="btn"><Icon d={siGithub.path} /> View on GitHub</a>
            </div>
          </div>
          <div className="built">
            <span className="label">Built with</span>
            {stack.map(([name, d]) => (
              <span key={name} className="tech">{d && <Icon d={d} />}{name}</span>
            ))}
          </div>
        </div>
        <Diagram />
      </main>

      <footer>MIT licensed · Built by <a href="https://www.n1m35h.in/">Nimesh</a></footer>
    </div>
  );
}
