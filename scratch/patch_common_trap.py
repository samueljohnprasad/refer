import re

path = "src/exercises/CommonTrap/config.ts"
with open(path, "r") as f:
    content = f.read()

interaction_block = """
  interaction: {
    submissionMode: "explicit",
    getPrimaryLabel: (exercise, response) => response.revealed === true ? "Continue" : "And then what happens?",
    getPrimaryTransition: (exercise, response) => response.revealed === true ? null : { kind: "response" as const, ready: true, response: { ...response, revealed: true } }
  },
"""

content = content.replace(
"""    unavailableCopy: "This common-trap exercise is not available yet.",
""",
f"""    unavailableCopy: "This common-trap exercise is not available yet.",{interaction_block}"""
)

with open(path, "w") as f:
    f.write(content)
