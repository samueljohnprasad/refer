import { memo, useCallback, type ReactElement } from "react";
import { Pressable, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon, Settings02Icon } from "@hugeicons/core-free-icons";

import { Mascot } from "@/src/components/ui/Mascot";
import {
  HappyAssistantCommandEnum,
  type HappyAssistantCommand,
} from "@/src/store/slices/happyAssistantSlice";
import type { HappyAssistantActionDescriptor } from "./types";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { Text } from "@/src/components/ui/Text";

interface AssistantActionSheetProps {
  title: string;
  subtitle: string;
  actions: HappyAssistantActionDescriptor[];
  onCommandPress: (command: HappyAssistantCommand) => void;
}

// ponytail: polished quick-action sheet styling per audit
export function AssistantActionSheet({
  title,
  subtitle,
  actions,
  onCommandPress,
}: AssistantActionSheetProps): ReactElement {
  const quickActions = actions.filter((action) => !isAccountAction(action));
  const accountAction = actions.find(isAccountAction);

  const handleSettingsPress = useCallback((): void => {
    onCommandPress(HappyAssistantCommandEnum.OpenSettings);
  }, [onCommandPress]);

  return (
    <View className="flex-1 px-5 pb-4 pt-6">
      <View className="mb-3.5 flex-row items-center gap-3">
        <Pressable
          className="h-12 w-12 items-center justify-center rounded-xl active:opacity-80"
          onPress={() => {
            onCommandPress(HappyAssistantCommandEnum.GoHome);
          }}
          accessibilityRole="button"
          accessibilityLabel="Go to Home Screen"
        >
          <Mascot state="panda-happy" size={42} />
        </Pressable>
        <View className="flex-1">
          <Text
            variant="body-bold"
            className="text-[21px] leading-6 tracking-tight text-ink"
          >
            {title}
          </Text>
          <Text
            variant="body"
            className="mt-0.5 text-[14px] leading-5 text-[#636366]"
            style={{ color: "#636366" }}
          >
            {subtitle}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={handleSettingsPress}
          className="h-11 w-11 items-center justify-center rounded-full active:opacity-80"
        >
          <HugeiconsIcon
            icon={Settings02Icon}
            size={17}
            color="#8E8E93"
          />
        </Pressable>
      </View>

      <View className="gap-2">
        {quickActions.map((action) => (
          <AssistantActionRow
            key={action.id}
            action={action}
            onCommandPress={onCommandPress}
          />
        ))}
      </View>

      {accountAction ? (
        <View className="mt-3.5 border-t border-black/[0.06] pt-2">
          <AssistantAccountActionRow
            action={accountAction}
            onCommandPress={onCommandPress}
          />
        </View>
      ) : null}
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
    <Pressable
      onPress={handlePress}
      className="min-h-[52px] flex-row items-center rounded-lg bg-white/60 px-3 py-2 active:bg-white/90"
      accessibilityRole="button"
      accessibilityLabel={action.label}
      accessibilityHint={action.description}
    >
      <View className="mr-3 h-8 w-8 items-center justify-center rounded-lg bg-sage-100">
        <HugeiconsIcon
          icon={action.icon}
          size={17}
          color={SEMANTIC_COLORS.brand.pressed}
        />
      </View>
      <View className="flex-1">
        <Text variant="body-bold" className="text-[15px]">
          {action.label}
        </Text>
        <Text
          variant="body"
          className="mt-0.5 text-[13px] leading-4 text-[#636366]"
          style={{ color: "#636366" }}
          numberOfLines={1}
        >
          {action.description}
        </Text>
      </View>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={17}
        color="#8E8E93"
      />
    </Pressable>
  );
});

const AssistantAccountActionRow = memo(function AssistantAccountActionRow({
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
    <Pressable
      onPress={handlePress}
      className="min-h-[46px] flex-row items-center rounded-lg px-3 py-1.5 active:bg-white/40"
      accessibilityRole="button"
      accessibilityLabel={action.label}
      accessibilityHint={action.description}
    >
      <View className="flex-1">
        <Text
          variant="label-bold"
          className="text-[14px] font-medium text-[#3A3A3C]"
          style={{ color: "#3A3A3C" }}
        >
          {action.label}
        </Text>
        <Text
          variant="caption"
          className="text-[12px] leading-4 text-[#636366]"
          style={{ color: "#636366" }}
          numberOfLines={1}
        >
          {action.description}
        </Text>
      </View>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={15}
        color="#AEAEB2"
      />
    </Pressable>
  );
});

function isAccountAction(action: HappyAssistantActionDescriptor): boolean {
  return action.command === HappyAssistantCommandEnum.OpenSaveProfile;
}
