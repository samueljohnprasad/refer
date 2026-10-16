import { Stack } from "expo-router";

export default function ExercisesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="practice"
        options={{
          headerShown: true,
          headerTransparent: false,
          headerLargeTitle: false,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
    </Stack>
  );
}
