import type { GetCourseTreeResponse } from "@/src/types/journeyV5";

export const sleepResetFlatData: GetCourseTreeResponse = {
  course: {
  "id": "sleep-reset",
  "title": "Sleep Reset",
  "description": "Reclaim your nights, one small shift at a time",
  "iconUrl": "moon",
  "colorHex": "#4B5563",
  "orderIndex": 0,
  "isPublished": true,
  "domain": "sleep_wellness",
  "targetAudience": "Adults struggling with sleep onset, quality, or restless nights",
  "totalLessons": 32,
  "totalDurationWeeks": 8,
  "sessionsPerWeek": 5,
  "sessionDurationMinutes": [
    5,
    15
  ]
},
  sections: [
  {
    "id": "s1_sleep_science",
    "courseId": "sleep-reset",
    "title": "How Sleep Actually Works",
    "orderIndex": 1,
    "narrativeHook": "You can't fix what you don't understand. Let's demystify the engine.",
    "badgeOnComplete": "Sleep Scientist",
    "difficultyRange": [
      0.15,
      0.35
    ],
    "objectives": {
      "remember": "Name the four sleep stages and understand: early sleep is deep sleep; late sleep is dream sleep.",
      "understand": "Explain your circadian rhythm as your body's 24-hour clock. Why alcohol disrupts the second half of the night specifically.",
      "apply": "Identify your own top sleep disruptors from a personal audit and understand the mechanism behind each one"
    },
    "conceptsIntroduced": [
      "sleep_architecture",
      "sleep_cycles",
      "sleep_composition",
      "circadian_rhythm",
      "sleep_pressure",
      "caffeine_sleep",
      "alcohol_sleep",
      "light_stress_disruptors"
    ]
  }
],
  units: [
  {
    "id": "u1_1_sleep_mechanics",
    "sectionId": "s1_sleep_science",
    "title": "Your Brain at Night",
    "iconKey": "unit-icon",
    "orderIndex": 1
  },
  {
    "id": "u1_2_sleep_disruptors",
    "sectionId": "s1_sleep_science",
    "title": "What's Stealing Your Sleep",
    "iconKey": "unit-icon",
    "orderIndex": 2
  }
],
  nodes: [
  {
    "id": "u1_1_sleep_mechanics-n1",
    "unitId": "u1_1_sleep_mechanics",
    "title": "Welcome to Sleep School",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_1_sleep_mechanics-n1",
    "contentType": "lesson",
    "passThreshold": 0.95,
    "orderIndex": 0,
    "estimatedMins": 5,
    "newConcepts": [
      "sleep_architecture"
    ],
    "reviewConcepts": [],
    "prerequisites": []
  },
  {
    "id": "u1_1_sleep_mechanics-n2",
    "unitId": "u1_1_sleep_mechanics",
    "title": "The 90-Minute Cycle",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_1_sleep_mechanics-n2",
    "contentType": "lesson",
    "passThreshold": 0.8,
    "orderIndex": 1,
    "estimatedMins": 9,
    "newConcepts": [
      "sleep_cycles"
    ],
    "reviewConcepts": [
      "sleep_architecture"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_1_sleep_mechanics-n3",
    "unitId": "u1_1_sleep_mechanics",
    "title": "Your Internal Clock",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_1_sleep_mechanics-n3",
    "contentType": "lesson",
    "passThreshold": 0.8,
    "orderIndex": 2,
    "estimatedMins": 10,
    "newConcepts": [
      "circadian_rhythm"
    ],
    "reviewConcepts": [
      "sleep_architecture",
      "sleep_cycles"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_1_sleep_mechanics-n4",
    "unitId": "u1_1_sleep_mechanics",
    "title": "Early vs Late Sleep",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_1_sleep_mechanics-n4",
    "contentType": "lesson",
    "passThreshold": 0.78,
    "orderIndex": 3,
    "estimatedMins": 9,
    "newConcepts": [
      "sleep_composition"
    ],
    "reviewConcepts": [
      "sleep_architecture",
      "sleep_cycles",
      "circadian_rhythm"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_2_sleep_disruptors-n1",
    "unitId": "u1_2_sleep_disruptors",
    "title": "The Sleep Pressure System",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_2_sleep_disruptors-n1",
    "contentType": "lesson",
    "passThreshold": 0.8,
    "orderIndex": 0,
    "estimatedMins": 10,
    "newConcepts": [
      "sleep_pressure"
    ],
    "reviewConcepts": [
      "circadian_rhythm"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_2_sleep_disruptors-n2",
    "unitId": "u1_2_sleep_disruptors",
    "title": "Caffeine: The Pressure Blocker",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_2_sleep_disruptors-n2",
    "contentType": "lesson",
    "passThreshold": 0.8,
    "orderIndex": 1,
    "estimatedMins": 10,
    "newConcepts": [
      "caffeine_sleep"
    ],
    "reviewConcepts": [
      "sleep_pressure"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_2_sleep_disruptors-n3",
    "unitId": "u1_2_sleep_disruptors",
    "title": "Alcohol: The Sleep Saboteur",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_2_sleep_disruptors-n3",
    "contentType": "lesson",
    "passThreshold": 0.78,
    "orderIndex": 2,
    "estimatedMins": 10,
    "newConcepts": [
      "alcohol_sleep"
    ],
    "reviewConcepts": [
      "sleep_cycles",
      "sleep_pressure"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_2_sleep_disruptors-n4",
    "unitId": "u1_2_sleep_disruptors",
    "title": "Light, Stress & Irregular Wake Times",
    "type": "lesson",
    "icon": "book",
    "contentId": "u1_2_sleep_disruptors-n4",
    "contentType": "lesson",
    "passThreshold": 0.75,
    "orderIndex": 3,
    "estimatedMins": 10,
    "newConcepts": [
      "light_stress_disruptors"
    ],
    "reviewConcepts": [
      "sleep_pressure",
      "circadian_rhythm"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_2_sleep_disruptors-n5",
    "unitId": "u1_2_sleep_disruptors",
    "title": "Sleep Science Checkpoint",
    "type": "checkpoint",
    "icon": "checkpoint",
    "contentId": "u1_2_sleep_disruptors-n5",
    "contentType": "checkpoint",
    "passThreshold": 0.85,
    "orderIndex": 4,
    "estimatedMins": 10,
    "newConcepts": [],
    "reviewConcepts": [
      "sleep_architecture",
      "sleep_cycles",
      "circadian_rhythm",
      "sleep_pressure",
      "caffeine_sleep",
      "alcohol_sleep",
      "light_stress_disruptors"
    ],
    "prerequisites": []
  },
  {
    "id": "u1_2_sleep_disruptors-n6_claim",
    "unitId": "u1_2_sleep_disruptors",
    "title": "Claim: unknown_badge",
    "type": "chest",
    "icon": "chest",
    "contentId": "u1_2_sleep_disruptors-n6_claim",
    "contentType": "chest",
    "passThreshold": null,
    "orderIndex": 5,
    "estimatedMins": 5,
    "newConcepts": [],
    "reviewConcepts": [],
    "prerequisites": []
  }
],
  exercises: [
  {
    "id": "l1_e1",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 0,
    "type": "learn_cards",
    "phase": "warmup",
    "durationSeconds": 30,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "cards": [
        {
          "text": "Your sleep has 4 stages. Two are for deep repair (N3). Two are for dreams (REM).",
          "visual_url": "/assets/sleep_stages_4boxes.png"
        },
        {
          "text": "Early night is mostly deep sleep. Late night is mostly dreams. Both matter.",
          "visual_url": "/assets/sleep_night_arc.png"
        },
        {
          "text": "This is why waking at 3am feels different from waking at 11pm — different brain states.",
          "visual_url": "/assets/timeline_sleep_stages.png"
        }
      ],
      "rules": {
        "max_words_per_card": 40,
        "max_cards": 3,
        "auto_advance": false
      }
    }
  },
  {
    "id": "l1_e1b",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 1,
    "type": "true_false",
    "phase": "introduce",
    "durationSeconds": 20,
    "scaffoldLevel": 2,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "statement": "Your body repairs muscles and bone during REM (dream) sleep.",
      "correct": false,
      "explanation": "Physical repair happens during N3 Deep Sleep, not REM!"
    }
  },
  {
    "id": "l1_e2",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 2,
    "type": "multiple_choice",
    "phase": "introduce",
    "durationSeconds": 20,
    "scaffoldLevel": 2,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "prompt": "Your brain has 4 sleep stages. Which description matches 'deep sleep' (N3)?",
      "subPrompt": "Select the best answer...",
      "options": [
        {
          "id": "a",
          "text": "When your body repairs and grows — muscles, immune system, bone",
          "correct": true
        },
        {
          "id": "b",
          "text": "When you dream and process emotions",
          "correct": false
        },
        {
          "id": "c",
          "text": "When you're barely asleep, just drifting off",
          "correct": false
        }
      ],
      "feedback_correct": "Exactly. N3 is deep sleep — that's when your body does its heavy restoration work.",
      "feedback_incorrect": "That's actually a different stage. N3 is deep sleep, when your body repairs itself — muscles, immune, bone.",
      "rules": {
        "shuffle_options": true,
        "show_explanation_always": true
      }
    }
  },
  {
    "id": "l1_e2b",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 3,
    "type": "matching",
    "phase": "challenge",
    "durationSeconds": 45,
    "scaffoldLevel": 3,
    "difficulty": 0.2,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "prompt": "Match the time of night to its primary sleep stage.",
      "pairs": [
        { "left": "Early Night", "right": "Mostly Deep Sleep (N3)" },
        { "left": "Late Night", "right": "Mostly Dreams (REM)" }
      ]
    }
  },
  {
    "id": "l1_e3",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 4,
    "type": "scenario",
    "phase": "challenge",
    "durationSeconds": 40,
    "scaffoldLevel": 6,
    "difficulty": 0.2,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "scenario": "You wake at 3am. Your mind is racing — you're having vivid dreams or think you're in a dream. Earlier at 11pm you fell asleep deeply and didn't move.",
      "question": "What does this tell you?",
      "options": [
        {
          "id": "a",
          "text": "At 11pm I was in deep sleep (N3). At 3am I'm in dream sleep (REM). Different brain states.",
          "correct": true,
          "feedback": "Yes! Early sleep is N3-heavy (deep). Late sleep is REM-heavy (dreams). That's why 3am waking feels like you're trapped in dream logic."
        },
        {
          "id": "b",
          "text": "I'm broken and will never sleep normally again",
          "correct": false,
          "feedback": "Actually, this is completely normal. Your sleep is cycling exactly as it should. The 'trapped' feeling is because you're waking in REM (dream) mode, not deep sleep mode."
        },
        {
          "id": "c",
          "text": "I had a nightmare and that's why I'm awake",
          "correct": false,
          "feedback": "Not necessarily. REM is when dreams happen, but dreams don't cause waking. More likely: something environmental (noise, temperature) woke you during your late-night REM cycle."
        }
      ],
      "rules": {
        "realistic_scenario": true,
        "plausible_distractors": true,
        "feedback_explains_why": true
      }
    }
  },
  {
    "id": "l1_e3b",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 5,
    "type": "multiple_choice",
    "phase": "consolidate",
    "durationSeconds": 25,
    "scaffoldLevel": 4,
    "difficulty": 0.2,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "prompt": "If you wake up at 4am, what sleep stage were you most likely just in?",
      "options": [
        { "id": "a", "text": "REM (dream sleep)", "correct": true },
        { "id": "b", "text": "N3 (deep sleep)", "correct": false },
        { "id": "c", "text": "Light sleep", "correct": false }
      ],
      "feedback_correct": "Right! REM cycles get longer later in the night.",
      "feedback_incorrect": "Not quite. Deep sleep (N3) happens early. By 4am, you are mostly experiencing REM."
    }
  },
  {
    "id": "l1_e4a",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 6,
    "type": "guided_response",
    "phase": "consolidate",
    "durationSeconds": 30,
    "scaffoldLevel": 3,
    "difficulty": 0.25,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "prompt": "Complete the rule of thumb:",
      "template": "Early sleep is for {1}, late sleep is for {2}.",
      "options": [
        { "id": "opt_1", "text": "physical repair", "target": "1" },
        { "id": "opt_2", "text": "dreams", "target": "2" }
      ],
      "feedback_correct": "Exactly! The first half of the night repairs the body, the second half repairs the mind.",
      "feedback_incorrect": "Remember: Body first (deep sleep), Mind second (REM)."
    }
  },
  {
    "id": "l1_e4b",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 7,
    "type": "true_false",
    "phase": "consolidate",
    "durationSeconds": 20,
    "scaffoldLevel": 2,
    "difficulty": 0.1,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "statement": "Waking up from a vivid dream at 5am means your sleep architecture is broken.",
      "correct": false,
      "explanation": "It's completely normal! You are naturally in a heavy REM phase at 5am."
    }
  },
  {
    "id": "l1_e4",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 8,
    "type": "free_text",
    "phase": "cooldown",
    "durationSeconds": 45,
    "scaffoldLevel": 5,
    "difficulty": 0.1,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Did this change how you understand your 3am or 5am waking?",
      "min_words": 3,
      "max_words": 100,
      "placeholder": "E.g., 'I never knew my sleep cycles were this specific...'"
    }
  },
  {
    "id": "l1_e5",
    "nodeId": "u1_1_sleep_mechanics-n1",
    "orderIndex": 9,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "After learning about sleep stages, how do you feel?",
      "scale": 5,
      "labels": [
        "Confused",
        "Uncertain",
        "Neutral",
        "Hopeful",
        "Empowered"
      ],
      "note_enabled": true
    }
  },
  {
    "id": "l2_e1",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 0,
    "type": "multiple_choice",
    "phase": "warmup",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "prompt": "Which stage happens mostly in early sleep?",
      "options": [
        {
          "id": "a",
          "text": "N3 (deep sleep)",
          "correct": true
        },
        {
          "id": "b",
          "text": "REM (dream sleep)",
          "correct": false
        },
        {
          "id": "c",
          "text": "Both equally",
          "correct": false
        }
      ],
      "feedback_correct": "Right. Remember: early night = N3 heavy, late night = REM heavy.",
      "feedback_incorrect": "Not quite. Early sleep is N3-heavy (deep). Late sleep is REM-heavy (dreams)."
    }
  },
  {
    "id": "l2_e2",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 1,
    "type": "learn_cards",
    "phase": "introduce",
    "durationSeconds": 60,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": "sleep_cycles",
    "content": {
      "cards": [
        {
          "text": "Your sleep doesn't stay in one stage all night. It cycles. First cycle: 70-100 minutes. Later cycles: 90-120 minutes.",
          "visual_url": "/assets/cycle_progression.png"
        },
        {
          "text": "Each cycle: light sleep → deep sleep → REM. Then repeat. Each repeat gets longer, with more REM.",
          "visual_url": "/assets/nrem_rem_cycle.png"
        },
        {
          "text": "By 5am-6am (after 4-5 cycles), you're mostly in REM (dreams). That's why late-night waking feels dream-like.",
          "visual_url": "/assets/timeline_rem_increasing.png"
        }
      ],
      "rules": {
        "max_cards": 3,
        "auto_advance": false
      }
    }
  },
  {
    "id": "l2_e3",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 2,
    "type": "ordering",
    "phase": "challenge",
    "durationSeconds": 50,
    "scaffoldLevel": 4,
    "difficulty": 0.25,
    "isScored": true,
    "concept": "sleep_cycles",
    "content": {
      "prompt": "Put these events in the order they happen during a typical night:",
      "items": [
        {
          "id": 0,
          "text": "You're in deep sleep (N3), muscles repair"
        },
        {
          "id": 1,
          "text": "Your first REM cycle starts (dreams begin)"
        },
        {
          "id": 2,
          "text": "Later REM cycles get longer; N3 starts disappearing"
        },
        {
          "id": 3,
          "text": "You wake at 3-4am in REM; it feels dream-trapped"
        }
      ],
      "correct_order": [
        0,
        1,
        2,
        3
      ],
      "partial_credit": true
    }
  },
  {
    "id": "l2_e4",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 3,
    "type": "true_false",
    "phase": "challenge",
    "durationSeconds": 30,
    "scaffoldLevel": 3,
    "difficulty": 0.25,
    "isScored": true,
    "concept": "sleep_cycles",
    "content": {
      "statement": "If you wake at 3am and can't fall back asleep, it's because you're broken or sick.",
      "correct": false,
      "explanation": "False. At 3am you're in a late-cycle REM sleep — dream mode. Waking then is completely normal if something disrupts you (sound, temperature, need to use bathroom). Your sleep isn't broken; you're just in a different brain state than at 11pm."
    }
  },
  {
    "id": "l2_e5",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 4,
    "type": "guided_response",
    "phase": "peak",
    "durationSeconds": 90,
    "scaffoldLevel": 5,
    "difficulty": 0.3,
    "isScored": false,
    "concept": "sleep_cycles",
    "content": {
      "prompt": "Describe a time you woke at 3-5am. What time did you fall asleep? What time did you wake? Now you know: that's your sleep cycles happening exactly as they should.",
      "sub_prompts": [
        "I fell asleep around ___",
        "I woke around ___",
        "Now I understand that I was in [choose: early-cycle deep sleep, late-cycle REM/dreams]"
      ],
      "min_words": 20,
      "max_words": 200,
      "mood_before": true,
      "mood_after": true,
      "tags": [
        "sleep_cycles",
        "3am_waking",
        "normalization"
      ]
    }
  },
  {
    "id": "l2_e6",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 5,
    "type": "multiple_choice",
    "phase": "consolidate",
    "durationSeconds": 25,
    "scaffoldLevel": 3,
    "difficulty": 0.25,
    "isScored": true,
    "concept": "sleep_cycles",
    "content": {
      "prompt": "A typical first sleep cycle lasts about ___ minutes. Later cycles last about ___ minutes.",
      "options": [
        {
          "id": "a",
          "text": "70-100 minutes first, 90-120 minutes later",
          "correct": true
        },
        {
          "id": "b",
          "text": "Always 90 minutes",
          "correct": false
        },
        {
          "id": "c",
          "text": "Variable, no pattern",
          "correct": false
        }
      ],
      "feedback_correct": "Exactly. First cycle is shorter (70-100), later cycles lengthen (90-120).",
      "feedback_incorrect": "Close but not quite. First cycles are 70-100 min. Later cycles stretch to 90-120 min."
    }
  },
  {
    "id": "l2_e7",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 6,
    "type": "slider_rating",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "How much sense does the 'sleep cycles explain 3am waking' idea make to you now?",
      "min": 1,
      "max": 5,
      "labels": [
        "No sense yet",
        "A bit",
        "Makes some sense",
        "Makes a lot of sense",
        "Crystal clear!"
      ]
    }
  },
  {
    "id": "l2_e8",
    "nodeId": "u1_1_sleep_mechanics-n2",
    "orderIndex": 7,
    "type": "learn_cards",
    "phase": "cooldown",
    "durationSeconds": 30,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": "sleep_cycles",
    "content": {
      "cards": [
        {
          "text": "You just learned: sleep cycles get longer through the night. Early cycles = deep sleep. Late cycles = more dreams. Your 3am waking is biology, not brokenness.",
          "visual_url": "/assets/celebration_subtle.png"
        }
      ],
      "rules": {
        "auto_advance": false
      }
    }
  },
  {
    "id": "l3_e1",
    "nodeId": "u1_1_sleep_mechanics-n3",
    "orderIndex": 0,
    "type": "multiple_choice",
    "phase": "warmup",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_cycles",
    "content": {
      "prompt": "Review: Which sleep stage happens mostly in the later half of the night (like 4am)?",
      "options": [
        {
          "id": "a",
          "text": "REM (dream sleep)",
          "correct": true
        },
        {
          "id": "b",
          "text": "N3 (deep sleep)",
          "correct": false
        }
      ],
      "feedback_correct": "Right! Later sleep cycles are longer and packed with REM (dream) sleep.",
      "feedback_incorrect": "Not quite. Deep sleep (N3) happens early. The later half of the night is mostly REM (dreams)."
    }
  },
  {
    "id": "l3_e2",
    "nodeId": "u1_1_sleep_mechanics-n3",
    "orderIndex": 1,
    "type": "learn_cards",
    "phase": "introduce",
    "durationSeconds": 60,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": "circadian_rhythm",
    "content": {
      "cards": [
        {
          "text": "Your circadian rhythm is a 24-hour internal clock. It creates a 'wake maintenance zone' — peak alertness around bedtime.",
          "visual_url": "/assets/circadian_24hr_clock.png"
        },
        {
          "text": "Peak → sharp DROP. At 10pm you feel wired. By 11pm you crash. That's the clock working.",
          "visual_url": "/assets/peak_then_drop_curve.png"
        },
        {
          "text": "Consistent WAKE TIME (not bedtime) resets this clock best. If you wake at 7am every day, your clock learns this anchor.",
          "visual_url": "/assets/wake_time_anchor.png"
        }
      ],
      "rules": {
        "auto_advance": false
      }
    }
  },
  {
    "id": "l3_e3",
    "nodeId": "u1_1_sleep_mechanics-n3",
    "orderIndex": 2,
    "type": "scenario",
    "phase": "challenge",
    "durationSeconds": 45,
    "scaffoldLevel": 5,
    "difficulty": 0.25,
    "isScored": true,
    "concept": "circadian_rhythm",
    "content": {
      "scenario": "You sleep 7am Mon-Fri, 10am Sat-Sun. Your clock gets confused. You're groggy, sleep is patchy.",
      "question": "What's happening?",
      "options": [
        {
          "id": "a",
          "text": "Your wake time shifts 3 hours — your 'anchor' is drifting. Your clock can't settle into a pattern.",
          "correct": true,
          "feedback": "Exactly. Your clock needs a consistent anchor. Even 2-3 hour shifts on weekends can disrupt the whole week."
        },
        {
          "id": "b",
          "text": "You just need more sleep",
          "correct": false,
          "feedback": "Sleep amount isn't the issue. Your TIMING (wake time) is inconsistent, so your clock stays confused."
        },
        {
          "id": "c",
          "text": "Weekends should naturally reset your sleep",
          "correct": false,
          "feedback": "Actually, weekend drift makes things worse. Consistency is what your clock needs."
        }
      ]
    }
  },
  {
    "id": "l3_e4",
    "nodeId": "u1_1_sleep_mechanics-n3",
    "orderIndex": 3,
    "type": "guided_response",
    "phase": "peak",
    "durationSeconds": 90,
    "scaffoldLevel": 5,
    "difficulty": undefined,
    "isScored": false,
    "concept": "circadian_rhythm",
    "content": {
      "prompt": "What time do you wake on weekdays vs weekends? How consistent is your wake time?",
      "sub_prompts": [
        "Weekday wake time: ___",
        "Weekend wake time: ___",
        "How many hours of drift? ___",
        "Could you make your wake time more consistent? How?"
      ],
      "min_words": 20,
      "max_words": 150
    }
  },
  {
    "id": "l3_e5",
    "nodeId": "u1_1_sleep_mechanics-n3",
    "orderIndex": 4,
    "type": "multiple_choice",
    "phase": "consolidate",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.18,
    "isScored": true,
    "concept": "circadian_rhythm",
    "content": {
      "prompt": "The best way to reset your circadian clock is:",
      "options": [
        {
          "id": "a",
          "text": "Keep a consistent WAKE TIME every day (within 30 min, even on weekends)",
          "correct": true
        },
        {
          "id": "b",
          "text": "Keep a consistent bedtime",
          "correct": false
        },
        {
          "id": "c",
          "text": "Sleep as long as you want on weekends",
          "correct": false
        }
      ],
      "feedback_correct": "Right. Wake time is the master anchor. Bedtime naturally follows when the clock is set correctly."
    }
  },
  {
    "id": "l3_e6",
    "nodeId": "u1_1_sleep_mechanics-n3",
    "orderIndex": 5,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Does this 'circadian clock' idea change how you think about your sleep schedule?",
      "scale": 5,
      "labels": [
        "Not at all",
        "Slightly",
        "Somewhat",
        "Very much",
        "Yes, completely"
      ],
      "note_enabled": false
    }
  },
  {
    "id": "l4_e1",
    "nodeId": "u1_1_sleep_mechanics-n4",
    "orderIndex": 0,
    "type": "multiple_choice",
    "phase": "warmup",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_cycles",
    "content": {
      "prompt": "Sleep cycles get longer as the night goes on. First cycle is 70-100 min; later cycles are ___?",
      "options": [
        {
          "id": "a",
          "text": "90-120 minutes",
          "correct": true
        },
        {
          "id": "b",
          "text": "70-100 minutes (same)",
          "correct": false
        },
        {
          "id": "c",
          "text": "60-80 minutes (shorter)",
          "correct": false
        }
      ],
      "feedback_correct": "Right. Cycles lengthen. That's why late-night sleep feels different."
    }
  },
  {
    "id": "l4_e2",
    "nodeId": "u1_1_sleep_mechanics-n4",
    "orderIndex": 1,
    "type": "learn_cards",
    "phase": "introduce",
    "durationSeconds": 50,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": "sleep_composition",
    "content": {
      "cards": [
        {
          "text": "Early cycles: 50-70% N3 (deep sleep), 20% REM. Late cycles: 10% N3, 50-60% REM.",
          "visual_url": "/assets/cycle_composition_arc.png"
        },
        {
          "text": "First 4 hours of sleep = mostly deep. Last 4 hours = mostly dreams.",
          "visual_url": "/assets/8hr_sleep_split.png"
        },
        {
          "text": "This is why waking at 4am feels different from 7am — you're in a completely different sleep state.",
          "visual_url": "/assets/4am_vs_7am_states.png"
        }
      ],
      "rules": {
        "auto_advance": false
      }
    }
  },
  {
    "id": "l4_e3",
    "nodeId": "u1_1_sleep_mechanics-n4",
    "orderIndex": 2,
    "type": "matching",
    "phase": "challenge",
    "durationSeconds": 50,
    "scaffoldLevel": 4,
    "difficulty": 0.22,
    "isScored": true,
    "concept": "sleep_composition",
    "content": {
      "prompt": "Match time of night to sleep stage composition:",
      "pairs": [
        {
          "left": "11pm-1am (early cycles)",
          "right": "Mostly deep sleep (N3), some light sleep"
        },
        {
          "left": "3am-5am (late cycles)",
          "right": "Mostly dream sleep (REM), minimal deep sleep"
        },
        {
          "left": "5am-7am (final cycle)",
          "right": "Almost pure REM (dreams), recovery mostly complete"
        }
      ]
    }
  },
  {
    "id": "l4_e4",
    "nodeId": "u1_1_sleep_mechanics-n4",
    "orderIndex": 3,
    "type": "guided_response",
    "phase": "peak",
    "durationSeconds": 90,
    "scaffoldLevel": 5,
    "difficulty": undefined,
    "isScored": false,
    "concept": "sleep_composition",
    "content": {
      "prompt": "If you sleep 8 hours (11pm-7am), describe the two halves:",
      "sub_prompts": [
        "First 4 hours (11pm-3am): Mostly ___ (deep sleep / dream sleep)",
        "Last 4 hours (3am-7am): Mostly ___ (deep sleep / dream sleep)",
        "Why do you think waking at 3am feels trapped, but waking at 7am feels like natural wake-up?"
      ],
      "min_words": 25,
      "max_words": 150
    }
  },
  {
    "id": "l4_e5",
    "nodeId": "u1_1_sleep_mechanics-n4",
    "orderIndex": 4,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Does this explain why your 3am waking feels SO different from your 7am waking?",
      "scale": 5,
      "labels": [
        "Not really",
        "A bit",
        "Somewhat",
        "Very much",
        "Yes, exactly"
      ],
      "note_enabled": false
    }
  },
  {
    "id": "l5_e1",
    "nodeId": "u1_2_sleep_disruptors-n1",
    "orderIndex": 0,
    "type": "learn_cards",
    "phase": "warmup",
    "durationSeconds": 40,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "cards": [
        {
          "text": "Two-process model: PROCESS S (adenosine/pressure) + PROCESS C (circadian clock).",
          "visual_url": "/assets/two_process_model.png"
        },
        {
          "text": "Sleep = HIGH pressure + LOW clock alert. Both needed. Miss either = insomnia.",
          "visual_url": "/assets/pressure_clock_overlap.png"
        }
      ],
      "rules": {
        "auto_advance": false
      }
    }
  },
  {
    "id": "l5_e2",
    "nodeId": "u1_2_sleep_disruptors-n1",
    "orderIndex": 1,
    "type": "multiple_choice",
    "phase": "introduce",
    "durationSeconds": 20,
    "scaffoldLevel": 2,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_pressure",
    "content": {
      "prompt": "Adenosine (sleep pressure) builds up all day like a tank filling. By 11pm, the tank is full AND your circadian alert has dropped. This means:",
      "options": [
        {
          "id": "a",
          "text": "Both systems say 'sleep' — high pressure + low alert = sleep happens",
          "correct": true
        },
        {
          "id": "b",
          "text": "You're just tired and need to try harder",
          "correct": false
        },
        {
          "id": "c",
          "text": "Your body is broken if you don't fall asleep instantly",
          "correct": false
        }
      ],
      "feedback_correct": "Exactly. When BOTH systems align, sleep is easy."
    }
  },
  {
    "id": "l5_e3",
    "nodeId": "u1_2_sleep_disruptors-n1",
    "orderIndex": 2,
    "type": "scenario",
    "phase": "challenge",
    "durationSeconds": 45,
    "scaffoldLevel": 5,
    "difficulty": 0.24,
    "isScored": true,
    "concept": "sleep_pressure",
    "content": {
      "scenario": "You take a 2-hour nap at 4pm. Your adenosine tank drains. At 11pm, even though your clock alert is dropping, your pressure tank is still only half-full. You can't fall asleep.",
      "question": "Why?",
      "options": [
        {
          "id": "a",
          "text": "One system says 'sleep' (low clock alert) but the other says 'not yet' (half-full pressure tank). You need BOTH.",
          "correct": true,
          "feedback": "Yes. Naps drain pressure. The longer the nap, the less pressure by bedtime. This is why late-afternoon naps wreck night sleep."
        },
        {
          "id": "b",
          "text": "You're just anxious",
          "correct": false,
          "feedback": "Not anxiety. Your adenosine pressure is literally too low. The two-process system is balanced wrong."
        },
        {
          "id": "c",
          "text": "Your body rejected the nap",
          "correct": false,
          "feedback": "Your body didn't reject it. The nap lowered your sleep pressure, so bedtime feels less urgent."
        }
      ]
    }
  },
  {
    "id": "l5_e4",
    "nodeId": "u1_2_sleep_disruptors-n1",
    "orderIndex": 3,
    "type": "free_text",
    "phase": "peak",
    "durationSeconds": 60,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Do you nap? If so, what time, and how does it affect your night sleep? How could you adjust your nap to protect night sleep?",
      "min_words": 15,
      "max_words": 120
    }
  },
  {
    "id": "l5_e5",
    "nodeId": "u1_2_sleep_disruptors-n1",
    "orderIndex": 4,
    "type": "multiple_choice",
    "phase": "consolidate",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.16,
    "isScored": true,
    "concept": "sleep_pressure",
    "content": {
      "prompt": "To keep your sleep pressure high for bedtime:",
      "options": [
        {
          "id": "a",
          "text": "Avoid long naps, especially after 2pm",
          "correct": true
        },
        {
          "id": "b",
          "text": "Nap as much as you want",
          "correct": false
        },
        {
          "id": "c",
          "text": "It doesn't matter when you nap",
          "correct": false
        }
      ],
      "feedback_correct": "Right. Late naps drain pressure when you need it at bedtime."
    }
  },
  {
    "id": "l5_e6",
    "nodeId": "u1_2_sleep_disruptors-n1",
    "orderIndex": 5,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Does the 'adenosine tank' model make sense for why you sometimes can't sleep at bedtime?",
      "scale": 5,
      "labels": [
        "Not at all",
        "A little",
        "Somewhat",
        "Very much",
        "Yes, exactly"
      ],
      "note_enabled": false
    }
  },
  {
    "id": "l6_e1",
    "nodeId": "u1_2_sleep_disruptors-n2",
    "orderIndex": 0,
    "type": "multiple_choice",
    "phase": "warmup",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_pressure",
    "content": {
      "prompt": "Adenosine is what your brain 'feels' as sleepiness. What blocks adenosine receptors?",
      "options": [
        {
          "id": "a",
          "text": "Caffeine (about 5-6 hour half-life)",
          "correct": true
        },
        {
          "id": "b",
          "text": "Water",
          "correct": false
        },
        {
          "id": "c",
          "text": "Exercise",
          "correct": false
        }
      ],
      "feedback_correct": "Right. Caffeine is the blocker. So even when pressure is high, caffeine prevents your brain from FEELING it."
    }
  },
  {
    "id": "l6_e2",
    "nodeId": "u1_2_sleep_disruptors-n2",
    "orderIndex": 1,
    "type": "learn_cards",
    "phase": "introduce",
    "durationSeconds": 55,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": "caffeine_sleep",
    "content": {
      "cards": [
        {
          "text": "Caffeine half-life: 5-6 hours average. Genetics vary 3-7x (CYP1A2 enzyme).",
          "visual_url": "/assets/caffeine_half_life_decay.png"
        },
        {
          "text": "3pm coffee: By 8pm, 50% left. By 11pm, 25% left. Your brain still feels 25-50% blocked.",
          "visual_url": "/assets/caffeine_timeline.png"
        },
        {
          "text": "Late-afternoon coffee is why you're wired at 11pm. Your pressure tank is full, but caffeine blocks the sensation.",
          "visual_url": "/assets/pressure_but_blocked.png"
        }
      ],
      "rules": {
        "auto_advance": false
      }
    }
  },
  {
    "id": "l6_e3",
    "nodeId": "u1_2_sleep_disruptors-n2",
    "orderIndex": 2,
    "type": "true_false",
    "phase": "challenge",
    "durationSeconds": 25,
    "scaffoldLevel": 3,
    "difficulty": 0.2,
    "isScored": true,
    "concept": "caffeine_sleep",
    "content": {
      "statement": "If you take 200mg caffeine at 2pm, it's mostly gone by 8pm, so it won't affect your 11pm sleep.",
      "correct": false,
      "explanation": "False. Half-life of 5-6 hours means 50mg is still in your system at 8pm, and 25mg at 11pm. That's enough to block adenosine and disrupt sleep. Plus, genetic variation means some people metabolize it much slower."
    }
  },
  {
    "id": "l6_e4",
    "nodeId": "u1_2_sleep_disruptors-n2",
    "orderIndex": 3,
    "type": "guided_response",
    "phase": "peak",
    "durationSeconds": 90,
    "scaffoldLevel": 5,
    "difficulty": undefined,
    "isScored": false,
    "concept": "caffeine_sleep",
    "content": {
      "prompt": "Map your caffeine intake and sleep:",
      "sub_prompts": [
        "What time do you have caffeine? (e.g., 7am, 2pm, 4pm)",
        "How much? (coffee cups, energy drinks, etc.)",
        "When do you usually want to sleep?",
        "Based on 5-6 hour half-life, what caffeine is still in your system at bedtime?"
      ],
      "min_words": 20,
      "max_words": 150
    }
  },
  {
    "id": "l6_e5",
    "nodeId": "u1_2_sleep_disruptors-n2",
    "orderIndex": 4,
    "type": "multiple_choice",
    "phase": "consolidate",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.16,
    "isScored": true,
    "concept": "caffeine_sleep",
    "content": {
      "prompt": "To protect sleep, the safest caffeine cutoff is:",
      "options": [
        {
          "id": "a",
          "text": "2pm or earlier (to have <25% in system by 11pm)",
          "correct": true
        },
        {
          "id": "b",
          "text": "4pm is fine, it'll be mostly gone by bedtime",
          "correct": false
        },
        {
          "id": "c",
          "text": "Caffeine doesn't affect sleep much",
          "correct": false
        }
      ],
      "feedback_correct": "Right. 2pm cutoff is a safe rule for most people (though genetics vary)."
    }
  },
  {
    "id": "l6_e6",
    "nodeId": "u1_2_sleep_disruptors-n2",
    "orderIndex": 5,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Does this explain your nighttime wakefulness after afternoon coffee?",
      "scale": 5,
      "labels": [
        "Not at all",
        "Slightly",
        "Somewhat",
        "Very much",
        "Yes, that's it"
      ],
      "note_enabled": false
    }
  },
  {
    "id": "l7_e1",
    "nodeId": "u1_2_sleep_disruptors-n3",
    "orderIndex": 0,
    "type": "multiple_choice",
    "phase": "warmup",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "sleep_cycles",
    "content": {
      "prompt": "Late-night sleep is mostly what stage?",
      "options": [
        {
          "id": "a",
          "text": "REM (dream sleep)",
          "correct": true
        },
        {
          "id": "b",
          "text": "N3 (deep sleep)",
          "correct": false
        }
      ],
      "feedback_correct": "Right. Late cycles are REM-heavy. This is important for understanding alcohol's effect."
    }
  },
  {
    "id": "l7_e2",
    "nodeId": "u1_2_sleep_disruptors-n3",
    "orderIndex": 1,
    "type": "learn_cards",
    "phase": "introduce",
    "durationSeconds": 60,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": "alcohol_sleep",
    "content": {
      "cards": [
        {
          "text": "Alcohol helps ONSET (acts like sleeping pill) but destroys SECOND HALF (REM rebound, fragmentation).",
          "visual_url": "/assets/alcohol_biphasic_effect.png"
        },
        {
          "text": "One drink at 6pm: Sleep onset at 9pm is easy, but 1-3am you wake fragmented, REM disrupted.",
          "visual_url": "/assets/alcohol_timeline_effects.png"
        },
        {
          "text": "Dose-dependent: One beer barely disrupts. Three drinks = major fragmentation.",
          "visual_url": "/assets/dose_dependent_effect.png"
        }
      ],
      "rules": {
        "auto_advance": false
      }
    }
  },
  {
    "id": "l7_e3",
    "nodeId": "u1_2_sleep_disruptors-n3",
    "orderIndex": 2,
    "type": "scenario",
    "phase": "challenge",
    "durationSeconds": 50,
    "scaffoldLevel": 5,
    "difficulty": 0.25,
    "isScored": true,
    "concept": "alcohol_sleep",
    "content": {
      "scenario": "You have two glasses of wine at 7pm. You fall asleep easily at 10pm (alcohol helped). But at 2am you wake fragmented, sweating, heart racing, can't get back to sleep.",
      "question": "What happened?",
      "options": [
        {
          "id": "a",
          "text": "Alcohol metabolite (acetaldehyde) causes REM rebound when BAC drops. Your late-cycle REM is disrupted and fragmented.",
          "correct": true,
          "feedback": "Yes. Alcohol helps onset but destroys second-half sleep. The crash at 2am is classic REM rebound."
        },
        {
          "id": "b",
          "text": "You're just sensitive to alcohol",
          "correct": false,
          "feedback": "Not just sensitivity — this is a dose-dependent effect everyone experiences."
        },
        {
          "id": "c",
          "text": "You should've waited longer before bed",
          "correct": false,
          "feedback": "Timing doesn't fix it. The alcohol will metabolize 4-5 hrs post-dose, disrupting late sleep regardless."
        }
      ]
    }
  },
  {
    "id": "l7_e4",
    "nodeId": "u1_2_sleep_disruptors-n3",
    "orderIndex": 3,
    "type": "guided_response",
    "phase": "peak",
    "durationSeconds": 90,
    "scaffoldLevel": 5,
    "difficulty": undefined,
    "isScored": false,
    "concept": "alcohol_sleep",
    "content": {
      "prompt": "Do you drink alcohol? If so, map its effect on your sleep:",
      "sub_prompts": [
        "When do you drink? How much? (e.g., 7pm, 2 glasses wine)",
        "How's your sleep that night? Onset? Middle-of-night waking?",
        "Have you noticed a pattern (fragmented, sweaty, can't get back to sleep at 1-3am)?"
      ],
      "min_words": 15,
      "max_words": 130
    }
  },
  {
    "id": "l7_e5",
    "nodeId": "u1_2_sleep_disruptors-n3",
    "orderIndex": 4,
    "type": "multiple_choice",
    "phase": "consolidate",
    "durationSeconds": 20,
    "scaffoldLevel": 3,
    "difficulty": 0.18,
    "isScored": true,
    "concept": "alcohol_sleep",
    "content": {
      "prompt": "The dose where alcohol stops disrupting sleep is:",
      "options": [
        {
          "id": "a",
          "text": "Individual and varies; lower is better. Even one drink disrupts for sensitive people.",
          "correct": true
        },
        {
          "id": "b",
          "text": "Two drinks is always safe",
          "correct": false
        },
        {
          "id": "c",
          "text": "Alcohol doesn't really disrupt sleep",
          "correct": false
        }
      ],
      "feedback_correct": "Right. DOSE matters. There's no universal safe amount; lower is always better for sleep."
    }
  },
  {
    "id": "l7_e6",
    "nodeId": "u1_2_sleep_disruptors-n3",
    "orderIndex": 5,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Does this explain your fragmented, sweaty sleep after drinking alcohol?",
      "scale": 5,
      "labels": [
        "Not at all",
        "Slightly",
        "Somewhat",
        "Very much",
        "Yes, exactly"
      ],
      "note_enabled": false
    }
  },
  {
    "id": "l8_e1",
    "nodeId": "u1_2_sleep_disruptors-n4",
    "orderIndex": 0,
    "type": "learn_cards",
    "phase": "warmup",
    "durationSeconds": 50,
    "scaffoldLevel": 1,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "cards": [
        {
          "text": "Three more disruptors: Brightness/light (blocks melatonin), stress (floods adrenaline), irregular wake times (confuses clock).",
          "visual_url": "/assets/three_disruptors.png"
        },
        {
          "text": "Bright screen at 10pm tells brain it's 10am. Stressful email at 8pm floods adrenaline. Sleeping 7am-10am on weekends keeps clock confused.",
          "visual_url": "/assets/three_examples.png"
        }
      ],
      "rules": {
        "auto_advance": false
      }
    }
  },
  {
    "id": "l8_e2",
    "nodeId": "u1_2_sleep_disruptors-n4",
    "orderIndex": 1,
    "type": "multiple_choice",
    "phase": "introduce",
    "durationSeconds": 25,
    "scaffoldLevel": 2,
    "difficulty": 0.15,
    "isScored": true,
    "concept": "light_stress_disruptors",
    "content": {
      "prompt": "Which is MOST disruptive to your circadian clock?",
      "options": [
        {
          "id": "a",
          "text": "Irregular wake times (3-hour drift Sat-Sun keeps your clock confused all week)",
          "correct": true
        },
        {
          "id": "b",
          "text": "Irregular bedtimes",
          "correct": false
        },
        {
          "id": "c",
          "text": "Both equally",
          "correct": false
        }
      ],
      "feedback_correct": "Right. Wake time is the master anchor."
    }
  },
  {
    "id": "l8_e3",
    "nodeId": "u1_2_sleep_disruptors-n4",
    "orderIndex": 2,
    "type": "scenario",
    "phase": "challenge",
    "durationSeconds": 50,
    "scaffoldLevel": 5,
    "difficulty": 0.28,
    "isScored": true,
    "concept": "light_stress_disruptors",
    "content": {
      "scenario": "Monday-Friday you wake at 7am, feel okay. Saturday you sleep until 10am. Sunday the same. Monday you wake groggy at 7am. Sleep that night is patchy.",
      "question": "What's disrupting your Monday sleep?",
      "options": [
        {
          "id": "a",
          "text": "Your clock got reset. 3-hour weekend drift means your body thinks bedtime is 3 hours later. Monday at 11pm your clock doesn't think it's sleep time yet.",
          "correct": true,
          "feedback": "Exactly. Consistency matters more than duration. One or two 'catch-up sleep' days reset your whole week."
        },
        {
          "id": "b",
          "text": "You just need more sleep",
          "correct": false,
          "feedback": "Sleep amount isn't the issue. It's TIMING. Your clock is confused."
        },
        {
          "id": "c",
          "text": "You're just tired from the work week",
          "correct": false,
          "feedback": "If this happens every Monday after weekends, it's your clock, not fatigue."
        }
      ]
    }
  },
  {
    "id": "l8_e4",
    "nodeId": "u1_2_sleep_disruptors-n4",
    "orderIndex": 3,
    "type": "free_text",
    "phase": "peak",
    "durationSeconds": 60,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Do you have irregular wake times (different weekday vs weekend)? If so, what's the drift? How could you make it more consistent?",
      "min_words": 15,
      "max_words": 120
    }
  },
  {
    "id": "l8_e5",
    "nodeId": "u1_2_sleep_disruptors-n4",
    "orderIndex": 4,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Of these three disruptors (light, stress, irregular wake), which ones apply to you?",
      "scale": 4,
      "labels": [
        "None",
        "One",
        "Two",
        "All three"
      ],
      "note_enabled": false
    }
  },
  {
    "id": "l9_e1",
    "nodeId": "u1_2_sleep_disruptors-n5",
    "orderIndex": 0,
    "type": "multiple_choice",
    "phase": "warmup",
    "durationSeconds": 20,
    "scaffoldLevel": 2,
    "difficulty": 0.12,
    "isScored": true,
    "concept": "sleep_architecture",
    "content": {
      "prompt": "Name the 4 sleep stages:",
      "options": [
        {
          "id": "a",
          "text": "N1, N2, N3 (light and deep), and REM (dreams)",
          "correct": true
        },
        {
          "id": "b",
          "text": "Light, medium, deep, REM",
          "correct": false
        },
        {
          "id": "c",
          "text": "Only deep and dream",
          "correct": false
        }
      ],
      "feedback_correct": "Right."
    }
  },
  {
    "id": "l9_e2",
    "nodeId": "u1_2_sleep_disruptors-n5",
    "orderIndex": 1,
    "type": "guided_response",
    "phase": "consolidate",
    "durationSeconds": 90,
    "scaffoldLevel": 5,
    "difficulty": 0.32,
    "isScored": false,
    "concept": "sleep_architecture",
    "content": {
      "prompt": "Personal disruptor audit: Identify your own TOP 3 disruptors from this section. For each, explain WHAT it is and WHY it disrupts your sleep.",
      "sub_prompts": [
        "Disruptor #1: ___ (e.g., Caffeine). WHAT: I drink coffee at 3pm. WHY: Half-life 5-6 hrs, so 25% blocks adenosine at 11pm.",
        "Disruptor #2: ___ WHAT: ___ WHY: ___",
        "Disruptor #3: ___ WHAT: ___ WHY: ___"
      ],
      "min_words": 50,
      "max_words": 250
    }
  },
  {
    "id": "l9_e3",
    "nodeId": "u1_2_sleep_disruptors-n5",
    "orderIndex": 2,
    "type": "free_text",
    "phase": "peak",
    "durationSeconds": 60,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Which ONE of your top 3 disruptors could you change FIRST? Why start with that one?",
      "min_words": 10,
      "max_words": 100
    }
  },
  {
    "id": "l9_e4",
    "nodeId": "u1_2_sleep_disruptors-n5",
    "orderIndex": 3,
    "type": "rating_check",
    "phase": "cooldown",
    "durationSeconds": 15,
    "scaffoldLevel": undefined,
    "difficulty": undefined,
    "isScored": false,
    "concept": null,
    "content": {
      "prompt": "Now that you understand your sleep disruptors, how do you feel?",
      "scale": 5,
      "labels": [
        "Overwhelmed",
        "Uncertain",
        "Neutral",
        "Hopeful",
        "Empowered"
      ],
      "note_enabled": true
    }
  }
],
};
