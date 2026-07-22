from __future__ import annotations

import json
import os
from pathlib import Path

from openai import OpenAI

from .schemas import AnalysisResult


class RuleGenerator:
    """
    Developer-only tool.

    Generates candidate deterministic rules for
    unsupported SQL constructs.

    Generated files are saved for human review
    before being merged into the project.
    """

    def __init__(
        self,
        output_dir: str = "generated_rules",
        model: str = "gpt-5.5",
    ):

        self.client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY")
        )

        self.model = model

        self.output_dir = Path(output_dir)

        self.output_dir.mkdir(exist_ok=True)

    # --------------------------------------------------------

    def generate(
        self,
        query: str,
        analysis: AnalysisResult,
    ):

        if not analysis.unsupported:

            print("No unsupported constructs.")

            return

        prompt = self._build_prompt(
            query,
            analysis,
        )

        response = self.client.responses.create(
            model=self.model,
            input=prompt,
        )

        content = response.output_text

        filename = (
            self.output_dir
            / f"{analysis.unsupported[0].lower()}_rule.md"
        )

        filename.write_text(content)

        print(f"Generated {filename}")

    # --------------------------------------------------------

    def _build_prompt(
        self,
        query: str,
        analysis: AnalysisResult,
    ):

        summary = {
            "unsupported": analysis.unsupported,
            "tables": analysis.tables,
            "joins": analysis.joins,
            "group_by": analysis.group_by,
            "aggregates": analysis.aggregates,
        }

        return f"""
You are helping extend an AST-based SQL analyzer.

The current deterministic analyzer could not
understand the following SQL constructs:

{analysis.unsupported}

Generate a proposal.

Return Markdown.

Sections:

# Overview

Explain the SQL construct.

# Analyzer Changes

Show sqlglot traversal code.

# Schema Changes

Explain whether AnalysisResult needs
new fields.

# Optimizer Changes

Suggest optimization rules.

# Explain Changes

Show explanation template.

# Interview Changes

Generate interview questions.

# Example Queries

Provide five SQL examples.

SQL:

{query}

Current Analysis:

{json.dumps(summary, indent=2)}
"""