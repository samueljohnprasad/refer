import { memo, useCallback, useMemo, type ReactElement } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";

import { Mascot } from "@/src/components/ui/Mascot";
import {
  HappyAssistantCommandEnum,
  type HappyAssistantCommand,
} from "@/src/store/slices/happyAssistantSlice";
import type { HappyAssistantActionDescriptor } from "./types";

interface AssistantActionSheetProps {
  title: string;
  subtitle: string;
  actions: HappyAssistantActionDescriptor[];
  onCommandPress: (command: HappyAssistantCommand) => void;
}

export function AssistantActionSheet({
  title,
  subtitle,
  actions,
  onCommandPress,
}: AssistantActionSheetProps): ReactElement {
  const handleSettingsPress = useCallback((): void => {
    onCommandPress(HappyAssistantCommandEnum.OpenSettings);
  }, [onCommandPress]);

  return (
    <View
      className="rounded-[28px] bg-white px-5 pt-4 pb-5"
      style={styles.sheet}
    >
      <View className="mb-4 flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-[#F0FDF4]">
          <Mascot state="panda-happy" size={46} />
        </View>
        <View className="flex-1">
          <Text
            className="text-[28px] leading-8 text-slate-950"
            style={{ fontFamily: "CormorantSemiBold" }}
          >
            {title}
          </Text>
          <Text className="mt-0.5 text-sm font-medium leading-5 text-slate-500">
            {subtitle}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={handleSettingsPress}
          className="h-11 w-11 items-center justify-center rounded-full bg-slate-100 active:opacity-80"
          style={styles.iconButton}
        >
          <HugeiconsIcon icon={Settings02Icon} size={21} color="#334155" />
        </Pressable>
      </View>

      <View className="gap-2">
        {actions.map((action) => (
          <AssistantActionRow
            key={action.id}
            action={action}
            onCommandPress={onCommandPress}
          />
        ))}
      </View>
    </View>
  );
}

const AssistantActionRow = memo(function AssistantActionRow({
  action,
  onCommandPress,
}: {
  action: HappyAssistantActionDescriptor;
  onCommandPress: (command: HappyAssistantCommand) => void;
}): ReactElement {
  const iconBackgroundStyle = useMemo(
    () => [styles.actionIcon, { backgroundColor: `${action.tint}18` }],
    [action.tint],
  );
  const handlePress = useCallback((): void => {
    onCommandPress(action.command);
  }, [action.command, onCommandPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.label}
      accessibilityHint={action.description}
      onPress={handlePress}
      className="min-h-[70px] flex-row items-center rounded-2xl border border-slate-100 bg-slate-50 px-3.5 py-3 active:opacity-80"
      style={styles.actionRow}
    >
      <View
        className="mr-3 h-11 w-11 items-center justify-center rounded-2xl"
        style={iconBackgroundStyle}
      >
        <HugeiconsIcon icon={action.icon} size={22} color={action.tint} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-extrabold text-slate-900">
          {action.label}
        </Text>
        <Text
          className="mt-0.5 text-[13px] font-medium leading-4 text-slate-500"
          numberOfLines={2}
        >
          {action.description}
        </Text>
      </View>
      <HugeiconsIcon icon={ArrowRight01Icon} size={18} color="#94A3B8" />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  sheet: {
    borderCurve: "continuous",
  },
  iconButton: {
    borderCurve: "continuous",
  },
  actionRow: {
    borderCurve: "continuous",
  },
  actionIcon: {
    borderCurve: "continuous",
  },
});
