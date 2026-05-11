import React from "react";
import { Text, View, Modal, Pressable } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import MochiMascot from "./MochiMascot";
import TactileButton from "./TactileButton";

interface DiscountInterceptModalProps {
  visible: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

const DiscountInterceptModal: React.FC<DiscountInterceptModalProps> = ({
  visible,
  onAccept,
  onDismiss,
}) => {
  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View
        entering={FadeIn.duration(200)}
        className="flex-1 items-center justify-end bg-black/50"
      >
        <Animated.View
          entering={SlideInDown.duration(400)}
          className="w-full rounded-t-3xl bg-cream px-6 pb-10 pt-6"
        >
          <View className="items-center">
            <MochiMascot expression="happy" size={80} animate={false} />
            <Text className="mt-2 text-xs font-bold uppercase tracking-widest text-sage-500">
              Wait — one more thing
            </Text>
            <Text
              style={{ fontFamily: "CormorantSemiBold" }}
              className="mt-2 text-center text-2xl text-ink"
            >
              Try Happy Plus for $4.99
            </Text>
            <Text className="mt-2 text-center text-sm text-ink-soft">
              A first month, on us — almost. No pressure. No catch.
            </Text>
          </View>

          <View className="mt-5 rounded-2xl bg-sage-50 p-4">
            <View className="flex-row items-center justify-between">
              <Text
                style={{ fontFamily: "CormorantSemiBold" }}
                className="text-xl text-sage-700"
              >
                $4.99
              </Text>
              <Text className="text-sm text-ink-muted line-through">
                $14.99
              </Text>
            </View>
            <Text className="mt-1 text-xs text-ink-muted">
              After month 1: continues at $14.99/mo · Cancel anytime
            </Text>
          </View>

          <View className="mt-5">
            <TactileButton
              label="YES, I'LL TRY IT FOR $4.99"
              onPress={() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                onAccept();
              }}
            />
            <Pressable onPress={onDismiss} className="mt-3 items-center py-2">
              <Text className="text-sm text-ink-muted">
                No thanks, continue with free
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default React.memo(DiscountInterceptModal);
