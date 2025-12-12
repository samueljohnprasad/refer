import { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { useUpdateDisplayName } from "@/hooks/post/useUpdateDisplayName";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";

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
    <View className="flex-1 bg-[#F6F4FF]">
      <View className="flex-1 p-5 justify-between">
        {/* Top bar */}
        <View className="flex-row justify-between items-center mt-16">
          <TouchableOpacity
            className="w-10 h-10 rounded-full justify-center items-center bg-[#7C5CFF] shadow-sm"
            onPress={() => setShowModal(false)}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View className="flex-1 justify-center items-center -mt-16">
          <Text className="text-4xl font-cormorantSemiBold text-[#1f2937] text-center mb-10">
            Edit your name
          </Text>

          {/* Avatar Container */}
          <View className="w-28 h-28 rounded-full bg-white p-1 justify-center items-center mb-8 shadow-sm">
            <HugeiconsIcon icon={UserIcon} size={48} color="black" />
          </View>

          {/* Input */}
          <View
            className="w-full bg-white rounded-[24px] h-20 justify-center items-center mb-4 shadow-sm"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <TextInput
              className="text-3xl font-cormorantSemiBold text-[#1f2937] w-full text-center h-full"
              value={name}
              onChangeText={setName}
              maxLength={20}
              placeholder="Your name"
              placeholderTextColor="#9CA3AF"
              textAlign="center"
              autoFocus
              selectionColor="#7B61FF"
            />
          </View>
        </View>

        {/* Bottom buttons */}
        <View className="flex-row justify-between gap-4 mb-2">
          <TouchableOpacity
            className="flex-1 bg-[#F6F4FF] border border-[#e5e5ea] rounded-full flex-row items-center justify-center py-4 active:opacity-80"
            onPress={() => setShowModal(false)}
            disabled={isUpdating}
          >
            <Text className="text-gray-900 font-bold text-lg mr-2">Cancel</Text>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="#1f2937" />
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 bg-[#7B61FF] rounded-full flex-row items-center justify-center py-4 shadow-sm ${
              isUpdating ? "opacity-80" : ""
            }`}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <Text className="text-white text-lg font-bold mr-2">
              {isUpdating ? "Saving..." : "Save"}
            </Text>
            {!isUpdating && (
              <HugeiconsIcon icon={Tick02Icon} size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <Animated.View style={keyboardPadding} />
      </View>
      <KeyboardToolbar
        showArrows={false}
        insets={{ left: 16, right: 0 }}
        doneText="Done"
      />
    </View>
  );
}
