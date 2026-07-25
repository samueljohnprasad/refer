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
    
    console.log(`[get-timeline-monthly] === START REQUEST ===`);
    console.log(`[get-timeline-monthly] Params -> User: ${user.id} | Page: ${page} | PageSize: ${pageSize} | Offset: ${offset}`);

    // 1. Fetch paginated unique journal months using RPC
    console.log(`[get-timeline-monthly] Executing RPC 'get_unique_journal_months' with offset ${offset}, limit ${pageSize}...`);
    const { data: allMonths, error: monthsError } = await supabaseClient
      .rpc('get_unique_journal_months', {
        p_user_id: user.id,
        p_limit: pageSize,
        p_offset: offset
      });

    if (monthsError) {
      console.error(`[get-timeline-monthly] RPC Error:`, monthsError);
      throw monthsError;
    }
    
    // Check if we hit the limit to determine hasMore
    const hasMore = (allMonths || []).length === pageSize;
    
    console.log(`[get-timeline-monthly] RPC returned ${(allMonths || []).length} rows. hasMore set to: ${hasMore}`);
    console.log(`[get-timeline-monthly] Raw RPC data:`, JSON.stringify(allMonths));

    // Extract unique months from the fetched data
    const uniqueMonths = new Map<string, { year: number, month: number }>();
    
    (allMonths || []).forEach((m: any) => {
      const year = m.year_num;
      const month = m.month_num;
      const monthKey = `${year}-${month < 10 ? '0' + month : month}`;
      uniqueMonths.set(monthKey, { year, month });
    });

    const uniqueMonthKeys = Array.from(uniqueMonths.keys());
    console.log(`[get-timeline-monthly] Parsed unique month keys:`, JSON.stringify(uniqueMonthKeys));

    // 2. Fetch AI Insights ONLY for those specific months
    let aiInsights: any[] = [];
    if (uniqueMonthKeys.length > 0) {
      console.log(`[get-timeline-monthly] Fetching monthly_ai table for months:`, uniqueMonthKeys);
      
      const years = Array.from(new Set(Array.from(uniqueMonths.values()).map(m => m.year)));
      console.log(`[get-timeline-monthly] Querying monthly_ai for years in:`, years);
      
      const { data, error: aiError } = await supabaseClient
        .from('monthly_ai')
        .select('*')
        .eq('user_id', user.id)
        .in('year', years);

      if (aiError) {
        console.error(`[get-timeline-monthly] monthly_ai query error:`, aiError);
        throw aiError;
      }
      
      console.log(`[get-timeline-monthly] Raw monthly_ai rows fetched: ${data?.length || 0}`);
      
      // Filter the data to only include the months we asked for
      aiInsights = (data || []).filter(insight => {
        const monthKey = `${insight.year}-${insight.month < 10 ? '0' + insight.month : insight.month}`;
        return uniqueMonths.has(monthKey);
      });
      console.log(`[get-timeline-monthly] Filtered to ${aiInsights.length} relevant ai insights matching our unique months.`);
      console.log(`[get-timeline-monthly] Matching AI insights mapping:`, JSON.stringify(aiInsights.map(a => `${a.year}-${a.month}`)));
    } else {
      console.log(`[get-timeline-monthly] No unique months to fetch ai insights for. Skipping query.`);
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
    let populatedCount = 0;
    aiInsights.forEach((insight) => {
      const monthKey = `${insight.year}-${insight.month < 10 ? '0' + insight.month : insight.month}`;
      if (timelineMap.has(monthKey)) {
        timelineMap.get(monthKey).aiInsight = insight;
        populatedCount++;
      }
    });
    
    console.log(`[get-timeline-monthly] Populated ${populatedCount} timeline entries with AI insights.`);

    // Convert map to sorted array (newest first)
    const timeline = Array.from(timelineMap.values()).sort((a, b) => {
      return b.date.localeCompare(a.date);
    });
    
    console.log(`[get-timeline-monthly] === END REQUEST === Returning ${timeline.length} sorted timeline entries.`);

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
