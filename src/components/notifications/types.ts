import type { ComponentProps } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

export type FeatherName = ComponentProps<typeof Feather>["name"];
export type MCName = ComponentProps<typeof MaterialCommunityIcons>["name"];

/**
 * Base reminder item structure
 */
export type BaseItem = {
  id: string;
  title: string;
  hour: number;
  minute: number;
  notificationBody: string;
};

export type FeItem = BaseItem & { iconLib: "fe"; icon: FeatherName };
export type McItem = BaseItem & { iconLib: "mc"; icon: MCName };

export type ReminderItem = FeItem | McItem;

/**
 * Color scheme for reminder cards
 */
export type ReminderColorScheme = {
  bg: string;
  border: string;
  text: string;
  icon: string;
};
