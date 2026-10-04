import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React from "react";
import { Text, View, Modal, Pressable } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import MochiMascot from "./MochiMascot";
import TactileButton from "./TactileButton";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("onboarding");
  const offerPrice = "$4.99";
  const regularPrice = "$14.99";
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
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.bold }}
              className="mt-2 text-xs font-bold uppercase tracking-widest text-sage-500"
            >
              {t("paywall.discount.wait")}
            </Text>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
              className="mt-2 text-center text-2xl text-ink"
            >
              {t("paywall.discount.title", { price: offerPrice })}
            </Text>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.regular }}
              className="mt-2 text-center text-sm text-ink-soft"
            >
              {t("paywall.discount.description")}
            </Text>
          </View>

          <View className="mt-5 rounded-2xl bg-sage-50 p-4">
            <View className="flex-row items-center justify-between">
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                className="text-xl text-sage-700"
              >
                {offerPrice}
              </Text>
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.regular }}
                className="text-sm text-ink-muted line-through"
              >
                {regularPrice}
              </Text>
            </View>
            <Text
              style={{ fontFamily: APP_FONT_FAMILIES.regular }}
              className="mt-1 text-xs text-ink-muted"
            >
              {t("paywall.discount.afterMonth", { price: regularPrice })}
            </Text>
          </View>

          <View className="mt-5">
            <TactileButton
              label={t("paywall.discount.accept", { price: offerPrice })}
              onPress={() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                onAccept();
              }}
            />
            <Pressable onPress={onDismiss} className="mt-3 items-center py-2">
              <Text
                style={{ fontFamily: APP_FONT_FAMILIES.semiBold }}
                className="text-sm text-ink-muted"
              >
                {t("paywall.discount.decline")}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default React.memo(DiscountInterceptModal);
