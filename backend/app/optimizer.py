from __future__ import annotations

from typing import Any

from .schemas import AnalysisResult


class SQLOptimizer:
    """
    Rule-based SQL optimizer.

    Generates optimization suggestions using AnalysisResult.
    """
    @staticmethod
    def optimize(analysis: AnalysisResult) -> list[dict[str, Any]]:

        suggestions = []

        rules = [
            SQLOptimizer._check_select_star,
            SQLOptimizer._check_missing_limit,
            SQLOptimizer._check_distinct,
            SQLOptimizer._check_order_by,
            SQLOptimizer._check_cartesian_join,
            SQLOptimizer._check_count_star,
            SQLOptimizer._check_subquery,
        ]

        for rule in rules:

            result = rule(analysis)

            if not result:
                continue

            if isinstance(result, list):
                suggestions.extend(result)
            else:
                suggestions.append(result)

        return suggestions
    
    
    # --------------------------------------------------
    # SELECT *
    # --------------------------------------------------
    @staticmethod
    def _check_select_star(analysis: AnalysisResult):

        for item in analysis.select_items:

            if item.is_star:

                return {
                    "severity": "warning",
                    "title": "Avoid SELECT *",
                    "message": "Retrieve only the required columns to reduce I/O.",
                    "rewrite": "SELECT column1, column2 ..."
                }

        return None

    # --------------------------------------------------
    # LIMIT
    # --------------------------------------------------
    @staticmethod
    def _check_missing_limit(analysis: AnalysisResult):

        if analysis.limit is not None:
            return None

        return {
            "severity": "info",
            "title": "LIMIT missing",
            "message": "Consider using LIMIT for pagination or during development."
        }

    # --------------------------------------------------
    # DISTINCT
    # --------------------------------------------------
    @staticmethod
    def _check_distinct(analysis: AnalysisResult):

        if analysis.distinct:

            return {
                "severity": "info",
                "title": "DISTINCT detected",
                "message": "DISTINCT may require sorting or hashing and can impact performance."
            }

        return None

    # --------------------------------------------------
    # ORDER BY
    # --------------------------------------------------

    @staticmethod
    def _check_order_by(analysis: AnalysisResult):

        if not analysis.order_by:
            return None

        return {

            "severity": "info",

            "title": "ORDER BY",

            "message": "Consider indexing: " + ", ".join(analysis.order_by)
        }

    # --------------------------------------------------
    # Cartesian JOIN
    # --------------------------------------------------

    @staticmethod
    def _check_cartesian_join(analysis: AnalysisResult):

        suggestions = []

        for join in analysis.joins:

            if join["condition"] is None:

                suggestions.append({

                    "severity": "critical",

                    "title": "Possible Cartesian JOIN",

                    "message": f"JOIN with table '{join['table']}' has no ON condition."
                })

        return suggestions

    # --------------------------------------------------
    # COUNT(*)
    # --------------------------------------------------

    @staticmethod
    def _check_count_star(analysis: AnalysisResult):

        for aggregate in analysis.aggregates:

            if aggregate.upper().replace(" ", "") == "COUNT(*)":

                return {

                    "severity": "info",

                    "title": "COUNT(*)",

                    "message": "COUNT(*) is generally optimized by modern database engines."
                }

        return None

    # --------------------------------------------------
    # Subqueries
    # --------------------------------------------------

    @staticmethod
    def _check_subquery(analysis: AnalysisResult):

        if not analysis.subqueries:
            return None

        return {

            "severity": "info",

            "title": "Subquery detected",

            "message": f"{len(analysis.subqueries)} subquery(s) detected. Consider replacing with JOINs if performance becomes an issue."
        }