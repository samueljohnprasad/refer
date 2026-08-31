import os

path = "src/exercises/ParadoxCard/config.ts"
with open(path, "r") as f:
    content = f.read()

interaction = """  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => response.revealed === true ? "Continue" : "Push the button above",
    getPrimaryTransition: (exercise, response) => null,
  },"""

content = content.replace(
    "    unavailableCopy: \"This paradox exercise is not available yet.\",\n",
    f"    unavailableCopy: \"This paradox exercise is not available yet.\",\n{interaction}\n"
)

with open(path, "w") as f:
    f.write(content)
