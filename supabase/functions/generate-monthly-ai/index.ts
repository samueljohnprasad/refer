import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { MonthlyService } from "../_shared/reflection-engine/services/monthly.service.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("Missing or invalid Authorization header");
    }
    const token = authHeader.replace("Bearer ", "");

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    // Get the user from the authorization header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error("Unauthorized request: " + userError?.message);
    }

    // ponytail: accept monthYear or slice 'YYYY-MM' from date
    const { month, year, monthYear, date } = await req.json();
    const targetMonth = month && year 
      ? `${year}-${String(month).padStart(2, '0')}`
      : monthYear ?? (typeof date === 'string' ? date.slice(0, 7) : null);

    if (!targetMonth) {
      throw new Error("Missing 'monthYear' or 'date' in request body.");
    }

    const monthlyService = new MonthlyService(supabaseClient);

    const result = await monthlyService.generateAndSaveMonthlyReflection(
      user.id,
      targetMonth
    );

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in generate-monthly-ai:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
