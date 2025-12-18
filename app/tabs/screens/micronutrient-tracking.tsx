import { Stack } from "expo-router";
import MicronutrientTrackingScreen from "@/src/screens/MicronutrientTrackingScreen/MicronutrientTrackingScreen";

export default function MicronutrientTracking() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MicronutrientTrackingScreen />
    </>
  );
}
