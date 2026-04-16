import type {
  ExerciseConfig,
  CognitiveShuffleResponse,
} from "@/src/types/exerciseFlow";
import { createStep } from "@/src/components/exercise/steps/createStep";
import { createSummaryStep } from "@/src/components/exercise/steps/createSummaryStep";
import { IntroStep } from "@/src/components/exercise/steps/IntroStep";
import { TextInputStep } from "@/src/components/exercise/steps/TextInputStep";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import { BooleanStep } from "@/src/components/exercise/steps/BooleanStep";
import { SliderStep } from "@/src/components/exercise/steps/SliderStep";

const INITIAL: CognitiveShuffleResponse = {
  word: "",
  visualizedLetters: [],
  anotherWord: false,
  drowsinessRating: 5,
};

export const cognitiveShuffleConfig: ExerciseConfig<CognitiveShuffleResponse> =
  {
    type: "cognitive_shuffle",
    category: "sleep",
    title: "Cognitive Shuffle",
    subtitle: "Random imagery to ease into sleep",
    icon: "cognitive_shuffle",
    duration: "5-10 min",
    xp: 8,
    backgroundColor: "#fff",
    schemaVersion: 1,
    initialResponse: INITIAL,

    steps: [
      {
        id: "intro",
        component: createStep(IntroStep, {
          title: "Cognitive Shuffle",
          subtitle:
            "Distract your mind with random imagery to ease into sleep.",
          exerciseType: "cognitive_shuffle",
          duration: "5-10 min",
        }),
        label: "Welcome",
        validate: () => true,
        excludeFromProgress: true,
      },
      {
        id: "random_word",
        component: createStep(TextInputStep, {
          title: "Your Word",
          subtitle: 'Think of a random word (e.g. "BEACH").',
          fieldKey: "word",
          placeholder: "Type a word...",
        }),
        label: "Here's your random word",
        validate: (r) => r.word.length > 0,
      },
      {
        id: "visualize_letters",
        component: createStep(MultiTextInputStep, {
          title: "Visualize",
          subtitle:
            "For each letter of the word, picture an unrelated object starting with that letter.",
          fieldKey: "visualizedLetters",
          placeholder: "e.g. B = Butterfly",
          minItems: 1,
        }),
        label: "Visualize for each letter",
        validate: (r) => r.visualizedLetters.length >= 1,
      },
      {
        id: "another_word_or_done",
        component: createStep(BooleanStep, {
          title: "Continue?",
          subtitle: "Want to try another word?",
          fieldKey: "anotherWord",
          yesLabel: "Another word",
          noLabel: "I'm done",
          yesIconKey: "refresh",
          noIconKey: "sleep",
        }),
        label: "Another word or done?",
        validate: () => true,
        next: (r) => (r.anotherWord ? "random_word" : undefined),
      },
      {
        id: "drowsiness_rating",
        component: createStep(SliderStep, {
          title: "Drowsiness",
          subtitle: "How drowsy do you feel?",
          fieldKey: "drowsinessRating",
          min: 1,
          max: 10,
          minLabel: "Wide awake",
          maxLabel: "Very drowsy",
        }),
        label: "How drowsy are you? (1-10)",
        validate: () => true,
      },
      {
        id: "summary",
        component: createSummaryStep<CognitiveShuffleResponse>(
          [
            { label: "Word", key: "word" },
            { label: "Drowsiness", key: "drowsinessRating" },
          ],
          { title: "Shuffle complete!", exerciseType: "cognitive_shuffle" },
        ),
        label: "Summary",
        validate: () => true,
        excludeFromProgress: true,
      },
    ],
  };
