import os
import threading
from typing import Any, Dict, Optional, Union
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import laya

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
        try:
            result = agent.predict(
                state=body.state,
                questions=body.questions
            )
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("LAYA_PORT", "8008"))
    host = os.environ.get("LAYA_HOST", "127.0.0.1")
    uvicorn.run(app, host=host, port=port)
