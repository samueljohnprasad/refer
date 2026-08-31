import os

for root, _, files in os.walk("src"):
    for file in files:
        if file.endswith((".tsx", ".ts")):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            original_content = content
            content = content.replace(r'courseExerciseTheme\"', 'courseExerciseTheme"')
            
            if content != original_content:
                with open(path, "w") as f:
                    f.write(content)
