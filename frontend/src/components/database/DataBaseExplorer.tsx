import { useEffect, useState } from "react";

import {
  getPreview,
  getSchema,
  getTables,
} from "../../api/database";

import type {
  PreviewResponse,
  SchemaResponse,
} from "../../api/database";

import UploadDatabase from "./UploadDatabase";
import TableSchema from "./TableSchema";
import TablePreview from "./TablePreview";

export default function DataBaseExplorer() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");

  const [schema, setSchema] = useState<SchemaResponse | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const loadTables = async () => {
    try {
      setLoadingTables(true);

      const tableList = await getTables();

      setTables(tableList);

      if (tableList.length > 0) {
        setSelectedTable(tableList[0]);
      } else {
        setSelectedTable("");
        setSchema(null);
        setPreview(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (!selectedTable) return;

    async function loadTableDetails() {
      try {
        setLoadingPreview(true);

        const [schemaResponse, previewResponse] =
          await Promise.all([
            getSchema(selectedTable),
            getPreview(selectedTable),
          ]);

        setSchema(schemaResponse);
        setPreview(previewResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPreview(false);
      }
    }

    loadTableDetails();
  }, [selectedTable]);

  return (
    <div className="space-y-4">

      <UploadDatabase
        onUploadSuccess={loadTables}
      />

      <div className="rounded-lg border bg-white shadow-sm p-4">

        <h2 className="text-lg font-semibold mb-3">
          Tables
        </h2>

        {loadingTables ? (
          <p>Loading...</p>
        ) : tables.length === 0 ? (
          <p className="text-gray-500">
            No database uploaded.
          </p>
        ) : (
          <div className="space-y-2">
            {tables.map((table) => (
              <button
                key={table}
                onClick={() => setSelectedTable(table)}
                className={`block w-full rounded px-3 py-2 text-left transition
                ${
                  selectedTable === table
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {table}
              </button>
            ))}
          </div>
        )}

      </div>

      {loadingPreview ? (
        <div className="rounded-lg border bg-white p-4">
          Loading...
        </div>
      ) : (
        <>
          {schema && (
            <TableSchema
              schema={schema}
            />
          )}

          {preview && (
            <TablePreview
              preview={preview}
            />
          )}
        </>
      )}

    </div>
  );
}