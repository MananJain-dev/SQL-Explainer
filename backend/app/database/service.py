import os
import shutil
import sqlite3
from pathlib import Path
import time

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

DATABASE_PATH = UPLOAD_DIR / "current.db"


class DatabaseService:

    @staticmethod
    def save_database(temp_file_path: str):

        shutil.copyfile(temp_file_path, DATABASE_PATH)

    @staticmethod
    def get_connection():

        if not DATABASE_PATH.exists():
            raise FileNotFoundError("No database uploaded.")

        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row

        return conn

    @staticmethod
    def list_tables():

        conn = DatabaseService.get_connection()

        cursor = conn.execute("""
            SELECT name
            FROM sqlite_master
            WHERE type='table'
            ORDER BY name;
        """)

        tables = [row["name"] for row in cursor.fetchall()]

        conn.close()

        return tables

    @staticmethod
    def get_schema(table: str):

        conn = DatabaseService.get_connection()

        cursor = conn.execute(f"PRAGMA table_info('{table}')")

        schema = []

        for row in cursor.fetchall():

            schema.append({
                "name": row["name"],
                "type": row["type"],
            })

        conn.close()

        return schema

    @staticmethod
    def preview_table(table: str, limit: int = 20):

        conn = DatabaseService.get_connection()

        cursor = conn.execute(
            f'SELECT * FROM "{table}" LIMIT ?',
            (limit,),
        )

        rows = [dict(row) for row in cursor.fetchall()]

        columns = list(rows[0].keys()) if rows else []

        conn.close()

        return columns, rows
    
    @staticmethod
    def execute_query(query: str):

        conn = DatabaseService.get_connection()

        start = time.perf_counter()

        cursor = conn.cursor()

        cursor.execute(query)

        rows = cursor.fetchall()

        execution_time = (time.perf_counter() - start) * 1000

        columns = []

        if cursor.description:
            columns = [col[0] for col in cursor.description]

        result = [dict(row) for row in rows]

        conn.commit()
        conn.close()

        return {
            "columns": columns,
            "rows": result,
            "rowCount": len(result),
            "executionTime": round(execution_time, 2),

            "snapshots": [
                {
                    
                    "step":"RESULT",

                    "title":"Final Result",

                    "description":"SQLite returned the final result of the query.",

                    "columns":columns,

                    "rows":result,
                }
            ],
        }