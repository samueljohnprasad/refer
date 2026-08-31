import os
import re

MAPPINGS = {
    # Tints
    r'\bOTTER_BLUE_TINT\b': 'SEMANTIC_COLORS.info.surface',
    r'\bTERRACOTTA_TINT\b': 'SEMANTIC_COLORS.error.surface',
    r'\bGOLD_TINT\b': 'SEMANTIC_COLORS.warning.surface',
    r'\bMACAW_PURPLE\b': 'SEMANTIC_COLORS.brand.soft',
    
    # Brand
    r'\bBRAND_DARK\.surface\b': 'SEMANTIC_COLORS.surface.primary',
    r'\bBRAND_DARK\b': 'SEMANTIC_COLORS.surface.primary',
    r'\bBRAND_BORDER\b': 'SEMANTIC_COLORS.border.default',
    r'\bBRAND_SURFACE_SOFT\b': 'SEMANTIC_COLORS.surface.secondary',
    r'\bINK_MUTED\b': 'SEMANTIC_COLORS.text.disabled',
    
    # Danger
    r'\bDANGER\[[0-9]+\]': 'SEMANTIC_COLORS.error.indicator',
    r'\bDANGER\b': 'SEMANTIC_COLORS.error.indicator',
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
    dirs_to_sweep = ['app', 'src']
    for d in dirs_to_sweep:
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    migrate_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
