import type { Algorithm, AlgorithmId } from "../types";

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selectedAlgorithmId: AlgorithmId;
  onSelectAlgorithm: (algorithmId: AlgorithmId) => void;
} 

export function AlgorithmSelector({
  algorithms,
  selectedAlgorithmId,
  onSelectAlgorithm,
}: AlgorithmSelectorProps) {
  return (
    <label className="algorithm-selector">
      <span>Algorithmus</span>
      <select
        value={selectedAlgorithmId}
        onChange={(event) => onSelectAlgorithm(event.target.value as AlgorithmId)}
      >
        {algorithms.map((algorithm) => (
          <option key={algorithm.id} value={algorithm.id}>
            {algorithm.name}
          </option>
        ))}
      </select>
    </label>
  );
}