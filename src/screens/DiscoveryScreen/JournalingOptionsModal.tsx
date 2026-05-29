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
              <View className="flex-1">
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                    paddingTop: 16,
                  }}
                >
                  {/* Header */}
                  <View className="mb-6 items-center">
                    <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-sage-50">
                      <HugeiconsIcon
                        icon={BookOpen01Icon}
                        size={32}
                        color={SAGE[600]}
                      />
                    </View>
                    <Text variant="display" className="text-center">
                      Journaling Options
                    </Text>
                  </View>

                  {/* Free Write Option */}
                  <Pressable
                    onPress={() => {
                      onSelectPrompt("Free Write");
                      onClose();
                    }}
                    className="mb-6 flex-row items-center rounded-3xl border-2 border-brand-border bg-brand-surface p-5"
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
                    onPress={() => {
                      onScanJournal?.();
                      onClose();
                    }}
                    className="mb-4 flex-row items-center rounded-3xl border-2 border-brand-border bg-brand-surface p-5"
                  >
                    <View className="mr-4 h-12 w-12 items-center justify-center rounded-[18px] bg-sage-50">
                      <HugeiconsIcon
                        icon={Camera01Icon}
                        size={24}
                        color={SAGE[600]}
                      />
                    </View>
                    <View className="flex-1">
                      <Text variant="body-bold">Scan Journal Page</Text>
                      <Text variant="body" color="soft">
                        Capture handwritten entries
                      </Text>
                    </View>
                  </Pressable>

                  <Text variant="eyebrow" className="mb-4 ml-1">
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
                            : "border-brand-border bg-brand-surface"
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
