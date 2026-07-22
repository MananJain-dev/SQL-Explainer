from __future__ import annotations

from dataclasses import dataclass, field


@dataclass
class SelectItem:
    expression: str
    alias: str | None = None
    is_aggregate: bool = False
    is_star: bool = False

@dataclass
class AnalysisResult:
    """
    Shared analysis produced from a parsed SQL AST.
    """

    tables: list[str] = field(default_factory=list)

    select_items: list[SelectItem] = field(default_factory=list)

    joins: list[dict] = field(default_factory=list)

    where: list[str] = field(default_factory=list)

    group_by: list[str] = field(default_factory=list)

    having: list[str] = field(default_factory=list)

    order_by: list[str] = field(default_factory=list)

    limit: str | None = None

    distinct: bool = False

    aggregates: list[str] = field(default_factory=list)

    functions: list[str] = field(default_factory=list)

    subqueries: list[str] = field(default_factory=list)

    ctes: list[str] = field(default_factory=list)

    window_functions: list[str] = field(default_factory=list)

    unsupported: list[str] = field(default_factory=list)