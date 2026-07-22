from __future__ import annotations

import json
import os
from typing import Any

from dotenv import load_dotenv
from openai import OpenAI

from .schemas import AnalysisResult

load_dotenv()


class LLMExplainer:
    """
    Uses an LLM to explain SQL constructs that are not handled
    by the deterministic analysis engine.
    """

    def __init__(
        self,
        model: str | None = None,
        client: OpenAI | None = None,
    ) -> None:

        self.model = model or os.getenv(
            "OPENROUTER_MODEL",
            "openrouter/free",
        )

        self.client = client or OpenAI(
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url=os.getenv(
                "OPENROUTER_BASE_URL",
                "https://openrouter.ai/api/v1",
            ),
            default_headers={
                "HTTP-Referer": os.getenv(
                    "APP_URL",
                    "http://localhost:3000",
                ),
                "X-Title": os.getenv(
                    "APP_NAME",
                    "SQL Mentor",
                ),
            },
        )

    # ------------------------------------------------------------

    def explain(
        self,
        query: str,
        analysis: AnalysisResult,
    ) -> dict[str, Any]:

        # No unsupported constructs -> no LLM call.
        if not analysis.unsupported:
            return {
                "used_llm": False,
                "explanations": [],
            }

        prompt = self._build_prompt(query, analysis)

        try:

            response = self.client.responses.create(
                model=self.model,
                input=prompt,
            )

            text = response.output_text.strip()

        except Exception as e:

            return {
                "used_llm": False,
                "error": "LLM request failed.",
                "message": str(e),
                "explanations": [],
            }

        try:

            parsed = json.loads(text)

        except Exception:

            parsed = {
                "explanations": [
                    {
                        "construct": ", ".join(analysis.unsupported),
                        "explanation": text,
                    }
                ]
            }

        parsed["used_llm"] = True

        return parsed

    # ------------------------------------------------------------

    def _build_prompt(
        self,
        query: str,
        analysis: AnalysisResult,
    ) -> str:

        payload = {
            "unsupported": analysis.unsupported,
            "tables": analysis.tables,
            "joins": analysis.joins,
            "where": analysis.where,
            "group_by": analysis.group_by,
            "having": analysis.having,
            "order_by": analysis.order_by,
            "limit": analysis.limit,
            "distinct": analysis.distinct,
            "aggregates": analysis.aggregates,
            "functions": analysis.functions,
            "subqueries": analysis.subqueries,
            "window_functions": analysis.window_functions,
            "ctes": analysis.ctes,
        }

        return f"""
You are an expert SQL educator.

A deterministic SQL analysis engine has already analyzed
the SQL query below.

Your ONLY responsibility is to explain the SQL constructs
listed under "unsupported".

Rules:

1. Do NOT explain supported constructs.
2. Do NOT explain SELECT, WHERE, JOIN, GROUP BY,
   HAVING, ORDER BY, LIMIT, DISTINCT, etc.
   unless they appear in the unsupported list.
3. Keep explanations concise and educational.
4. Return ONLY valid JSON.
5. Do not include markdown.

Return this exact JSON format:

{{
    "explanations": [
        {{
            "construct": "...",
            "explanation": "..."
        }}
    ]
}}

SQL Query:

{query}

Deterministic Analysis:

{json.dumps(payload, indent=2)}
"""