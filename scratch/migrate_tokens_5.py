import os
import re

MAPPINGS = {
    r'\bINK\b': 'SEMANTIC_COLORS.text.primary',
    r'\bINK_SOFT\b': 'SEMANTIC_COLORS.text.secondary',
}

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content

    for pattern, replacement in MAPPINGS.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Migrated {filepath}")

def main():
    dirs_to_sweep = ['src/exercises', 'src/hooks', 'src/lib']
    for d in dirs_to_sweep:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    migrate_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
