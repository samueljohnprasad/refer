import React, { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { Host, Picker, Text as SwiftUIText, BottomSheet } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint, presentationDetents, presentationDragIndicator } from "@expo/ui/swift-ui/modifiers";
import { SAGE } from "@/lib/tokens";
import { IMessageStack } from "@/src/animations/imessage-stack";

import { DaysTimelineTab } from "@/src/screens/Timelines/tabs/DaysTimelineTab";
import { WeeksTimelineTab } from "@/src/screens/Timelines/tabs/WeeksTimelineTab";
import { MonthsTimelineTab } from "@/src/screens/Timelines/tabs/MonthsTimelineTab";

export default function TimelinesScreen() {
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
          headerBackButtonDisplayMode: "minimal",
          headerTitle: () => (
            <View className="items-center justify-center pt-2">
              <Host style={{ width: 220, height: 32 }}>
                <Picker
                  modifiers={[pickerStyle("segmented"), tint(SAGE[600])]}
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
        }}
      />
      <View className="flex-1">
        {activeTab === "days" && <DaysTimelineTab onOpenModal={handleOpenModal} />}
        {activeTab === "weeks" && <WeeksTimelineTab onOpenModal={handleOpenModal} />}
        {activeTab === "months" && <MonthsTimelineTab onOpenModal={handleOpenModal} />}
      </View>

      <Host>
        <BottomSheet
          isPresented={isStackModalOpen}
          onIsPresentedChange={setIsStackModalOpen}
          modifiers={[
            presentationDetents(["medium", "large"]),
            presentationDragIndicator("visible"),
          ]}
        >
          <View style={{ flex: 1, backgroundColor: "transparent", justifyContent: "center", alignItems: "center" }}>
            <IMessageStack />
          </View>
        </BottomSheet>
      </Host>
    </View>
  );
}
