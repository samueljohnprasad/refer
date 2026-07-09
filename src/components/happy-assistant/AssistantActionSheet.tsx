import { memo, useCallback, type ReactElement } from "react";
import { Pressable, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowRight01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import * as Haptics from "expo-haptics";

import { Mascot } from "@/src/components/ui/Mascot";
import {
  HappyAssistantCommandEnum,
  type HappyAssistantCommand,
} from "@/src/store/slices/happyAssistantSlice";
import type { HappyAssistantActionDescriptor } from "./types";
import { INK_SOFT, SAGE } from "@/lib/tokens";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";

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
    void Haptics.selectionAsync();
    onCommandPress(HappyAssistantCommandEnum.OpenSettings);
  }, [onCommandPress]);

  return (
    <View className="flex-1 px-5 pt-8">
      <View className="mb-4 flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-2xl">
          <Mascot state="panda-happy" size={46} />
        </View>
        <View className="flex-1">
          <Text
            variant="body-bold"
            className="text-[26px] leading-8 tracking-tight"
          >
            {title}
          </Text>
          <Text variant="body" color="muted" className="mt-0.5 text-[15px] leading-5">
            {subtitle}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={handleSettingsPress}
          className="h-11 w-11 items-center justify-center rounded-full active:opacity-80"
        >
          <HugeiconsIcon icon={Settings02Icon} size={22} color={SAGE[600]} />
        </Pressable>
      </View>

      <View className="gap-2">
        {actions.map((action, index) => (
          <AssistantActionRow
            key={action.id}
            action={action}
            onCommandPress={onCommandPress}
            isPrimary={index === 0}
          />
        ))}
      </View>
    </View>
  );
}

const AssistantActionRow = memo(function AssistantActionRow({
  action,
  onCommandPress,
  isPrimary,
}: {
  action: HappyAssistantActionDescriptor;
  onCommandPress: (command: HappyAssistantCommand) => void;
  isPrimary?: boolean;
}): ReactElement {
  const handlePress = useCallback((): void => {
    void Haptics.selectionAsync();
    onCommandPress(action.command);
  }, [action.command, onCommandPress]);

  if (isPrimary) {
    return (
      <Card
        variant="tile"
        radius="lg"
        showDepth={true}
        onPress={handlePress}
        className="mb-1.5"
        contentClassName="min-h-[72px] flex-row items-center px-4 py-3.5 bg-white border border-white/60 rounded-2xl"
        accessibilityRole="button"
        accessibilityLabel={action.label}
        accessibilityHint={action.description}
      >
        <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-sage-100">
          <HugeiconsIcon icon={action.icon} size={22} color={SAGE[600]} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text variant="body-bold" className="text-[16px]">
              {action.label}
            </Text>
            <View className="rounded-full bg-sage-pill px-2 py-0.5">
              <Text
                variant="body-bold"
                className="text-[10px] tracking-wide text-sage-700"
              >
                RECOMMENDED
              </Text>
            </View>
          </View>
          <Text
            variant="body"
            color="muted"
            className="mt-0.5 text-[14px] leading-4"
            numberOfLines={1}
          >
            {action.description}
          </Text>
        </View>
        <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={SAGE[400]} />
      </Card>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      className="mb-1.5 min-h-[64px] flex-row items-center px-4 py-3 rounded-2xl active:bg-sage-100/40"
      accessibilityRole="button"
      accessibilityLabel={action.label}
      accessibilityHint={action.description}
    >
      <View className="mr-3 h-10 w-10 items-center justify-center rounded-2xl bg-white/50">
        <HugeiconsIcon icon={action.icon} size={20} color={INK_SOFT} />
      </View>
      <View className="flex-1">
        <Text variant="body-bold" className="text-[15px]">
          {action.label}
        </Text>
        <Text
          variant="body"
          color="soft"
          className="mt-0.5 text-[13px] leading-4"
          numberOfLines={1}
        >
          {action.description}
        </Text>
      </View>
      <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={INK_SOFT} />
    </Pressable>
  );
});
