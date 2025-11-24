import { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { useUpdateDisplayName } from "@/hooks/post/useUpdateDisplayName";

interface NameEditScreenProps {
  setShowModal: (show: boolean) => void;
}

export default function NameEditScreen({ setShowModal }: NameEditScreenProps) {
  const { height } = useGradualAnimation();

  const [name, setName] = useState("");
  const { mutate: updateDisplayName, isPending: isUpdating } =
    useUpdateDisplayName();
  const { data: userProfile } = useUserProfile();

  useEffect(() => {
    if (userProfile?.displayName) {
      setName(userProfile.displayName);
    }
  }, [userProfile?.displayName]);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    updateDisplayName(name.trim(), {
      onSuccess: () => {
        setShowModal(false);
      },
      onError: () => {
        Alert.alert("Error", "Failed to update name. Please try again.");
      },
    });
  }, [name, updateDisplayName, setShowModal]);

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  return (
    <View className="flex-1">
      <View className="flex-1 bg-[#7366ea] p-5 justify-between">
        {/* Top bar */}
        <View className="flex-row justify-between items-center mt-10">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-white/10 justify-center items-center"
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-[28px] font-bold text-white text-center mb-5">
            Edit your name
          </Text>

          {/* Avatar */}
          <LinearGradient
            colors={["#FFC4A1", "#FF9C7A"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            className="w-[110px] h-[110px] rounded-full justify-center items-center mb-10 shadow-lg shadow-[#FF9C7A]/20"
            style={{
              shadowColor: "#FF9C7A",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
            }}
          >
            <Ionicons name="person" size={54} color="rgba(255,255,255,0.9)" />
          </LinearGradient>

          {/* Input */}
          <View
            className="w-[90%] bg-white rounded-[50px] h-[70px] justify-center items-center mb-5 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
          >
            <TextInput
              className="text-[32px] font-semibold text-[#FF9A7A]"
              value={name}
              onChangeText={setName}
              maxLength={18}
              placeholder="Your name"
              placeholderTextColor="rgba(255,154,122,0.5)"
              textAlign="center"
            />
          </View>
        </View>

        {/* Bottom buttons */}
        <View className="flex-row justify-between gap-3">
          <TouchableOpacity
            className="flex-1 bg-white rounded-[50px] py-4 items-center shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 12,
            }}
            onPress={() => setShowModal(false)}
            disabled={isUpdating}
          >
            <Text className="text-gray-900 font-medium text-base">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 bg-[#ffd23f] rounded-[50px] py-4 items-center shadow-md ${
              isUpdating ? "opacity-70" : ""
            }`}
            style={{
              shadowColor: "#ffd23f",
              shadowOpacity: 0.25,
              shadowRadius: 20,
            }}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <Text className="text-[#7366ea] text-base font-semibold">
              {isUpdating ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={keyboardPadding} />
      </View>
      <KeyboardToolbar
        showArrows={false}
        insets={{ left: 16, right: 0 }}
        doneText="Close keyboard"
      />
    </View>
  );
}
