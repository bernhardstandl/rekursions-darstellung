import type {
  Algorithm,
  CallTreeNode,
  CodeLine,
  FrameStatus,
  StackFrame,
  TraceStep,
} from "../types";

type CallId = "call-5" | "call-3" | "call-2" | "call-4" | "call-7" | "call-8";

const code: CodeLine[] = [
  { lineNumber: 1, text: "def inorder(x):" },
  { lineNumber: 2, text: "    if x is None:" },
  { lineNumber: 3, text: "        return" },
  { lineNumber: 4, text: "" },
  { lineNumber: 5, text: "    inorder(x.left)" },
  { lineNumber: 6, text: "    visit(x)" },
  { lineNumber: 7, text: "    inorder(x.right)" },
];

const callNodes: Record<CallId, { label: string; key: number; children: CallId[] }> = {
  "call-5": {
    label: "Inorder(5)",
    key: 5,
    children: ["call-3", "call-7"],
  },
  "call-3": {
    label: "Inorder(3)",
    key: 3,
    children: ["call-2", "call-4"],
  },
  "call-2": {
    label: "Inorder(2)",
    key: 2,
    children: [],
  },
  "call-4": {
    label: "Inorder(4)",
    key: 4,
    children: [],
  },
  "call-7": {
    label: "Inorder(7)",
    key: 7,
    children: ["call-8"],
  },
  "call-8": {
    label: "Inorder(8)",
    key: 8,
    children: [],
  },
};

function createFrame(
  id: CallId,
  options: {
    status?: FrameStatus;
    isActive?: boolean;
    note?: string;
    returnValue?: string;
  } = {}
): StackFrame {
  const status = options.status ?? "active";

  return {
    id,
    call: callNodes[id].label,
    variables: {
      "x.key": callNodes[id].key,
    },
    isActive: options.isActive ?? status === "active",
    status,
    note: options.note,
    returnValue: options.returnValue,
  };
}

function createCallTree(options: {
  visible: CallId[];
  activeCallId: CallId | null;
  pending?: CallId[];
  completed?: CallId[];
  returnValues?: Partial<Record<CallId, string>>;
}): CallTreeNode {
  const visible = new Set<CallId>(options.visible);
  const pending = new Set<CallId>(options.pending ?? []);
  const completed = new Set<CallId>(options.completed ?? []);
  const returnValues = options.returnValues ?? {};

  function buildNode(id: CallId): CallTreeNode {
    let status: FrameStatus | undefined;

    if (pending.has(id)) {
      status = "pending";
    }

    if (completed.has(id)) {
      status = "completed";
    }

    if (options.activeCallId === id) {
      status = "active";
    }

    return {
      id,
      label: callNodes[id].label,
      status,
      returnValue: returnValues[id],
      children: callNodes[id].children
        .filter((childId) => visible.has(childId))
        .map((childId) => buildNode(childId)),
    };
  }

  return buildNode("call-5");
}

