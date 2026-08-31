import os
import re

MAPPINGS = {
    r'SAGE\[50\]': 'SEMANTIC_COLORS.selection.surface',
    r'SAGE\[100\]': 'SEMANTIC_COLORS.brand.soft',
    r'SAGE\[200\]': 'SEMANTIC_COLORS.selection.foreground',
    r'SAGE\[300\]': 'SEMANTIC_COLORS.border.selected',
    r'SAGE\[400\]': 'SEMANTIC_COLORS.brand.primary',
    r'SAGE\[500\]': 'SEMANTIC_COLORS.brand.primary',
    r'SAGE\[600\]': 'SEMANTIC_COLORS.brand.pressed',
    r'SAGE\[700\]': 'SEMANTIC_COLORS.brand.onSoft',
    r'SAGE\[800\]': 'SEMANTIC_COLORS.brand.onSoft',
    r'SAGE\.selected': 'SEMANTIC_COLORS.selection.surface',
    r'SAGE\.pill': 'SEMANTIC_COLORS.selection.surface',
    r'SAGE_OVERLAY\.clear': '"transparent"',
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
    dirs_to_sweep = ['src/components', 'src/screens', 'src/domains', 'app']
    for d in dirs_to_sweep:
        for root, dirs, files in os.walk(d):
            if 'exercise' in root.split(os.sep): 
                continue
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    migrate_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
