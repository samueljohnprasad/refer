//@ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../database.types.ts";

export const auth = (userToken: string) => {
  //@ts-ignore
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  // Use anon key for user operations
  //@ts-ignore
  const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  // Create client with anon key and user token
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  });

  return supabase;
};
