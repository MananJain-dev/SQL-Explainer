import { MarkerType, type Edge, type Node } from "reactflow";
import type { Analysis } from "../types/api";
import type { ExecutionGraph } from "./types";

export function buildExecutionGraph(
    analysis: Analysis
): ExecutionGraph {

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    //--------------------------------------------------
    // Helpers
    //--------------------------------------------------

    const uniqueAggregates = [
        ...new Set(analysis.aggregates)
    ];

    function addNode(
        id: string,
        type: string,
        title: string,
        value: string
    ) {
        nodes.push({
            id,
            type,
            position: {
                x: 0,
                y: 0,
            },
            data: {
                title,
                value,
            },
        });
    }

    function addEdge(
        source: string,
        target: string
    ) {
        edges.push({
            id: `${source}-${target}`,
            source,
            target,
            markerEnd: {
                type: MarkerType.ArrowClosed,
            },
        });
    }

    //--------------------------------------------------
    // FROM
    //--------------------------------------------------

    analysis.tables.forEach((table, index) => {
        addNode(
            `table-${index}`,
            "table",
            "FROM",
            table
        );
    });

    //--------------------------------------------------
    // JOIN
    //--------------------------------------------------

    analysis.joins.forEach((join, index) => {

        const joinType =
            (join.kind ?? "INNER").toUpperCase();

        addNode(
            `join-${index}`,
            "join",
            `${joinType} JOIN`,
            `${join.table}${
                join.condition
                    ? `\n${join.condition}`
                    : ""
            }`
        );
    });

    //--------------------------------------------------
    // WHERE
    //--------------------------------------------------

    if (analysis.where.length) {

        addNode(
            "where",
            "filter",
            "WHERE",
            analysis.where.join("\n")
        );

    }

    //--------------------------------------------------
    // GROUP BY
    //--------------------------------------------------

    if (analysis.group_by.length) {

        addNode(
            "groupby",
            "group",
            "GROUP BY",
            analysis.group_by.join(", ")
        );

    }

    //--------------------------------------------------
    // AGGREGATE
    //--------------------------------------------------

    if (uniqueAggregates.length) {

        addNode(
            "aggregate",
            "aggregate",
            "AGGREGATE",
            uniqueAggregates.join("\n")
        );

    }

    //--------------------------------------------------
    // HAVING
    //--------------------------------------------------

    if (analysis.having.length) {

        addNode(
            "having",
            "filter",
            "HAVING",
            analysis.having.join("\n")
        );

    }

    //--------------------------------------------------
    // SELECT
    //--------------------------------------------------

    addNode(
        "select",
        "select",
        "SELECT",
        analysis.select_items
            .map((item) => {

                if (item.alias) {

                    return `${item.expression} AS ${item.alias}`;

                }

                return item.expression;

            })
            .join("\n")
    );

        //--------------------------------------------------
    // ORDER BY
    //--------------------------------------------------

    if (analysis.order_by.length) {

        addNode(
            "orderby",
            "sort",
            "ORDER BY",
            analysis.order_by.join(", ")
        );

    }

    //--------------------------------------------------
    // LIMIT
    //--------------------------------------------------

    if (analysis.limit) {

        addNode(
            "limit",
            "limit",
            "LIMIT",
            analysis.limit
        );

    }

    //--------------------------------------------------
    // BUILD EDGES
    //--------------------------------------------------

    let current: string;

    // FROM → JOIN
    if (analysis.joins.length) {

        analysis.tables.forEach((_, index) => {
            addEdge(
                `table-${index}`,
                "join-0"
            );
        });

        for (
            let i = 1;
            i < analysis.joins.length;
            i++
        ) {

            addEdge(
                `join-${i - 1}`,
                `join-${i}`
            );

        }

        current = `join-${analysis.joins.length - 1}`;

    } else {

        current = analysis.tables.length
            ? "table-0"
            : "select";

    }

    //--------------------------------------------------
    // WHERE
    //--------------------------------------------------

    if (analysis.where.length) {

        addEdge(current, "where");
        current = "where";

    }

    //--------------------------------------------------
    // GROUP BY
    //--------------------------------------------------

    if (analysis.group_by.length) {

        addEdge(current, "groupby");
        current = "groupby";

    }

    //--------------------------------------------------
    // AGGREGATE
    //--------------------------------------------------

    if (uniqueAggregates.length) {

        addEdge(current, "aggregate");
        current = "aggregate";

    }

    //--------------------------------------------------
    // HAVING
    //--------------------------------------------------

    if (analysis.having.length) {

        addEdge(current, "having");
        current = "having";

    }

    //--------------------------------------------------
    // SELECT
    //--------------------------------------------------

    addEdge(current, "select");
    current = "select";

    //--------------------------------------------------
    // ORDER BY
    //--------------------------------------------------

    if (analysis.order_by.length) {

        addEdge(current, "orderby");
        current = "orderby";

    }

    //--------------------------------------------------
    // LIMIT
    //--------------------------------------------------

    if (analysis.limit) {

        addEdge(current, "limit");
        current = "limit";

    }

    return {
        nodes,
        edges,
    };
}