import Card from "../layout/Card";
import type { InterviewQuestion } from "../../types/api";

interface Props {
  interview: InterviewQuestion[];
}

const difficultyColor = {
  Easy: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Hard: "bg-red-100 text-red-700",
};

export default function InterviewPanel({ interview }: Props) {
  return (
    <Card title="Interview Questions">

      <div className="space-y-4">

        {interview.map((question, index) => (

          <div
            key={index}
            className="border rounded-xl p-4 hover:bg-slate-50 transition"
          >

            <div className="flex justify-between items-center">

              <span className="font-semibold">
                {question.topic}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  difficultyColor[
                    question.difficulty as keyof typeof difficultyColor
                  ]
                }`}
              >
                {question.difficulty}
              </span>

            </div>

            <p className="mt-3 text-slate-700">
              {question.question}
            </p>

          </div>

        ))}

      </div>

    </Card>
  );
}