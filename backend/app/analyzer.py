from __future__ import annotations

from sqlglot import expressions as exp
from .schemas import AnalysisResult, SelectItem


class SQLAnalyzer:
    """
    Traverses the SQL AST once and extracts
    structured information.
    """
    @staticmethod
    def analyze(tree: exp.Expression) -> AnalysisResult:

        result = AnalysisResult()

        # ---------------- Tables ----------------

        for table in tree.find_all(exp.Table):
            result.tables.append(table.sql())

        # ---------------- Columns ----------------

# ---------------- SELECT Items ----------------

        select = tree.find(exp.Select)

        if select:

            aggregate_types = (
                exp.Count,
                exp.Sum,
                exp.Avg,
                exp.Min,
                exp.Max,
            )

            for expression in select.expressions:

                alias = None

                if isinstance(expression, exp.Alias):
                    alias = expression.alias
                    actual = expression.this
                else:
                    actual = expression

                result.select_items.append(
                    SelectItem(
                        expression=actual.sql(),
                        alias=alias,
                        is_aggregate=isinstance(actual, aggregate_types),
                        is_star=isinstance(actual, exp.Star),
                    )
                )

        # ---------------- JOINS ----------------

        for join in tree.find_all(exp.Join):

            result.joins.append(
                {
                    "table": join.this.sql(),
                    "condition": join.args.get("on").sql()
                    if join.args.get("on")
                    else None,
                    "kind": join.args.get("kind"),
                }
            )

        # ---------------- WHERE ----------------

        where = tree.find(exp.Where)

        if where:
            result.where.append(where.this.sql())

        # ---------------- GROUP BY ----------------

        group = tree.find(exp.Group)

        if group:
            for expr in group.expressions:
                result.group_by.append(expr.sql())

        # ---------------- HAVING ----------------

        having = tree.find(exp.Having)

        if having:
            result.having.append(having.this.sql())

        # ---------------- ORDER BY ----------------

        order = tree.find(exp.Order)

        if order:
            for expr in order.expressions:
                result.order_by.append(expr.sql())

        # ---------------- LIMIT ----------------

        limit = tree.find(exp.Limit)

        if limit:
            result.limit = limit.expression.sql()

        # ---------------- DISTINCT ----------------

        result.distinct = tree.find(exp.Distinct) is not None

        # ---------------- Aggregate Functions ----------------

        aggregate_types = (
            exp.Count,
            exp.Sum,
            exp.Avg,
            exp.Min,
            exp.Max,
        )

        for node in tree.walk():

            if isinstance(node, aggregate_types):
                result.aggregates.append(node.sql())

        # ---------------- Other Functions ----------------

        for func in tree.find_all(exp.Func):

            result.functions.append(func.sql())

        # ---------------- Subqueries ----------------

        for subquery in tree.find_all(exp.Subquery):

            result.subqueries.append(subquery.sql())

        # ---------------- CTE ----------------

        for cte in tree.find_all(exp.CTE):

            result.ctes.append(cte.alias_or_name)

        # ---------------- Window Functions ----------------

        for window in tree.find_all(exp.Window):

            result.window_functions.append(window.sql())

        # ---------------- Unsupported ----------------

        result.unsupported = []

        return result