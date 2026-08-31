import os
import re

MAPPINGS = {
    r'\bTHEME\.backgroundPrimary\b': 'SEMANTIC_COLORS.surface.canvas',
    r'\bTHEME\.backgroundSecondary\b': 'SEMANTIC_COLORS.surface.secondary',
    r'\bTHEME\.backgroundCard\b': 'SEMANTIC_COLORS.surface.primary',
    r'\bTHEME\.textPrimary\b': 'SEMANTIC_COLORS.text.primary',
    r'\bTHEME\.textSecondary\b': 'SEMANTIC_COLORS.text.secondary',
    r'\bTHEME\.border\b': 'SEMANTIC_COLORS.border.default',
    r'\bTHEME\.purpleLight\b': 'SEMANTIC_COLORS.info.surface', # approximate
    r'\bTHEME\.purplePrimary\b': 'SEMANTIC_COLORS.info.border',
    r'\bTHEME\.purpleDeep\b': 'SEMANTIC_COLORS.info.foreground',
    
    r'\bBRAND_CANVAS\b': 'SEMANTIC_COLORS.surface.canvas',
    r'\bBRAND_SURFACE\b': 'SEMANTIC_COLORS.surface.primary',
    r'\bBRAND_SURFACE_SOFT\b': 'SEMANTIC_COLORS.surface.secondary',
    r'\bMASCOT_STAGE\b': 'SEMANTIC_COLORS.surface.primary',
    r'\bCREAM\b': 'SEMANTIC_COLORS.surface.canvas',
    r'\bCREAM_RAISED\b': 'SEMANTIC_COLORS.surface.primary',
    r'\bWARM_WHITE\b': 'SEMANTIC_COLORS.surface.canvas',
    r'\bOFFWHITE\b': 'SEMANTIC_COLORS.surface.primary',
    r'\bBRAND_BORDER\b': 'SEMANTIC_COLORS.border.default',
    r'\bBRAND_BORDER_STRONG\b': 'SEMANTIC_COLORS.border.strong',
    
    r'\bSAGE\[50\]\b': 'SEMANTIC_COLORS.selection.surface',
    r'\bSAGE\[100\]\b': 'SEMANTIC_COLORS.brand.soft',
    r'\bSAGE\[200\]\b': 'SEMANTIC_COLORS.selection.foreground',
    r'\bSAGE\[300\]\b': 'SEMANTIC_COLORS.border.selected',
    r'\bSAGE\[400\]\b': 'SEMANTIC_COLORS.brand.primary',
    r'\bSAGE\[500\]\b': 'SEMANTIC_COLORS.brand.primary',
    r'\bSAGE\[600\]\b': 'SEMANTIC_COLORS.brand.pressed',
    r'\bSAGE\[700\]\b': 'SEMANTIC_COLORS.brand.onSoft',
    r'\bSAGE\[800\]\b': 'SEMANTIC_COLORS.brand.onSoft',
    r'\bSAGE\.selected\b': 'SEMANTIC_COLORS.selection.surface',
    r'\bSAGE\.pill\b': 'SEMANTIC_COLORS.selection.surface',
    
    r'\bSAGE_OVERLAY\.clear\b': '"transparent"',
    r'\bTRANSPARENT\b': '"transparent"',
    
    r'\bINK\b': 'SEMANTIC_COLORS.text.primary',
    r'\bINK_SOFT\b': 'SEMANTIC_COLORS.text.secondary',
    r'\bINK_MUTED\b': 'SEMANTIC_COLORS.text.tertiary',
    
    r'\bDANGER\b': 'SEMANTIC_COLORS.error.foreground',
}

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content

    # Replace usages
    for pattern, replacement in MAPPINGS.items():
        content = re.sub(pattern, replacement, content)
        
    # Replace single string aliases where they might be bare like TERRACOTTA
    content = re.sub(r'\bTERRACOTTA\b', 'SEMANTIC_COLORS.error.foreground', content)
    content = re.sub(r'\bGOLD\b', 'SEMANTIC_COLORS.warning.foreground', content)
    content = re.sub(r'\bOTTER_BLUE\b', 'SEMANTIC_COLORS.info.indicator', content)
    
    # Imports fixing
    if 'SEMANTIC_COLORS' in content and 'SEMANTIC_COLORS' not in original_content:
        # We added SEMANTIC_COLORS, need to import it
        # If lib/tokens was imported, replace it with SEMANTIC_COLORS
        if 'lib/tokens' in content:
            content = re.sub(r'import\s+\{[^}]*\}\s+from\s+["\']@?/lib/tokens["\'];?', 'import { SEMANTIC_COLORS } from "@/src/theme/colors";\nimport { RADIUS } from "@/src/theme/radius";', content)
        else:
            # just inject it at the top
            content = 'import { SEMANTIC_COLORS } from "@/src/theme/colors";\n' + content
    else:
        # Maybe just removed it
        if 'lib/tokens' in content:
            content = re.sub(r'import\s+\{[^}]*\}\s+from\s+["\']@?/lib/tokens["\'];?', 'import { SEMANTIC_COLORS } from "@/src/theme/colors";\nimport { RADIUS } from "@/src/theme/radius";', content)

    # Some manual fixes for leftover { THEME } imports
    content = re.sub(r'import\s+\{\s*THEME\s*\}\s+from\s+["\'][^"\']*["\'];?', '', content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Migrated {filepath}")

def main():
    dirs_to_sweep = ['src/components', 'src/screens', 'src/domains', 'app']
    for d in dirs_to_sweep:
        for root, dirs, files in os.walk(d):
            if 'exercise' in root.split(os.sep): # Skip exercise as it's already migrated mostly
                continue
            for file in files:
                if file.endswith(('.ts', '.tsx')):
                    migrate_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
