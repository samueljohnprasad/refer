UPDATE exercises
SET content = $concept$
{
  "category": "concept_card",
  "format": "concept_card",
  "completionMode": "direct",
  "hideSkipAction": true,
  "variant": "myth",
  "title": "One waking is not a broken night",
  "myth": "Waking at 3am means my sleep system has failed.",
  "reality": "Sleep moves through changing cycles.\n\nLater sleep often has more REM, so vivid dreams and brief wakings can happen without meaning anything is broken.",
  "note": "A less frightening explanation leaves room for sleep to return.",
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
      "body": "Your need for sleep gradually builds while you're awake."
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
