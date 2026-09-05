import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { SafeAreaView } from "@/src/components/tw";
import { Stack, useRouter } from "expo-router";
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
import { ChevronLeft } from "lucide-react-native";
import { IMessageStack } from "@/src/animations/imessage-stack";

import { DaysTimelineTab } from "@/src/domains/timeline/ui/tabs/DaysTimelineTab";
import { WeeksTimelineTab } from "@/src/domains/timeline/ui/tabs/WeeksTimelineTab";
import { MonthsTimelineTab } from "@/src/domains/timeline/ui/tabs/MonthsTimelineTab";

export default function TimelinesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"days" | "weeks" | "months">(
    "days",
  );
  const [isStackModalOpen, setIsStackModalOpen] = useState(false);

  const handleSelectionChange = (selection: unknown) => {
    if (typeof selection === "string") {
      if (selection === "Days") setActiveTab("days");
      if (selection === "Weeks") setActiveTab("weeks");
      if (selection === "Months") setActiveTab("months");
    }
  };

  const selectedLabel =
    activeTab === "days" ? "Days" : activeTab === "weeks" ? "Weeks" : "Months";

  const handleOpenModal = () => {
    setIsStackModalOpen(true);
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
                  selection={selectedLabel}
                  onSelectionChange={handleSelectionChange}
                >
                  <SwiftUIText modifiers={[tag("Days")]}>Days</SwiftUIText>
                  <SwiftUIText modifiers={[tag("Weeks")]}>Weeks</SwiftUIText>
                  <SwiftUIText modifiers={[tag("Months")]}>Months</SwiftUIText>
                </Picker>
              </Host>
            </View>
          ),
          headerLeft: () => (
            // Aligned native back button, small footprint but large hit target (Point 16, 17, 18)
            <Pressable onPress={() => router.back()} className="px-2 py-2 ml-[-8px]">
              <ChevronLeft size={24} color="#1A1A1A" strokeWidth={2.5} />
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

      <Host>
        <BottomSheet
          isPresented={isStackModalOpen}
          onIsPresentedChange={(val) => {
            if (!val) setIsStackModalOpen(false);
          }}
        >
          <Group
            modifiers={[
              presentationDetents(["medium"]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <SafeAreaView
                edges={["bottom"]}
                style={{
                  flex: 1,
                  width: "100%",
                  backgroundColor: "transparent",
                }}
              >
                <View className="flex-1 justify-center bg-transparent w-full py-4">
                  <IMessageStack />
                </View>
              </SafeAreaView>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </View>
  );
}
