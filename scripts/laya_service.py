import atexit
import os
import threading
from time import perf_counter
from typing import Any, Dict, Optional, Union
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from posthog import Posthog
from pydantic import BaseModel
import laya

posthog_project_token = os.environ.get("POSTHOG_PROJECT_TOKEN")
posthog_host = os.environ.get("POSTHOG_HOST")
posthog_client = None

if posthog_project_token and posthog_host:
    posthog_client = Posthog(
        posthog_project_token,
        host=posthog_host,
        metrics={"service_name": "laya-local-decision-service"},
        enable_exception_autocapture=True,
    )
    atexit.register(posthog_client.shutdown)
elif os.environ.get("ENVIRONMENT", "development").lower() != "production":
    missing_variable = (
        "POSTHOG_PROJECT_TOKEN" if not posthog_project_token else "POSTHOG_HOST"
    )
    raise RuntimeError(
        f"{missing_variable} variable required by PostHog is missing or un-configured, "
        f"this causes events to be silently missed. This error stops appearing once "
        f"{missing_variable} is configured"
    )

# Single GPU/CPU lock for thread-safe inference
model_lock = threading.Lock()
agent = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global agent
    print("Loading Laya model checkpoint...")
    # Load English checkpoint by default
    agent = laya.load("convaiinnovations/laya")
    
    # Warm up with throwaway predict call to compile kernels
    with model_lock:
        try:
            agent.predict(
                "Warmup query",
                {
                    "intent": {
                        "type": "choice",
                        "instructions": "Is this a warmup query?",
                        "criteria": {"yes": "yes", "no": "no"}
                    }
                }
            )
            print("Laya model loaded and warmed up successfully.")
        except Exception as e:
            print(f"Warmup warning: {e}")
    yield

app = FastAPI(title="Laya Local Decision Service", version="1.0.0", lifespan=lifespan)

@app.middleware("http")
async def record_http_metrics(request: Request, call_next):
    started_at = perf_counter()
    status_code = "500"
    try:
        response = await call_next(request)
        status_code = str(response.status_code)
        return response
    finally:
        if posthog_client is not None:
            route = request.scope.get("route")
            route_path = getattr(route, "path", "unmatched")
            attributes = {
                "method": request.method,
                "route": route_path,
                "status_code": status_code,
            }
            posthog_client.metrics.count("http.server.requests", attributes=attributes)
            posthog_client.metrics.histogram(
                "http.server.duration",
                (perf_counter() - started_at) * 1000,
                unit="ms",
                attributes=attributes,
            )

@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": agent is not None
    }

@app.post("/predict")
def predict(body: PredictRequest):
    if agent is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    
    with model_lock:
        started_at = perf_counter()
        outcome = "error"
        try:
            result = agent.predict(
                state=body.state,
                questions=body.questions
            )
            outcome = "success"
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            if posthog_client is not None:
                attributes = {"outcome": outcome}
                posthog_client.metrics.count(
                    "model.inference.calls", attributes=attributes
                )
                posthog_client.metrics.histogram(
                    "model.inference.duration",
                    (perf_counter() - started_at) * 1000,
                    unit="ms",
                    attributes=attributes,
                )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("LAYA_PORT", "8008"))
    host = os.environ.get("LAYA_HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=port)
