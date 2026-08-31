import re

path = "src/domains/journey/learning/courseExercisePrimaryTransition.ts"
with open(path, "r") as f:
    content = f.read()

# Make sure resolveCourseExerciseConfig is imported
if "resolveCourseExerciseConfig" not in content:
    content = "import { resolveCourseExerciseConfig } from '@/src/components/exercise/courseExerciseCategoryConfig';\n" + content

# Refactor getCoursePrimaryLabel
content = re.sub(
r"""  const category = resolveCourseExerciseCategory\(exercise\);\s*switch \(category\) \{[\s\S]*?default:\s*return null;\s*\}""",
r"""  const config = resolveCourseExerciseConfig(exercise);
  if (config.interaction?.getPrimaryLabel) {
    return config.interaction.getPrimaryLabel(exercise, response);
  }
  return null;""",
content)

# Refactor getCoursePrimaryTransition
content = re.sub(
r"""  const category = resolveCourseExerciseCategory\(exercise\);\s*switch \(category\) \{[\s\S]*?default:\s*return null;\s*\}""",
r"""  const config = resolveCourseExerciseConfig(exercise);
  if (config.interaction?.getPrimaryTransition) {
    return config.interaction.getPrimaryTransition(exercise, response);
  }
  return null;""",
content)

with open(path, "w") as f:
    f.write(content)
