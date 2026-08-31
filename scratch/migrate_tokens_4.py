import os
import re

MAPPINGS = {
    # Imports
    r'import \{[^}]*THEME[^}]*\} from [\'"]@/lib/tokens[\'"];?': 'import { SEMANTIC_COLORS } from "@/src/theme/colors";',
    r'import \{ THEME \} from [\'"]@/lib/tokens[\'"];?': 'import { SEMANTIC_COLORS } from "@/src/theme/colors";',
    r'import \{[^}]*SAGE[^}]*\} from [\'"]@/lib/tokens[\'"];?': 'import { SEMANTIC_COLORS } from "@/src/theme/colors";',
    r'import \{[^}]*DANGER[^}]*\} from [\'"]@/lib/tokens[\'"];?': 'import { SEMANTIC_COLORS } from "@/src/theme/colors";',
    r'import \{[^}]*NEUTRAL[^}]*\} from [\'"]@/lib/tokens[\'"];?': 'import { SEMANTIC_COLORS } from "@/src/theme/colors";',
    r'import \{.*?\} from [\'"]@/lib/tokens[\'"];?': 'import { SEMANTIC_COLORS } from "@/src/theme/colors";',
    
    # THEME usages
    r'THEME\.backgroundPrimary': 'SEMANTIC_COLORS.surface.primary',
    r'THEME\.backgroundSecondary': 'SEMANTIC_COLORS.surface.secondary',
    r'THEME\.backgroundCard': 'SEMANTIC_COLORS.surface.primary',
    r'THEME\.textPrimary': 'SEMANTIC_COLORS.text.primary',
    r'THEME\.textSecondary': 'SEMANTIC_COLORS.text.secondary',
    r'THEME\.textDisabled': 'SEMANTIC_COLORS.text.disabled',
    r'THEME\.borderPrimary': 'SEMANTIC_COLORS.border.default',
    r'THEME\.borderSubtle': 'SEMANTIC_COLORS.border.subtle',
    r'THEME\.borderStrong': 'SEMANTIC_COLORS.border.strong',
    r'THEME\.tintPrimary': 'SEMANTIC_COLORS.brand.primary',
    r'THEME\.danger': 'SEMANTIC_COLORS.error.indicator',
    r'THEME\.success': 'SEMANTIC_COLORS.success.indicator',
    
    # SAGE usages
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
    
    # DANGER usages
    r'DANGER\[50\]': 'SEMANTIC_COLORS.error.surface',
    r'DANGER\[100\]': 'SEMANTIC_COLORS.error.surface',
    r'DANGER\[500\]': 'SEMANTIC_COLORS.error.indicator',
    r'DANGER\[600\]': 'SEMANTIC_COLORS.error.indicator',
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
