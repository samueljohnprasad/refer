with open("src/components/exercise/courseExerciseTheme.ts", "r") as f:
    content = f.read()

content = content.replace(
    "border: {\n    default: string;\n    selected: string;\n  };",
    "border: {\n    default: string;\n    selected: string;\n  };\n  shadow: string;"
)

content = content.replace(
    "border: {\n    default: adaptiveColor(BRAND_BORDER, BRAND_DARK.border),\n    selected: adaptiveColor(SAGE[400], SAGE[300]),\n  },",
    "border: {\n    default: adaptiveColor(BRAND_BORDER, BRAND_DARK.border),\n    selected: adaptiveColor(SAGE[400], SAGE[300]),\n  },\n  shadow: adaptiveColor(SAGE[800], \"#000000\"),"
)

with open("src/components/exercise/courseExerciseTheme.ts", "w") as f:
    f.write(content)
