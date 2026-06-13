import { bstSearchAlgorithm } from "./bstSearchTrace";
import { inorderTraversalAlgorithm } from "./inorderTraversalTrace";
import type { Algorithm } from "../types";

export const algorithms: Algorithm[] = [
  bstSearchAlgorithm,
  inorderTraversalAlgorithm,
];