export function Legend() {
  return (
    <section className="legend" aria-label="Legende">
      <div className="legend-item">
        <span className="legend-swatch code-swatch" />
        <span>Aktive Codezeile</span>
      </div>

      <div className="legend-item">
        <span className="legend-swatch stack-swatch" />
        <span>Aktiver Stackframe</span>
      </div>

      <div className="legend-item">
        <span className="legend-swatch tree-swatch" />
        <span>Aktiver Aufruf</span>
      </div>
    </section>
  );
}