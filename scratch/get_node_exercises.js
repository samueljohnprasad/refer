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
      const x = data.filter(d => d.node_source_id === 'u1_2_sleep_disruptors-n3');
      if (x.length > 0) console.log(x.map(e => e.type + " " + e.content?.title).join("\n"));
    }
  } catch(e) {}
}
