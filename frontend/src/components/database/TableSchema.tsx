import type { SchemaResponse } from "../../api/database";

interface TableSchemaProps {
  schema: SchemaResponse;
}

export default function TableSchema({
  schema,
}: TableSchemaProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">

      <h2 className="mb-3 text-lg font-semibold">
        Schema — {schema.table}
      </h2>

      <table className="w-full border-collapse">

        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Column</th>
            <th className="py-2 text-left">Type</th>
          </tr>
        </thead>

        <tbody>
          {schema.columns.map((column) => (
            <tr
              key={column.name}
              className="border-b"
            >
              <td className="py-2">
                {column.name}
              </td>

              <td className="py-2 text-gray-600">
                {column.type}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}