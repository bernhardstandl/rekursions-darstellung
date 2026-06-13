import type { CallTreeNode } from "../types";

interface CallTreePanelProps {
  callTree: CallTreeNode;
  activeCallId: string | null;
  returnValue?: string;
  returnFromCallId?: string | null;
  returnToCallId?: string | null;
}

interface TreeNodeViewProps {
  node: CallTreeNode;
  activeCallId: string | null;
  returnValue?: string;
  returnFromCallId?: string | null;
  returnToCallId?: string | null;
}

function findNodeLabel(node: CallTreeNode, id: string | null | undefined): string | null {
  if (!id) {
    return null;
  }

  if (node.id === id) {
    return node.label;
  }

  for (const child of node.children) {
    const result = findNodeLabel(child, id);

    if (result) {
      return result;
    }
  }

  return null;
}

function TreeNodeView({
  node,
  activeCallId,
  returnValue,
  returnFromCallId,
  returnToCallId,
}: TreeNodeViewProps) {
  const isActive = node.id === activeCallId;
  const isReturningFrom = node.id === returnFromCallId;
  const isReturnTarget = node.id === returnToCallId;

  const className = [
    "tree-node",
    isActive ? "active" : "",
    node.status ? `status-${node.status}` : "",
    isReturningFrom ? "returning-from" : "",
    isReturnTarget ? "return-target" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className="tree-item">
      <div className={className}>
        <span className="tree-node-label">{node.label}</span>

        {node.returnValue && (
          <span className="tree-return-badge">return: {node.returnValue}</span>
        )}

        {isReturningFrom && returnValue && (
          <span className="tree-current-return">↑ gibt {returnValue} zurück</span>
        )}

        {isReturnTarget && returnValue && (
          <span className="tree-receive-badge">empfängt Rückgabe</span>
        )}
      </div>

      {node.children.length > 0 && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <TreeNodeView
              key={child.id}
              node={child}
              activeCallId={activeCallId}
              returnValue={returnValue}
              returnFromCallId={returnFromCallId}
              returnToCallId={returnToCallId}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CallTreePanel({
  callTree,
  activeCallId,
  returnValue,
  returnFromCallId,
  returnToCallId,
}: CallTreePanelProps) {
  const returnFromLabel = findNodeLabel(callTree, returnFromCallId);
  const returnToLabel =
    findNodeLabel(callTree, returnToCallId) ?? "Endergebnis";

  const showReturnFlow = Boolean(returnValue && returnFromLabel);

  return (
    <section className="panel tree-panel" aria-labelledby="tree-panel-title">
      <div className="panel-header">
        <h2 id="tree-panel-title">Rekursionsbaum</h2>
      </div>

      {showReturnFlow && (
        <div className="return-flow" aria-live="polite">
          <span className="return-flow-label">Aktuelle Rückgabe</span>

          <div className="return-flow-path">
            <strong>{returnFromLabel}</strong>
            <span className="return-flow-arrow">↑</span>
            <strong>{returnToLabel}</strong>
          </div>

          <div className="return-flow-value">
            Wert: <strong>{returnValue}</strong>
          </div>
        </div>
      )}

      <ul className="call-tree">
        <TreeNodeView
          node={callTree}
          activeCallId={activeCallId}
          returnValue={returnValue}
          returnFromCallId={returnFromCallId}
          returnToCallId={returnToCallId}
        />
      </ul>
    </section>
  );
}