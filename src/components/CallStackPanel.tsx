import type { StackFrame } from "../types";

interface CallStackPanelProps {
  stack: StackFrame[];
}

function getStatusLabel(status: StackFrame["status"], isActive: boolean) {
  if (status === "pending") {
    return "wartet";
  }

  if (status === "completed") {
    return "abgeschlossen";
  }

  if (status === "active" || isActive) {
    return "aktiv";
  }

  return "inaktiv";
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
          {newestFrameFirst.map((frame) => {
            const statusLabel = getStatusLabel(frame.status, frame.isActive);
            const statusClass = frame.status ?? (frame.isActive ? "active" : "idle");

            return (
              <article
                key={frame.id}
                className={`stack-frame ${frame.isActive ? "active" : ""} status-${statusClass}`}
              >
                <div className="stack-frame-header">
                  <h3>{frame.call}</h3>
                  <span className={`frame-status-badge status-${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <dl className="variables">
                  {Object.entries(frame.variables).map(([name, value]) => (
                    <div key={name} className="variable-row">
                      <dt>{name}</dt>
                      <dd>{value === null ? "None" : value}</dd>
                    </div>
                  ))}
                </dl>

                {frame.note && <p className="frame-note">{frame.note}</p>}

                {frame.returnValue && (
                  <div className="frame-return">
                    <span>Rückgabewert: </span>
                    <strong>{frame.returnValue}</strong>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}