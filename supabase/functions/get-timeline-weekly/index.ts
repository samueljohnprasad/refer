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
    
    console.log(`[get-timeline-weekly] User: ${user.id} | Page: ${page}, PageSize: ${pageSize}, Offset: ${offset}`);

    // 1. Fetch paginated journals to determine the weeks we are looking at
    const { data: journals, error: journalsError } = await supabaseClient
      .from('journal_records')
      .select('id, selected_date, title')
      .eq('user_id', user.id)
      .order('selected_date', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (journalsError) throw journalsError;
    
    console.log(`[get-timeline-weekly] Found ${journals?.length || 0} journals in range.`);

    function getISOWeekInfo(dateString: string) {
      const date = new Date(dateString);
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
      return { year: d.getUTCFullYear(), week: weekNo };
    }

    // Extract unique weeks from the fetched journals
    const uniqueWeeks = new Map<string, { year: number, week: number }>();
    
    journals?.forEach(j => {
      if (!j.selected_date) return;
      const { year, week } = getISOWeekInfo(j.selected_date);
      const weekKey = `${year}-W${week < 10 ? '0' + week : week}`;
      if (!uniqueWeeks.has(weekKey)) {
        uniqueWeeks.set(weekKey, { year, week });
      }
    });

    const uniqueWeekKeys = Array.from(uniqueWeeks.keys());

    // 2. Fetch AI Insights ONLY for those specific weeks
    let aiInsights: any[] = [];
    if (uniqueWeekKeys.length > 0) {
      console.log(`[get-timeline-weekly] Fetching weekly_ai for weeks:`, uniqueWeekKeys);
      
      // Since we can't easily query by a list of (year, week) tuples, we can query by the years and then filter in memory
      const years = Array.from(new Set(Array.from(uniqueWeeks.values()).map(w => w.year)));
      
      const { data, error: aiError } = await supabaseClient
        .from('weekly_ai')
        .select('*')
        .eq('user_id', user.id)
        .in('year', years);

      if (aiError) throw aiError;
      
      // Filter the data to only include the weeks we asked for
      aiInsights = (data || []).filter(insight => {
        const weekKey = `${insight.year}-W${insight.week_number < 10 ? '0' + insight.week_number : insight.week_number}`;
        return uniqueWeeks.has(weekKey);
      });
      console.log(`[get-timeline-weekly] Found ${aiInsights.length} ai insights.`);
    } else {
      console.log(`[get-timeline-weekly] No unique weeks to fetch ai insights for.`);
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
    aiInsights.forEach((insight) => {
      const weekKey = `${insight.year}-W${insight.week_number < 10 ? '0' + insight.week_number : insight.week_number}`;
      if (timelineMap.has(weekKey)) {
        timelineMap.get(weekKey).aiInsight = insight;
      }
    });

    // Convert map to sorted array (newest first)
    const timeline = Array.from(timelineMap.values()).sort((a, b) => {
      // Sort by weekKey descending (e.g. 2026-W30 > 2026-W29)
      return b.date.localeCompare(a.date);
    });
    
    console.log(`[get-timeline-weekly] Returning ${timeline.length} timeline entries.`);

    return new Response(
      JSON.stringify({ success: true, data: timeline }),
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
