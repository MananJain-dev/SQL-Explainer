import Card from "../layout/Card";
import type { Analysis } from "../../types/api";

interface Props {
  analysis: Analysis;
}

function Badge({ text }: { text: string }) {
  return (
    <span
      className="
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        bg-blue-100
        text-blue-700
        text-sm
        font-medium
      "
    >
      {text}
    </span>
  );
}

export default function AnalysisPanel({ analysis }: Props) {
  return (
    <Card title="Analysis">

      <div className="space-y-8">

        {/* Tables */}

        <section>

          <h3 className="font-semibold text-slate-700 mb-3">
            Tables
          </h3>

          <div className="flex flex-wrap gap-2">

            {analysis.tables.length === 0 ? (
              <span className="text-slate-500">
                None
              </span>
            ) : (
              analysis.tables.map((table) => (
                <Badge
                  key={table}
                  text={table}
                />
              ))
            )}

          </div>

        </section>

        {/* Columns */}

        <section>

          <h3 className="font-semibold text-slate-700 mb-3">
            Columns
          </h3>

          <div className="flex flex-wrap gap-2">

            {analysis.select_items.map((item) => (
              <Badge
                key={item.expression}
                text={item.expression}
              />
            ))}

          </div>

        </section>

        {/* Joins */}

        <section>

          <h3 className="font-semibold text-slate-700 mb-3">
            Joins
          </h3>

          {analysis.joins.length === 0 ? (
            <span className="text-slate-500">
              None
            </span>
          ) : (

            <div className="space-y-2">

              {analysis.joins.map((join, index) => (

                <div
                  key={index}
                  className="
                    rounded-lg
                    bg-slate-100
                    px-3
                    py-2
                  "
                >
                  <span className="font-semibold">
                    {join.kind ?? "JOIN"}
                  </span>

                  {" "}

                  {join.table}

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </Card>
  );
}