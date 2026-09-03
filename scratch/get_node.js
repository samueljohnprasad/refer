const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
async function main() {
  // Can't use anon key for exercises... Wait! How does the app read exercises?
  // Ah, the user's phone has an auth session!
}
