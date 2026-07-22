from __future__ import annotations

from typing import Any

from .schemas import AnalysisResult


class ExecutionFlowGenerator:
    """
    Generates the logical SQL execution order from AnalysisResult.

    Each step contains enough semantic information for:
    - Timeline rendering
    - Step descriptions
    - Future animations
    """

    @staticmethod
    def generate(analysis: AnalysisResult) -> list[dict[str, Any]]:

        flow: list[dict[str, Any]] = []
        step = 1

        def add(
            keyword: str,
            title: str,
            description: str,
            details: dict[str, Any] | None = None,
        ):
            nonlocal step

            flow.append(
                {
                    "id": step,
                    "step": keyword,
                    "title": title,
                    "description": description,
                    "details": details or {},
                }
            )

            step += 1

        # ---------------- FROM ----------------

        if analysis.tables:

            add(
                "FROM",
                "Read Tables",
                f"Read data from {', '.join(analysis.tables)}.",
                {
                    "tables": analysis.tables,
                },
            )

        # ---------------- JOIN ----------------

        for join in analysis.joins:

            table = join["table"]

            condition = join.get("condition")

            kind = join.get("kind") or "INNER"

            add(
                "JOIN",
                "Join Tables",
                f"{kind.upper()} JOIN with {table}.",
                {
                    "table": table,
                    "condition": condition,
                    "kind": kind,
                },
            )

        # ---------------- WHERE ----------------

        if analysis.where:

            predicate = " AND ".join(analysis.where)

            add(
                "WHERE",
                "Filter Rows",
                f"Keep only rows satisfying: {predicate}.",
                {
                    "conditions": analysis.where,
                },
            )

        # ---------------- GROUP BY ----------------

        if analysis.group_by:

            add(
                "GROUP BY",
                "Group Rows",
                f"Group rows by {', '.join(analysis.group_by)}.",
                {
                    "columns": analysis.group_by,
                },
            )

        # ---------------- HAVING ----------------

        if analysis.having:

            add(
                "HAVING",
                "Filter Groups",
                f"Keep only groups satisfying: {' AND '.join(analysis.having)}.",
                {
                    "conditions": analysis.having,
                },
            )

        # ---------------- SELECT ----------------

        projected = [
            item.alias if item.alias else item.expression
            for item in analysis.select_items
        ]

        add(
            "SELECT",
            "Project Columns",
            f"Return columns: {', '.join(projected)}.",
            {
                "columns": projected,
            },
        )

        # ---------------- DISTINCT ----------------

        if analysis.distinct:

            add(
                "DISTINCT",
                "Remove Duplicates",
                "Remove duplicate rows from the result.",
                {},
            )

        # ---------------- ORDER BY ----------------

        if analysis.order_by:

            add(
                "ORDER BY",
                "Sort Results",
                f"Sort rows by {', '.join(analysis.order_by)}.",
                {
                    "columns": analysis.order_by,
                },
            )

        # ---------------- LIMIT ----------------

        if analysis.limit is not None:

            add(
                "LIMIT",
                "Limit Output",
                f"Return only the first {analysis.limit} row(s).",
                {
                    "limit": analysis.limit,
                },
            )

        return flow