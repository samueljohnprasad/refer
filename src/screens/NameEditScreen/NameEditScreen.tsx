import { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import { useUpdateDisplayName } from "@/hooks/post/useUpdateDisplayName";
// ponytail: use native expo-symbols instead of lucide
import { SymbolView } from "expo-symbols";

interface NameEditScreenProps {
  setShowModal: (show: boolean) => void;
}

export default function NameEditScreen({ setShowModal }: NameEditScreenProps) {
  const { t } = useTranslation("common");
  const { height } = useGradualAnimation();
  const [name, setName] = useState("");
  const { mutate: updateDisplayName, isPending: isUpdating } = useUpdateDisplayName();
  const { data: userProfile } = useUserProfile();

  useEffect(() => {
    if (userProfile?.displayName) {
      setName(userProfile.displayName);
    }
  }, [userProfile?.displayName]);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      Alert.alert(t("errors.title"), t("profile.nameEdit.nameRequired"));
      return;
    }
    updateDisplayName(name.trim(), {
      onSuccess: () => setShowModal(false),
      onError: () => Alert.alert(t("errors.title"), t("profile.nameEdit.updateFailed")),
    });
  }, [name, updateDisplayName, setShowModal, t]);

  const keyboardPadding = useAnimatedStyle(() => ({
    height: height.value,
  }), []);

  return (
    <View className="flex-1 bg-background pt-4">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pb-2">
        <Pressable 
          onPress={() => setShowModal(false)}
          className="p-2 -ml-2 active:opacity-60"
        >
          <Text className="text-[17px] text-foreground font-medium">{t("actions.cancel")}</Text>
        </Pressable>
        <Text className="text-[17px] text-foreground font-semibold">{t("profile.nameEdit.title")}</Text>
        <Pressable 
          onPress={handleSave}
          disabled={isUpdating}
          className="p-2 -mr-2 active:opacity-60"
        >
          <Text className="text-[17px] text-foreground font-medium" style={{ opacity: isUpdating ? 0.5 : 1 }}>
            {isUpdating ? t("actions.saving") : t("actions.save")}
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-5 pt-8 items-center">
        {/* Avatar Container */}
        <View className="w-24 h-24 rounded-full bg-card items-center justify-center mb-8 shadow-sm border border-border">
          <SymbolView name="person.fill" size={38} tintColor="#8e8e93" />
        </View>

        {/* Input */}
        <View className="w-full bg-card rounded-xl px-4 py-4 mb-4 shadow-sm border border-border">
          <TextInput
            className="text-[17px] text-foreground w-full"
            value={name}
            onChangeText={setName}
            maxLength={20}
            placeholder={t("profile.nameEdit.placeholder")}
            placeholderTextColor="#8e8e93"
            autoFocus
            
          />
        </View>
        <Text className="text-[13px] text-muted-foreground text-center px-4">
          {t("profile.nameEdit.description")}
        </Text>
      </View>
      <Animated.View style={keyboardPadding} />
      
      <KeyboardToolbar
        showArrows={false}
        insets={{ left: 16, right: 0 }}
        doneText={t("actions.done")}
      />
    </View>
  );
}
