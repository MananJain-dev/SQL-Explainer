import dagre from "@dagrejs/dagre";
import type { Node, Edge } from "reactflow";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 110;

export function getLayoutedElements(
    nodes: Node[],
    edges: Edge[],
    direction: "TB" | "LR" = "TB"
) {
    const graph = new dagre.graphlib.Graph();

    graph.setDefaultEdgeLabel(() => ({}));

    graph.setGraph({
        rankdir: direction,
        ranksep: 80,
        nodesep: 50,
        marginx: 40,
        marginy: 40,
    });

    nodes.forEach((node) => {
        graph.setNode(node.id, {
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
        });
    });

    edges.forEach((edge) => {
        graph.setEdge(edge.source, edge.target);
    });

    dagre.layout(graph);

    return {
        nodes: nodes.map((node) => {
            const pos = graph.node(node.id);

            return {
                ...node,
                position: {
                    x: pos.x - NODE_WIDTH / 2,
                    y: pos.y - NODE_HEIGHT / 2,
                },
            };
        }),
        edges,
    };
}