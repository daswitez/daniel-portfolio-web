import type { ReactNode } from "react";
import s from "./ProductMock.module.css";

/*
 * The "finished product" side of the How I work chapter, built in code instead of
 * a screenshot so it stays sharp at any size and has live details.
 * It is laid out on the same 1376 × 768 grid as /story/craft-sketch.jpg, so the
 * wipe lines up with the sketch; the parent scales it with `--k` (width / 1376).
 * Every animation uses transform/opacity only (no repaints).
 */

const NAV: Array<{ label: string; icon: ReactNode; active?: boolean }> = [
  {
    label: "Home",
    icon: (
      <path d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
    ),
  },
  {
    label: "Media",
    active: true,
    icon: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
        <path d="m7 16 4-4 3 3 2-2 3 3" />
      </>
    ),
  },
  { label: "Analytics", icon: <path d="M5 19V11M10 19V5M15 19v-6M20 19V9" /> },
  {
    label: "Calendar",
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="3" />
        <path d="M4 10h16M9 3v4M15 3v4" />
      </>
    ),
  },
  {
    label: "Apps",
    icon: (
      <>
        <rect x="4" y="4" width="6.5" height="6.5" rx="2" />
        <rect x="13.5" y="4" width="6.5" height="6.5" rx="2" />
        <rect x="4" y="13.5" width="6.5" height="6.5" rx="2" />
        <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="2" />
      </>
    ),
  },
];

const SECONDARY = [
  {
    label: "Docs",
    icon: (
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v4h4" />
    ),
  },
  {
    label: "Settings",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
      </>
    ),
  },
];

const FLOW = [
  { label: "Prompt", x: 62, y: 22 },
  { label: "Model", x: 18, y: 88 },
  { label: "Render", x: 140, y: 88 },
  { label: "Publish", x: 62, y: 152 },
];

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={s.icon} aria-hidden="true">
      {children}
    </svg>
  );
}

export function ProductMock() {
  return (
    <div className={s.mock} aria-hidden="true">
      <div className={s.device}>
        {/* ---------- sidebar ---------- */}
        <aside className={s.sidebar}>
          <div className={s.brand}>
            <span className={s.logo} />
            <b>Studio</b>
          </div>
          <nav className={s.nav}>
            {NAV.map((item) => (
              <span
                key={item.label}
                className={item.active ? s.navActive : undefined}
              >
                <Icon>{item.icon}</Icon>
                {item.label}
              </span>
            ))}
          </nav>
          <span className={s.navLabel}>Workspace</span>
          <nav className={s.nav}>
            {SECONDARY.map((item) => (
              <span key={item.label}>
                <Icon>{item.icon}</Icon>
                {item.label}
              </span>
            ))}
          </nav>
          <div className={s.account}>
            <span className={s.avatar}>D</span>
            <div>
              <b>Daniel</b>
              <small>Pro plan</small>
            </div>
          </div>
        </aside>

        {/* ---------- main ---------- */}
        <section className={s.main}>
          <header className={s.topbar}>
            <span className={s.crumb}>Workspace</span>
            <span className={s.chev}>›</span>
            <span className={s.crumb}>Campaigns</span>
            <span className={s.chev}>›</span>
            <span className={`${s.crumb} ${s.crumbCurrent}`}>
              Spring launch
            </span>
            <span className={s.live}>
              <i /> Live
            </span>
            <span className={s.share}>Share</span>
          </header>

          {/* Card 1: generated video */}
          <article className={`${s.card} ${s.cardMedia}`}>
            <h4>Generative media preview</h4>
            <div className={s.video}>
              <span className={`${s.blob} ${s.blobA}`} />
              <span className={`${s.blob} ${s.blobB}`} />
              <span className={`${s.blob} ${s.blobC}`} />
              <span className={s.play}>
                <svg viewBox="0 0 24 24">
                  <path d="M8 5.5v13l10.5-6.5z" fill="#fff" />
                </svg>
              </span>
              <span className={s.duration}>0:12</span>
              <span className={s.videoBar}>
                <i />
              </span>
            </div>
            <p className={s.meta}>
              <span className={s.tagPink}>4K</span> 16:9 · 24 fps
            </p>
          </article>

          {/* Card 2: metrics */}
          <article className={`${s.card} ${s.cardChart}`}>
            <h4>Real-time performance metrics</h4>
            <div className={s.kpi}>
              <b>128.4k</b>
              <span className={s.up}>▲ 38%</span>
            </div>
            <svg
              viewBox="0 0 200 92"
              className={s.chart}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="mock-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2f80ff" stopOpacity=".35" />
                  <stop offset="1" stopColor="#2f80ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 30H200M0 60H200" stroke="#e6e9ef" strokeWidth="1" />
              <path
                d="M0 72C18 70 26 58 42 60s24 14 40 6 22-44 42-46 22 34 40 30 22-22 36-24V92H0Z"
                fill="url(#mock-area)"
              />
              <path
                d="M0 72C18 70 26 58 42 60s24 14 40 6 22-44 42-46 22 34 40 30 22-22 36-24"
                fill="none"
                stroke="#2f80ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span className={s.liveDot} />
            <p className={s.axis}>
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
              <span>Sun</span>
            </p>
          </article>

          {/* Card 3: AI workflow */}
          <article className={`${s.card} ${s.cardFlow}`}>
            <h4>AI workflow node</h4>
            <span className={s.running}>
              <i /> Running
            </span>
            <div className={s.flow}>
              <svg viewBox="0 0 200 180" className={s.wires}>
                <path d="M100 44 56 88M100 44l44 44M56 110l44 44M144 110l-44 44" />
              </svg>
              {FLOW.map((node, i) => (
                <span
                  key={node.label}
                  className={s.node}
                  style={{ left: node.x, top: node.y }}
                  data-step={i}
                >
                  {node.label}
                </span>
              ))}
            </div>
          </article>

          {/* Prompt bar */}
          <div className={s.prompt}>
            <span className={s.model}>
              <span className={s.modelDot} /> Video model <small>▾</small>
            </span>
            <span className={s.promptText}>
              Cinematic product shot, golden hour
              <i className={s.caret} />
            </span>
            <span className={s.generate}>
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 3c.8 4.4 2.6 6.2 7 7-4.4.8-6.2 2.6-7 7-.8-4.4-2.6-6.2-7-7 4.4-.8 6.2-2.6 7-7Z"
                  fill="#fff"
                />
              </svg>
              Generate
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
