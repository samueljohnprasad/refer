import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("Unauthorized request");
    }

    // Get pagination parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const offset = (page - 1) * pageSize;

    // 1. Fetch paginated journals to determine the days we are looking at
    const { data: journals, error: journalsError } = await supabaseClient
      .from('journals')
      .select('id, created_at, title')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (journalsError) throw journalsError;

    // Extract unique dates from the fetched journals
    const uniqueDates = Array.from(
      new Set(journals?.map((j) => j.created_at.split('T')[0]))
    );

    // 2. Fetch AI Insights ONLY for those specific dates
    let aiInsights: any[] = [];
    if (uniqueDates.length > 0) {
      const { data, error: aiError } = await supabaseClient
        .from('daily_ai')
        .select('*')
        .eq('user_id', user.id)
        .in('reflection_date', uniqueDates);

      if (aiError) throw aiError;
      aiInsights = data || [];
    }

    // Build the timeline array mapped by date
    const timelineMap = new Map<string, any>();
    
    // Seed the map with the unique dates
    uniqueDates.forEach((date) => {
      timelineMap.set(date, {
        date: date,
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
