UPDATE exercises
SET content = $content$
{
  "category": "lever_scenario",
  "format": "lever_scenario",
  "completionMode": "direct",
  "hideFooterUntilReady": true,
  "title": "Use the sleep map",
  "instruction": "Read the moment.",
  "capability": "Tired and wired can happen together.",
  "variants": [
    {
      "sceneLabel": "TUESDAY · 11:40PM",
      "scene": "• Awake since 7am\n• Checks work email at 11:40pm\n• Heart starts racing",
      "prompt": "What best explains what’s happening?",
      "clue": "She is already tired. Look for the clue that explains her alertness.",
      "worked": "Checking work pushed her tired body into alert mode.",
      "options": [
        {"id": "arousal", "label": "Her stress response switched on", "isCorrect": true, "feedback": "Checking work has pushed her tired body into alert mode."},
        {"id": "more-pressure", "label": "She simply isn’t tired yet", "feedback": "She’s already tired. Her racing heart points to increased alertness instead."},
        {"id": "missed-window", "label": "She missed her sleep window", "feedback": "Her racing heart points to alertness, not a missed sleep window."}
      ]
    },
    {
      "sceneLabel": "SATURDAY · 10:30PM",
      "scene": "• 2-hour evening nap\n• Feels calm\n• Not sleepy at 10:30pm",
      "prompt": "What best explains what’s happening?",
      "clue": "He is calm. Think about what the nap changed.",
      "worked": "The evening nap lowered his sleep pressure, so he may not feel sleepy yet.",
      "options": [
        {"id": "lower-pressure", "label": "His nap lowered his sleep pressure", "isCorrect": true, "feedback": "The nap released some sleep pressure, so he may not feel sleepy yet."},
        {"id": "clock-shifted", "label": "His body clock changed for the weekend", "feedback": "The nap is the clearest clue here. It lowered the sleep pressure built during the day."},
        {"id": "force-sleep", "label": "He needs to try harder to sleep", "feedback": "Trying harder can raise alertness. His sleep pressure needs time to rebuild."}
      ]
    }
  ],
  "waitingPrimaryLabel": "Choose an answer"
}
$content$::jsonb
WHERE type = 'lever_scenario'
  AND content->>'title' = 'Use the sleep map';
