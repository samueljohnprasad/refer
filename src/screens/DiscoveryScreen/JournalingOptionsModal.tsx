import React, { useEffect, useRef } from "react";
import { Pressable, View, Text } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  PencilEdit02Icon,
  BookOpen01Icon,
  Tick02Icon,
  Camera01Icon,
} from "@hugeicons/core-free-icons";
import {
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BRAND_SURFACE, SAGE, SAGE_OVERLAY } from "@/lib/tokens";

interface JournalingOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
  allPrompts: string[];
  currentPrompt: string;
  onScanJournal?: () => void;
}

export const JournalingOptionsModal: React.FC<JournalingOptionsModalProps> = ({
  visible,
  onClose,
  onSelectPrompt,
  allPrompts,
  currentPrompt,
  onScanJournal,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={["75%"]}
      onDismiss={onClose}
      style={{
        marginHorizontal: 8,
        borderRadius: 32,
        overflow: "hidden",
      }}
      backgroundStyle={{ backgroundColor: BRAND_SURFACE }}
      handleIndicatorStyle={{ backgroundColor: SAGE[100], width: 48 }}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 20,
          paddingTop: 8,
        }}
      >
        {/* Header */}
        <View className="mb-6 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-[22px] bg-sage-pill">
            <HugeiconsIcon
              icon={BookOpen01Icon}
              size={32}
              color={SAGE[600]}
            />
          </View>
          <Text className="text-center text-4xl happy-font-heading-bold text-ink">
            Journaling Options
          </Text>
        </View>

        {/* Free Write Option */}
        <Pressable
          onPress={() => {
            onSelectPrompt("Free Write");
            onClose();
          }}
          className="mb-8 flex-row items-center rounded-3xl border-2 border-sage-100 bg-sage-50 p-5"
        >
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-[18px] bg-white">
            <HugeiconsIcon
              icon={PencilEdit02Icon}
              size={24}
              color={SAGE[600]}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xl leading-6 happy-font-body-bold text-ink">
              Free Write
            </Text>
            <Text className="text-base happy-font-body-medium text-ink-muted">
              Write without a prompt
            </Text>
          </View>
        </Pressable>

        {/* Scan Journal Option */}
        <Pressable
          onPress={() => {
            onScanJournal?.();
            onClose();
          }}
          className="mb-4 flex-row items-center rounded-3xl border-2 border-sage-100 bg-sage-50 p-5"
        >
          <View className="mr-4 h-12 w-12 items-center justify-center rounded-[18px] bg-white">
            <HugeiconsIcon
              icon={Camera01Icon}
              size={24}
              color={SAGE[600]}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xl leading-6 happy-font-body-bold text-ink">
              Scan Journal Page
            </Text>
            <Text className="text-base happy-font-body-medium text-ink-muted">
              Capture handwritten entries
            </Text>
          </View>
        </Pressable>

        <Text className="mb-4 ml-1 text-xs font-bold uppercase tracking-widest text-sage-500">
          Or select a Prompt
        </Text>

        {allPrompts.map((prompt, index) => {
          const isSelected = prompt === currentPrompt;
          return (
            <Pressable
              key={index}
              onPress={() => {
                onSelectPrompt(prompt);
                onClose();
              }}
              className={`mb-3 flex-row items-center rounded-2xl border-2 p-5 ${
                isSelected
                  ? "border-sage-600 bg-sage-500"
                  : "border-sage-100 bg-white"
              }`}
            >
              <Text
                className={`flex-1 text-lg leading-6 happy-font-body-medium ${
                  isSelected ? "text-white" : "text-ink-soft"
                }`}
              >
                {prompt}
              </Text>
              {isSelected && (
                <View
                  className="ml-3 rounded-xl p-1.5"
                  style={{ backgroundColor: SAGE_OVERLAY.whiteTint }}
                >
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={18}
                    color={BRAND_SURFACE}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
