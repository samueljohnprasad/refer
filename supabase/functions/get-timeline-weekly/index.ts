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
    
    console.log(`[get-timeline-weekly] === START REQUEST ===`);
    console.log(`[get-timeline-weekly] Params -> User: ${user.id} | Page: ${page} | PageSize: ${pageSize} | Offset: ${offset}`);

    // 1. Fetch paginated unique journal weeks using RPC
    console.log(`[get-timeline-weekly] Executing RPC 'get_unique_journal_weeks' with offset ${offset}, limit ${pageSize}...`);
    const { data: allWeeks, error: weeksError } = await supabaseClient
      .rpc('get_unique_journal_weeks', {
        p_user_id: user.id,
        p_limit: pageSize,
        p_offset: offset
      });

    if (weeksError) {
      console.error(`[get-timeline-weekly] RPC Error:`, weeksError);
      throw weeksError;
    }
    
    // Check if we hit the limit to determine hasMore
    const hasMore = (allWeeks || []).length === pageSize;
    
    console.log(`[get-timeline-weekly] RPC returned ${(allWeeks || []).length} rows. hasMore set to: ${hasMore}`);
    console.log(`[get-timeline-weekly] Raw RPC data:`, JSON.stringify(allWeeks));

    // Extract unique weeks from the fetched data
    const uniqueWeeks = new Map<string, { year: number, week: number }>();
    
    (allWeeks || []).forEach((w: any) => {
      const year = w.iso_year;
      const week = w.iso_week;
      const weekKey = `${year}-W${week < 10 ? '0' + week : week}`;
      uniqueWeeks.set(weekKey, { year, week });
    });

    const uniqueWeekKeys = Array.from(uniqueWeeks.keys());
    console.log(`[get-timeline-weekly] Parsed unique week keys:`, JSON.stringify(uniqueWeekKeys));

    // 2. Fetch AI Insights ONLY for those specific weeks
    let aiInsights: any[] = [];
    if (uniqueWeekKeys.length > 0) {
      console.log(`[get-timeline-weekly] Fetching weekly_ai table for weeks:`, uniqueWeekKeys);
      
      // Since we can't easily query by a list of (year, week) tuples, we can query by the years and then filter in memory
      const years = Array.from(new Set(Array.from(uniqueWeeks.values()).map(w => w.year)));
      console.log(`[get-timeline-weekly] Querying weekly_ai for years in:`, years);
      
      const { data, error: aiError } = await supabaseClient
        .from('weekly_ai')
        .select('*')
        .eq('user_id', user.id)
        .in('year', years);

      if (aiError) {
        console.error(`[get-timeline-weekly] weekly_ai query error:`, aiError);
        throw aiError;
      }
      
      console.log(`[get-timeline-weekly] Raw weekly_ai rows fetched: ${data?.length || 0}`);
      
      // Filter the data to only include the weeks we asked for
      aiInsights = (data || []).filter(insight => {
        const weekKey = `${insight.year}-W${insight.week_number < 10 ? '0' + insight.week_number : insight.week_number}`;
        return uniqueWeeks.has(weekKey);
      });
      console.log(`[get-timeline-weekly] Filtered to ${aiInsights.length} relevant ai insights matching our unique weeks.`);
      console.log(`[get-timeline-weekly] Matching AI insights mapping:`, JSON.stringify(aiInsights.map(a => `${a.year}-W${a.week_number}`)));
    } else {
      console.log(`[get-timeline-weekly] No unique weeks to fetch ai insights for. Skipping query.`);
    }

    // Build the timeline array mapped by week
    const timelineMap = new Map<string, any>();
    
    // Seed the map with the unique weeks
    uniqueWeeks.forEach((val, weekKey) => {
      timelineMap.set(weekKey, {
        date: weekKey,
        originalDateString: weekKey,
        aiInsight: null // Will be populated if exists
      });
    });

    // Populate AI insights
    let populatedCount = 0;
    aiInsights.forEach((insight) => {
      const weekKey = `${insight.year}-W${insight.week_number < 10 ? '0' + insight.week_number : insight.week_number}`;
      if (timelineMap.has(weekKey)) {
        timelineMap.get(weekKey).aiInsight = insight;
        populatedCount++;
      }
    });
    
    console.log(`[get-timeline-weekly] Populated ${populatedCount} timeline entries with AI insights.`);

    // Convert map to sorted array (newest first)
    const timeline = Array.from(timelineMap.values()).sort((a, b) => {
      // Sort by weekKey descending (e.g. 2026-W30 > 2026-W29)
      return b.date.localeCompare(a.date);
    });
    
    console.log(`[get-timeline-weekly] === END REQUEST === Returning ${timeline.length} sorted timeline entries.`);

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
