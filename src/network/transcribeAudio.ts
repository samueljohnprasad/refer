import { supabase } from "./auth/supabase";
import { InsightsType } from "./genAi";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("AudioTranscription");

interface CallMyFunctionParams {
  journal: string;
  isAudio: boolean;
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
}: CallMyFunctionParams): Promise<InsightsType> {
  log.info("Invoking save-journal-ai-insights edge function...", { isAudio, length: journal.length });
  try {
    const { data, error } = await supabase.functions.invoke<InsightsType>(
      "save-journal-ai-insights",
      {
        body: { journal, isAudio },
      }
    );

    if (error) {
      log.error("Edge function returned error", error);
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
      log.error("Edge function returned empty response data");
      throw new EdgeFunctionError(
        "No data received from AI processing. Please try again."
      );
    }

    log.info("Edge function response received successfully", { title: data.title });
    return data;
  } catch (err) {
    log.error("Failed to invoke save-journal-ai-insights edge function", err);
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
