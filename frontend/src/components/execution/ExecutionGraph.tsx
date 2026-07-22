import ReactFlow, {
    Background,
    Controls,
    MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

import { getLayoutedElements } from "../../graph/layout";
import { buildExecutionGraph } from "../../graph/GraphBuilder";

import type { Analysis } from "../../types/api";

import OperationNode from "./nodes/OperationNode";

const nodeTypes = {
    table: OperationNode,
    filter: OperationNode,
    join: OperationNode,
    group: OperationNode,
    select: OperationNode,
    aggregate: OperationNode,
    sort: OperationNode,
    limit: OperationNode,
    result: OperationNode,
};

interface Props {
    analysis: Analysis;
}

export default function ExecutionGraph({ analysis }: Props) {
    const rawGraph = buildExecutionGraph(analysis);

    const graph = getLayoutedElements(
        rawGraph.nodes,
        rawGraph.edges
    );

    return (
        <div className="h-[700px] w-full rounded-xl border bg-white shadow-lg">
            <ReactFlow
                nodes={graph.nodes}
                edges={graph.edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                    padding: 0.4,
                    maxZoom: 1,
                }}
                minZoom={0.2}
                maxZoom={2}
                defaultViewport={{
                    x: 0,
                    y: 0,
                    zoom: 1,
                }}
                proOptions={{ hideAttribution: true }}
            >
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}