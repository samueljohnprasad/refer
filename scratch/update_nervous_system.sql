UPDATE exercises 
SET 
  type = 'state_switch',
  content = '{
    "category": "state_switch",
    "format": "state_switch",
    "title": "Your nervous system at night",
    "instruction": "See how your body shifts between alert and settled.",
    "states": [
      {
        "id": "on",
        "mode": "on",
        "meterLabel": "ON",
        "symptoms": [
          "Alert",
          "Heart can race",
          "Muscles tense"
        ],
        "summary": "Your body is preparing to respond.",
        "actionLabel": "SEE THE SETTLED STATE",
        "meterValue": 0
      },
      {
        "id": "off",
        "mode": "off",
        "meterLabel": "OFF",
        "symptoms": [
          "Settling",
          "Breathing easier",
          "Muscles soften"
        ],
        "summary": "Sleep is easier when the system can settle.",
        "actionLabel": "WHAT KEEPS IT ON?",
        "meterValue": 100
      },
      {
        "id": "conflict",
        "mode": "conflict",
        "meterLabel": "ON",
        "stressors": [
          "Work thoughts",
          "Caffeine",
          "Bright light"
        ],
        "summary": "Even when you feel tired,\nyour alert system can still stay activated.",
        "actionLabel": "TRY A QUICK RECALL",
        "meterValue": 15
      }
    ],
    "recall": {
      "scenario": "It’s midnight. Your body feels exhausted,\nbut your heart is racing and your thoughts won’t slow.\n\nWhich direction is the system leaning?",
      "options": [
        { "id": "on", "label": "ON", "isCorrect": true },
        { "id": "off", "label": "OFF", "isCorrect": false }
      ],
      "feedback": {
        "correct": "ON\n\nRacing thoughts + physical tension\nare signs the alert system is still active.",
        "incorrect": "OFF would mean the system is settling.\n\nHere, racing thoughts and tension point toward ON."
      }
    },
    "finalInsight": {
      "headline": "TIRED ≠ SETTLED",
      "body": "Feeling sleepy and having a settled nervous system\nare not exactly the same thing."
    }
  }'::jsonb
WHERE content->>'title' ILIKE '%Your nervous system at night%';
