import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { EmotionRadarChart } from "@/src/components/charts/EmotionRadarChart";
import { LifeDomainBalanceWheel } from "@/src/components/charts/LifeDomainBalanceWheel";
import { Text } from "@/src/components/ui/Text";
import { FluxChartScreen } from "@/src/screens/FluxChartScreen/FluxChartScreen";
import { NutrieScreen } from "@/src/screens/NutrieScreen/NutrieScreen";
import GlowyInput from "@/src/components/GlowyInput";
import { ExclusionTabs } from "@/src/animations/exclusion-tabs";

const mockEmotionData = [
  { emotion: "Joy", score: 85, count: 5 },
  { emotion: "Gratitude", score: 75, count: 4 },
  { emotion: "Anxiety", score: 30, count: 2 },
  { emotion: "Peace", score: 70, count: 4 },
  { emotion: "Sadness", score: 20, count: 1 },
  { emotion: "Fear", score: 10, count: 1 },
];

const mockLifeDomainData = [
  { domain: "Work/Career", score: 65, trend: "improving" as const, attention_needed: false, insights: "Steady progress in current projects" },
  { domain: "Relationships", score: 85, trend: "stable" as const, attention_needed: false, insights: "Strong connections with close friends" },
  { domain: "Health", score: 40, trend: "declining" as const, attention_needed: true, insights: "Sleep schedule has been erratic" },
  { domain: "Personal Growth", score: 75, trend: "improving" as const, attention_needed: false, insights: "Reading habit is paying off" },
  { domain: "Recreation", score: 50, trend: "stable" as const, attention_needed: false, insights: "Need more time for hobbies" },
  { domain: "Spirituality", score: 60, trend: "stable" as const, attention_needed: false, insights: "Consistent meditation practice" },
];

export default function TestChartsScreen() {
  const [message, setMessage] = useState("");

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ title: "Test Charts & UI", headerBackTitle: "Back" }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Flux Chart</Text>
        <View style={{ height: 500, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          {/* We wrap the full screen in a fixed height container so it doesn't expand infinitely */}
          <FluxChartScreen />
        </View>

        <View style={{ height: 32 }} />

        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Nutrie Dashboard</Text>
        <View style={{ height: 600, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <NutrieScreen />
        </View>

        <View style={{ height: 32 }} />

        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Emotion Radar Chart</Text>
        <EmotionRadarChart 
          startDate={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
          endDate={new Date()}
          data={mockEmotionData}
          emotionInsight="You've been feeling mostly joyful and peaceful this week. Keep it up!"
        />
        
        <View style={{ height: 32 }} />
        
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Life Domain Balance Wheel</Text>
        <LifeDomainBalanceWheel 
          data={mockLifeDomainData}
          insight="Focusing on your sleep schedule could significantly improve your overall health and balance."
          premium={true}
        />

        <View style={{ height: 32 }} />

        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Glowy Input Component</Text>
        <View style={{ backgroundColor: '#1A1A2E', paddingVertical: 40, borderRadius: 24, overflow: 'hidden' }}>
          <GlowyInput 
            message={message}
            setMessage={setMessage}
            handleSendMessage={() => {
              console.log("Sent:", message);
            }}
            handleSubmitEditing={() => {
              console.log("Submitted:", message);
              setMessage("");
            }}
            placeholder="Test the glowy input..."
          />
        </View>

        <View style={{ height: 32 }} />

        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Exclusion Tabs</Text>
        <View style={{ height: 200, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <ExclusionTabs />
        </View>

      </ScrollView>
    </View>
  );
}
