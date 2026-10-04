import React, { useState } from "react";
import { View, Pressable, Modal, ScrollView } from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Host,
  Picker,
  Text as SwiftUIText,
  BottomSheet,
  Group,
  RNHostView,
} from "@expo/ui/swift-ui";
import {
  pickerStyle,
  tag,
  tint,
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { BlurView } from "expo-blur";
// ponytail: use native expo-symbols instead of lucide
import { SymbolView } from "expo-symbols";
import { Text as AppText } from "@/src/components/ui/Text";
import type { AiInsight } from "@/src/domains/timeline/model/timeline.types";

import { DaysTimelineTab } from "@/src/domains/timeline/ui/tabs/DaysTimelineTab";
import { WeeksTimelineTab } from "@/src/domains/timeline/ui/tabs/WeeksTimelineTab";
import { MonthsTimelineTab } from "@/src/domains/timeline/ui/tabs/MonthsTimelineTab";

export default function TimelinesScreen() {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [activeTab, setActiveTab] = useState<"days" | "weeks" | "months">(
    "days",
  );
  const [isInsightModalVisible, setIsInsightModalVisible] = useState(false);
  const [isInsightSheetPresented, setIsInsightSheetPresented] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<AiInsight | null>(null);

  const handleSelectionChange = (selection: unknown) => {
    if (typeof selection === "string") {
      if (selection === "days") setActiveTab("days");
      if (selection === "weeks") setActiveTab("weeks");
      if (selection === "months") setActiveTab("months");
    }
  };

  const handleOpenModal = (insight: AiInsight) => {
    setSelectedInsight(insight);
    setIsInsightModalVisible(true);
    setIsInsightSheetPresented(true);
  };

  return (
    <View className="flex-1 bg-brand-surface">
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerBackground: () => (
            // A clear, transparent/frosted material that prevents harsh content collision
            <BlurView intensity={70} tint="light" style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.4)' }} />
          ),
          headerTitle: () => (
            <View className="items-center justify-center">
              <Host style={{ width: 200, height: 32 }}>
                <Picker
                  modifiers={[pickerStyle("segmented"), tint(SEMANTIC_COLORS.brand.pressed)]}
                  selection={activeTab}
                  onSelectionChange={handleSelectionChange}
                >
                  <SwiftUIText modifiers={[tag("days")]}>{t("timeline.days")}</SwiftUIText>
                  <SwiftUIText modifiers={[tag("weeks")]}>{t("timeline.weeks")}</SwiftUIText>
                  <SwiftUIText modifiers={[tag("months")]}>{t("timeline.months")}</SwiftUIText>
                </Picker>
              </Host>
            </View>
          ),
          headerLeft: () => (
            // Aligned native back button, small footprint but large hit target (Point 16, 17, 18)
            <Pressable onPress={() => router.back()} className="px-2 py-2 ml-[-8px]">
              <SymbolView name="chevron.left" size={20} tintColor="#1A1A1A" weight="semibold" />
            </Pressable>
          ),
          headerRight: () => null,
        }}
      />
      <View className="flex-1">
        {activeTab === "days" && (
          <DaysTimelineTab onOpenModal={handleOpenModal} />
        )}
        {activeTab === "weeks" && (
          <WeeksTimelineTab onOpenModal={handleOpenModal} />
        )}
        {activeTab === "months" && (
          <MonthsTimelineTab onOpenModal={handleOpenModal} />
        )}
      </View>

      <Modal
        visible={isInsightModalVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => setIsInsightSheetPresented(false)}
      >
        <Host>
          <BottomSheet
            isPresented={isInsightSheetPresented}
            onIsPresentedChange={setIsInsightSheetPresented}
            onDismiss={() => {
              setSelectedInsight(null);
              setIsInsightModalVisible(false);
            }}
          >
            <Group
              modifiers={[
                presentationDetents(["medium", "large"]),
                presentationDragIndicator("visible"),
              ]}
            >
              <RNHostView>
                <SafeAreaView edges={["bottom"]} className="flex-1 w-full">
                  <ScrollView
                    className="flex-1 w-full"
                    contentContainerClassName="px-6 py-6"
                    showsVerticalScrollIndicator={false}
                  >
                    <AppText variant="h2" className="mb-4">
                      {t("timeline.viewInsight")}
                    </AppText>
                    {selectedInsight ? (
                      <AppText variant="body">{selectedInsight.summary}</AppText>
                    ) : null}
                  </ScrollView>
                </SafeAreaView>
              </RNHostView>
            </Group>
          </BottomSheet>
        </Host>
      </Modal>
    </View>
  );
}
