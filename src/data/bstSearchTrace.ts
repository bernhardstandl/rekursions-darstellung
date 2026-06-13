import type { Algorithm, CallTreeNode, CodeLine, StackFrame, TraceStep } from "../types";

const code: CodeLine[] = [
  { lineNumber: 1, text: "def tree_search(x, k):" },
  { lineNumber: 2, text: "    if x is None:" },
  { lineNumber: 3, text: "        return None" },
  { lineNumber: 4, text: "" },
  { lineNumber: 5, text: "    if x.key == k:" },
  { lineNumber: 6, text: "        return x" },
  { lineNumber: 7, text: "" },
  { lineNumber: 8, text: "    if k < x.key:" },
  { lineNumber: 9, text: "        return tree_search(x.left, k)" },
  { lineNumber: 10, text: "" },
  { lineNumber: 11, text: "    return tree_search(x.right, k)" },
];

const frame5 = (isActive: boolean): StackFrame => ({
  id: "call-5",
  call: "TreeSearch(5, 4)",
  variables: {
    "x.key": 5,
    k: 4,
  },
  isActive,
});

const frame3 = (isActive: boolean): StackFrame => ({
  id: "call-3",
  call: "TreeSearch(3, 4)",
  variables: {
    "x.key": 3,
    k: 4,
  },
  isActive,
});

const frame4 = (isActive: boolean): StackFrame => ({
  id: "call-4",
  call: "TreeSearch(4, 4)",
  variables: {
    "x.key": 4,
    k: 4,
  },
  isActive,
});

const callTree5: CallTreeNode = {
  id: "call-5",
  label: "TreeSearch(5, 4)",
  children: [],
};

const callTree53: CallTreeNode = {
  id: "call-5",
  label: "TreeSearch(5, 4)",
  children: [
    {
      id: "call-3",
      label: "TreeSearch(3, 4)",
      children: [],
    },
  ],
};

const callTree534: CallTreeNode = {
  id: "call-5",
  label: "TreeSearch(5, 4)",
  children: [
    {
      id: "call-3",
      label: "TreeSearch(3, 4)",
      children: [
        {
          id: "call-4",
          label: "TreeSearch(4, 4)",
          children: [],
        },
      ],
    },
  ],
};

