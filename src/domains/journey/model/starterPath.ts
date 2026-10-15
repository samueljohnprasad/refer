export type StarterPathActionKind =
  | "lesson"
  | "practice"
  | "reflection"
  | "insight";

export type StarterPracticeSource = "course_node" | "exercise_catalog";

export interface StarterPathNextAction {
  kind: StarterPathActionKind;
  targetId: string;
  pathId: string;
  reasonCode: "lesson_complete";
}

export interface StarterPathCopyKeys {
  goal: {
    eyebrow: string;
    title: string;
    description: string;
    choice: string;
    choiceDescription: string;
    continueButton: string;
  };
  lesson: {
    eyebrow: string;
    title: string;
    paragraphOne: string;
    paragraphTwo: string;
    continueButton: string;
  };
  practice: {
    eyebrow: string;
    title: string;
    description: string;
    toolTitle: string;
    toolDescription: string;
    openButton: string;
    homeButton: string;
    completionError: string;
  };
  boundary: string;
}

export interface StarterPathV1 {
  pathId: string;
  pathVersion: 1;
  goalId: string;
  courseId: string;
  lessonNodeId: string;
  practiceRef: {
    source: StarterPracticeSource;
    id: string;
  };
  reflectionPromptId: string;
  nextAction: StarterPathNextAction;
  copyKeys: StarterPathCopyKeys;
}

export function resolveStarterPathPractice(
  path: StarterPathV1,
  isRegisteredPractice: (practiceId: string) => boolean,
): StarterPathV1["practiceRef"] | null {
  const { id } = path.practiceRef;
  return isRegisteredPractice(id) ? path.practiceRef : null;
}

export const ANXIOUS_THOUGHTS_STARTER_PATH: StarterPathV1 = {
  pathId: "understand_anxious_thoughts",
  pathVersion: 1,
  goalId: "understand_anxious_thoughts",
  courseId: "anxiety",
  lessonNodeId: "anxiety-s1-u1-n1-anxiety-has-a-job",
  practiceRef: {
    source: "exercise_catalog",
    id: "thought_catcher",
  },
  reflectionPromptId: "notice_the_anxiety_alarm",
  nextAction: {
    kind: "practice",
    targetId: "thought_catcher",
    pathId: "understand_anxious_thoughts",
    reasonCode: "lesson_complete",
  },
  copyKeys: {
    goal: {
      eyebrow: "starter_path.goal.eyebrow",
      title: "starter_path.goal.title",
      description: "starter_path.goal.description",
      choice: "starter_path.goal.choice",
      choiceDescription: "starter_path.goal.choice_description",
      continueButton: "starter_path.goal.continue_button",
    },
    lesson: {
      eyebrow: "starter_path.lesson.eyebrow",
      title: "starter_path.lesson.title",
      paragraphOne: "starter_path.lesson.paragraph_one",
      paragraphTwo: "starter_path.lesson.paragraph_two",
      continueButton: "starter_path.lesson.continue_button",
    },
    practice: {
      eyebrow: "starter_path.practice.eyebrow",
      title: "starter_path.practice.title",
      description: "starter_path.practice.description",
      toolTitle: "starter_path.practice.tool_title",
      toolDescription: "starter_path.practice.tool_description",
      openButton: "starter_path.practice.open_button",
      homeButton: "starter_path.practice.home_button",
      completionError: "starter_path.practice.completion_error",
    },
    boundary: "starter_path.boundary",
  },
};

export const FEEL_LESS_OVERWHELMED_STARTER_PATH: StarterPathV1 = {
  pathId: "feel_less_overwhelmed",
  pathVersion: 1,
  goalId: "feel_less_overwhelmed",
  courseId: "stress-steady-under-pressure",
  lessonNodeId: "stress-steady-under-pressure-l1",
  practiceRef: {
    source: "exercise_catalog",
    id: "grounding_54321",
  },
  reflectionPromptId: "stress_small_next_step",
  nextAction: {
    kind: "practice",
    targetId: "grounding_54321",
    pathId: "feel_less_overwhelmed",
    reasonCode: "lesson_complete",
  },
  copyKeys: {
    goal: {
      eyebrow: "starter_path.stress.goal.eyebrow",
      title: "starter_path.stress.goal.title",
      description: "starter_path.stress.goal.description",
      choice: "starter_path.stress.goal.choice",
      choiceDescription: "starter_path.stress.goal.choice_description",
      continueButton: "starter_path.stress.goal.continue_button",
    },
    lesson: {
      eyebrow: "starter_path.stress.lesson.eyebrow",
      title: "starter_path.stress.lesson.title",
      paragraphOne: "starter_path.stress.lesson.paragraph_one",
      paragraphTwo: "starter_path.stress.lesson.paragraph_two",
      continueButton: "starter_path.stress.lesson.continue_button",
    },
    practice: {
      eyebrow: "starter_path.stress.practice.eyebrow",
      title: "starter_path.stress.practice.title",
      description: "starter_path.stress.practice.description",
      toolTitle: "starter_path.stress.practice.tool_title",
      toolDescription: "starter_path.stress.practice.tool_description",
      openButton: "starter_path.stress.practice.open_button",
      homeButton: "starter_path.stress.practice.home_button",
      completionError: "starter_path.stress.practice.completion_error",
    },
    boundary: "starter_path.boundary",
  },
};

export const STARTER_PATHS = [
  ANXIOUS_THOUGHTS_STARTER_PATH,
  FEEL_LESS_OVERWHELMED_STARTER_PATH,
] as const;

export function getStarterPath(pathId: string | null | undefined): StarterPathV1 {
  return (
    STARTER_PATHS.find((path) => path.pathId === pathId) ??
    ANXIOUS_THOUGHTS_STARTER_PATH
  );
}
