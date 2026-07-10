import React from "react";
import { Pressable, View, ScrollView, Modal } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  PencilEdit02Icon,
  BookOpen01Icon,
  Tick02Icon,
  Camera01Icon,
} from "@hugeicons/core-free-icons";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
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
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Host>
        <BottomSheet
          isPresented={visible}
          onIsPresentedChange={(val: boolean) => {
            if (!val) {
              onClose();
            }
          }}
        >
          <Group
            modifiers={[
              presentationDetents([{ fraction: 0.75 }]),
              presentationDragIndicator("visible"),
            ]}
          >
            <RNHostView>
              <View className="flex-1" accessibilityViewIsModal={true}>
                <View className="border-b border-brand-border/40 px-5 pb-2 pt-4">
                  {/* Header */}
                  <View className="mb-8 items-center">
                    <Text variant="display" className="text-center">
                      Journaling Options
                    </Text>
                  </View>

                  {/* Free Write Option */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Free Write: Write without a prompt"
                    onPress={() => {
                      onSelectPrompt("Free Write");
                      onClose();
                    }}
                    className="mb-6 flex-row items-center p-2 active:opacity-70"
                  >
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-[18px] bg-sage-50">
                      <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        size={24}
                        color={SAGE[600]}
                      />
                    </View>
                    <View className="flex-1">
                      <Text variant="body-bold">Free Write</Text>
                      <Text variant="body" color="soft">
                        Write without a prompt
                      </Text>
                    </View>
                  </Pressable>

                  {/* Scan Journal Option */}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Import Handwritten Entry: Capture handwritten entries"
                    onPress={() => {
                      onScanJournal?.();
                      onClose();
                    }}
                    className="mb-6 flex-row items-center p-2 active:opacity-70"
                  >
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-[18px] bg-sage-50">
                      <HugeiconsIcon
                        icon={Camera01Icon}
                        size={24}
                        color={SAGE[600]}
                      />
                    </View>
                    <View className="flex-1">
                      <Text variant="body-bold">Import Handwritten Entry</Text>
                      <Text variant="body" color="soft">
                        Capture handwritten entries
                      </Text>
                    </View>
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerClassName="px-5 pb-6 pt-4"
                >

                  {allPrompts.map((prompt, index) => {
                    const isSelected = prompt === currentPrompt;
                    return (
                      <Pressable
                        key={index}
                        accessibilityRole="button"
                        accessibilityLabel={`Prompt: ${prompt}${isSelected ? ", selected" : ""}`}
                        onPress={() => {
                          onSelectPrompt(prompt);
                          onClose();
                        }}
                        className={`mb-3 flex-row items-center rounded-2xl p-5 active:opacity-70 ${
                          isSelected
                            ? "bg-sage-500"
                            : ""
                        }`}
                      >
                        <Text
                          variant="body"
                          className={`flex-1 ${
                            isSelected ? "text-white" : ""
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
                </ScrollView>
              </View>
            </RNHostView>
          </Group>
        </BottomSheet>
      </Host>
    </Modal>
  );
};