const trace: TraceStep[] = [
  {
    id: 1,
    title: "Start: TreeSearch(5, 4)",
    description:
      "Die Suche beginnt an der Wurzel des binären Suchbaums. Der aktuelle Knoten hat den Schlüssel 5, gesucht wird der Schlüssel 4.",
    activeLine: 1,
    stack: [frame5(true)],
    callTree: callTree5,
    activeCallId: "call-5",
  },
  {
    id: 2,
    title: "Prüfung: x is None",
    description:
      "Zuerst wird geprüft, ob der aktuelle Knoten leer ist. Das ist hier nicht der Fall, denn x zeigt auf den Knoten mit Schlüssel 5.",
    activeLine: 2,
    stack: [frame5(true)],
    callTree: callTree5,
    activeCallId: "call-5",
  },
  {
    id: 3,
    title: "Prüfung: x.key == k",
    description:
      "Nun wird geprüft, ob der aktuelle Schlüssel 5 gleich dem gesuchten Schlüssel 4 ist. Das ist falsch.",
    activeLine: 5,
    stack: [frame5(true)],
    callTree: callTree5,
    activeCallId: "call-5",
  },
  {
    id: 4,
    title: "4 < 5: Suche links",
    description:
      "Da 4 kleiner als 5 ist, kann sich der gesuchte Schlüssel nur im linken Teilbaum befinden. Es folgt ein rekursiver Aufruf mit x.left.",
    activeLine: 9,
    stack: [frame5(true)],
    callTree: callTree5,
    activeCallId: "call-5",
  },
  {
    id: 5,
    title: "Rekursiver Aufruf: TreeSearch(3, 4)",
    description:
      "Ein neuer Stackframe wird erzeugt. Die Funktion arbeitet jetzt mit dem Knoten 3 weiter.",
    activeLine: 1,
    stack: [frame5(false), frame3(true)],
    callTree: callTree53,
    activeCallId: "call-3",
  },
  {
    id: 6,
    title: "Prüfung: x is None",
    description:
      "Auch der Knoten 3 ist nicht leer. Die Suche geht im aktuellen Funktionsaufruf weiter.",
    activeLine: 2,
    stack: [frame5(false), frame3(true)],
    callTree: callTree53,
    activeCallId: "call-3",
  },
  {
    id: 7,
    title: "Prüfung: x.key == k",
    description:
      "Der aktuelle Schlüssel 3 wird mit dem gesuchten Schlüssel 4 verglichen. 3 ist nicht gleich 4.",
    activeLine: 5,
    stack: [frame5(false), frame3(true)],
    callTree: callTree53,
    activeCallId: "call-3",
  },
  {
    id: 8,
    title: "4 > 3: Suche rechts",
    description:
      "Da 4 größer als 3 ist, wird im rechten Teilbaum weitergesucht. Es folgt ein rekursiver Aufruf mit x.right.",
    activeLine: 11,
    stack: [frame5(false), frame3(true)],
    callTree: callTree53,
    activeCallId: "call-3",
  },
  {
    id: 9,
    title: "Rekursiver Aufruf: TreeSearch(4, 4)",
    description:
      "Ein weiterer Stackframe wird erzeugt. Die Funktion arbeitet jetzt mit dem Knoten 4.",
    activeLine: 1,
    stack: [frame5(false), frame3(false), frame4(true)],
    callTree: callTree534,
    activeCallId: "call-4",
  },
  {
    id: 10,
    title: "Prüfung: x is None",
    description:
      "Der aktuelle Knoten ist nicht leer. x zeigt auf den Knoten mit Schlüssel 4.",
    activeLine: 2,
    stack: [frame5(false), frame3(false), frame4(true)],
    callTree: callTree534,
    activeCallId: "call-4",
  },
  {
    id: 11,
    title: "Prüfung: x.key == k",
    description:
      "Der aktuelle Schlüssel 4 wird mit dem gesuchten Schlüssel 4 verglichen. Die Bedingung ist wahr.",
    activeLine: 5,
    stack: [frame5(false), frame3(false), frame4(true)],
    callTree: callTree534,
    activeCallId: "call-4",
  },
  {
    id: 12,
    title: "Basisfall gefunden",
    description:
      "Der gesuchte Schlüssel wurde gefunden. Dieser Fall beendet die Rekursion: Der aktuelle Knoten wird zurückgegeben.",
    activeLine: 6,
    stack: [frame5(false), frame3(false), frame4(true)],
    callTree: callTree534,
    activeCallId: "call-4",
  },
  {
  id: 13,
  title: "return Knoten 4",
  description:
    "TreeSearch(4, 4) gibt den gefundenen Knoten 4 an den vorherigen Aufruf zurück.",
  activeLine: 6,
  stack: [
    { ...frame5(false), status: "pending", note: "wartet auf Ergebnis aus dem linken Teilbaum" },
    { ...frame3(false), status: "pending", note: "wartet auf Ergebnis aus dem rechten Teilbaum" },
    { ...frame4(true), status: "completed", returnValue: "Knoten 4" }
  ],
  callTree: callTree534,
  activeCallId: "call-4",
  returnValue: "Knoten 4",
  returnFromCallId: "call-4",
  returnToCallId: "call-3",
},
{
  id: 14,
  title: "Rückgabe an TreeSearch(3, 4)",
  description:
    "TreeSearch(3, 4) erhält den Rückgabewert Knoten 4 aus dem rechten Teilbaum und gibt ihn weiter.",
  activeLine: 11,
  stack: [
    { ...frame5(false), status: "pending", note: "wartet auf Ergebnis aus dem linken Teilbaum" },
    { ...frame3(true), status: "completed", returnValue: "Knoten 4" }
  ],
  callTree: callTree534,
  activeCallId: "call-3",
  returnValue: "Knoten 4",
  returnFromCallId: "call-3",
  returnToCallId: "call-5",
},
{
  id: 15,
  title: "Rückgabe an TreeSearch(5, 4)",
  description:
    "Der ursprüngliche Aufruf erhält den Knoten 4 aus seinem linken Teilbaum.",
  activeLine: 9,
  stack: [
    { ...frame5(true), status: "completed", returnValue: "Knoten 4" }
  ],
  callTree: callTree534,
  activeCallId: "call-5",
  returnValue: "Knoten 4",
  returnFromCallId: "call-5",
  returnToCallId: null,
},
  {
    id: 16,
    title: "Ergebnis: Knoten 4",
    description:
      "Die Suche ist abgeschlossen. Der Algorithmus liefert den Knoten mit Schlüssel 4 zurück.",
    activeLine: null,
    stack: [],
    callTree: callTree534,
    activeCallId: "call-4",
  },
];

export const bstSearchAlgorithm: Algorithm = {
  id: "bst-search",
  name: "BST Suche",
  description: "Rekursive Suche in einem binären Suchbaum nach dem Schlüssel 4.",
  input: {
    title: "Binärer Suchbaum, gesucht: Schlüssel 4",
    description:
      "Die Suche startet an der Wurzel 5. Da der Baum ein binärer Suchbaum ist, entscheidet jeder Vergleich, ob links oder rechts weitergesucht wird.",
    ascii: `        5
      /   \\
     3     7
    / \\     \\
   2   4     8`,
  },
  code,
  trace,
};