import Diagram from "./Diagram";

const REPO = "https://github.com/GitNimay/Termy-Agentic_Coding_Env";
const RELEASE = `${REPO}/releases/latest`;

const features = [
  ["Project workspaces", "Keep named folders, panes, and working context together."],
  ["Real Windows terminals", "Run PowerShell, PowerShell Core, or Command Prompt through ConPTY."],
  ["Split panes", "Arrange up to six live terminals in one workspace."],
  ["Session continuity", "Shells keep running after the desktop window closes."],
  ["Persistent state", "Restore layouts, panes, Git context, and recent terminal output."],
  ["Fast desktop UI", "Terminal cells rendered through eframe, egui, and wgpu."],
];

export default function Home() {
  return (
    <>
      <header className="nav">
        <a href="#top" className="brand">
          <img src="/icon.png" alt="" width={22} height={22} /> Termy
        </a>
        <nav>
          <a href="#features">Features</a>
          <a href="#install">Install</a>
          <a href={REPO} className="btn dark">GitHub</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <span className="badge">Open source · MIT</span>
            <h1>The terminal workspace for Windows</h1>
            <p className="lead">
              Run PowerShell and Command Prompt in split panes, grouped by project, with layouts and
              sessions that are still there when you come back. Engineered in Rust.
            </p>
            <div className="row">
              <a href={RELEASE} className="btn dark">Download latest release →</a>
              <a href={REPO} className="btn">View source</a>
            </div>
            <p className="stack">Rust · egui · wgpu · ConPTY · SQLite</p>
          </div>
          <div className="stage"><Diagram /></div>
        </section>

        <section id="features" className="block">
          <h2>What you get</h2>
          <div className="grid">
            {features.map(([t, d]) => (
              <div key={t} className="cell">
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="install" className="block">
          <h2>Install</h2>
          <p className="lead">
            Grab the Windows executable from the <a href={RELEASE}>latest release</a>, put it in a
            permanent folder, and run it. Or build from source:
          </p>
          <pre>{`git clone ${REPO}.git
cd Termy-Agentic_Coding_Env
cargo build -p ade-app
.\\target\\debug\\ade-app.exe`}</pre>
        </section>
      </main>

      <footer>
        <span>MIT licensed · Built by <a href="https://www.n1m35h.in/">Nimesh</a></span>
        <a href={REPO}>GitHub</a>
      </footer>
    </>
  );
}
