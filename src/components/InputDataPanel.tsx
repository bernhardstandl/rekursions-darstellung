interface InputDataPanelProps {
  title: string;
  description: string;
  ascii: string;
}

export function InputDataPanel({
  title,
  description,
  ascii,
}: InputDataPanelProps) {
  return (
    <section className="input-data-panel" aria-labelledby="input-data-title">
      <div>
        <p className="eyebrow-dark">Eingabedaten</p>
        <h2 id="input-data-title">{title}</h2>
        <p>{description}</p>
      </div>

      <pre className="input-ascii" aria-label="ASCII-Darstellung der Eingabe">
        {ascii}
      </pre>
    </section>
  );
}