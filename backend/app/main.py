from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dataclasses import asdict

from app.parser import SQLParser
from app.analyzer import SQLAnalyzer
from app.execution import ExecutionFlowGenerator
from app.explain import SQLExplainer
from app.optimizer import SQLOptimizer
from app.interview import InterviewQuestionGenerator
from app.llm import LLMExplainer

from app.database.router import router as database_router


app = FastAPI(
    title="SQL Mentor API",
    version="1.0.0",
    description="AI-powered SQL learning and analysis backend.",
)

app.include_router(
    database_router,
    prefix="/database",
    tags=["Database"],
)

# Allow frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "SQL Mentor",
        "version": "1.0.0",
    }


@app.post("/analyze")
def analyze(request: QueryRequest):
    """
    Complete SQL analysis pipeline.
    """

    try:
        # --------------------------------------------------
        # Parse SQL
        # --------------------------------------------------
        tree = SQLParser.parse(request.query)

        # --------------------------------------------------
        # Analyze AST
        # --------------------------------------------------
        analysis = SQLAnalyzer.analyze(tree)

        # --------------------------------------------------
        # Generate execution flow
        # --------------------------------------------------
        execution = ExecutionFlowGenerator.generate(analysis)

        # --------------------------------------------------
        # Generate explanation
        # --------------------------------------------------
        explanation = SQLExplainer.explain(analysis)

        # --------------------------------------------------
        # Generate optimization suggestions
        # --------------------------------------------------
        optimization = SQLOptimizer.optimize(analysis)

        # --------------------------------------------------
        # Generate interview questions
        # --------------------------------------------------
        interview = InterviewQuestionGenerator.generate(analysis)

        # --------------------------------------------------
        # LLM explanation (only if unsupported constructs exist)
        # --------------------------------------------------
        llm_output = []

        if getattr(analysis, "unsupported", None):
            try:
                llm_output = LLMExplainer.explain(
                    query=request.query,
                    unsupported=analysis.unsupported,
                )
            except Exception as llm_error:
                llm_output = [
                    {
                        "error": "LLM explanation failed.",
                        "message": str(llm_error),
                    }
                ]

        # --------------------------------------------------
        # Response
        # --------------------------------------------------
        return {
            "success": True,
            "query": request.query,
            "analysis": asdict(analysis),
            "execution": execution,
            "explanation": explanation,
            "optimization": optimization,
            "interview": interview,
            "llm": llm_output,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {e}",
        )