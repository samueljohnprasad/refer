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
    
    console.log(`[get-timeline-monthly] User: ${user.id} | Page: ${page}, PageSize: ${pageSize}, Offset: ${offset}`);

    // 1. Fetch paginated journals to determine the months we are looking at
    const { data: journals, error: journalsError } = await supabaseClient
      .from('journal_records')
      .select('id, selected_date, title')
      .eq('user_id', user.id)
      .order('selected_date', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (journalsError) throw journalsError;
    
    console.log(`[get-timeline-monthly] Found ${journals?.length || 0} journals in range.`);

    // Extract unique months from the fetched journals
    const uniqueMonths = new Map<string, { year: number, month: number }>();
    
    journals?.forEach(j => {
      if (!j.selected_date) return;
      const date = new Date(j.selected_date);
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1;
      const monthKey = `${year}-${month < 10 ? '0' + month : month}`;
      if (!uniqueMonths.has(monthKey)) {
        uniqueMonths.set(monthKey, { year, month });
      }
    });

    const uniqueMonthKeys = Array.from(uniqueMonths.keys());

    // 2. Fetch AI Insights ONLY for those specific months
    let aiInsights: any[] = [];
    if (uniqueMonthKeys.length > 0) {
      console.log(`[get-timeline-monthly] Fetching monthly_ai for months:`, uniqueMonthKeys);
      
      const years = Array.from(new Set(Array.from(uniqueMonths.values()).map(m => m.year)));
      
      const { data, error: aiError } = await supabaseClient
        .from('monthly_ai')
        .select('*')
        .eq('user_id', user.id)
        .in('year', years);

      if (aiError) throw aiError;
      
      // Filter the data to only include the months we asked for
      aiInsights = (data || []).filter(insight => {
        const monthKey = `${insight.year}-${insight.month < 10 ? '0' + insight.month : insight.month}`;
        return uniqueMonths.has(monthKey);
      });
      console.log(`[get-timeline-monthly] Found ${aiInsights.length} ai insights.`);
    } else {
      console.log(`[get-timeline-monthly] No unique months to fetch ai insights for.`);
    }

    // Build the timeline array mapped by month
    const timelineMap = new Map<string, any>();
    
    // Seed the map with the unique months
    uniqueMonths.forEach((val, monthKey) => {
      timelineMap.set(monthKey, {
        date: monthKey,
        originalDateString: monthKey,
        aiInsight: null // Will be populated if exists
      });
    });

    // Populate AI insights
    aiInsights.forEach((insight) => {
      const monthKey = `${insight.year}-${insight.month < 10 ? '0' + insight.month : insight.month}`;
      if (timelineMap.has(monthKey)) {
        timelineMap.get(monthKey).aiInsight = insight;
      }
    });

    // Convert map to sorted array (newest first)
    const timeline = Array.from(timelineMap.values()).sort((a, b) => {
      return b.date.localeCompare(a.date);
    });
    
    console.log(`[get-timeline-monthly] Returning ${timeline.length} timeline entries.`);

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
