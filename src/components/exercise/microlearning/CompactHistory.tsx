import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export interface CompactHistoryItem {
  id: string;
  label?: string;
  value: string;
}

interface CompactHistoryProps {
  items: readonly CompactHistoryItem[];
  onEdit?: (id: string) => void;
}

export function CompactHistory({ items, onEdit }: CompactHistoryProps) {
  if (items.length === 0) return null;
  return (
    <View accessibilityLabel="Completed steps" style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <View style={styles.copy}>
            {item.label ? <Text style={styles.label}>{item.label}</Text> : null}
            <Text numberOfLines={2} style={styles.value}>
              {item.value}
            </Text>
          </View>
          {onEdit ? (
            <Pressable
              accessibilityLabel={`Edit ${item.label}`}
              accessibilityRole="button"
              onPress={() => onEdit(item.id)}
              style={({ pressed }) => [styles.edit, pressed && styles.pressed]}
            >
              <Text style={styles.editLabel}>Edit</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    paddingLeft: 14,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  copy: { flex: 1, gap: 2, paddingVertical: 10 },
  label: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  value: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 19,
  },
  edit: { minHeight: 48, justifyContent: "center", paddingHorizontal: 14 },
  editLabel: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
  pressed: { opacity: 0.6 },
});
