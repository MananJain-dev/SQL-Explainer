import Card from "../layout/Card";
import type { Explanation } from "../../types/api";

interface Props {
  explanation: Explanation;
}

export default function ExplanationPanel({
  explanation,
}: Props) {
  return (
    <Card title="Explanation">

      <div className="space-y-4">

        {explanation.steps.map((step) => (

          <div
            key={step.id}
            className="
              border-l-4
              border-blue-600
              pl-4
              py-2
            "
          >

            <h3 className="font-bold text-slate-800">
              {step.title}
            </h3>

            <p className="text-slate-600 mt-1">
              {step.description}
            </p>

          </div>

        ))}

      </div>

    </Card>
  );
}