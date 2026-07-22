import { supabase } from "@/src/network/auth/supabase";
import type {
  ChestRarity,
  ExerciseInputType,
  ExerciseStep,
  NodeContent,
} from "@/src/types/journey/mentalHealth";

type BreathingPattern = "box" | "4-7-8" | "simple";

function normalizeBreathingPattern(value: unknown): BreathingPattern {
  if (value === "box" || value === "4-7-8" || value === "simple") {
    return value;
  }
  return "box";
}

function normalizeExerciseInputType(value: unknown): ExerciseInputType {
  if (value === "scale") return "slider";
  if (value === "multi_choice") return "multi_choice";
  if (value === "picker") return "picker";
  if (value === "rating") return "rating";
  return "text";
}

function normalizeChestRarity(value: unknown): ChestRarity {
  if (
    value === "common" ||
    value === "uncommon" ||
    value === "rare" ||
    value === "legendary"
  ) {
    return value;
  }
  return "common";
}

function formatPracticeStep(
  step: Record<string, unknown>,
  index: number,
): string | null {
  const text = step.instruction ?? step.body ?? step.text;
  if (typeof text !== "string" || text.trim().length === 0) return null;

  const duration =
    typeof step.durationSecs === "number" ? ` (${step.durationSecs}s)` : "";
  return `${index + 1}. ${text.trim()}${duration}`;
}

function buildTextExerciseStep(
  prompt: string,
  placeholder: string,
): ExerciseStep {
  return {
    prompt,
    input_type: "text",
    placeholder,
  };
}

function formatExerciseInstructions(
  instruction: string,
  steps: Array<Record<string, unknown>>,
): string {
  const stepInstructions = steps
    .map(formatPracticeStep)
    .filter((step): step is string => step !== null);

  return [instruction, ...stepInstructions]
    .filter((part) => part.trim().length > 0)
    .join("\n\n");
}

function buildBreathingPrompt(
  instruction: string,
  step: Record<string, unknown>,
): string {
  const pattern = normalizeBreathingPattern(step.pattern);
  const rounds = typeof step.rounds === "number" ? step.rounds : 4;
  const inhale = typeof step.inhale_seconds === "number" ? step.inhale_seconds : 4;
  const holdIn =
    typeof step.hold_in_seconds === "number" ? step.hold_in_seconds : 4;
  const exhale = typeof step.exhale_seconds === "number" ? step.exhale_seconds : 4;
  const holdOut =
    typeof step.hold_out_seconds === "number" ? step.hold_out_seconds : 4;

  return [
    instruction || `Practice ${pattern} breathing for ${rounds} rounds.`,
    `Breathe in for ${inhale}s, hold for ${holdIn}s, breathe out for ${exhale}s, then pause for ${holdOut}s.`,
    "When you finish, write one thing you noticed in your body.",
  ]
    .filter((part) => part.trim().length > 0)
    .join("\n\n");
}

export async function fetchNodeContent(
  nodeId: string,
  nodeType: string,
): Promise<unknown | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any;

  switch (nodeType) {
    case "lesson":
    case "mood_check":
    case "journal":
    case "checkpoint":
    case "chest":
    case "ai_insight": {
      const { data } = await sb
        .from("lesson_contents")
        .select("screens")
        .eq("node_id", nodeId)
        .single();
      return data ? { screens: data.screens } : null;
    }

    case "exercise": {
      const { data } = await sb
        .from("exercise_contents")
        .select("instruction, steps")
        .eq("node_id", nodeId)
        .single();
      return data ? { instruction: data.instruction, steps: data.steps } : null;
    }

    case "practice": {
      const { data } = await sb
        .from("practice_contents")
        .select("instruction, steps, repeat_count")
        .eq("node_id", nodeId)
        .single();
      return data
        ? {
            instruction: data.instruction,
            repeat_count: data.repeat_count,
            steps: data.steps,
          }
        : null;
    }

    case "story": {
      const { data } = await sb
        .from("story_contents")
        .select("dialogues")
        .eq("node_id", nodeId)
        .single();
      return data ? { dialogues: data.dialogues } : null;
    }

    case "quiz": {
      const { data } = await sb
        .from("quiz_contents")
        .select("questions")
        .eq("node_id", nodeId)
        .single();
      return data ? { questions: data.questions } : null;
    }

    default:
      return null;
  }
}

