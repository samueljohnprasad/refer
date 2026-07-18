export const GRATITUDE_REFRAME_PROMPTS = [
  {
    value: "people",
    label: "A person who showed up for me",
    iconKey: "people",
  },
  {
    value: "growth",
    label: "Something steady that supports me",
    iconKey: "growth",
  },
  {
    value: "simple",
    label: "A small moment that helped me today",
    iconKey: "simple_joy",
  },
] as const;

export function getGratitudePromptLabel(selectedPrompt: string): string {
  return (
    GRATITUDE_REFRAME_PROMPTS.find(
      (prompt) => prompt.value === selectedPrompt,
    )?.label ?? selectedPrompt
  );
}
