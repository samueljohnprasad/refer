import { useTranslation } from "react-i18next";
import { View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ZapIcon } from "@hugeicons/core-free-icons";
import { Text } from "@/src/components/ui/Text";
import { TouchableGlass } from "@/src/components/touchable-glass";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

type ExercisesTab = "discover" | "log";

interface ExercisesTabHeaderProps {
  activeTab: ExercisesTab;
  completedCount: number;
  tabPillStyle: AnimatedStyle<ViewStyle>;
  onTabChange: (tab: ExercisesTab) => void;
}

export function ExercisesTabHeader({
  activeTab,
  completedCount,
  tabPillStyle,
  onTabChange,
}: ExercisesTabHeaderProps) {
  const { t } = useTranslation("exercises");
  const options = [
    { value: "discover", label: t("tab.lessons") },
    { value: "log", label: t("tab.myLog") },
  ] as const;

  return (
    <GlassView
      glassEffectStyle="regular"
      style={{
        borderBottomWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowColor: "transparent",
        overflow: "hidden",
      }}
    >
      <SafeAreaView edges={["top"]}>
        <View className="px-5 pb-3 pt-3">
          <View className="mb-5">
            <View className="flex-row items-center justify-between pt-2">
              <Text variant="body-bold" className="text-[32px] leading-[38px] tracking-tight">
                {t("title")}
              </Text>
              <View className="flex-row items-center gap-3">
                {completedCount > 0 ? (
                  <View
                    accessibilityLabel={t("tab.completedCount", { count: completedCount })}
                    className="flex-row items-center justify-center rounded-full bg-sage-50/80 px-3 py-1.5"
                  >
                    <HugeiconsIcon icon={ZapIcon} size={16} color={SEMANTIC_COLORS.brand.pressed} />
                    <Text variant="chip" className="ml-1.5 font-nunito-bold text-sage-700">
                      {completedCount}
                    </Text>
                  </View>
                ) : null}
                <TouchableGlass
                  onPress={() => router.push("/tabs/screens/coping-cards" as never)}
                  accessibilityRole="button"
                  accessibilityLabel={t("tab.copingCards")}
                  hitSlop={8}
                  className="w-9 h-9 rounded-full items-center justify-center"
                >
                  <SymbolView name="bookmark" size={18} tintColor={SEMANTIC_COLORS.brand.pressed} weight="medium" />
                </TouchableGlass>
              </View>
            </View>
          </View>
          <Animated.View style={tabPillStyle} className="w-full">
            <Host style={{ width: "100%", height: 36 }}>
              <Picker
                modifiers={[pickerStyle("segmented"), tint(SEMANTIC_COLORS.brand.pressed)]}
                label={t("tab.view")}
                selection={activeTab}
                onSelectionChange={(selection) => {
                  if (selection === "discover" || selection === "log") onTabChange(selection);
                }}
              >
                {options.map((option) => (
                  <SwiftUIText key={option.value} modifiers={[tag(option.value)]}>
                    {option.label}
                  </SwiftUIText>
                ))}
              </Picker>
            </Host>
          </Animated.View>
        </View>
      </SafeAreaView>
    </GlassView>
  );
}
