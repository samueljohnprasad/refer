import re

with open('src/data/exerciseIconRegistry.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('import { SAGE, OTTER_BLUE, GOLD, MACAW_PURPLE } from "@/lib/tokens";', 'import { SEMANTIC_COLORS } from "@/src/theme/colors";')
content = content.replace('cbt_core: { iconBg: "bg-sage-50", iconColor: SAGE[600], eyebrowColor: "text-sage-500" },', 'cbt_core: { iconBg: "bg-surface-secondary", iconColor: SEMANTIC_COLORS.brand.primary as string, eyebrowColor: "text-brand-primary" },')
content = content.replace('mindfulness: { iconBg: "bg-otter-blue/10", iconColor: OTTER_BLUE, eyebrowColor: "text-otter-blue" },', 'mindfulness: { iconBg: "bg-surface-secondary", iconColor: SEMANTIC_COLORS.info.indicator as string, eyebrowColor: "text-info-indicator" },')
content = content.replace('anxiety: { iconBg: "bg-gold/10", iconColor: GOLD, eyebrowColor: "text-bee-yellow" },', 'anxiety: { iconBg: "bg-surface-secondary", iconColor: SEMANTIC_COLORS.warning.indicator as string, eyebrowColor: "text-warning-indicator" },')
content = content.replace('overthinking: { iconBg: "bg-macaw-purple/10", iconColor: MACAW_PURPLE, eyebrowColor: "text-macaw-purple" },', 'overthinking: { iconBg: "bg-surface-secondary", iconColor: SEMANTIC_COLORS.error.indicator as string, eyebrowColor: "text-error-indicator" },')

with open('src/data/exerciseIconRegistry.ts', 'w', encoding='utf-8') as f:
    f.write(content)
