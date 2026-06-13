export type AlgorithmId = "bst-search";

export interface CodeLine {
  lineNumber: number;
  text: string;
}

export type VariableValue = string | number | null;

export interface StackFrame {
  id: string;
  call: string;
  variables: Record<string, VariableValue>;
  isActive: boolean;
}

export interface CallTreeNode {
  id: string;
  label: string;
  children: CallTreeNode[];
}

export interface TraceStep {
  id: number;
  title: string;
  description: string;
  activeLine: number | null;
  stack: StackFrame[];
  callTree: CallTreeNode;
  activeCallId: string | null;
}

export interface Algorithm {
  id: AlgorithmId;
  name: string;
  description: string;
  input?: AlgorithmInput;
  code: CodeLine[];
  trace: TraceStep[];
}

export interface AlgorithmInput {
  title: string;
  description: string;
  ascii: string;
}