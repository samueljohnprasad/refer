import React from "react";
import { StyleSheet, Text } from "react-native";
import type {
  DataSourceMenuProps,
  DataSourceOption,
} from "./data-source-menu.types";

export type { DataSourceMenuProps, DataSourceOption };

export default function DataSourceMenu({ value, style }: DataSourceMenuProps) {
  return <Text style={[styles.triggerLabel, style]}>{value}</Text>;
}

const styles = StyleSheet.create({
  triggerLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