const trace: TraceStep[] = [
  {
    id: 1,
    title: "Start: Inorder(5)",
    description:
      "Die Inorder-Traversierung beginnt an der Wurzel 5. Bei Inorder gilt: zuerst links, dann aktueller Knoten, dann rechts.",
    activeLine: 1,
    stack: [createFrame("call-5")],
    callTree: createCallTree({
      visible: ["call-5"],
      activeCallId: "call-5",
    }),
    activeCallId: "call-5",
  },
  {
    id: 2,
    title: "Prüfung: x is None",
    description:
      "Der aktuelle Knoten ist nicht leer. Deshalb wird die Traversierung fortgesetzt.",
    activeLine: 2,
    stack: [createFrame("call-5")],
    callTree: createCallTree({
      visible: ["call-5"],
      activeCallId: "call-5",
    }),
    activeCallId: "call-5",
  },
  {
    id: 3,
    title: "Zuerst linker Teilbaum von 5",
    description:
      "Bei Inorder wird zuerst der linke Teilbaum traversiert. Deshalb ruft Inorder(5) nun Inorder(3) auf.",
    activeLine: 5,
    stack: [
      createFrame("call-5", {
        status: "pending",
        note: "wartet, bis der linke Teilbaum vollständig traversiert ist",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5"],
      activeCallId: "call-5",
      pending: ["call-5"],
    }),
    activeCallId: "call-5",
  },
  {
    id: 4,
    title: "Rekursiver Aufruf: Inorder(3)",
    description:
      "Ein neuer Stackframe entsteht. Jetzt wird der linke Teilbaum der Wurzel bearbeitet.",
    activeLine: 1,
    stack: [
      createFrame("call-5", {
        status: "pending",
        note: "wartet auf Inorder(3)",
      }),
      createFrame("call-3"),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3"],
      activeCallId: "call-3",
      pending: ["call-5"],
    }),
    activeCallId: "call-3",
  },
  {
    id: 5,
    title: "Zuerst linker Teilbaum von 3",
    description:
      "Auch bei Knoten 3 gilt: zuerst links. Der nächste Aufruf ist Inorder(2).",
    activeLine: 5,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", {
        status: "pending",
        note: "wartet, bis der linke Teilbaum traversiert ist",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3"],
      activeCallId: "call-3",
      pending: ["call-5", "call-3"],
    }),
    activeCallId: "call-3",
  },
  {
    id: 6,
    title: "Rekursiver Aufruf: Inorder(2)",
    description:
      "Knoten 2 ist der linke Nachfolger von 3. Er wird jetzt aktiv bearbeitet.",
    activeLine: 1,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", { status: "pending", note: "wartet auf Inorder(2)" }),
      createFrame("call-2"),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2"],
      activeCallId: "call-2",
      pending: ["call-5", "call-3"],
    }),
    activeCallId: "call-2",
  },
  {
    id: 7,
    title: "Linker Teilbaum von 2 ist leer",
    description:
      "Knoten 2 hat keinen linken Nachfolger. Der rekursive Aufruf auf den leeren linken Teilbaum würde sofort zurückkehren.",
    activeLine: 5,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", { status: "pending", note: "wartet auf Inorder(2)" }),
      createFrame("call-2", {
        status: "active",
        note: "linker Teilbaum ist leer",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2"],
      activeCallId: "call-2",
      pending: ["call-5", "call-3"],
    }),
    activeCallId: "call-2",
  },
  {
    id: 8,
    title: "visit(2)",
    description:
      "Nach dem linken Teilbaum wird der aktuelle Knoten besucht. Ausgabe bisher: 2.",
    activeLine: 6,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", { status: "pending", note: "wartet auf Inorder(2)" }),
      createFrame("call-2", {
        status: "active",
        note: "besucht den aktuellen Knoten; Ausgabe bisher: 2",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2"],
      activeCallId: "call-2",
      pending: ["call-5", "call-3"],
    }),
    activeCallId: "call-2",
  },
  {
    id: 9,
    title: "Inorder(2) ist abgeschlossen",
    description:
      "Der rechte Teilbaum von 2 ist ebenfalls leer. Damit ist Inorder(2) fertig und die Kontrolle kehrt zu Inorder(3) zurück.",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", { status: "pending", note: "wartet auf Inorder(2)" }),
      createFrame("call-2", {
        status: "completed",
        isActive: true,
        note: "fertig; kehrt zu Inorder(3) zurück",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2"],
      activeCallId: "call-2",
      pending: ["call-5", "call-3"],
      completed: ["call-2"],
    }),
    activeCallId: "call-2",
  },
  {
    id: 10,
    title: "visit(3)",
    description:
      "Der linke Teilbaum von 3 ist fertig. Jetzt wird Knoten 3 besucht. Ausgabe bisher: 2, 3.",
    activeLine: 6,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", {
        status: "active",
        note: "linker Teilbaum abgeschlossen; Ausgabe bisher: 2, 3",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2"],
      activeCallId: "call-3",
      pending: ["call-5"],
      completed: ["call-2"],
    }),
    activeCallId: "call-3",
  },
  {
    id: 11,
    title: "Rechter Teilbaum von 3",
    description:
      "Nach dem Besuch von 3 wird der rechte Teilbaum traversiert. Der nächste Aufruf ist Inorder(4).",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", {
        status: "pending",
        note: "wartet auf Inorder(4)",
      }),
      createFrame("call-4"),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4"],
      activeCallId: "call-4",
      pending: ["call-5", "call-3"],
      completed: ["call-2"],
    }),
    activeCallId: "call-4",
  },
  {
    id: 12,
    title: "visit(4)",
    description:
      "Knoten 4 hat keinen linken Teilbaum. Also wird der aktuelle Knoten besucht. Ausgabe bisher: 2, 3, 4.",
    activeLine: 6,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", { status: "pending", note: "wartet auf Inorder(4)" }),
      createFrame("call-4", {
        status: "active",
        note: "besucht den aktuellen Knoten; Ausgabe bisher: 2, 3, 4",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4"],
      activeCallId: "call-4",
      pending: ["call-5", "call-3"],
      completed: ["call-2"],
    }),
    activeCallId: "call-4",
  },
  {
    id: 13,
    title: "Inorder(4) ist abgeschlossen",
    description:
      "Der rechte Teilbaum von 4 ist leer. Inorder(4) ist fertig und kehrt zu Inorder(3) zurück.",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", { status: "pending", note: "wartet auf Inorder(4)" }),
      createFrame("call-4", {
        status: "completed",
        isActive: true,
        note: "fertig; kehrt zu Inorder(3) zurück",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4"],
      activeCallId: "call-4",
      pending: ["call-5", "call-3"],
      completed: ["call-2", "call-4"],
    }),
    activeCallId: "call-4",
  },
  {
    id: 14,
    title: "Inorder(3) ist abgeschlossen",
    description:
      "Links, Knoten selbst und rechts sind für Knoten 3 fertig. Die Kontrolle kehrt zu Inorder(5) zurück.",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(3)" }),
      createFrame("call-3", {
        status: "completed",
        isActive: true,
        note: "linker Teilbaum, Knoten 3 und rechter Teilbaum sind fertig",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4"],
      activeCallId: "call-3",
      pending: ["call-5"],
      completed: ["call-2", "call-4", "call-3"],
    }),
    activeCallId: "call-3",
  },
  {
    id: 15,
    title: "visit(5)",
    description:
      "Der linke Teilbaum der Wurzel ist fertig. Jetzt wird Knoten 5 besucht. Ausgabe bisher: 2, 3, 4, 5.",
    activeLine: 6,
    stack: [
      createFrame("call-5", {
        status: "active",
        note: "linker Teilbaum abgeschlossen; Ausgabe bisher: 2, 3, 4, 5",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4"],
      activeCallId: "call-5",
      completed: ["call-2", "call-4", "call-3"],
    }),
    activeCallId: "call-5",
  },
  {
    id: 16,
    title: "Rechter Teilbaum von 5",
    description:
      "Nach dem Besuch der Wurzel wird der rechte Teilbaum traversiert. Der nächste Aufruf ist Inorder(7).",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(7)" }),
      createFrame("call-7"),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4", "call-7"],
      activeCallId: "call-7",
      pending: ["call-5"],
      completed: ["call-2", "call-4", "call-3"],
    }),
    activeCallId: "call-7",
  },
  {
    id: 17,
    title: "visit(7)",
    description:
      "Knoten 7 hat keinen linken Teilbaum. Deshalb wird 7 besucht. Ausgabe bisher: 2, 3, 4, 5, 7.",
    activeLine: 6,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(7)" }),
      createFrame("call-7", {
        status: "active",
        note: "linker Teilbaum leer; Ausgabe bisher: 2, 3, 4, 5, 7",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4", "call-7"],
      activeCallId: "call-7",
      pending: ["call-5"],
      completed: ["call-2", "call-4", "call-3"],
    }),
    activeCallId: "call-7",
  },
  {
    id: 18,
    title: "Rechter Teilbaum von 7",
    description:
      "Nach dem Besuch von 7 wird dessen rechter Teilbaum traversiert. Der nächste Aufruf ist Inorder(8).",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(7)" }),
      createFrame("call-7", { status: "pending", note: "wartet auf Inorder(8)" }),
      createFrame("call-8"),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4", "call-7", "call-8"],
      activeCallId: "call-8",
      pending: ["call-5", "call-7"],
      completed: ["call-2", "call-4", "call-3"],
    }),
    activeCallId: "call-8",
  },
  {
    id: 19,
    title: "visit(8)",
    description:
      "Knoten 8 hat keinen linken Teilbaum. Er wird besucht. Ausgabe bisher: 2, 3, 4, 5, 7, 8.",
    activeLine: 6,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(7)" }),
      createFrame("call-7", { status: "pending", note: "wartet auf Inorder(8)" }),
      createFrame("call-8", {
        status: "active",
        note: "besucht den aktuellen Knoten; Ausgabe bisher: 2, 3, 4, 5, 7, 8",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4", "call-7", "call-8"],
      activeCallId: "call-8",
      pending: ["call-5", "call-7"],
      completed: ["call-2", "call-4", "call-3"],
    }),
    activeCallId: "call-8",
  },
  {
    id: 20,
    title: "Inorder(8) ist abgeschlossen",
    description:
      "Der rechte Teilbaum von 8 ist leer. Inorder(8) ist fertig und kehrt zu Inorder(7) zurück.",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(7)" }),
      createFrame("call-7", { status: "pending", note: "wartet auf Inorder(8)" }),
      createFrame("call-8", {
        status: "completed",
        isActive: true,
        note: "fertig; kehrt zu Inorder(7) zurück",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4", "call-7", "call-8"],
      activeCallId: "call-8",
      pending: ["call-5", "call-7"],
      completed: ["call-2", "call-4", "call-3", "call-8"],
    }),
    activeCallId: "call-8",
  },
  {
    id: 21,
    title: "Inorder(7) ist abgeschlossen",
    description:
      "Knoten 7 und sein rechter Teilbaum sind fertig. Die Kontrolle kehrt zu Inorder(5) zurück.",
    activeLine: 7,
    stack: [
      createFrame("call-5", { status: "pending", note: "wartet auf Inorder(7)" }),
      createFrame("call-7", {
        status: "completed",
        isActive: true,
        note: "fertig; kehrt zu Inorder(5) zurück",
      }),
    ],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4", "call-7", "call-8"],
      activeCallId: "call-7",
      pending: ["call-5"],
      completed: ["call-2", "call-4", "call-3", "call-8", "call-7"],
    }),
    activeCallId: "call-7",
  },
  {
    id: 22,
    title: "Ergebnis der Inorder-Traversierung",
    description:
      "Alle Teilbäume wurden verarbeitet. Die Besuchsreihenfolge lautet: 2, 3, 4, 5, 7, 8.",
    activeLine: null,
    stack: [],
    callTree: createCallTree({
      visible: ["call-5", "call-3", "call-2", "call-4", "call-7", "call-8"],
      activeCallId: null,
      completed: ["call-2", "call-4", "call-3", "call-8", "call-7", "call-5"],
    }),
    activeCallId: null,
  },
];

export const inorderTraversalAlgorithm: Algorithm = {
  id: "inorder-traversal",
  name: "Inorder-Traversierung",
  description:
    "Rekursive Inorder-Traversierung eines Binärbaums: links, Knoten, rechts.",
  input: {
    title: "Binärbaum für die Inorder-Traversierung",
    description:
      "Die Inorder-Traversierung besucht zuerst den linken Teilbaum, dann den aktuellen Knoten und anschließend den rechten Teilbaum.",
    ascii: `        5
      /   \\
     3     7
    / \\     \\
   2   4     8`,
  },
  code,
  trace,
};