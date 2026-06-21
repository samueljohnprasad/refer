import { memo, useCallback, type ReactElement } from "react";
import { Pressable, View } from "react-native";
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
import { INK_MUTED, SAGE } from "@/lib/tokens";
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
            variant="h1"
            className="text-[28px] leading-9 tracking-tight"
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
  const handlePress = useCallback((): void => {
    onCommandPress(action.command);
  }, [action.command, onCommandPress]);

  return (
    <Card
      variant="tile"
      radius="xl"
      showDepth={true}
      onPress={handlePress}
      className="mb-1.5"
      contentClassName="min-h-[72px] flex-row items-center px-4 py-3.5 bg-white/85 border border-white/60 rounded-[20px]"
      accessibilityRole="button"
      accessibilityLabel={action.label}
      accessibilityHint={action.description}
    >
      <View className="mr-3 h-11 w-11 items-center justify-center rounded-icon-well bg-sage-pill">
        <HugeiconsIcon icon={action.icon} size={22} color={SAGE[600]} />
      </View>
      <View className="flex-1">
        <Text variant="body-bold" className="text-[15px]">
          {action.label}
        </Text>
        <Text
          variant="body"
          color="muted"
          className="mt-0.5 text-[13px] leading-4"
          numberOfLines={2}
        >
          {action.description}
        </Text>
      </View>
      <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={SAGE[400]} />
    </Card>
  );
});
