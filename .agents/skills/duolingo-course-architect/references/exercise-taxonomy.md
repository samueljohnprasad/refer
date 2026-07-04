# Exercise Taxonomy Reference

## Complete Exercise Type Catalog

Every exercise type available for course generation, with cognitive mode, scaffolding level, and usage guidelines.

**Principle Justification**: Each exercise type is grounded in the 50 Psychology Principles (see `references/psychology-principles.md`). Citations indicate which learning science principles justify each type's use, timing, and difficulty calibration.

---

## Core Exercise Types

### 1. Learn Cards (Carousel)

**Principles**: Narrative Transportation (#21), Embodied Cognition (#26), Elaboration Likelihood (#20 - peripheral route)  
**Cognitive Mode**: Receptive (passive)  
**Scaffold Level**: 1 (Passive Exposure)  
**Duration**: 30-90 seconds  
**When to Use**: Introducing new concepts, psychoeducation, setting context  
**Accuracy Tracking**: N/A (no right/wrong)

```yaml
type: "learn_cards"
config:
  cards:
    - text: "max 40 words per card"
      visual_key: "illustration_key"
  max_cards: 3-5  # More = disengagement
  auto_advance: false  # User swipes
```

**Rules:**
- Max 5 cards per set
- Max 40 words per card
- Each card should have ONE idea
- Use at start of lesson (introduction) or end (cool-down summary)
- Never use more than once per lesson

---

### 2. Multiple Choice

**Principles**: Testing Effect (#3), Self-Efficacy (#12), Positive Reinforcement After Failure (#16), Immediate Feedback (#41)  
**Cognitive Mode**: Recognition  
**Scaffold Level**: 2-3 (Recognition Easy → Hard)  
**Duration**: 15-30 seconds  
**When to Use**: Testing comprehension, review, discrimination, warmups (build confidence)  
**Accuracy Tracking**: Yes

```yaml
type: "multiple_choice"
config:
  prompt: "question text"
  options: ["correct", "wrong1", "wrong2", "wrong3"]  # 3-4 options
  correct: 0  # Index of correct answer
  feedback_correct: "Reinforcement message"
  feedback_incorrect: "Correction + explanation"
  shuffle_options: true
```

**Difficulty Levers:**
- Level 2: Obvious wrong answers ("Box breathing is: A) A technique B) A type of pizza C) A math formula")
- Level 3: Plausible distractors ("Box breathing uses: A) 4-4-4-4 pattern B) 4-7-8 pattern C) 5-5-5-5 pattern")

**Rules:**
- Always include explanation for wrong answers (learning happens in errors)
- 3 options for easy, 4 options for hard
- Correct answer position should vary (not always A)

---

### 3. True/False with Explanation

**Principles**: Testing Effect (#3), Cognitive Biases (#39), Growth Mindset (#22), Chunking & Pattern Recognition (#36)  
**Cognitive Mode**: Discrimination / Critical thinking  
**Scaffold Level**: 2-3  
**Duration**: 15-25 seconds  
**When to Use**: Challenging assumptions, correcting misconceptions, addressing pre-existing false beliefs  
**Accuracy Tracking**: Yes

```yaml
type: "true_false"
config:
  statement: "declarative statement"
  correct: true | false
  explanation: "why — shown regardless of user's answer"
```

**Rules:**
- Statement should be plausible either way
- Explanation is ALWAYS shown (even on correct answer — reinforces learning)
- Use for common misconceptions: "The goal of a body scan is to relax all tension" (false)

---

### 4. Fill-in-the-Blank

**Cognitive Mode**: Guided production / Active recall  
**Scaffold Level**: 4 (Guided Production)  
**Duration**: 20-45 seconds  
**When to Use**: Testing recall of specific terms, sequences, or facts  
**Accuracy Tracking**: Yes

```yaml
type: "fill_blank"
config:
  sentence: "The four phases of box breathing are: inhale, ___, exhale, ___"
  blanks: ["hold", "hold"]  # Accepted answers
  alternatives: [["hold in", "pause"], ["hold out", "pause"]]  # Acceptable synonyms
  hint: "Both blanks are the same word"  # Optional
```

**Rules:**
- Accept reasonable synonyms (case-insensitive)
- Max 2 blanks per sentence
- Provide hint after first failed attempt
- More advanced than multiple choice — use after user has seen concept 2+ times

---

### 5. Ordering / Sequencing

**Cognitive Mode**: Structural understanding / Procedural recall  
**Scaffold Level**: 4 (Guided Production)  
**Duration**: 30-60 seconds  
**When to Use**: Learning procedures, steps, sequences  
**Accuracy Tracking**: Yes (partial credit possible)

```yaml
type: "ordering"
config:
  prompt: "Put these steps in the correct order:"
  items: ["Step A", "Step B", "Step C", "Step D"]
  correct_order: [0, 1, 2, 3]
  partial_credit: true  # Award XP for partially correct
```

**Rules:**
- 3-5 items (never more than 6 — cognitive overload)
- Provide context in prompt ("Put the EVENING WIND-DOWN steps in order")
- Partial credit: 2 adjacent items in correct relative position = partial win

---

### 6. Matching Pairs

**Cognitive Mode**: Association / Categorization  
**Scaffold Level**: 3 (Recognition Hard)  
**Duration**: 30-60 seconds  
**When to Use**: Connecting related concepts, vocabulary, cause-effect  
**Accuracy Tracking**: Yes

```yaml
type: "matching"
config:
  prompt: "Match each technique to its primary benefit:"
  left: ["Box breathing", "Body scan", "Thought catcher"]
  right: ["Calms nervous system", "Releases muscle tension", "Identifies cognitive patterns"]
  correct_pairs: [[0,0], [1,1], [2,2]]
```

**Rules:**
- 3-5 pairs (never more than 5)
- All items should be from RELATED concepts (not random pairing)
- Good for mid-lesson consolidation

---


### 10. Scenario / Situation

**Cognitive Mode**: Application / Transfer  
**Scaffold Level**: 6 (Application in Context)  
**Duration**: 30-60 seconds  
**When to Use**: Real-world application, testing transfer, contextual decision-making  
**Accuracy Tracking**: Yes

```yaml
type: "scenario"
config:
  situation: "It's 11:30pm. You've been lying in bed for 45 minutes with racing thoughts about tomorrow's meeting."
  question: "Which technique would you use first?"
  options:
    - text: "4-7-8 breathing to activate parasympathetic system"
      correct: true
      feedback: "Great choice — breathing directly calms the nervous system, making thought work easier afterward."
    - text: "Thought reframing to challenge the worry"
      correct: false
      feedback: "Thought work is harder when the nervous system is activated. Calm the body first, then address thoughts."
    - text: "Get up and watch TV until tired"
      correct: false
      feedback: "Screen light suppresses melatonin. Better to use a body-based technique first."
```

**Rules:**
- Scenarios should be REALISTIC and relatable
- Correct answer should apply concepts learned in THIS or PRIOR lessons
- Wrong answers should be plausible (not obviously wrong)
- Feedback should explain WHY (not just "correct/incorrect")

---


**Rules:**
- Use at START of first lesson (baseline)
- Use at END of checkpoint lessons (comparison)
- Data feeds mood-arc AI insights
- Never judge or evaluate mood (just track)

---

## Exercise Mixing Rules

### Within a Single Lesson (10 exercises):

```
Position 1:  Multiple choice (review, easy) — WARM-UP
Position 2:  Learn cards (new concept) — INTRODUCE
Position 3:  Multiple choice or True/False (new concept, recognition) — CHALLENGE
Position 4:  Ordering or Matching (new concept, guided) — CHALLENGE
Position 5:  True/False (review, consolidation) — CONSOLIDATE
Position 6:  Multiple choice (mix new + review) — CONSOLIDATE
Position 7: Learn cards (summary + next teaser) — COOL-DOWN
```

### Type Distribution Per Lesson:

| Exercise Type | Frequency Per Lesson | Notes |
|--------------|---------------------|-------|
| Learn cards | 1-2 | Start + end only |
| Multiple choice | 2-3 | Workhorse type |
| True/False | 1 | Good for misconceptions |
| Ordering/Matching | 1 | Variety |
| Free text | 1 | Personal application |
| Timer/Experiential | 0-1 | High value, use sparingly |
| Scenario | 0-1 | Advanced application |

### Hard Rules:

- ❌ NEVER two learn_cards sets in a row
- ❌ NEVER three multiple_choice in a row
- ❌ NEVER end on a hard exercise (user might fail and close app feeling bad)
- ❌ NEVER start with free_text (too much effort when cold)
- ✅ ALWAYS start with easy review (build confidence)
- ✅ ALWAYS end with easy or reflective (end on success)
- ✅ ALWAYS include at least one production exercise 
