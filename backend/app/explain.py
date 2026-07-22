from __future__ import annotations

from typing import Any

from .schemas import AnalysisResult


class SQLExplainer:
    """
    Generates human-readable explanations for an SQL query
    using the AnalysisResult.
    """
    @staticmethod
    def explain(analysis: AnalysisResult) -> dict[str, Any]:    

        steps = []

        step_number = 1

        def add(title: str, description: str):

            nonlocal step_number

            steps.append(
                {
                    "id": step_number,
                    "title": title,
                    "description": description,
                }
            )

            step_number += 1

        # ----------------------------------------------------
        # FROM
        # ----------------------------------------------------

        if analysis.tables:

            tables = ", ".join(analysis.tables)

            add(
                "FROM",
                f"Read data from table(s): {tables}."
            )

        # ----------------------------------------------------
        # JOIN
        # ----------------------------------------------------

        for join in analysis.joins:

            table = join["table"]

            kind = join["kind"] or "JOIN"

            condition = join["condition"]

            if condition:

                add(
                    "JOIN",
                    f"{kind} the table '{table}' using the condition ({condition})."
                )

            else:

                add(
                    "JOIN",
                    f"{kind} the table '{table}' without an ON condition (Cartesian product)."
                )

        # ----------------------------------------------------
        # WHERE
        # ----------------------------------------------------

        for condition in analysis.where:

            add(
                "WHERE",
                f"Filter rows where {condition}."
            )

        # ----------------------------------------------------
        # GROUP BY
        # ----------------------------------------------------

        if analysis.group_by:

            cols = ", ".join(analysis.group_by)

            add(
                "GROUP BY",
                f"Group rows by {cols}."
            )

        # ----------------------------------------------------
        # Aggregates
        # ----------------------------------------------------

        if analysis.aggregates:

            funcs = ", ".join(analysis.aggregates)

            add(
                "AGGREGATE",
                f"Compute aggregate function(s): {funcs}."
            )

        # ----------------------------------------------------
        # HAVING
        # ----------------------------------------------------

        for condition in analysis.having:

            add(
                "HAVING",
                f"Filter grouped rows where {condition}."
            )

        # ----------------------------------------------------
        # SELECT
        # ----------------------------------------------------

        if analysis.select_items:

            items = []

            for item in analysis.select_items:

                if item.alias:
                    items.append(f"{item.expression} AS {item.alias}")
                else:
                    items.append(item.expression)

            add(
                "SELECT",
                f"Return: {', '.join(items)}."
            )

        # ----------------------------------------------------
        # DISTINCT
        # ----------------------------------------------------

        if analysis.distinct:

            add(
                "DISTINCT",
                "Remove duplicate rows from the result."
            )

        # ----------------------------------------------------
        # ORDER BY
        # ----------------------------------------------------

        if analysis.order_by:

            cols = ", ".join(analysis.order_by)

            add(
                "ORDER BY",
                f"Sort the final result using {cols}."
            )

        # ----------------------------------------------------
        # LIMIT
        # ----------------------------------------------------

        if analysis.limit is not None:

            add(
                "LIMIT",
                f"Return only the first {analysis.limit} row(s)."
            )

        return {
            "steps": steps,
            "unsupported": analysis.unsupported,
        }