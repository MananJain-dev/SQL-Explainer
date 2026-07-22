import { useState } from "react";

import api from "../api/api";
import { runQuery } from "../api/database";

import type { AnalysisResponse } from "../types/api";
import type { QueryResponse } from "../api/database";

import DataBaseExplorer from "../components/database/DataBaseExplorer";
import QueryResult from "../components/database/QueryResult";

import AnalysisPanel from "../components/analysis/AnalysisPanel";
import SqlEditor from "../components/editor/SqlEditor";
import ExecutionGraph from "../components/execution/ExecutionGraph";
import ExplanationPanel from "../components/explanation/ExplanationPanel";
import OptimizationPanel from "../components/optimization/OptimizationPanel";
import InterviewPanel from "../components/interview/InterviewPanel";

export default function Home() {
    const [response, setResponse] =
        useState<AnalysisResponse | null>(null);

    const [queryResult, setQueryResult] =
        useState<QueryResponse | null>(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const analyzeQuery = async (query: string) => {
        setLoading(true);
        setError("");
        setResponse(null);

        try {
            const res = await api.post<AnalysisResponse>(
                "/analyze",
                { query }
            );

            setResponse(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to analyze the SQL query.");
        } finally {
            setLoading(false);
        }
    };

    const runSqlQuery = async (query: string) => {
        setLoading(true);
        setError("");
        setQueryResult(null);

        try {
            const result = await runQuery(query);
            setQueryResult(result);
        } catch (err) {
            console.error(err);
            setError("Failed to execute the SQL query.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">

            <div className="max-w-7xl mx-auto p-8">

                <h1 className="text-5xl font-bold text-center">
                    SQL Mentor
                </h1>

                <p className="text-center text-gray-500 mt-3 mb-10">
                    Analyze, visualize and understand SQL queries interactively.
                </p>

                <div className="flex flex-col lg:flex-row gap-6">

                    <div className="w-full lg:w-80 shrink-0">
                        <DataBaseExplorer />
                    </div>

                    <div className="flex-1">

                        <SqlEditor
                            onAnalyze={analyzeQuery}
                            onRun={runSqlQuery}
                        />

                        {loading && (
                            <div className="mt-6 rounded-xl border bg-white shadow-lg p-6 animate-pulse">

                                <h2 className="text-xl font-semibold">
                                    Processing Query...
                                </h2>

                                <p className="mt-2 text-gray-500">
                                    SQL Mentor is processing your request...
                                </p>

                            </div>
                        )}

                        {!loading && error && (
                            <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-5">

                                <h2 className="text-lg font-semibold text-red-700">
                                    Error
                                </h2>

                                <p className="mt-2 text-red-600">
                                    {error}
                                </p>

                            </div>
                        )}

                        {!loading && queryResult && (
                            <div className="mt-6">
                                <QueryResult result={queryResult} />
                            </div>
                        )}

                        {!loading && response && (
                            <>

                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">

                                    <div className="lg:col-span-3">
                                        <ExecutionGraph
                                            analysis={response.analysis}
                                        />
                                    </div>

                                    <div className="lg:col-span-2">
                                        <AnalysisPanel
                                            analysis={response.analysis}
                                        />
                                    </div>

                                </div>

                                <div className="mt-6">
                                    <ExplanationPanel
                                        explanation={response.explanation}
                                    />
                                </div>

                                <div className="mt-6">
                                    <OptimizationPanel
                                        optimization={response.optimization}
                                    />
                                </div>

                                <div className="mt-6">
                                    <InterviewPanel
                                        interview={response.interview}
                                    />
                                </div>

                            </>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}