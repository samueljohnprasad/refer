const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../supabase/seed/sleep_reset_section_1.sql');
let sql = fs.readFileSync(filePath, 'utf8');

const regex = /jsonb_to_recordset\('(\[.*?\])'::jsonb\)/gs;
let match;
let found = false;

while ((match = regex.exec(sql)) !== null) {
  const fullMatch = match[0];
  const jsonStrMatch = match[1];
  const jsonStr = jsonStrMatch.replace(/''/g, "'"); // Postgres escaping
  
  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch (e) {
    continue;
  }
  
  if (Array.isArray(data)) {
    const targetIndex = data.findIndex(d => d.source_id === 'u1_l7_alcohol_story');
    if (targetIndex !== -1) {
      data[targetIndex] = {
        ...data[targetIndex],
        type: "timeline_rewind",
        content: {
          category: "timeline_rewind",
          format: "timeline_rewind",
          title: "Arun’s two versions of the night",
          setup: "Arun has a drink in the evening and falls asleep quickly.",
          prompt: "How would you read the night?",
          timelineEvents: [
            { time: "11:00 PM", description: "Arun has a drink and falls asleep quickly." },
            { time: "2:30 AM", description: "Wakes up feeling hot and restless." },
            { time: "4:15 AM", description: "Briefly wakes again." },
            { time: "7:00 AM", description: "Alarm rings. Feels unrefreshed." }
          ],
          paths: [
            {
              id: "first-hour",
              choiceLabel: "It seems like the drink helped",
              visibleEventCount: 1,
              interpretation: "Sleep arrives quickly, so Arun assumes the drink helped the whole night. The early benefit felt real, but it wasn't the whole story."
            },
            {
              id: "whole-night",
              choiceLabel: "I’d want to see the whole night",
              visibleEventCount: 4,
              interpretation: "Arun notes the drink’s timing, then notices both sleep onset and later waking. He has a pattern to discuss, not a verdict about his character."
            }
          ],
          reflectionQuestion: "What did the first hour hide?",
          reflectionOptions: [
            { id: "later-sleep", label: "Later sleep quality can differ from sleep onset", isCorrect: true },
            { id: "one-cause", label: "One drink proves the exact cause", isCorrect: false }
          ],
          finalInsight: {
            headline: "FIRST HOUR ≠ WHOLE NIGHT",
            body: "Falling asleep quickly and sleeping well across the night are different questions."
          }
        }
      };
      
      let newJsonStr = JSON.stringify(data);
      newJsonStr = newJsonStr.replace(/'/g, "''");
      
      sql = sql.replace(jsonStrMatch, newJsonStr);
      fs.writeFileSync(filePath, sql, 'utf8');
      console.log("Updated seed file!");
      found = true;
      break;
    }
  }
}

if (!found) {
  console.log("Could not find u1_l7_alcohol_story");
}
