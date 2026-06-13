import type { CallTreeNode } from "../types";

interface CallTreePanelProps {
  callTree: CallTreeNode;
  activeCallId: string | null;
}

interface TreeNodeViewProps {
  node: CallTreeNode;
  activeCallId: string | null;
}

function TreeNodeView({ node, activeCallId }: TreeNodeViewProps) {
  const isActive = node.id === activeCallId;

  return (
    <li className="tree-item">
      <div className={`tree-node ${isActive ? "active" : ""}`}>{node.label}</div>

      {node.children.length > 0 && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <TreeNodeView key={child.id} node={child} activeCallId={activeCallId} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function CallTreePanel({ callTree, activeCallId }: CallTreePanelProps) {
  return (
    <section className="panel tree-panel" aria-labelledby="tree-panel-title">
      <div className="panel-header">
        <h2 id="tree-panel-title">Rekursionsbaum</h2>
      </div>

      <ul className="call-tree">
        <TreeNodeView node={callTree} activeCallId={activeCallId} />
      </ul>
    </section>
  );
}