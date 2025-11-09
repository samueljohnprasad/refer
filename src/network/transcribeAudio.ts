import { supabase } from "./auth/supabase";
import { InsightsType } from "./genAi";

interface CallMyFunctionParams {
  journal: string;
  isAudio: boolean;
}

export async function callMyFunction({
  journal,
  isAudio,
}: CallMyFunctionParams) {
  const { data, error } = await supabase.functions.invoke<InsightsType>(
    "save-journal-ai-insights",
    {
      body: { journal, isAudio },
    }
  );

  if (error || !data) {
    console.error("Function invoke error:", error);
    return null;
  }

  return data;
}

export async function deleteUserAuth() {
  const { data, error } = await supabase.functions.invoke<InsightsType>(
    "delete-user-auth"
  );

  if (error || !data) {
    console.error("Function invoke error:", error);
    return null;
  }

  return data;
}
