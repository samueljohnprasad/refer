UPDATE exercises 
SET 
  type = 'timeline_rewind',
  content = '{
    "category": "timeline_rewind",
    "format": "timeline_rewind",
    "title": "Arun’s two versions of the night",
    "setup": "Arun has a drink in the evening and falls asleep quickly.",
    "prompt": "How would you read the night?",
    "timelineEvents": [
      { "time": "11:00 PM", "description": "Drink → asleep quickly" },
      { "time": "2:30 AM", "description": "Hot and restless" },
      { "time": "4:15 AM", "description": "Wakes again" },
      { "time": "7:00 AM", "description": "Unrefreshed" }
    ],
    "paths": [
      {
        "id": "first-hour",
        "choiceLabel": "Falling asleep quickly suggests the drink helped",
        "visibleEventCount": 1,
        "interpretation": "“Looks like it helped.”",
        "revealMoreButton": "SEE WHAT HAPPENED NEXT",
        "postRevealText": "The first hour was real.\nIt just wasn’t the whole night.",
        "switchPathButton": "REWIND THE NIGHT"
      },
      {
        "id": "whole-night",
        "choiceLabel": "I’d wait to see how the whole night went",
        "visibleEventCount": 4,
        "interpretation": "Looking beyond sleep onset changes the picture.",
        "switchPathButton": "SEE THE FIRST-HOUR READING"
      }
    ],
    "reflectionQuestion": "What did the first hour hide?",
    "reflectionOptions": [
      { "id": "diff", "label": "Later sleep quality can differ from sleep onset", "isCorrect": true },
      { "id": "same", "label": "Falling asleep quickly is enough to judge the night", "isCorrect": false }
    ],
    "finalInsight": {
      "headline": "FIRST HOUR ≠ WHOLE NIGHT",
      "body": "Sleep onset tells you how the night began.\nIt doesn’t tell you how the whole night went."
    }
  }'::jsonb
WHERE content->>'title' ILIKE '%Arun%';
