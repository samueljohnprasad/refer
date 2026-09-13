# Sleep Reset Section 3: New Exercises Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate four new production-quality microlearning exercises (`invent_first`, `surge_diagram`, `guided_discovery_trail`, `teach_back_chain`) into the Sleep Reset Section 3 curriculum without modifying existing exercises.

**Architecture:** We will append new JSON objects into the `course_exercises` insertion statement in `supabase/seed/sleep_reset_section_3.sql`. These exercises will be mapped to existing lesson nodes where their concepts naturally fit.

**Tech Stack:** PostgreSQL (Supabase Seed SQL), JSONB

## Global Constraints

- Do not modify existing exercises in the seed file.
- Add the new exercises by appending them to the end of the JSON array for `course_exercises`.
- Use correct JSON schema for each microlearning type.
- Ensure the `order_index` for the new exercises is higher than the existing exercises in their respective nodes.

---

### Task 1: Add `invent_first` exercise to "Find Your Switch Cue"

**Files:**
- Modify: `supabase/seed/sleep_reset_section_3.sql`

**Interfaces:**
- Consumes: `sleep_reset_section_3.sql`
- Produces: Appends a new `invent_first` exercise object.

- [ ] **Step 1: Locate the `course_exercises` array in `sleep_reset_section_3.sql`**
Find the `WITH curriculum AS (` block that inserts into `course_exercises` (usually towards the bottom of the file).

- [ ] **Step 2: Append the `invent_first` JSON object**
Add the following JSON to the end of the array (ensure commas are correct). This will belong to node `u3_1_shift_into_night-n3` (Find Your Switch Cue, concept: `transition_cue`). Let's assume order_index 10.

```json
      ,{
        "source_id": "u3_l21_switch_cue_invent",
        "node_source_id": "u3_1_shift_into_night-n3",
        "order_index": 10,
        "type": "invent_first",
        "phase": "infer",
        "duration_seconds": 60,
        "scaffold_level": 3,
        "difficulty": 0.2,
        "is_scored": true,
        "concept": "transition_cue",
        "content": {
          "category": "invent_first",
          "format": "invent_first",
          "title": "Invent the rule",
          "instruction": "Find what makes a transition cue effective.",
          "cases": [
            {
              "id": "effective",
              "name": "Alex",
              "reading": "ends work, then folds a small basket of laundry",
              "outcome": "changes pace",
              "isCalm": true
            },
            {
              "id": "ineffective",
              "name": "Sam",
              "reading": "ends work, then immediately checks personal emails",
              "outcome": "stays alert",
              "isCalm": false
            }
          ],
          "question": "What separates the effective cue?",
          "options": [
            {
              "id": "screen",
              "label": "It does not use a screen.",
              "response": "Screens matter, but laundry isn't the only screen-free task. What is the shift in demand?"
            },
            {
              "id": "demand",
              "label": "It significantly lowers demand.",
              "response": "Yes. A transition cue acts as a bridge by requiring less cognitive effort."
            }
          ],
          "theory": "demand"
        }
      }
```

### Task 2: Add `surge_diagram` exercise to "Rebuild the Bed-Sleep Connection"

**Files:**
- Modify: `supabase/seed/sleep_reset_section_3.sql`

- [ ] **Step 1: Append the `surge_diagram` JSON object**
Add this to node `u3_2_make_the_bedroom_work-n4` (concept: `stimulus_control`). order_index 10.

```json
      ,{
        "source_id": "u3_l25_stimulus_surge",
        "node_source_id": "u3_2_make_the_bedroom_work-n4",
        "order_index": 10,
        "type": "surge_diagram",
        "phase": "model",
        "duration_seconds": 35,
        "scaffold_level": 1,
        "difficulty": 0.12,
        "is_scored": false,
        "concept": "stimulus_control",
        "content": {
          "category": "surge_diagram",
          "format": "surge_diagram",
          "title": "Frustration changes over time",
          "instruction": "Read the shape.",
          "diagramTitle": "Wakeful effort rises, peaks, and can fall",
          "peakLabel": "peak effort",
          "fadeLabel": "body adjusts",
          "axisLabel": "time",
          "explanation": "When you can't sleep, frustration and effort can rise quickly. If you step out of bed and shift context, the effort cycle breaks and activation can fall.",
          "note": "The goal isn't to force sleep, but to protect the bed from being associated with a surge of effort."
        }
      }
```

