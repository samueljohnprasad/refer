import { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { useUpdateDisplayName } from "@/hooks/post/useUpdateDisplayName";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, Tick02Icon, UserIcon } from "@hugeicons/core-free-icons";
import { BRAND_SURFACE, INK, INK_MUTED, SAGE } from "@/lib/tokens";

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
    <View className="flex-1 happy-brand-screen">
      <View className="flex-1 p-5 justify-between">
        {/* Top bar */}
        <View className="flex-row justify-between items-center mt-16">
          <TouchableOpacity
            className="w-11 h-11 rounded-full justify-center items-center bg-sage-pill"
            onPress={() => setShowModal(false)}
            activeOpacity={0.7}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={21} color={SAGE[600]} />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View className="flex-1 justify-center items-center -mt-16">
          <Text className="happy-font-heading-bold text-[38px] text-ink text-center mb-10">
            Edit your name
          </Text>

          {/* Avatar Container */}
          <View className="happy-mascot-stage w-28 h-28 rounded-full p-1 justify-center items-center mb-8">
            <HugeiconsIcon icon={UserIcon} size={48} color={SAGE[600]} />
          </View>

          {/* Input */}
          <View className="happy-brand-card w-full rounded-[24px] h-20 justify-center items-center mb-4">
            <TextInput
              className="happy-font-heading-bold text-3xl text-ink w-full text-center h-full"
              value={name}
              onChangeText={setName}
              maxLength={20}
              placeholder="Your name"
              placeholderTextColor={INK_MUTED}
              textAlign="center"
              autoFocus
              selectionColor={SAGE[600]}
            />
          </View>
        </View>

        {/* Bottom buttons */}
        <View className="flex-row justify-between gap-4 mb-2">
          <TouchableOpacity
            className="flex-1 bg-sage-pill rounded-full flex-row items-center justify-center py-4 active:opacity-80"
            onPress={() => setShowModal(false)}
            disabled={isUpdating}
          >
            <Text className="happy-font-body-bold text-ink text-lg mr-2">
              Cancel
            </Text>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color={INK} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`happy-brand-primary-cta flex-1 rounded-full flex-row items-center justify-center py-4 ${
              isUpdating ? "opacity-80" : ""
            }`}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <Text className="happy-font-body-bold text-brand-surface text-lg mr-2">
              {isUpdating ? "Saving..." : "Save"}
            </Text>
            {!isUpdating && (
              <HugeiconsIcon icon={Tick02Icon} size={20} color={BRAND_SURFACE} />
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
