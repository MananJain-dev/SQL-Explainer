from __future__ import annotations

from typing import Any

from .schemas import AnalysisResult


class InterviewQuestionGenerator:
    """
    Generates SQL interview questions from the
    deterministic AnalysisResult.
    """

    @staticmethod
    def generate(analysis: AnalysisResult) -> list[dict[str, Any]]:

        questions: list[dict[str, Any]] = []

        rules = [
            InterviewQuestionGenerator._select_questions,
            InterviewQuestionGenerator._join_questions,
            InterviewQuestionGenerator._where_questions,
            InterviewQuestionGenerator._group_questions,
            InterviewQuestionGenerator._having_questions,
            InterviewQuestionGenerator._order_questions,
            InterviewQuestionGenerator._limit_questions,
            InterviewQuestionGenerator._distinct_questions,
            InterviewQuestionGenerator._aggregate_questions,
            InterviewQuestionGenerator._subquery_questions,
            InterviewQuestionGenerator._window_questions,
            InterviewQuestionGenerator._cte_questions,
        ]

        for rule in rules:
            questions.extend(rule(analysis))

        return questions

    # ---------------------------------------------------------
    # SELECT
    # ---------------------------------------------------------

    @staticmethod
    def _select_questions(analysis: AnalysisResult):

        if not analysis.select_items:
            return []

        return [
            {
                "topic": "SELECT",
                "difficulty": "Easy",
                "question": "Why is SELECT logically executed after FROM and WHERE?"
            },
            {
                "topic": "SELECT",
                "difficulty": "Medium",
                "question": "Why is SELECT processed after GROUP BY and HAVING?"
            }
        ]

    # ---------------------------------------------------------
    # JOIN
    # ---------------------------------------------------------

    @staticmethod
    def _join_questions(analysis: AnalysisResult):

        if not analysis.joins:
            return []

        return [
            {
                "topic": "JOIN",
                "difficulty": "Medium",
                "question": "Explain the JOIN used in this query."
            },
            {
                "topic": "JOIN",
                "difficulty": "Hard",
                "question": "Which indexes would improve this JOIN?"
            },
            {
                "topic": "JOIN",
                "difficulty": "Hard",
                "question": "How would duplicate rows affect this JOIN?"
            },
        ]

    # ---------------------------------------------------------
    # WHERE
    # ---------------------------------------------------------

    @staticmethod
    def _where_questions(analysis: AnalysisResult):

        if not analysis.where:
            return []

        return [
            {
                "topic": "WHERE",
                "difficulty": "Easy",
                "question": "Why is WHERE evaluated before GROUP BY?"
            },
            {
                "topic": "WHERE",
                "difficulty": "Medium",
                "question": "Can this WHERE clause benefit from an index?"
            },
        ]

    # ---------------------------------------------------------
    # GROUP BY
    # ---------------------------------------------------------

    @staticmethod
    def _group_questions(analysis: AnalysisResult):

        if not analysis.group_by:
            return []

        return [
            {
                "topic": "GROUP BY",
                "difficulty": "Easy",
                "question": "Why must every non-aggregated column appear in GROUP BY?"
            },
            {
                "topic": "GROUP BY",
                "difficulty": "Medium",
                "question": "How does GROUP BY impact performance?"
            },
            {
                "topic": "GROUP BY",
                "difficulty": "Hard",
                "question": "How would execution change if GROUP BY were removed?"
            },
        ]

    # ---------------------------------------------------------
    # HAVING
    # ---------------------------------------------------------

    @staticmethod
    def _having_questions(analysis: AnalysisResult):

        if not analysis.having:
            return []

        return [
            {
                "topic": "HAVING",
                "difficulty": "Medium",
                "question": "Why can't HAVING always be replaced with WHERE?"
            },
            {
                "topic": "HAVING",
                "difficulty": "Hard",
                "question": "At which stage of execution is HAVING evaluated?"
            },
        ]

    # ---------------------------------------------------------
    # ORDER BY
    # ---------------------------------------------------------

    @staticmethod
    def _order_questions(analysis: AnalysisResult):

        if not analysis.order_by:
            return []

        return [
            {
                "topic": "ORDER BY",
                "difficulty": "Medium",
                "question": "What is the computational cost of ORDER BY?"
            },
            {
                "topic": "ORDER BY",
                "difficulty": "Hard",
                "question": "How can indexes reduce sorting cost?"
            },
        ]

    # ---------------------------------------------------------
    # LIMIT
    # ---------------------------------------------------------

    @staticmethod
    def _limit_questions(analysis: AnalysisResult):

        if analysis.limit is None:
            return []

        return [
            {
                "topic": "LIMIT",
                "difficulty": "Easy",
                "question": "Why is LIMIT useful for pagination?"
            }
        ]

    # ---------------------------------------------------------
    # DISTINCT
    # ---------------------------------------------------------

    @staticmethod
    def _distinct_questions(analysis: AnalysisResult):

        if not analysis.distinct:
            return []

        return [
            {
                "topic": "DISTINCT",
                "difficulty": "Medium",
                "question": "How is DISTINCT implemented internally?"
            }
        ]

    # ---------------------------------------------------------
    # Aggregates
    # ---------------------------------------------------------

    @staticmethod
    def _aggregate_questions(analysis: AnalysisResult):

        if not analysis.aggregates:
            return []

        return [
            {
                "topic": "Aggregate Functions",
                "difficulty": "Medium",
                "question": "When are aggregate functions evaluated?"
            },
            {
                "topic": "Aggregate Functions",
                "difficulty": "Hard",
                "question": "Why can't aggregate functions normally appear inside WHERE?"
            },
        ]

    # ---------------------------------------------------------
    # Subqueries
    # ---------------------------------------------------------

    @staticmethod
    def _subquery_questions(analysis: AnalysisResult):

        if not analysis.subqueries:
            return []

        return [
            {
                "topic": "Subqueries",
                "difficulty": "Hard",
                "question": "When should a subquery be replaced with a JOIN?"
            },
            {
                "topic": "Subqueries",
                "difficulty": "Hard",
                "question": "Explain the difference between correlated and non-correlated subqueries."
            },
        ]

    # ---------------------------------------------------------
    # Window Functions
    # ---------------------------------------------------------

    @staticmethod
    def _window_questions(analysis: AnalysisResult):

        if not analysis.window_functions:
            return []

        return [
            {
                "topic": "Window Functions",
                "difficulty": "Hard",
                "question": "How do window functions differ from GROUP BY?"
            },
            {
                "topic": "Window Functions",
                "difficulty": "Hard",
                "question": "Why do window functions preserve the number of rows?"
            },
        ]

    # ---------------------------------------------------------
    # CTE
    # ---------------------------------------------------------

    @staticmethod
    def _cte_questions(analysis: AnalysisResult):

        if not analysis.ctes:
            return []

        return [
            {
                "topic": "CTE",
                "difficulty": "Hard",
                "question": "When should a CTE be preferred over a subquery?"
            }
        ]