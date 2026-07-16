import React, { useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { Stack } from "expo-router";
import { Host, Picker, Text as SwiftUIText } from "@expo/ui/swift-ui";
import { pickerStyle, tag, tint } from "@expo/ui/swift-ui/modifiers";
import { SAGE } from "@/lib/tokens";

import { DaysTimelineTab } from "@/src/screens/Timelines/tabs/DaysTimelineTab";
import { WeeksTimelineTab } from "@/src/screens/Timelines/tabs/WeeksTimelineTab";
import { MonthsTimelineTab } from "@/src/screens/Timelines/tabs/MonthsTimelineTab";

export default function TimelinesScreen() {
  const [activeTab, setActiveTab] = useState<"days" | "weeks" | "months">(
    "days",
  );

  const handleSelectionChange = (selection: unknown) => {
    if (typeof selection === "string") {
      if (selection === "Days") setActiveTab("days");
      if (selection === "Weeks") setActiveTab("weeks");
      if (selection === "Months") setActiveTab("months");
    }
  };

  const selectedLabel =
    activeTab === "days" ? "Days" : activeTab === "weeks" ? "Weeks" : "Months";

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
        {activeTab === "days" && <DaysTimelineTab />}
        {activeTab === "weeks" && <WeeksTimelineTab />}
        {activeTab === "months" && <MonthsTimelineTab />}
      </View>
    </View>
  );
}
