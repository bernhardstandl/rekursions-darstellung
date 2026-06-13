interface ControlsProps {
  isPlaying: boolean;
  speed: number;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onReset: () => void;
  onTogglePlay: () => void;
  onSpeedChange: (speed: number) => void;
}

export function Controls({
  isPlaying,
  speed,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
  onReset,
  onTogglePlay,
  onSpeedChange,
}: ControlsProps) {
  return (
    <section className="controls" aria-label="Steuerung">
      <div className="button-group">
        <button type="button" onClick={onPrevious} disabled={!canGoBack}>
          ← Zurück
        </button>

        <button type="button" onClick={onNext} disabled={!canGoForward}>
          Weiter →
        </button>

        <button type="button" onClick={onReset}>
          Reset
        </button>

        <button type="button" onClick={onTogglePlay} className="primary-button">
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <label className="speed-control">
        <span>Geschwindigkeit</span>
        <select
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
        >
          <option value={2000}>Langsam</option>
          <option value={1200}>Normal</option>
          <option value={700}>Schnell</option>
        </select>
      </label>
    </section>
  );
}