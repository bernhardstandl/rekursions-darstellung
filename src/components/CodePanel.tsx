import type { CodeLine } from "../types";

interface CodePanelProps {
  code: CodeLine[];
  activeLine: number | null;
}

export function CodePanel({ code, activeLine }: CodePanelProps) {
  return (
    <section className="panel code-panel" aria-labelledby="code-panel-title">
      <div className="panel-header">
        <h2 id="code-panel-title">Quellcode</h2>
      </div>

      <div className="code-list">
        {code.map((line) => {
          const isActive = line.lineNumber === activeLine;

          return (
            <div
              key={line.lineNumber}
              className={`code-row ${isActive ? "active" : ""}`}
              aria-current={isActive ? "step" : undefined}
            >
              <span className="line-number">{line.lineNumber}</span>
              <code>{line.text || "\u00A0"}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}