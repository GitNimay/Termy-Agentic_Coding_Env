import Diagram from "./Diagram";

const REPO = "https://github.com/GitNimay/Termy-Agentic_Coding_Env";
const RELEASE = `${REPO}/releases/latest`;
const stack = ["Rust", "egui", "wgpu", "ConPTY", "SQLite"];

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
        <a href={REPO} className="btn dark">Star on GitHub</a>
      </header>

      <main id="top" className="hero">
        <div className="copy">
          <div>
            <a href={RELEASE} className="badge"><span>MIT</span> Free and open source</a>
            <h1>The terminal workspace for Windows</h1>
            <p className="lead">
              Split panes, project workspaces, and shells that keep running after you close the window.
            </p>
            <div className="row">
              <a href={RELEASE} className="btn dark">Download latest →</a>
              <a href={REPO} className="btn">View source</a>
            </div>
          </div>
          <div className="built">
            <span>Built with</span>
            {stack.map((s) => <span key={s} className="chip">{s}</span>)}
          </div>
        </div>
        <Diagram />
      </main>

      <footer>MIT licensed · Built by <a href="https://www.n1m35h.in/">Nimesh</a></footer>
    </div>
  );
}
