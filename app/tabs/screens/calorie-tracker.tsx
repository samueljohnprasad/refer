import CalorieTrackerScreen from "@/src/screens/CalorieTrackerScreen/CalorieTrackerScreen";
import { useLocalSearchParams } from "expo-router";

export default function CalorieTrackerPage() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const selectedDate = date ? new Date(date) : new Date();

  return <CalorieTrackerScreen selectedDate={selectedDate} />;
}
