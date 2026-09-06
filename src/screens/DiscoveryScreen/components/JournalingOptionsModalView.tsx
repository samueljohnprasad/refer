import React from "react";
import { Pressable, View, ScrollView, Modal } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  PencilEdit02Icon,
  Camera01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
  presentationBackground,
} from "@expo/ui/swift-ui/modifiers";
import { SAGE } from "@/src/theme/palette";

export interface JournalingOptionsModalViewProps {
  visible: boolean;
  onClose: () => void;
  currentPrompt: string;
  displayPrompts: string[];
  onSelectPrompt: (prompt: string) => void;
  onScanJournal?: () => void;
}

// ponytail: pure presentational prompt selector modal with 100% Tailwind styling
export const JournalingOptionsModalView: React.FC<JournalingOptionsModalViewProps> = React.memo(
  ({
    visible,
    onClose,
    currentPrompt,
    displayPrompts,
    onSelectPrompt,
    onScanJournal,
  }) => {
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
                presentationDetents([{ fraction: 0.62 }]),
                presentationDragIndicator("visible"),
                presentationBackground("#FAF7EE"),
              ]}
            >
              <RNHostView>
                <View
                  className="flex-1 bg-[#FAF7EE] px-4 pt-1"
                  accessibilityViewIsModal={true}
                >
                  {/* Header with ~4pt extra breathing room under grabber */}
                  <View className="pt-2 pb-3 items-center">
                    <Text
                      color="ink"
                      className="text-center happy-font-heading-semibold text-[20px] leading-[26px]"
                    >
                      Journaling Options
                    </Text>
                  </View>

                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 56 }}
                  >
                    {/* Mode Actions Group - tightened 6-8pt between rows */}
                    <View className="gap-y-0.5 mb-1">
                      {/* Free Write */}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Free Write. Write without a prompt."
                        onPress={() => onSelectPrompt("Free Write")}
                        className="w-full flex-row items-center py-1.5 px-3 rounded-2xl active:bg-ink/[0.05] min-h-[44px]"
                      >
                        <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-sage-100 border border-sage-200/60">
                          <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            size={18}
                            color={SAGE[600]}
                          />
                        </View>
                        <View className="flex-1 justify-center">
                          <Text
                            color="ink"
                            className="happy-font-body-bold text-[16px] leading-[21px]"
                          >
                            Free Write
                          </Text>
                          <Text
                            color="soft"
                            className="happy-font-body text-[13px] leading-[18px] mt-0.5"
                          >
                            Write without a prompt
                          </Text>
                        </View>
                      </Pressable>

                      {/* Import Handwritten Entry */}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Import Handwritten Entry. Scan from paper."
                        onPress={onScanJournal}
                        className="w-full flex-row items-center py-1.5 px-3 rounded-2xl active:bg-ink/[0.05] min-h-[44px]"
                      >
                        <View className="mr-3 h-9 w-9 items-center justify-center rounded-xl bg-sage-100 border border-sage-200/60">
                          <HugeiconsIcon
                            icon={Camera01Icon}
                            size={18}
                            color={SAGE[600]}
                          />
                        </View>
                        <View className="flex-1 justify-center">
                          <Text
                            color="ink"
                            className="happy-font-body-bold text-[16px] leading-[21px]"
                          >
                            Import Handwritten Entry
                          </Text>
                          <Text
                            color="soft"
                            className="happy-font-body text-[13px] leading-[18px] mt-0.5"
                          >
                            Scan from paper
                          </Text>
                        </View>
                      </Pressable>
                    </View>

                    {/* Section Label: 1 step quieter (11px) with generous gap above */}
                    <View className="mt-5 mb-1 px-3">
                      <Text className="happy-font-body-bold text-[11px] leading-[15px] uppercase tracking-wide text-ink-muted">
                        TRY ANOTHER PROMPT
                      </Text>
                    </View>

                    {/* Prompt Choices Flat List: consistent row padding rhythm, no manual margins */}
                    {displayPrompts.map((prompt: string, index: number) => {
                      const isSelected = prompt === currentPrompt;
                      return (
                        <Pressable
                          key={index}
                          accessibilityRole="button"
                          accessibilityLabel={
                            isSelected ? `${prompt}. Selected.` : prompt
                          }
                          onPress={() => onSelectPrompt(prompt)}
                          className={`w-full flex-row items-center justify-between px-3.5 rounded-xl min-h-[44px] active:bg-ink/[0.05] ${
                            isSelected
                              ? "py-2 bg-sage-100/70"
                              : "py-2.5"
                          }`}
                        >
                          <Text
                            color="ink"
                            className={`flex-1 happy-font-body text-[16px] leading-[22px] pr-3 ${
                              isSelected
                                ? "happy-font-body-bold text-sage-900"
                                : "text-ink"
                            }`}
                          >
                            {prompt}
                          </Text>
                          {isSelected ? (
                            <View className="pl-2 pr-1.5 self-center justify-center items-center">
                              <HugeiconsIcon
                                icon={Tick02Icon}
                                size={18}
                                color={SAGE[600]}
                              />
                            </View>
                          ) : null}
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
  }
);

JournalingOptionsModalView.displayName = "JournalingOptionsModalView";
