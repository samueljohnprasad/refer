import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, type ViewStyle } from "react-native";
import Animated, { type AnimatedStyle } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Text } from "@/src/components/ui/Text";
import { TouchableGlass } from "@/src/components/touchable-glass";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { HelpSheetModal } from "@/src/domains/home/ui/containers/HelpRowWithSheet";

type ExercisesTab = "discover" | "log";

interface ExercisesTabHeaderProps {
  activeTab: ExercisesTab;
  completedCount: number;
  tabPillStyle: AnimatedStyle<ViewStyle>;
  onTabChange: (tab: ExercisesTab) => void;
  onPracticePress: () => void;
}

export function ExercisesTabHeader({
  activeTab,
  completedCount,
  tabPillStyle,
  onTabChange,
  onPracticePress,
}: ExercisesTabHeaderProps) {
  const { t } = useTranslation("exercises");
  const [helpOpen, setHelpOpen] = useState(false);
  const options = [
    { value: "discover", label: t("tab.lessons") },
    { value: "log", label: t("tab.myLog") },
    { value: "practice", label: t("tab.practice") },
  ] as const;
  const selectionHandlers: Record<string, () => void> = {
    discover: () => onTabChange("discover"),
    log: () => onTabChange("log"),
    practice: onPracticePress,
  };

  return (
    <View className="bg-white border-b border-happy-sep">
      <SafeAreaView edges={["top"]}>
        <View className="px-4 pb-3 pt-2">
          <View className="mb-2">
            <View className="flex-row items-center justify-between min-h-[44px]">
              <Text className="happy-font-heading text-[28px] leading-[32px] tracking-tight text-happy-label">
                {t("title")}
              </Text>
              <View className="flex-row items-center gap-1">
                {completedCount > 0 ? (
                  <View
                    accessibilityLabel={t("tab.completedCount", { count: completedCount })}
                    className="h-8 items-center justify-center rounded-full px-3 mr-1 bg-[#e5ede1]"
                  >
                    <Text className="happy-font-body-bold text-[13px] text-[#29452a]">
                      {t("tab.doneCount", { count: completedCount })}
                    </Text>
                  </View>
                ) : null}
                <TouchableGlass
                  onPress={() => router.push("/tabs/screens/coping-cards" as never)}
                  accessibilityRole="button"
                  accessibilityLabel={t("tab.copingCards")}
                  hitSlop={8}
                  className="w-11 h-11 rounded-full items-center justify-center"
                >
                  <SymbolView name="bookmark" size={20} tintColor="#44633f" weight="medium" />
                </TouchableGlass>
                <TouchableGlass
                  onPress={() => setHelpOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t("tab.support")}
                  hitSlop={8}
                  className="w-11 h-11 rounded-full items-center justify-center"
                >
                  <SymbolView name="lifepreserver" size={20} tintColor="#44633f" weight="medium" />
                </TouchableGlass>
              </View>
            </View>
          </View>
          <Animated.View style={tabPillStyle} className="w-full">
            <View
              role="tablist"
              accessibilityLabel={t("tab.view")}
              className="flex-row p-[2px] gap-[2px] rounded-xl bg-happy-surface-2 mt-2"
            >
              {options.map((option) => {
                const isSelected = activeTab === option.value;
                return (
                  <Pressable
                    key={option.value}
                    role="tab"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={option.label}
                    onPress={() => selectionHandlers[option.value]?.()}
                    className={`flex-1 min-h-[36px] items-center justify-center rounded-[10px] ${
                      isSelected
                        ? "bg-white shadow-sm"
                        : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-[15px] ${
                        isSelected
                          ? "happy-font-body-semibold text-happy-label"
                          : "happy-font-body-semibold text-happy-label-2"
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
      <HelpSheetModal visible={helpOpen} onClose={() => setHelpOpen(false)} />
    </View>
  );
}
