/**
 * Laya Decision Client
 * Connects to local Laya sidecar service (http://127.0.0.1:8008)
 * Provides typed decisions in ~20-35ms without LLM latency or cost.
 */

export type LayaQuestionType = "choice" | "score" | "noul";

export interface LayaChoiceQuestion {
  type: "choice";
  instructions: string;
  criteria: Record<string, string> | string[];
}

export interface LayaScoreQuestion {
  type: "score";
  instructions: string;
  criteria: string[];
}

export interface LayaNoulQuestion {
  type: "noul";
  instructions: string;
  criteria?: { true?: string; false?: string };
}

export type LayaQuestion = LayaChoiceQuestion | LayaScoreQuestion | LayaNoulQuestion;

export interface LayaAnswer {
  choice?: string;
  score?: number;
  noul?: number;
  confidence: number;
  probabilities?: Record<string, number>;
  action?: { act_probability: number };
}

export interface LayaPredictResponse {
  answers: Record<string, LayaAnswer>;
  usage: {
    input_tokens: number;
  };
}

const LAYA_SERVICE_URL = process.env.EXPO_PUBLIC_LAYA_URL || "http://127.0.0.1:8008";

/**
 * Checks if the local Laya service is running and healthy.
 */
export async function checkLayaHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${LAYA_SERVICE_URL}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data?.status === "ok" && data?.model_loaded === true;
  } catch {
    return false;
  }
}

/**
 * Predicts typed decisions for a given state using Laya.
 */
export async function predictLaya(
  state: string | Record<string, unknown> | Array<unknown>,
  questions: Record<string, LayaQuestion>,
  options?: { lang?: string; timeoutMs?: number }
): Promise<LayaPredictResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options?.timeoutMs ?? 15000);

  try {
    const response = await fetch(`${LAYA_SERVICE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        state,
        questions,
        lang: options?.lang,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Laya] Prediction failed with status ${response.status}`);
      return null;
    }

    return (await response.json()) as LayaPredictResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn("[Laya] Prediction error or timeout:", error);
    return null;
  }
}
