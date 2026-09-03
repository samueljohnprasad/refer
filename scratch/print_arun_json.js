const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../supabase/seed/sleep_reset_section_1.sql');
let content = fs.readFileSync(file, 'utf8');
const regex = /jsonb_to_recordset\('(\[.*?\])'::jsonb\)/gs;
let match;
while ((match = regex.exec(content)) !== null) {
  try {
    const data = JSON.parse(match[1].replace(/''/g, "'"));
    if (Array.isArray(data)) {
      const x = data.find(d => d.source_id === 'u1_l7_alcohol_story');
      if (x) console.log(JSON.stringify(x, null, 2));
    }
  } catch(e) {}
}
