import { useState } from "react";
import Editor from "@monaco-editor/react";

interface Props {
  onAnalyze: (query: string) => void;
  onRun: (query: string) => void;
}

export default function SqlEditor({
  onAnalyze,
  onRun,
}: Props) {
  const [query, setQuery] = useState(`SELECT name, salary
FROM employees
WHERE salary > 50000;`);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
      <div className="px-4 py-3 border-b font-semibold">
        SQL Editor
      </div>

      <Editor
        height="350px"
        language="sql"
        theme="vs-dark"
        value={query}
        onChange={(value) => setQuery(value ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />

      <div className="flex justify-end gap-3 p-4 border-t">
        <button
          onClick={() => onAnalyze(query)}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Analyze
        </button>

        <button
          onClick={() => onRun(query)}
          className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
        >
          Run
        </button>
      </div>
    </div>
  );
}