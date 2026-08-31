const fs = require('fs');
const file = 'supabase/seed/sleep_reset_section_1.sql';
let content = fs.readFileSync(file, 'utf8');

const search = '"Wake time shifts by 3 hours","Light on workdays only","Monday feels groggy"],"outcome":"Mixed timing cues"},{"heading":"Week B","rows":["Wake time stays within 1 hour","Light every morning","Monday feels stable"],"outcome":"Clearer timing cues"}],"explanation":"Consistent cues give the clock clear information. The goal is repeatability, not perfection."';
const replace = '"Wake time varies 3 hrs","Morning light only on workdays","Groggy Monday"],"outcome":"Mixed cues"},{"heading":"Week B","rows":["Wake time varies <1 hr","Morning light daily","Stable Monday"],"outcome":"Clearer cues"}],"explanation":"Consistent cues make your body clock easier to predict."';

if (content.includes(search)) {
  content = content.replaceAll(search, replace);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Replaced successfully');
} else {
  console.log('Search string not found');
}
