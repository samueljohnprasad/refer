import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Stack } from "expo-router";
import { EmotionRadarChart } from "@/src/components/charts/EmotionRadarChart";
import { LifeDomainBalanceWheel } from "@/src/components/charts/LifeDomainBalanceWheel";
import { Text } from "@/src/components/ui/Text";
import { FluxChartScreen } from "@/src/screens/FluxChartScreen/FluxChartScreen";
import { NutrieScreen } from "@/src/screens/NutrieScreen/NutrieScreen";
import { ExerciseTextComposer } from "@/src/components/exercise/ExerciseTextComposer";
import { ExclusionTabs } from "@/src/animations/exclusion-tabs";
import { IMessageStack } from "@/src/animations/imessage-stack";
import { MotionBlur } from "@/src/animations/motion-blur";
import { AlertDrawer } from "@/src/animations/alert-drawer";
import { DurationSlider } from "@/src/animations/duration-slider";
import { PomodoroTimer } from "@/src/animations/pomodoro-timer";
import { GitHubContributions } from "@/src/animations/github-contributions";
import { WheelPicker } from "@/src/animations/wheel-picker";
import { TwodosSlide } from "@/src/animations/twodos-slide";
import { BalanceSlider } from "@/src/animations/balance-slider";
import { ScrollableBottomSheet } from "@/src/animations/scrollable-bottom-sheet";
import { LoadingButton } from "@/src/animations/loading-button";
import { TelegramThemeSwitch } from "@/src/animations/telegram-theme-switch";
import { AnimatedCountText } from "@/src/animations/animated-count-text";
import { ThemeCanvasAnimation } from "@/src/animations/theme-canvas-animation";
import { AddToCart } from "@/src/animations/add-to-cart";
import { SharedTransitions } from "@/src/animations/shared-transition";
import { useCircularRevealNavigate } from "@/src/hooks/useCircularRevealNavigate";
import { TouchableOpacity } from "react-native";

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
  const navigateWithReveal = useCircularRevealNavigate();

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Stack.Screen options={{ title: "Test Charts & UI", headerBackTitle: "Back" }} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity 
          onPress={(e) => navigateWithReveal(e, '/tabs/screens/reveal-destination', '#4ECDC4')}
          style={{ padding: 16, backgroundColor: '#4ECDC4', borderRadius: 12, marginBottom: 32, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            Tap Me: Test Circular Reveal Transition
          </Text>
        </TouchableOpacity>

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

        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Exercise Composer</Text>
        <View style={{ backgroundColor: '#1A1A2E', paddingVertical: 40, borderRadius: 24, overflow: 'hidden' }}>
          <ExerciseTextComposer
            value={message}
            onChange={setMessage}
            onSubmit={() => {
              console.log("Sent:", message);
            }}
            onSubmitEditing={() => {
              console.log("Submitted:", message);
              setMessage("");
            }}
            placeholder="Test the glowy input..."
            showSubmit
            glow
          />
        </View>

        <View style={{ height: 32 }} />

        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Exclusion Tabs</Text>
        <View style={{ height: 200, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <ExclusionTabs />
        </View>

        <View style={{ height: 32 }} />

        <Text variant="h2" className="mb-4 mt-2 text-gray-800">iMessage Stack</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <IMessageStack />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Motion Blur</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <MotionBlur />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Alert Drawer</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <AlertDrawer />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Duration Slider</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <DurationSlider />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Pomodoro Timer</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <PomodoroTimer />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">GitHub Contributions</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <GitHubContributions />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Wheel Picker</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <WheelPicker />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">TwoDos Slide</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <TwodosSlide />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Balance Slider</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <BalanceSlider />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Scrollable Bottom Sheet</Text>
        <View style={{ height: 600, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <ScrollableBottomSheet />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Loading Button</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <LoadingButton />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Telegram Theme Switch</Text>
        <View style={{ height: 600, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <TelegramThemeSwitch />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Animated Count Text</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <AnimatedCountText />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Theme Canvas Animation</Text>
        <View style={{ height: 600, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <ThemeCanvasAnimation />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Add To Cart</Text>
        <View style={{ height: 400, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <AddToCart />
        </View>

        <View style={{ height: 32 }} />
        <Text variant="h2" className="mb-4 mt-2 text-gray-800">Shared Transition</Text>
        <View style={{ height: 600, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <SharedTransitions />
        </View>

      </ScrollView>
    </View>
  );
}
