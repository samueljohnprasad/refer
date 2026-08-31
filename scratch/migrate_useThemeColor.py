import re

def migrate_journal():
    with open('src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx', 'r') as f:
        content = f.read()
    
    content = content.replace('import { useThemeColor } from "@/lib/useThemeColor";', 'import { SEMANTIC_COLORS } from "@/src/theme/colors";')
    content = content.replace('const theme = useThemeColor();\n', '')
    content = content.replace('theme.foreground', 'SEMANTIC_COLORS.text.primary')
    content = content.replace('theme.background', 'SEMANTIC_COLORS.surface.primary')
    
    with open('src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx', 'w') as f:
        f.write(content)

def migrate_text():
    with open('src/components/ui/Text.tsx', 'r') as f:
        content = f.read()
    
    content = content.replace('import { useThemeColor } from "@/lib/useThemeColor";', 'import { SEMANTIC_COLORS } from "@/src/theme/colors";')
    content = content.replace('const theme = useThemeColor();\n', '')
    content = content.replace('theme: ReturnType<typeof useThemeColor>,', '')
    content = re.sub(r'const resolvedColor = resolveTextColor\([^,]+,\s*theme\);', r'const resolvedColor = resolveTextColor(color, variant, opacity);', content)
    content = re.sub(r'resolveTextColor\(color:[^,]+,\s*variant:[^,]+,\s*opacity:[^,]+,\s*theme:[^\)]+\)', r'resolveTextColor(color: TextColor, variant: TextVariant, opacity?: number)', content)
    content = content.replace('theme.mutedForeground', 'SEMANTIC_COLORS.text.secondary')
    content = content.replace('theme.foreground', 'SEMANTIC_COLORS.text.primary')
    
    with open('src/components/ui/Text.tsx', 'w') as f:
        f.write(content)

def migrate_featured():
    with open('src/components/FeaturedPromptCard/FeaturedPromptCard.tsx', 'r') as f:
        content = f.read()
    
    content = content.replace('import { useThemeColor } from "@/lib/useThemeColor";', 'import { SEMANTIC_COLORS } from "@/src/theme/colors";')
    content = content.replace('const theme = useThemeColor();\n', '')
    content = content.replace('theme.foreground', 'SEMANTIC_COLORS.text.primary')
    
    with open('src/components/FeaturedPromptCard/FeaturedPromptCard.tsx', 'w') as f:
        f.write(content)

migrate_journal()
migrate_text()
migrate_featured()
print("Migration done")
