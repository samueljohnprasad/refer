const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('source_id', 'u1_l7_alcohol_story')
    .single();
    
  if (error) {
    console.error('Error fetching:', error);
    return;
  }
  
  console.log('Found exercise:', data.id);
  
  // Update it
  const updatePayload = {
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
  
  const { error: updateError } = await supabase
    .from('exercises')
    .update(updatePayload)
    .eq('id', data.id);
    
  if (updateError) {
    console.error('Error updating:', updateError);
  } else {
    console.log('Update successful!');
  }
}
main();
