import Card from "../layout/Card";
import type { OptimizationSuggestion } from "../../types/api";

interface Props {
  optimization: OptimizationSuggestion[];
}

const severityColors = {
  info: "bg-blue-100 text-blue-700",
  warning: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
};

export default function OptimizationPanel({ optimization }: Props) {
  return (
    <Card title="Optimization Suggestions">

      {optimization.length === 0 ? (

        <div className="text-green-600 font-medium">
          ✅ No optimization suggestions.
        </div>

      ) : (

        <div className="space-y-4">

          {optimization.map((item, index) => (

            <div
              key={index}
              className="border rounded-xl p-4 bg-slate-50"
            >

              <div className="flex justify-between items-center">

                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    severityColors[
                      item.severity as keyof typeof severityColors
                    ] ?? "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.severity}
                </span>

              </div>

              <p className="mt-3 text-slate-600">
                {item.message}
              </p>

              {item.rewrite && (

                <div className="mt-3 rounded bg-slate-900 text-green-400 p-3 font-mono text-sm">

                  {item.rewrite}

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </Card>
  );
}