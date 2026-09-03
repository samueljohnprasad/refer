UPDATE exercises 
SET 
  content = '{
    "category": "state_switch",
    "format": "state_switch",
    "title": "Your nervous system at night",
    "instruction": "See how your body shifts between alert and settled.",
    "states": [
      {
        "id": "on",
        "mode": "on",
        "meterLabel": "",
        "symptoms": [
          "Heart may race",
          "Muscles tense"
        ],
        "summary": "Your body is preparing to respond.",
        "actionLabel": "SEE THE SETTLED STATE",
        "meterValue": 0
      },
      {
        "id": "off",
        "mode": "off",
        "meterLabel": "",
        "symptoms": [
          "Breathing can slow",
          "Muscles soften"
        ],
        "summary": "Sleep is easier when the system can settle.",
        "actionLabel": "WHAT KEEPS YOU ALERT?",
        "meterValue": 100
      },
      {
        "id": "conflict",
        "mode": "conflict",
        "meterLabel": "",
        "stressors": [
          "Work thoughts",
          "Caffeine",
          "Bright light"
        ],
        "summary": "Even when you feel tired,\nyour alert system can still stay activated.",
        "actionLabel": "TRY IT",
        "meterValue": 15
      }
    ],
    "recall": {
      "scenario": "It’s midnight. Your body feels exhausted,\nbut your heart is racing and your thoughts won’t slow.\n\nWhich direction is the system leaning?",
      "options": [
        { "id": "alert", "label": "ALERT", "isCorrect": true },
        { "id": "settled", "label": "SETTLED", "isCorrect": false }
      ],
      "feedback": {
        "correct": "Racing thoughts and a racing heart\npoint toward the alert side.",
        "incorrect": "Settled would mean the system is moving toward calm.\n\nHere, racing thoughts and a racing heart\npoint toward ALERT."
      }
    },
    "finalInsight": {
      "headline": "TIRED ≠ SETTLED",
      "body": "You can feel tired\nwhile your body is still alert."
    }
  }'::jsonb
WHERE content->>'title' ILIKE '%Your nervous system at night%';
