import type { PreviewResponse } from "../../api/database";

interface TablePreviewProps {
  preview: PreviewResponse;
}

export default function TablePreview({
  preview,
}: TablePreviewProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">

      <h2 className="mb-4 text-lg font-semibold">
        Preview — {preview.table}
      </h2>

      {preview.rows.length === 0 ? (
        <p className="text-gray-500">
          Table is empty.
        </p>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full border-collapse">

            <thead>

              <tr className="border-b bg-gray-100">

                {preview.columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-2 text-left"
                  >
                    {column}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {preview.rows.map((row, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >
                  {preview.columns.map((column) => (
                    <td
                      key={column}
                      className="px-4 py-2"
                    >
                      {String(row[column] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}