export function adaptNodeContent(
  nodeType: string,
  rawContent: unknown,
): NodeContent | null {
  if (!rawContent) return null;
  const content = rawContent as Record<string, unknown>;

  switch (nodeType) {
    case "lesson": {
      const screens = content.screens as
        | Array<Record<string, unknown>>
        | undefined;
      if (!screens) return null;
      return {
        cards: screens.map((s) => ({
          text: (s.body as string) ?? "",
          visual_key: (s.visual_key as string) ?? "default",
        })),
      };
    }

    case "story": {
      const dialogues = content.dialogues as
        | Array<Record<string, unknown>>
        | undefined;
      if (!dialogues) return null;

      return {
        cards: dialogues.map((dialogue) => {
          const options = dialogue.options as
            | Array<Record<string, unknown>>
            | undefined;
          const optionText = options?.length
            ? `\n\n${options
                .map((option) => `- ${String(option.text ?? "")}`)
                .join("\n")}`
            : "";

          return {
            text: `${String(dialogue.text ?? "")}${optionText}`,
            visual_key: (dialogue.speaker as string) ?? "story",
          };
        }),
      };
    }

    case "exercise":
    case "practice": {
      const steps = content.steps as Array<Record<string, unknown>> | undefined;
      const instruction =
        typeof content.instruction === "string" ? content.instruction : "";
      if (!steps) return null;

      if (nodeType === "practice") {
        return {
          steps: [
            buildTextExerciseStep(
              formatExerciseInstructions(instruction, steps) ||
                "Take a quiet minute to practice this skill.",
              "Write one thing you noticed.",
            ),
          ],
          exercise_type: "standard" as const,
        };
      }

      const firstStep = steps[0] as Record<string, unknown> | undefined;

      if (firstStep?.type === "breathing") {
        return {
          steps: [
            buildTextExerciseStep(
              buildBreathingPrompt(instruction, firstStep),
              "What changed after breathing?",
            ),
          ],
          exercise_type: "breathing" as const,
          breathing_config: {
            pattern: normalizeBreathingPattern(firstStep.pattern),
            inhale_seconds: (firstStep.inhale_seconds as number) ?? 4,
            hold_in_seconds: (firstStep.hold_in_seconds as number) ?? 4,
            exhale_seconds: (firstStep.exhale_seconds as number) ?? 4,
            hold_out_seconds: (firstStep.hold_out_seconds as number) ?? 4,
            rounds: (firstStep.rounds as number) ?? 4,
            visual: "wave",
          },
        };
      }

      if (firstStep?.type === "timed") {
        return {
          steps: [
            buildTextExerciseStep(
              formatExerciseInstructions(instruction, steps) ||
                "Move through each step slowly, then write what you noticed.",
              "What did you notice during this practice?",
            ),
          ],
          exercise_type: "body_scan" as const,
          body_scan_config: {
            areas: steps.reduce(
              (
                acc: Array<{
                  name: string;
                  tense_seconds: number;
                  release_seconds: number;
                  instruction: string;
                }>,
                step,
                idx,
              ) => {
                if (idx % 2 === 0) {
                  acc.push({
                    name: `Group ${Math.floor(idx / 2) + 1}`,
                    tense_seconds: (step.durationSecs as number) ?? 5,
                    release_seconds:
                      (steps[idx + 1]?.durationSecs as number) ?? 15,
                    instruction: (step.instruction as string) ?? "",
                  });
                }
                return acc;
              },
              [],
            ),
          },
        };
      }

      const exerciseSteps: ExerciseStep[] = steps
        .filter((s) => s.type === "prompt")
        .map((s): ExerciseStep => {
          const options = s.options as
            | Array<Record<string, unknown>>
            | undefined;

          const inputType = normalizeExerciseInputType(s.responseType);
          const step: ExerciseStep = {
            prompt: (s.body as string) ?? "",
            input_type: inputType,
          };

          if (inputType === "slider") {
            step.min = (s.min as number) ?? 0;
            step.max = (s.max as number) ?? 10;
            step.step = 1;
            step.label_min = (s.labelMin as string) ?? "";
            step.label_max = (s.labelMax as string) ?? "";
          }

          if (inputType === "multi_choice" && options) {
            step.options = options.map((o) => o.text as string);
            const correctIdx = options.findIndex((o) => o.isCorrect === true);
            if (correctIdx >= 0) step.correct_index = correctIdx;
            if (s.explanation) step.explanation = s.explanation as string;
          }

          return step;
        });

      if (exerciseSteps.length === 0) {
        return {
          steps: [
            buildTextExerciseStep(
              formatExerciseInstructions(instruction, steps) ||
                "Take a quiet minute with this practice, then write what you noticed.",
              "Write one thing you noticed.",
            ),
          ],
          exercise_type: "standard" as const,
        };
      }

      return {
        steps: exerciseSteps,
        exercise_type: "standard" as const,
      };
    }

    case "quiz": {
      const questions = content.questions as
        | Array<Record<string, unknown>>
        | undefined;
      if (!questions) return null;
      return {
        questions: questions.map((q) => {
          const options = q.options as Array<Record<string, unknown>>;
          const correctIdx = options.findIndex((o) => o.isCorrect === true);
          return {
            text: (q.text as string) ?? "",
            options: options.map((o) => o.text as string),
            correct_index: correctIdx >= 0 ? correctIdx : 0,
            explanation: (q.explanation as string) ?? "",
          };
        }),
      };
    }

    case "mood_check": {
      const screens = content.screens as
        | Array<Record<string, unknown>>
        | undefined;
      if (!screens?.[0]) return null;
      const s = screens[0];
      return {
        prompt: (s.prompt as string) ?? "",
        scale: (s.scale as number) ?? 5,
        note_enabled: (s.note_enabled as boolean) ?? true,
        labels: (s.labels as string[]) ?? [],
        comparison_note: (s.comparison_note as string) ?? undefined,
      };
    }

    case "journal": {
      const screens = content.screens as
        | Array<Record<string, unknown>>
        | undefined;
      if (!screens?.[0]) return null;
      const s = screens[0];
      return {
        prompt: (s.prompt as string) ?? "",
        mood_before: (s.mood_before as boolean) ?? false,
        mood_after: (s.mood_after as boolean) ?? false,
        voice_enabled: false,
        tags: (s.tags as string[]) ?? [],
      };
    }

    case "checkpoint": {
      const screens = content.screens as
        | Array<Record<string, unknown>>
        | undefined;
      if (!screens?.[0]) return null;
      const s = screens[0];
      return {
        badge_key: (s.badge_key as string) ?? "",
        badge_name: (s.badge_name as string) ?? "",
        badge_description: (s.badge_description as string) ?? "",
        skills_recap: (s.skills_recap as string[]) ?? [],
        show_mood_comparison: (s.show_mood_comparison as boolean) ?? false,
        is_journey_complete: (s.is_journey_complete as boolean) ?? false,
      };
    }

    case "chest": {
      const screens = content.screens as
        | Array<Record<string, unknown>>
        | undefined;
      if (!screens?.[0]) return null;
      const s = screens[0];
      return {
        reward_type: (s.reward_type as string) ?? "badge",
        reward_key: (s.reward_key as string) ?? "",
        reward_name: (s.reward_name as string) ?? "",
        reward_description: (s.reward_description as string) ?? "",
        rarity: normalizeChestRarity(s.rarity),
      };
    }

    default:
      return null;
  }
}

export function mapNodeTypeToRendererType(type: string): string {
  if (type === "lesson") return "learn";
  if (type === "story") return "learn";
  if (type === "practice") return "exercise";
  return type;
}
