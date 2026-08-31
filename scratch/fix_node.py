with open("src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts", "r") as f:
    content = f.read()

content = content.replace('import { darkenHex } from "@/src/utils/colorUtils";', '')

# Replace the block that sets faceColor
# We will explicitly set faceColor and rimColor
old_block = """  let faceColor: string = isDark ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.brand.soft;
  let iconColor: string = isDark ? SEMANTIC_COLORS.border.selected : SEMANTIC_COLORS.brand.pressed;
  let iconName = item.icon || "star";
  let isInteractive = false;
  let showProgressRing = false;
  let showTooltip = false;

  if (item.status === NodeStatus.COMPLETED) {
    faceColor = isDark ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.selection.foreground;
    iconColor = isDark ? SEMANTIC_COLORS.brand.soft : SEMANTIC_COLORS.brand.onSoft;
    iconName = NodeIcon.CHECKPOINT;
    isInteractive = true;
  } else if (item.status === NodeStatus.ACTIVE) {
    faceColor = SEMANTIC_COLORS.brand.primary;
    iconColor = "#FFFFFF";
    isInteractive = true;
    showProgressRing = true;
    showTooltip = true;
  }

  const rimColor = darkenHex(faceColor, 0.22);"""

new_block = """  let faceColor: string | import("react-native").OpaqueColorValue = isDark ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.brand.soft;
  let rimColor: string | import("react-native").OpaqueColorValue = isDark ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.brand.pressed;
  let iconColor: string | import("react-native").OpaqueColorValue = isDark ? SEMANTIC_COLORS.border.selected : SEMANTIC_COLORS.brand.pressed;
  let iconName = item.icon || "star";
  let isInteractive = false;
  let showProgressRing = false;
  let showTooltip = false;

  if (item.status === NodeStatus.COMPLETED) {
    faceColor = isDark ? SEMANTIC_COLORS.brand.onSoft : SEMANTIC_COLORS.selection.foreground;
    rimColor = isDark ? SEMANTIC_COLORS.brand.primary : SEMANTIC_COLORS.brand.pressed;
    iconColor = isDark ? SEMANTIC_COLORS.brand.soft : SEMANTIC_COLORS.brand.onSoft;
    iconName = NodeIcon.CHECKPOINT;
    isInteractive = true;
  } else if (item.status === NodeStatus.ACTIVE) {
    faceColor = SEMANTIC_COLORS.brand.primary;
    rimColor = SEMANTIC_COLORS.brand.pressed;
    iconColor = "#FFFFFF";
    isInteractive = true;
    showProgressRing = true;
    showTooltip = true;
  }"""

content = content.replace(old_block, new_block)

with open("src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts", "w") as f:
    f.write(content)
print("Done")
