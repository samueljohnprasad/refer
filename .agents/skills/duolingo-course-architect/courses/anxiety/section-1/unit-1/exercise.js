export function defineLesson({
  sourceId,
  title,
  objective,
  concepts,
  durationMinutes,
  exercises,
}) {
  return {
    sourceId,
    title,
    objective,
    concepts,
    durationMinutes,
    exercises: exercises.map((exercise, orderIndex) => ({
      id: `${sourceId}-${exercise.sourceId}`,
      nodeId: sourceId,
      orderIndex,
      type: exercise.category,
      phase: exercise.phase,
      durationSeconds: exercise.durationSeconds,
      scaffoldLevel: exercise.scaffoldLevel,
      difficulty: exercise.difficulty,
      isScored: exercise.isScored,
      concept: exercise.concept,
      content: {
        category: exercise.category,
        format: exercise.category,
        ...exercise.content,
      },
    })),
  };
}

export function exercise({
  sourceId,
  category,
  phase,
  concept,
  content,
  durationSeconds = 45,
  scaffoldLevel = 2,
  difficulty = 0.2,
  isScored = false,
}) {
  return {
    sourceId,
    category,
    phase,
    concept,
    content,
    durationSeconds,
    scaffoldLevel,
    difficulty,
    isScored,
  };
}
