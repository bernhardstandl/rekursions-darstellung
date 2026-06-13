import type { TraceStep } from "../types";

interface ExplanationPanelProps {
  step: TraceStep;
  currentStepNumber: number;
  totalSteps: number;
}

export function ExplanationPanel({
  step,
  currentStepNumber,
  totalSteps,
}: ExplanationPanelProps) {
  return (
    <section className="explanation-panel" aria-labelledby="explanation-title">
      <div>
        <p className="step-counter">
          Schritt {currentStepNumber} von {totalSteps}
        </p>
        <h2 id="explanation-title">{step.title}</h2>
      </div>

      <p>{step.description}</p>
    </section>
  );
}