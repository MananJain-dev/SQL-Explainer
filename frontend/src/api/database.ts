import axios from "axios";

const API_BASE = "http://localhost:8000/database";

export interface ColumnInfo {
  name: string;
  type: string;
}

export interface SchemaResponse {
  table: string;
  columns: ColumnInfo[];
}

export interface PreviewResponse {
  table: string;
  columns: string[];
  rows: Record<string, unknown>[];
}

export async function uploadDatabase(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axios.post(
    `${API_BASE}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function getTables(): Promise<string[]> {
  const { data } = await axios.get(`${API_BASE}/tables`);
  return data;
}

export async function getSchema(
  table: string
): Promise<SchemaResponse> {
  const { data } = await axios.get(
    `${API_BASE}/schema/${table}`
  );

  return data;
}

export async function getPreview(
  table: string
): Promise<PreviewResponse> {
  const { data } = await axios.get(
    `${API_BASE}/preview/${table}`
  );

  return data;
}

/* -------------------------------- */
/* Query Execution                  */
/* -------------------------------- */

export interface QueryRequest {
  query: string;
}

export interface QuerySnapshot {
    step: string;

    title: string;

    description: string;

    columns: string[];

    rows: Record<string, unknown>[];
}

export interface QueryResponse {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;

  snapshots: QuerySnapshot[];
}

export async function runQuery(
  query: string
): Promise<QueryResponse> {
  const { data } = await axios.post(
    `${API_BASE}/query`,
    {
      query,
    }
  );

  return data;
}