import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { useMemo, type ReactElement } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import EmotionLogger from "@/src/components/EmotionLogger";

interface AssistantMoodSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function AssistantMoodSheet({
  visible,
  onClose,
}: AssistantMoodSheetProps): ReactElement {
  const selectedDate = useMemo(() => new Date(), [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close mood check"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.copy}>
            <Text
              className="text-2xl text-slate-950"
              style={styles.title}
            >
              Mood check
            </Text>
            <Text className="text-sm font-medium leading-5 text-slate-500">
              Mark how today feels. One tap is enough.
            </Text>
          </View>
          <EmotionLogger selectedDate={selectedDate} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 88,
    backgroundColor: "rgba(15, 23, 42, 0.28)",
  },
  sheet: {
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderRadius: 28,
    borderCurve: "continuous",
    backgroundColor: "white",
    boxShadow: "0 14px 28px rgba(15, 23, 42, 0.18)",
  },
  handle: {
    alignSelf: "center",
    width: 42,
    height: 4,
    borderRadius: 999,
    borderCurve: "continuous",
    backgroundColor: "#E2E8F0",
  },
  copy: {
    gap: 4,
  },
  title: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
  },
});
