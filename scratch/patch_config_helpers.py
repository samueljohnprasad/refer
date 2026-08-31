import re

path = "src/components/exercise/courseExerciseCategoryConfig.ts"
with open(path, "r") as f:
    content = f.read()

# Add getSelectedOptionFeedback to feedback
content = content.replace(
    "  feedback?: Record<string, unknown>;",
    "  feedback?: {\n    getSelectedOptionFeedback?: (exercise: Exercise, response?: Record<string, unknown> | null) => string | null;\n  };"
)

# Add buildRetryResponse to interaction
content = content.replace(
    "getPrimaryTransition?: (exercise: Exercise, response: Record<string, unknown>) => CoursePrimaryTransition | null;",
    "getPrimaryTransition?: (exercise: Exercise, response: Record<string, unknown>) => CoursePrimaryTransition | null;\n  buildRetryResponse?: (exercise: Exercise, response: Record<string, unknown>) => Record<string, unknown> | null;"
)

with open(path, "w") as f:
    f.write(content)