### Task 3: Add `guided_discovery_trail` exercise to "The One-Change Rule"

**Files:**
- Modify: `supabase/seed/sleep_reset_section_3.sql`

- [ ] **Step 1: Append the `guided_discovery_trail` JSON object**
Add this to node `u3_3_clear_test_personalize-n3` (concept: `evening_experiment`). order_index 10.

```json
      ,{
        "source_id": "u3_l28_experiment_discovery",
        "node_source_id": "u3_3_clear_test_personalize-n3",
        "order_index": 10,
        "type": "guided_discovery_trail",
        "phase": "reason",
        "duration_seconds": 70,
        "scaffold_level": 2,
        "difficulty": 0.17,
        "is_scored": false,
        "concept": "evening_experiment",
        "content": {
          "category": "guided_discovery_trail",
          "format": "guided_discovery_trail",
          "completionMode": "direct",
          "title": "Follow the evidence",
          "instruction": "Choose one clue at a time.",
          "questions": [
            {
              "id": "trail-multiple-changes",
              "prompt": "You try a new tea, change your bedtime, and read instead of watch TV. You sleep poorly. What is known?",
              "summary": "You changed three things, but don't know which caused the poor sleep.",
              "options": [
                {
                  "id": "trail-multiple-all",
                  "label": "All three changes are bad",
                  "response": "That's a guess. One might have worked if the others hadn't interfered."
                },
                {
                  "id": "trail-multiple-none",
                  "label": "The outcome is unclear",
                  "response": "Exactly. Multiple changes obscure the data."
                }
              ]
            },
            {
              "id": "trail-single-change",
              "prompt": "How can you isolate the cause?",
              "summary": "Testing one variable clarifies the outcome.",
              "options": [
                {
                  "id": "trail-single-one",
                  "label": "Test one change across several nights",
                  "response": "Correct. This forms the basis of the one-change rule."
                },
                {
                  "id": "trail-single-fast",
                  "label": "Change nothing",
                  "response": "Changing nothing provides no new data to improve the evening blueprint."
                }
              ]
            }
          ]
        }
      }
```

### Task 4: Add `teach_back_chain` exercise to "Your Evening Blueprint"

**Files:**
- Modify: `supabase/seed/sleep_reset_section_3.sql`

- [ ] **Step 1: Append the `teach_back_chain` JSON object**
Add this to node `u3_3_clear_test_personalize-n4` (concept: `evening_blueprint`). order_index 10.

```json
      ,{
        "source_id": "u3_l29_blueprint_chain",
        "node_source_id": "u3_3_clear_test_personalize-n4",
        "order_index": 10,
        "type": "teach_back_chain",
        "phase": "explain",
        "duration_seconds": 80,
        "scaffold_level": 4,
        "difficulty": 0.27,
        "is_scored": true,
        "concept": "evening_blueprint",
        "content": {
          "title": "Build the blueprint",
          "instruction": "Put the flexible evening steps in order.",
          "message": "How does an evening blueprint safely guide you to rest?",
          "steps": [
            {
              "id": "step1_light",
              "label": "Manage environmental cues (e.g., dim lights)",
              "order": 1
            },
            {
              "id": "step2_capture",
              "label": "Capture lingering worries if needed",
              "order": 2
            },
            {
              "id": "step3_cue",
              "label": "Use a familiar transition cue to step down demand",
              "order": 3
            },
            {
              "id": "step4_bed",
              "label": "Go to bed, but reset if wakefulness persists",
              "order": 4
            }
          ]
        }
      }
```

- [ ] **Step 2: Commit the changes**
```bash
git add supabase/seed/sleep_reset_section_3.sql
git commit -m "feat(seed): add 4 new exercise types to sleep reset section 3"
```
