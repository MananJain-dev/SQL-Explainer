from typing import Any

from pydantic import BaseModel


class UploadResponse(BaseModel):
    database: str


class ColumnInfo(BaseModel):
    name: str
    type: str


class SchemaResponse(BaseModel):
    table: str
    columns: list[ColumnInfo]


class PreviewResponse(BaseModel):
    table: str
    columns: list[str]
    rows: list[dict]


# -----------------------------
# Query Execution
# -----------------------------

class QueryRequest(BaseModel):
    query: str


class QuerySnapshot(BaseModel):
    step: str
    title: str
    description: str

    columns: list[str]
    rows: list[dict[str, Any]]


class QueryResponse(BaseModel):
    columns: list[str]
    rows: list[dict[str, Any]]

    rowCount: int
    executionTime: float

    snapshots: list[QuerySnapshot]