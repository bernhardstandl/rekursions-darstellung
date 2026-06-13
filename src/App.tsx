import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { AlgorithmSelector } from "./components/AlgorithmSelector";
import { CallStackPanel } from "./components/CallStackPanel";
import { CallTreePanel } from "./components/CallTreePanel";
import { CodePanel } from "./components/CodePanel";
import { Controls } from "./components/Controls";
import { ExplanationPanel } from "./components/ExplanationPanel";
import { Legend } from "./components/Legend";
import { algorithms } from "./data/algorithms";
import type { AlgorithmId } from "./types";
import { InputDataPanel } from "./components/InputDataPanel";

function App() {
  const [selectedAlgorithmId, setSelectedAlgorithmId] =
    useState<AlgorithmId>("bst-search");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const selectedAlgorithm = useMemo(() => {
    return (
      algorithms.find((algorithm) => algorithm.id === selectedAlgorithmId) ??
      algorithms[0]
    );
  }, [selectedAlgorithmId]);

  const lastStepIndex = Math.max(selectedAlgorithm.trace.length - 1, 0);
  const safeStepIndex = Math.min(currentStepIndex, lastStepIndex);
  const currentStep = selectedAlgorithm.trace[safeStepIndex];

  const canGoBack = safeStepIndex > 0;
  const canGoForward = safeStepIndex < lastStepIndex;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (safeStepIndex >= lastStepIndex) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStepIndex((currentIndex) =>
        Math.min(currentIndex + 1, lastStepIndex)
      );
    }, speed);

    return () => window.clearTimeout(timer);
  }, [isPlaying, safeStepIndex, lastStepIndex, speed]);

  const handleSelectAlgorithm = (algorithmId: AlgorithmId) => {
    setSelectedAlgorithmId(algorithmId);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentStepIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentStepIndex((currentIndex) =>
      Math.min(currentIndex + 1, lastStepIndex)
    );
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (safeStepIndex >= lastStepIndex) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((playing) => !playing);
  };

  if (!currentStep) {
    return (
      <main className="app-shell">
        <section className="empty-state">
          Für diesen Algorithmus sind noch keine Trace-Daten vorhanden.
        </section>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Didaktische Web-App</p>
          <h1>Rekursions-Visualizer</h1>
          <p className="header-description">
            Rekursive Algorithmen Schritt für Schritt verstehen.
          </p>
        </div>

        <AlgorithmSelector
          algorithms={algorithms}
          selectedAlgorithmId={selectedAlgorithm.id}
          onSelectAlgorithm={handleSelectAlgorithm}
        />
      </header>

      <Legend />

      {selectedAlgorithm.input && (
  <InputDataPanel
    title={selectedAlgorithm.input.title}
    description={selectedAlgorithm.input.description}
    ascii={selectedAlgorithm.input.ascii}
  />
)}

      <main className="visualization-grid">
        <CodePanel
          code={selectedAlgorithm.code}
          activeLine={currentStep.activeLine}
        />

        <CallStackPanel stack={currentStep.stack} />

        <CallTreePanel
  callTree={currentStep.callTree}
  activeCallId={currentStep.activeCallId}
  returnValue={currentStep.returnValue}
  returnFromCallId={currentStep.returnFromCallId ?? null}
  returnToCallId={currentStep.returnToCallId ?? null}
/>
      </main>

      <footer className="bottom-area">
        <ExplanationPanel
          step={currentStep}
          currentStepNumber={safeStepIndex + 1}
          totalSteps={selectedAlgorithm.trace.length}
        />

        <Controls
          isPlaying={isPlaying}
          speed={speed}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onReset={handleReset}
          onTogglePlay={handleTogglePlay}
          onSpeedChange={setSpeed}
        />
      </footer>
    </div>
  );
}

export default App;