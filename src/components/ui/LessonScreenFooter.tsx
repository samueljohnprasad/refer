import React, { type ReactElement } from "react";
import { Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/src/components/ui/Button";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";

type FooterVariant = "solid" | "transparent";

export interface LessonScreenFooterProps {
  /** Label for the primary (3-D depth) button. @default "Continue" */
  primaryLabel?: string;
  /** Callback fired when the primary button is pressed. */
  onPrimaryPress: () => void;
  /** Disable the primary button. @default false */
  primaryDisabled?: boolean;
  /** Show a loading spinner in the primary button. @default false */
  primaryLoading?: boolean;
  /** Optional icon on the left side of the primary button. */
  primaryLeftIcon?: ReactElement;
  /** Optional icon on the right side of the primary button. */
  primaryRightIcon?: ReactElement;
  /** Label for the ghost secondary button. Omit to hide it. */
  secondaryLabel?: string;
  /** Callback fired when the secondary button is pressed. */
  onSecondaryPress?: () => void;
  /** Disable the secondary button. @default false */
  secondaryDisabled?: boolean;
  /** Background variant for the footer sheet. @default "solid" */
  variant?: FooterVariant;
  /** Custom style applied to the outer footer container. */
  style?: StyleProp<ViewStyle>;
  /** Custom className for the footer container. */
  className?: string;
  /** Status of the action footer */
  status?: "default" | "success" | "error";
  statusMessage?: string;
}

export function LessonScreenFooter({
  primaryLabel = "Continue",
  onPrimaryPress,
  primaryDisabled = false,
  primaryLoading = false,
  primaryLeftIcon,
  primaryRightIcon,
  secondaryLabel,
  onSecondaryPress,
  secondaryDisabled = false,
  variant = "solid",
  style,
  className,
  status = "default",
  statusMessage,
}: LessonScreenFooterProps) {
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <ScreenLayout.Footer
      variant={variant}
      style={style}
      className={`${className || ""} ${
        isSuccess
          ? "bg-sage-selected border-t border-sage-200"
          : isError
          ? "bg-red-100 border-t border-red-200"
          : variant === "transparent"
          ? "bg-transparent border-t-0"
          : "bg-white border-t border-brand-border"
      }`}
    >
      <View className="w-full gap-1">
        {isSuccess ? (
          <View className="mb-4 flex-row items-center">
            <View className="mr-4 h-8 w-8 items-center justify-center rounded-full bg-sage-500">
              <Feather name="check" size={20} color="white" />
            </View>
            <Text className="text-xl font-bold text-sage-700">Awesome!</Text>
          </View>
        ) : null}
        {isError ? (
          <View className="mb-4 flex-row items-start">
            <View className="mr-3 mt-0.5 h-8 w-8 items-center justify-center rounded-full bg-red-500">
              <Feather name="x" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-[17px] font-bold leading-[22px] text-red-500">
                Try another way
              </Text>
              {statusMessage ? (
                <Text className="mt-1 text-[13px] leading-[18px] text-red-700">
                  {statusMessage}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}

        <Button
          label={primaryLabel}
          onPress={onPrimaryPress}
          disabled={primaryDisabled}
          loading={primaryLoading}
          leftIcon={primaryLeftIcon}
          rightIcon={primaryRightIcon}
          variant={isError ? "danger" : "primary"}
          fullWidth
        />

        {secondaryLabel && onSecondaryPress ? (
          <Button
            label={secondaryLabel}
            onPress={onSecondaryPress}
            disabled={secondaryDisabled}
            variant="ghost"
            fullWidth
          />
        ) : null}
      </View>
    </ScreenLayout.Footer>
  );
}

export type { FooterVariant as LessonScreenFooterVariant };
