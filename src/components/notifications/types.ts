import type { ComponentProps } from "react";
import type { OpaqueColorValue } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export type FeatherName = ComponentProps<typeof Feather>["name"];
export type MCName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * Base reminder item structure
 */
export type ReminderTemplate = {
  id: string;
  hour: number;
  minute: number;
};

export type ReminderItem = ReminderTemplate & {
  title: string;
  notificationBody: string;
};

export type ReminderTemplateWithIcon = ReminderTemplate &
  ({ iconLib: "fe"; icon: FeatherName } | { iconLib: "mc"; icon: MCName });

/**
 * Color scheme for reminder cards
 */
export type ReminderColorScheme = {
  bg: string | OpaqueColorValue;
  border: string | OpaqueColorValue;
  text: string | OpaqueColorValue;
  icon: string | OpaqueColorValue;
};
