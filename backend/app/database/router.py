from fastapi import APIRouter
from fastapi import File
from fastapi import HTTPException
from fastapi import UploadFile
from app.database.models import (
    UploadResponse,
    SchemaResponse,
    PreviewResponse,
    ColumnInfo,
    QueryRequest,
    QueryResponse,
)
import tempfile

from app.database.models import (
    UploadResponse,
    SchemaResponse,
    PreviewResponse,
    ColumnInfo,
    QueryRequest,
    QueryResponse,
)

from app.database.service import DatabaseService


router = APIRouter()


@router.post(
    "/upload",
    response_model=UploadResponse,
)
async def upload_database(
    file: UploadFile = File(...)
):

    if not file.filename.endswith(".db"):
        raise HTTPException(
            status_code=400,
            detail="Only SQLite (.db) files are supported."
        )

    with tempfile.NamedTemporaryFile(delete=False) as temp:

        temp.write(await file.read())

        temp.flush()

        DatabaseService.save_database(temp.name)

    return UploadResponse(
        database=file.filename
    )


@router.post(
    "/query",
    response_model=QueryResponse,
)
def execute_query(
    request: QueryRequest,
):

    result = DatabaseService.execute_query(
        request.query
    )

    return QueryResponse(**result)

@router.get("/tables")
def list_tables():

    return DatabaseService.list_tables()


@router.get(
    "/schema/{table}",
    response_model=SchemaResponse,
)
def schema(table: str):

    columns = DatabaseService.get_schema(table)

    return SchemaResponse(
        table=table,
        columns=[
            ColumnInfo(**c)
            for c in columns
        ],
    )


@router.get(
    "/preview/{table}",
    response_model=PreviewResponse,
)
def preview(table: str):

    columns, rows = DatabaseService.preview_table(table)

    return PreviewResponse(
        table=table,
        columns=columns,
        rows=rows,
    )