import { useEffect, useCallback, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { useUpdateDisplayName } from "@/hooks/post/useUpdateDisplayName";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCSSVariable } from "uniwind";
import { isLiquidGlassAvailable } from "expo-glass-effect";

const GLASS = isLiquidGlassAvailable();

export default function NameEditScreen() {
  const router = useRouter();
  const { data: userProfile } = useUserProfile();
  const { mutate: updateDisplayName, isPending: isUpdating } = useUpdateDisplayName();
  
  const [fullName, setFullName] = useState(userProfile?.displayName || "");

  const appForeground = useCSSVariable("--app-foreground") as string;
  const appBackground = useCSSVariable("--app-background") as string;

  useEffect(() => {
    if (userProfile?.displayName && !fullName) {
      setFullName(userProfile.displayName);
    }
  }, [userProfile?.displayName]);

  const handleSave = useCallback(() => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    updateDisplayName(fullName.trim(), {
      onSuccess: () => {
        router.back();
      },
      onError: () => {
        Alert.alert("Error", "Failed to update name. Please try again.");
      },
    });
  }, [fullName, updateDisplayName, router]);

  return (
    <>
      <Stack.Screen 
        options={{
          headerLeft: () => null,
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="xmark" onPress={() => router.back()} />
      </Stack.Toolbar>

      <ScrollView
        className="flex-1 bg-background"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-5 pb-10"
        keyboardDismissMode="interactive"
      >
        {/* Full Name */}
        <Text className="text-[13px] font-medium text-muted-foreground mt-6 mb-2">
          Full Name
        </Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          className="bg-muted rounded-xl px-4 py-3 text-[17px] text-foreground border-continuous"
          placeholderTextColor="#999"
          autoFocus
        />

        {/* Update Profile Button */}
        <Pressable
          onPress={handleSave}
          disabled={isUpdating}
          className="bg-foreground rounded-xl mt-6 py-3.5 items-center active:opacity-80 border-continuous"
        >
          <Text className="text-[17px] font-semibold text-background">
            {isUpdating ? "Saving..." : "Update Profile"}
          </Text>
        </Pressable>

        {/* Divider */}
        <View className="h-px bg-border my-6" />

        <Text className="text-[13px] text-muted-foreground leading-relaxed">
          This is your public display name. It can be changed at any time.
        </Text>
      </ScrollView>
    </>
  );
}
