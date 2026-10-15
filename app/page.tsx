import Diagram from "./Diagram";

const REPO = "https://github.com/GitNimay/Termy-Agentic_Coding_Env";
const RELEASE = `${REPO}/releases/latest`;

export default function Home() {
  return (
    <div className="page">
      <header className="nav">
        <a href="#top" className="brand">
          <img src="/icon.png" alt="" width={18} height={18} /> Termy
        </a>
        <a href={REPO} className="btn dark">GitHub</a>
      </header>

      <main id="top" className="hero">
        <div>
          <span className="badge">Open source · MIT</span>
          <h1>The terminal workspace for Windows</h1>
          <p className="lead">
            Split panes, project workspaces, and sessions that survive closing the window. Built in Rust.
          </p>
          <div className="row">
            <a href={RELEASE} className="btn dark">Download latest →</a>
            <a href={REPO} className="btn">Source</a>
          </div>
          <p className="stack">Rust · egui · wgpu · ConPTY · SQLite</p>
        </div>
        <div className="stage"><Diagram /></div>
      </main>

      <footer>
        <span>MIT · Built by <a href="https://www.n1m35h.in/">Nimesh</a></span>
      </footer>
    </div>
  );
}
