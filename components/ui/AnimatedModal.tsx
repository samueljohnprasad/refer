import React from "react";
import { Modal, StyleSheet, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Pressable } from "react-native";
import { ModalType } from "@/types/journal";

// Avoid Animated.createAnimatedComponent to prevent useInsertionEffect warning
const FadeView = Animated.View;

interface ModalAnimationValues {
  blurAnim: Animated.Value;
  fadeAnim: Animated.Value;
  contentBlurAnim: Animated.Value;
}

interface AnimatedModalProps {
  visible: boolean;
  modalType: ModalType;
  animationValues: ModalAnimationValues;
  onClose: () => void;
  onRequestClose: () => void;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  visible,
  modalType,
  animationValues,
  onClose,
  onRequestClose,
}) => {
  const { blurAnim, fadeAnim, contentBlurAnim } = animationValues;

  const renderModalContent = (): JSX.Element => {
    const isAddModal = modalType === "add";
    const title = isAddModal ? "Add New Entry" : "View Entry";
    const buttonText = isAddModal ? "Add Entry" : "View Entry";

    return (
      <Animated.View
        style={[
          styles.modalContent,
          {
            opacity: fadeAnim,
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <BlurView intensity={100} style={styles.contentBlur} tint="light">
          <Animated.View style={{ opacity: contentBlurAnim }}>
            <VStack space="lg" style={styles.innerModalContent}>
              <Heading size="lg" className="font-bold text-center">
                {title}
              </Heading>
              <Pressable
                style={styles.actionButton}
                onPress={() => {
                  // TODO: integrate navigation or further logic here
                  onClose();
                }}
              >
                <Text className="text-white font-semibold">{buttonText}</Text>
              </Pressable>
              <Pressable onPress={onClose}>
                <Text className="text-gray-500 mt-4">Cancel</Text>
              </Pressable>
            </VStack>
          </Animated.View>
        </BlurView>
      </Animated.View>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView style={styles.modalBlur} tint="light">
        <Animated.View style={{ flex: 1, opacity: blurAnim }}>
          {renderModalContent()}
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBlur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 24,
    borderRadius: 24,
    width: "80%",
    alignItems: "center",
  },
  contentBlur: {
    borderRadius: 24,
    overflow: "hidden",
    width: "100%",
  },
  innerModalContent: {
    padding: 16,
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "#4f46e5",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
  },
});
