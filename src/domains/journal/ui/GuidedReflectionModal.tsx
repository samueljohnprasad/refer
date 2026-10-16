// ponytail: guided text reflection modal for post-practice CBT handoff
import React, { useState, useMemo, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/src/context/AuthContext";
import { getStarterPath } from "@/src/domains/journey/model/starterPath";
import { saveGuidedReflection } from "../data/reflectionLineage.repo";

export interface GuidedReflectionModalProps {
  visible: boolean;
  pathId: string;
  pathVersion?: number;
  practiceSessionId: string;
  practiceRef: { source: string; id: string };
  onClose: () => void;
  onCompleted: () => void;
}

export const GuidedReflectionModal: React.FC<GuidedReflectionModalProps> = ({
  visible,
  pathId,
  pathVersion = 1,
  practiceSessionId,
  practiceRef,
  onClose,
  onCompleted,
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useTranslation("journal");
  const [reflectionText, setReflectionText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const starterPath = useMemo(() => getStarterPath(pathId), [pathId]);
  const promptId = starterPath.reflectionPromptId;

  const promptInfo = useMemo(() => {
    const key = `guided.prompts.${promptId}`;
    return {
      title: t(`${key}.title`, { defaultValue: "Take a Moment to Reflect" }),
      prompt: t(`${key}.prompt`, {
        defaultValue:
          "What did you notice during this practice, and what feels most helpful to remember?",
      }),
    };
  }, [promptId, t]);

  const handleGatedMedia = useCallback(
    (type: "voice" | "photo") => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const title =
        type === "voice"
          ? t("guided.gated_voice", { defaultValue: "Voice reflection deferred" })
          : t("guided.gated_photo", { defaultValue: "Photo reflection deferred" });
      const desc =
        type === "voice"
          ? t("guided.gated_voice_desc", {
              defaultValue:
                "Voice processing deferred until privacy validation is complete.",
            })
          : t("guided.gated_photo_desc", {
              defaultValue:
                "Photo processing deferred until privacy validation is complete.",
            });
      Alert.alert(title, desc, [{ text: "OK" }]);
    },
    [t],
  );

  const handleSave = useCallback(async () => {
    const trimmed = reflectionText.trim();
    if (!trimmed || !user?.id) return;

    setIsSaving(true);
    try {
      await saveGuidedReflection({
        userId: user.id,
        title: promptInfo.title,
        transcripts: trimmed,
        inputType: "text",
        pathId,
        pathVersion,
        practiceSessionId,
        practiceRef,
        reflectionPromptId: promptId,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onCompleted();
    } catch {
      Alert.alert(
        "Save Failed",
        "Could not save your reflection. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    reflectionText,
    user?.id,
    promptInfo.title,
    pathId,
    pathVersion,
    practiceSessionId,
    practiceRef,
    promptId,
    onCompleted,
  ]);

  if (!visible) return null;

  const canSave = reflectionText.trim().length > 0 && !isSaving;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-amber-50/40"
      >
        <ScrollView
          contentContainerStyle={{
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24) + 16,
            paddingHorizontal: 20,
          }}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center space-x-2">
              <View className="w-8 h-8 rounded-full bg-amber-100 items-center justify-center">
                <Feather name="lock" size={14} color="#D97706" />
              </View>
              <Text className="text-xs uppercase tracking-wider font-nunito-bold text-amber-700">
                {t("guided.eyebrow", { defaultValue: "Private Reflection" })}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              disabled={isSaving}
              hitSlop={12}
              className="py-1 px-3 rounded-full bg-slate-100"
            >
              <Text className="text-xs font-nunito-semibold text-slate-500">
                {t("guided.skip", { defaultValue: "Skip for now" })}
              </Text>
            </Pressable>
          </View>

          {/* Prompt Card */}
          <View className="bg-white rounded-3xl p-5 shadow-sm border border-amber-100/60 mb-5">
            <Text className="text-xl font-nunito-extrabold text-slate-800 mb-2">
              {promptInfo.title}
            </Text>
            <Text className="text-sm font-nunito-medium text-slate-600 leading-relaxed">
              {promptInfo.prompt}
            </Text>
          </View>

          {/* Input Area */}
          <View className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm mb-4">
            <TextInput
              multiline
              autoFocus
              value={reflectionText}
              onChangeText={setReflectionText}
              placeholder={t("guided.placeholder", {
                defaultValue: "Write your reflection here...",
              })}
              placeholderTextColor="#94A3B8"
              className="min-h-[140px] text-base font-nunito-medium text-slate-800 leading-relaxed"
              textAlignVertical="top"
              editable={!isSaving}
            />

            {/* Gated media controls */}
            <View className="flex-row items-center justify-between pt-3 border-t border-slate-100 mt-2">
              <View className="flex-row items-center space-x-2">
                <Pressable
                  onPress={() => handleGatedMedia("voice")}
                  className="flex-row items-center px-2.5 py-1.5 rounded-xl bg-slate-100 active:bg-slate-200"
                >
                  <Feather name="mic" size={14} color="#64748B" />
                  <Text className="text-[11px] font-nunito-bold text-slate-500 ml-1.5">
                    Voice
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => handleGatedMedia("photo")}
                  className="flex-row items-center px-2.5 py-1.5 rounded-xl bg-slate-100 active:bg-slate-200"
                >
                  <Feather name="camera" size={14} color="#64748B" />
                  <Text className="text-[11px] font-nunito-bold text-slate-500 ml-1.5">
                    Photo
                  </Text>
                </Pressable>
              </View>
              <Text className="text-xs font-nunito-medium text-slate-400">
                {reflectionText.trim().split(/\s+/).filter(Boolean).length} words
              </Text>
            </View>
          </View>

          {/* Privacy Reassurance Note */}
          <View className="flex-row items-start space-x-2 px-2 mb-6">
            <Feather name="shield" size={13} color="#94A3B8" style={{ marginTop: 2 }} />
            <Text className="flex-1 text-[11px] font-nunito-medium text-slate-400 leading-tight">
              {t("guided.boundary", {
                defaultValue:
                  "Private & local to your account. Reflections are not shared publicly or used for medical diagnosis.",
              })}
            </Text>
          </View>

          {/* Save Action Button */}
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            className={`w-full py-4 rounded-2xl items-center justify-center shadow-md active:opacity-90 ${
              canSave ? "bg-amber-500 border-b-4 border-amber-600" : "bg-slate-200"
            }`}
          >
            <Text
              className={`text-sm font-nunito-extrabold tracking-wider ${
                canSave ? "text-white" : "text-slate-400"
              }`}
            >
              {isSaving
                ? t("guided.saving", { defaultValue: "SAVING..." })
                : t("guided.save", { defaultValue: "SAVE TO PRIVATE JOURNAL" })}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
