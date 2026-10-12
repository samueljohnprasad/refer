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
