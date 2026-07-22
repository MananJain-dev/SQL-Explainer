from __future__ import annotations

import sqlglot
from sqlglot import expressions as exp


class SQLParser:
    """
    Wrapper around sqlglot parser.
    """

    @staticmethod
    def parse(query: str) -> exp.Expression:
        """
        Parse an SQL query into an AST.

        Parameters
        ----------
        query : str

        Returns
        -------
        sqlglot Expression
        """

        try:
            return sqlglot.parse_one(query)

        except Exception as e:
            raise ValueError(f"Invalid SQL query.\n{e}")