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
    exercises: exercises.map((item, orderIndex) => ({
      id: `${sourceId}-${item.sourceId}`,
      nodeId: sourceId,
      orderIndex,
      type: item.category,
      phase: item.phase,
      durationSeconds: item.durationSeconds,
      scaffoldLevel: item.scaffoldLevel,
      difficulty: item.difficulty,
      isScored: item.isScored,
      concept: item.concept,
      content: {
        category: item.category,
        format: item.category,
        ...item.content,
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
