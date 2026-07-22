import { motion } from "framer-motion";
import clsx from "clsx";
import type { QuerySnapshot } from "../../api/database";

interface Props {
  snapshots: QuerySnapshot[];
  currentStep: number;
  onStepChange: (index: number) => void;
}

export default function ExecutionTimeline({
  snapshots,
  currentStep,
  onStepChange,
}: Props) {
  if (!snapshots.length) return null;

  return (
    <div className="bg-white rounded-xl shadow border p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-xl font-bold">
            Execution Timeline
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            SQL execution stages
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {currentStep + 1}/{snapshots.length}
        </div>

      </div>

      <div className="flex items-center gap-4 overflow-x-auto">

        {snapshots.map((snapshot, index) => (
          <div
            key={snapshot.step + index}
            className="flex items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onStepChange(index)}
              className={clsx(
                "rounded-full w-14 h-14 flex items-center justify-center font-bold border transition-all",

                currentStep === index
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                  : "bg-white hover:border-blue-500"
              )}
            >
              {index + 1}
            </motion.button>

            {index !== snapshots.length - 1 && (
              <div
                className={clsx(
                  "h-1 w-16 rounded-full",
                  index < currentStep
                    ? "bg-blue-600"
                    : "bg-gray-300"
                )}
              />
            )}
          </div>
        ))}

      </div>

      <motion.div
        key={currentStep}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mt-8 rounded-lg bg-slate-50 border p-4"
      >
        <p className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
          {snapshots[currentStep].step}
        </p>

        <h3 className="text-xl font-semibold mt-1">
          {snapshots[currentStep].title}
        </h3>

        <p className="text-gray-600 mt-2">
          {snapshots[currentStep].description}
        </p>
      </motion.div>

    </div>
  );
}