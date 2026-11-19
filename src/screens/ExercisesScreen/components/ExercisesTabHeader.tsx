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
    <View
      style={{
        backgroundColor: "#FCFDFB",
        borderBottomWidth: 1,
        borderBottomColor: "#EEF2EC",
      }}
    >
      <SafeAreaView edges={["top"]}>
        <View className="px-5 pb-3 pt-3">
          <View className="mb-5">
            <View className="flex-row items-center justify-between pt-2">
              <Text variant="h1" className="text-[32px] leading-[38px] tracking-tight">
                {t("title")}
              </Text>
              <View className="flex-row items-center gap-3">
                {completedCount > 0 ? (
                  <View
                    accessibilityLabel={t("tab.completedCount", { count: completedCount })}
                    className="items-center justify-center rounded-full px-3 py-1.5"
                    style={{ backgroundColor: "#e5ede1" }}
                  >
                    <Text variant="chip" className="font-nunito-bold text-sage-700">
                      {t("tab.doneCount", { count: completedCount })}
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
                <TouchableGlass
                  onPress={() => setHelpOpen(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t("tab.support")}
                  hitSlop={8}
                  className="w-9 h-9 rounded-full items-center justify-center"
                >
                  <SymbolView name="lifepreserver" size={18} tintColor={SEMANTIC_COLORS.brand.pressed} weight="medium" />
                </TouchableGlass>
              </View>
            </View>
          </View>
          <Animated.View style={tabPillStyle} className="w-full">
            <View
              role="tablist"
              accessibilityLabel={t("tab.view")}
              className="flex-row p-1 rounded-2xl bg-happy-surface-2 border border-happy-sep/50"
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
                    className={`flex-1 py-1.5 items-center justify-center rounded-xl ${
                      isSelected
                        ? "bg-white shadow-sm border border-black/5"
                        : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-[15px] ${
                        isSelected
                          ? "happy-font-body-bold text-happy-label"
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
