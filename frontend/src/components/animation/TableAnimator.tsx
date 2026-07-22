import { AnimatePresence, motion } from "framer-motion";
import type { QuerySnapshot } from "../../api/database";

interface Props {
  snapshot: QuerySnapshot;
}

export default function TableAnimator({ snapshot }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">

      {/* Header */}
      <div className="border-b px-6 py-4 bg-slate-50">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
              {snapshot.step}
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {snapshot.title}
            </h2>

            <p className="text-gray-600 mt-1">
              {snapshot.description}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {snapshot.rows.length} rows
          </div>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full border-collapse">

          <thead>

            <tr className="bg-gray-100 border-b">

              {snapshot.columns.map((column) => (

                <th
                  key={column}
                  className="px-4 py-3 text-left font-semibold whitespace-nowrap"
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            <AnimatePresence mode="popLayout">

              {snapshot.rows.map((row, index) => (

                <motion.tr

                  key={
                    String(row.id ?? `${snapshot.step}-${index}`)
                  }

                  layout

                  initial={{
                    opacity: 0,
                    y: 12,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  exit={{
                    opacity: 0,
                    y: -12,
                  }}

                  transition={{
                    duration: 0.25,
                  }}

                  className="border-b hover:bg-blue-50"

                >

                  {snapshot.columns.map((column) => (

                    <td
                      key={column}
                      className="px-4 py-3 whitespace-nowrap"
                    >
                      {String(row[column] ?? "")}
                    </td>

                  ))}

                </motion.tr>

              ))}

            </AnimatePresence>

          </tbody>

        </table>

      </div>

    </div>
  );
}