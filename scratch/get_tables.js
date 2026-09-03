const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
async function main() {
  const { data, error } = await supabase.from('courses').select('id, domain');
  console.log("courses:", data);
  const { data: ex, error: exErr } = await supabase.from('exercises').select('id, type').limit(1);
  console.log("exercises:", ex, exErr);
}
main();
