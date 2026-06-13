import type { StackFrame } from "../types";

interface CallStackPanelProps {
  stack: StackFrame[];
}

export function CallStackPanel({ stack }: CallStackPanelProps) {
  const newestFrameFirst = [...stack].reverse();

  return (
    <section className="panel stack-panel" aria-labelledby="stack-panel-title">
      <div className="panel-header">
        <h2 id="stack-panel-title">Call Stack</h2>
        <span className="panel-subtitle">Neuester Aufruf oben</span>
      </div>

      {newestFrameFirst.length === 0 ? (
        <div className="empty-state">Der Call Stack ist leer.</div>
      ) : (
        <div className="stack-list">
          {newestFrameFirst.map((frame) => (
            <article
              key={frame.id}
              className={`stack-frame ${frame.isActive ? "active" : ""}`}
            >
              <h3>{frame.call}</h3>

              <dl className="variables">
                {Object.entries(frame.variables).map(([name, value]) => (
                  <div key={name} className="variable-row">
                    <dt>{name}</dt>
                    <dd>{value === null ? "None" : value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}