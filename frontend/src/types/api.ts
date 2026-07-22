export interface SelectItem {
  expression: string;
  alias: string | null;
  is_aggregate: boolean;
  is_star: boolean;
}

export interface JoinInfo {
  table: string;
  condition: string | null;
  kind: string | null;
}

export interface Analysis {
  tables: string[];
  select_items: SelectItem[];
  joins: JoinInfo[];
  where: string[];
  group_by: string[];
  having: string[];
  order_by: string[];
  limit: string | null;
  distinct: boolean;
  aggregates: string[];
  functions: string[];
  subqueries: string[];
  ctes: string[];
  window_functions: string[];
  unsupported: string[];
}

export interface ExecutionStep {

    id: number;

    step: string;

    title: string;

    description: string;

    details: Record<string, any>;

}

export interface ExplanationStep {
  id: number;
  title: string;
  description: string;
}

export interface OptimizationSuggestion {
  severity: string;
  title: string;
  message: string;
  rewrite?: string;
}

export interface InterviewQuestion {
  topic: string;
  difficulty: string;
  question: string;
}

export interface Explanation {
  steps: ExplanationStep[];
  unsupported: string[];
}

export interface AnalysisResponse {
  success: boolean;
  query: string;

  analysis: Analysis;
  execution: ExecutionStep[];
  explanation: Explanation;
  optimization: OptimizationSuggestion[];
  interview: InterviewQuestion[];
  llm: unknown;
}