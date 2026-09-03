const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
async function main() {
  const { data, error } = await supabase.from('exercises').select('id, type, content').eq('type', 'timeline_rewind');
  console.log("timeline_rewind exercises:", data ? data.length : error);
  const { data: old, error: oldErr } = await supabase.from('exercises').select('id, type, content').eq('type', 'story_serial');
  console.log("story_serial exercises:", old ? old.length : oldErr);
}
main();
