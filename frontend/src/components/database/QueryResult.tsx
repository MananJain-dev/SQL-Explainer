import type { QueryResponse } from "../../api/database";

interface Props {
    result: QueryResponse;
}

export default function QueryResult({ result }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">

            {/* Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50">

                <div>

                    <h2 className="text-xl font-semibold">
                        Query Result
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        SQLite execution output
                    </p>

                </div>

                <div className="text-sm text-gray-600">

                    <span className="font-medium">
                        {result.rowCount}
                    </span>{" "}
                    rows

                    <span className="mx-2">•</span>

                    <span className="font-medium">
                        {result.executionTime}
                    </span>{" "}
                    ms

                </div>

            </div>

            {result.rows.length === 0 ? (

                <div className="py-16 text-center text-gray-500">

                    <p className="text-lg font-medium">
                        Query executed successfully
                    </p>

                    <p className="mt-2">
                        No rows were returned.
                    </p>

                </div>

            ) : (

                <div className="overflow-auto max-h-[500px]">

                    <table className="min-w-full text-sm">

                        <thead className="sticky top-0 bg-slate-100 z-10">

                            <tr>

                                <th className="px-4 py-3 border-b w-16 text-center font-semibold">
                                    #
                                </th>

                                {result.columns.map((column) => (

                                    <th
                                        key={column}
                                        className="px-4 py-3 border-b text-left font-semibold whitespace-nowrap"
                                    >
                                        {column}
                                    </th>

                                ))}

                            </tr>

                        </thead>

                        <tbody>

                            {result.rows.map((row, index) => (

                                <tr
                                    key={index}
                                    className={`
                                        border-b
                                        hover:bg-blue-50
                                        transition-colors
                                        ${
                                            index % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50/40"
                                        }
                                    `}
                                >

                                    <td className="px-4 py-3 text-center text-gray-500">
                                        {index + 1}
                                    </td>

                                    {result.columns.map((column) => (

                                        <td
                                            key={column}
                                            className="px-4 py-3 whitespace-nowrap"
                                        >
                                            {row[column] === null
                                                ? (
                                                    <span className="italic text-gray-400">
                                                        NULL
                                                    </span>
                                                )
                                                : String(row[column])}
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