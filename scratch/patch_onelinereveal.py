import os

path = "src/exercises/OneLineReveal/config.ts"
with open(path, "r") as f:
    content = f.read()

interaction = """  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => response.revealed === true ? "Continue" : "Reveal the rest",
    getPrimaryTransition: (exercise, response) => response.revealed === true
      ? null
      : { kind: "response", ready: true, response: { ...response, revealed: true } },
  },"""

content = content.replace(
    "    unavailableCopy: \"This one-line reveal is not available yet.\",\n",
    f"    unavailableCopy: \"This one-line reveal is not available yet.\",\n{interaction}\n"
)

with open(path, "w") as f:
    f.write(content)
