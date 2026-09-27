import { supabase } from "./auth/supabase";
import { InsightsType } from "./genAi";
import { createLogger } from "@/src/lib/logger";
import { GLOBAL_VOICE_CONFIG } from "@/src/constants/voice";

const log = createLogger("AudioTranscription");

interface CallMyFunctionParams {
  journal: string;
  isAudio: boolean;
  selectedDate?: string;
  inputType?: string;
  durationSeconds?: number;
}

export class EdgeFunctionError extends Error {
  constructor(
    message: string,
    public originalError?: Error,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = "EdgeFunctionError";
  }
}

export async function callMyFunction({
  journal,
  isAudio,
  selectedDate,
  inputType,
  durationSeconds,
}: CallMyFunctionParams): Promise<InsightsType> {
  // ponytail: guard network audio invocation when voice disabled
  if (isAudio && !GLOBAL_VOICE_CONFIG.ENABLE_VOICE) {
    log.warn("Blocked audio transcription request: voice feature is disabled");
    throw new EdgeFunctionError(
      "Voice features are disabled; audio processing is unavailable."
    );
  }

  const startTime = Date.now();
  log.info("Invoking save-journal-ai-insights edge function...", {
    isAudio,
    payloadLength: journal.length,
    inputType: inputType ?? "unknown",
    durationSeconds: durationSeconds ?? 0,
    selectedDate: selectedDate ?? "now",
  });

  try {
    const { data, error } = await supabase.functions.invoke<InsightsType>(
      "save-journal-ai-insights",
      {
        body: { journal, isAudio, selectedDate, inputType, durationSeconds },
      }
    );

    const elapsedMs = Date.now() - startTime;

    if (error) {
      log.error("Edge function returned error", { elapsedMs, error });
      const errorMessage = error.message || "Unknown error occurred";
      const isNetworkError =
        errorMessage.includes("Network request failed") ||
        errorMessage.includes("Failed to send a request");

      throw new EdgeFunctionError(
        isNetworkError
          ? "Unable to connect to server. Please check your internet connection and try again."
          : `AI processing failed: ${errorMessage}`,
        error as Error,
        isNetworkError
      );
    }

    if (!data) {
      log.error("Edge function returned empty response data", { elapsedMs });
      throw new EdgeFunctionError(
        "No data received from AI processing. Please try again."
      );
    }

    log.info("Edge function response received successfully", {
      elapsedMs,
      id: (data as any)?.id,
      title: data.title,
      mood: (data as any)?.moods?.main_mood,
      wordsCount: (data as any)?.words_count,
    });
    return data;
  } catch (err) {
    const elapsedMs = Date.now() - startTime;
    log.error("Failed to invoke save-journal-ai-insights edge function", {
      elapsedMs,
      error: err instanceof Error ? err.message : String(err),
    });
    // Re-throw EdgeFunctionError
    if (err instanceof EdgeFunctionError) {
      throw err;
    }
    // Wrap unexpected errors
    throw new EdgeFunctionError(
      "Unexpected error during AI processing. Please try again.",
      err as Error,
      true
    );
  }
}

export async function deleteUserAuth(): Promise<InsightsType | null> {
  try {
    const { data, error } = await supabase.functions.invoke<InsightsType>(
      "delete-user-auth"
    );

    if (error) {
      throw new EdgeFunctionError(
        "Failed to delete user. Please try again.",
        error as Error
      );
    }

    return data;
  } catch (err) {
    throw new EdgeFunctionError(
      "Unexpected error during user deletion.",
      err as Error
    );
  }
}
