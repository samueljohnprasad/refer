UPDATE exercises
SET content = $concept$
{
  "category": "concept_card",
  "format": "concept_card",
  "completionMode": "direct",
  "hideSkipAction": true,
  "variant": "rule",
  "title": "One waking is not a broken night",
  "rule": "Brief wakings are normal",
  "explanation": "Sleep moves through cycles during the night. Waking briefly does not mean your sleep is broken.",
  "primaryLabel": "Continue"
}
$concept$::jsonb
WHERE type = 'concept_card'
  AND content->>'title' = 'One waking is not a broken night';

UPDATE exercises
SET content = $cards$
{
  "category": "learn_cards",
  "format": "learn_cards",
  "completionMode": "direct",
  "hideSkipAction": true,
  "title": "Sleep pressure builds",
  "primaryLabel": "Continue",
  "cards": [
    {
      "id": "pressure-builds",
      "title": "The longer you’re awake, the sleepier you become",
      "body": "Time awake gradually builds your need for sleep. This growing need is called sleep pressure."
    },
    {
      "id": "sleep-releases",
      "title": "Sleep releases that pressure",
      "body": "As you sleep, some of that built-up need decreases."
    },
    {
      "id": "naps-lower-pressure",
      "title": "Long naps can reduce bedtime sleepiness",
      "body": "A long late nap can use some sleep pressure before bedtime."
    }
  ]
}
$cards$::jsonb
WHERE type = 'learn_cards'
  AND content->>'title' = 'Sleep pressure builds';
