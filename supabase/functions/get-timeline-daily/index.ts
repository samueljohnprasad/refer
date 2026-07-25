import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

//@ts-ignore
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      console.error("User verification failed:", userError);
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get pagination parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const offset = (page - 1) * pageSize;
    
    console.log(`[get-timeline-daily] User: ${user.id} | Page: ${page}, PageSize: ${pageSize}, Offset: ${offset}`);

    // 1. Fetch paginated unique journal dates using RPC
    const { data: allJournals, error: journalsError } = await supabaseClient
      .rpc('get_unique_journal_dates', {
        p_user_id: user.id,
        p_limit: pageSize,
        p_offset: offset
      });

    if (journalsError) throw journalsError;
    
    // Extract unique dates from the RPC result
    const uniqueDates = (allJournals || []).map((j: any) => j.selected_date);
    
    // Check if we hit the limit to determine hasMore
    const hasMore = uniqueDates.length === pageSize;
    
    console.log(`[get-timeline-daily] Found ${uniqueDates.length} unique dates from RPC for this page.`);

    // 2. Fetch AI Insights ONLY for those specific dates
    let aiInsights: any[] = [];
    if (uniqueDates.length > 0) {
      console.log(`[get-timeline-daily] Fetching daily_ai for dates:`, uniqueDates);
      
      const { data, error: aiError } = await supabaseClient
        .from('daily_ai')
        .select('*')
        .eq('user_id', user.id)
        .in('reflection_date', uniqueDates);

      if (aiError) throw aiError;
      aiInsights = data || [];
      console.log(`[get-timeline-daily] Found ${aiInsights.length} ai insights.`);
    } else {
      console.log(`[get-timeline-daily] No unique dates to fetch ai insights for.`);
    }

    // Build the timeline array mapped by date
    const timelineMap = new Map<string, any>();
    
    // Seed the map with the unique dates
    uniqueDates.forEach((date) => {
      timelineMap.set(date, {
        date: date,
        originalDateString: date,
        aiInsight: null // Will be populated if exists
      });
    });

    // Populate AI insights
    aiInsights.forEach((insight) => {
      if (timelineMap.has(insight.reflection_date)) {
        timelineMap.get(insight.reflection_date).aiInsight = insight;
      }
    });

    // Convert map to sorted array (newest first)
    const timeline = Array.from(timelineMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    console.log(`[get-timeline-daily] Returning ${timeline.length} timeline entries.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: timeline,
        hasMore: hasMore
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in get-timeline-daily:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
