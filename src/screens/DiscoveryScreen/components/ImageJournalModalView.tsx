import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Host, BottomSheet, Group, RNHostView } from "@expo/ui/swift-ui";
import {
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { Feather } from "@expo/vector-icons";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import type { ImageJournalScannerViewModel } from "../hooks/useImageJournalScanner";

export interface ImageJournalModalViewProps
  extends ImageJournalScannerViewModel {
  visible: boolean;
}

// ponytail: pure presentational image journal modal with 100% Tailwind CSS styling
export const ImageJournalModalView: React.FC<ImageJournalModalViewProps> = React.memo(
  ({
    visible,
    imageUri,
    step,
    stepMessage,
    captureImage,
    pickImage,
    handleRetake,
    handleClose,
    handleConfirmInsights,
  }) => {
    if (!visible) return null;

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <Host>
          <BottomSheet
            isPresented={visible}
            onIsPresentedChange={(val: boolean) => {
              if (!val) {
                handleClose();
              }
            }}
          >
            <Group
              modifiers={[
                presentationDetents(
                  imageUri ? [{ fraction: 0.85 }] : [{ fraction: 0.45 }]
                ),
                presentationDragIndicator("visible"),
              ]}
            >
              <RNHostView>
                <View className="flex-1 px-5 pb-6">
                  {/* Header */}
                  <View className="mb-8 pt-5">
                    <Text variant="display" className="mb-2">
                      Scan Journal
                    </Text>
                    <Text variant="body" color="muted">
                      Capture your handwritten or printed pages.
                    </Text>
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    {!imageUri ? (
                      <View className="flex-1 justify-center pb-12">
                        <Button
                          label="Open Camera"
                          variant="primary"
                          onPress={captureImage}
                          leftIcon={
                            <Feather
                              name="camera"
                              size={20}
                              color={SEMANTIC_COLORS.surface.primary}
                            />
                          }
                          className="mb-4"
                        />

                        <Button
                          label="Select from Gallery"
                          variant="secondary"
                          onPress={pickImage}
                          leftIcon={
                            <Feather
                              name="image"
                              size={20}
                              color={SEMANTIC_COLORS.text.secondary}
                            />
                          }
                        />
                      </View>
                    ) : (
                      // Image preview and processing
                      <View className="flex-1">
                        {/* Image Preview */}
                        <View className="flex-1 rounded-[28px] overflow-hidden bg-sage-50 mb-4 border border-brand-border">
                          <Image
                            source={{ uri: imageUri }}
                            className="w-full h-full"
                            resizeMode="contain"
                          />
                          {step !== "idle" && (
                            <View className="absolute inset-0 bg-sage-50/85 items-center justify-center">
                              {step === "done" ? (
                                <View className="items-center px-8">
                                  <View className="w-16 h-16 rounded-full bg-sage-200 items-center justify-center mb-4">
                                    <Feather
                                      name="check"
                                      size={32}
                                      color={SEMANTIC_COLORS.brand.pressed}
                                    />
                                  </View>
                                  <Text variant="h2" className="text-center mb-2">
                                    Ready
                                  </Text>
                                  <Text
                                    variant="body"
                                    color="soft"
                                    className="text-center mb-8"
                                  >
                                    Your insights have been successfully
                                    generated.
                                  </Text>
                                  <Button
                                    label="View Insights"
                                    variant="primary"
                                    onPress={handleConfirmInsights}
                                  />
                                </View>
                              ) : (
                                <View className="items-center w-full">
                                  <ActivityIndicator
                                    size="large"
                                    color={SEMANTIC_COLORS.brand.pressed}
                                  />
                                  <Text
                                    variant="body-bold"
                                    className="mt-6 text-center"
                                  >
                                    {stepMessage}
                                  </Text>
                                  {step === "extracting" && (
                                    <Text
                                      variant="body"
                                      color="soft"
                                      className="mt-2 text-center px-8"
                                    >
                                      Reading handwritten text...
                                    </Text>
                                  )}
                                  {step === "analyzing" && (
                                    <Text
                                      variant="body"
                                      color="soft"
                                      className="mt-2 text-center px-8"
                                    >
                                      Creating personalized insights...
                                    </Text>
                                  )}
                                  <TouchableOpacity
                                    onPress={handleClose}
                                    className="mt-10 px-6 py-3 rounded-full bg-sage-200/50"
                                  >
                                    <Text variant="body-bold" color="ink">
                                      Cancel Processing
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          )}
                        </View>

                        {/* Action buttons */}
                        {step === "error" && (
                          <View className="flex-row gap-3">
                            <Button
                              label="Cancel"
                              variant="secondary"
                              onPress={handleClose}
                              className="flex-1"
                            />
                            <Button
                              label="Try Again"
                              variant="primary"
                              onPress={handleRetake}
                              className="flex-1"
                            />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </RNHostView>
            </Group>
          </BottomSheet>
        </Host>
      </Modal>
    );
  }
);

ImageJournalModalView.displayName = "ImageJournalModalView";
