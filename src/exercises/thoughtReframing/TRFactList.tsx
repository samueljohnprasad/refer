// ponytail: the prototype's `ul.items` — each fact carries the same stone as the pan it lands in
// (square slate = backs it up, round pebble = goes against it), so colour and shape match the scale.
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export type TRFactKind = "for" | "against";

function Stone({ kind }: { kind: TRFactKind }) {
  return kind === "for" ? (
    <View style={{ width: 14, height: 12, borderRadius: 3, backgroundColor: "#5f7f58", borderBottomWidth: 3, borderBottomColor: "#44633f" }} />
  ) : (
    <View style={{ width: 14, height: 13, borderRadius: 7, backgroundColor: "#f5b942", borderBottomWidth: 3, borderBottomColor: "#e09a24" }} />
  );
}

export function TRFactList({ items, kind, onRemove, readOnly }: {
  items: readonly string[];
  kind: TRFactKind;
  onRemove: (index: number) => void;
  readOnly?: boolean;
}): React.JSX.Element | null {
  if (items.length === 0) return null;
  return (
    <View className="mt-3">
      {items.map((item, i) => (
        <View key={`${i}-${item}`} className="min-h-11 flex-row items-center gap-3 border-t border-happy-sep py-1">
          <Stone kind={kind} />
          <Text className="flex-1 text-t-body font-semibold text-happy-label">{item}</Text>
          {!readOnly && (
            <Pressable
              onPress={() => onRemove(i)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item}`}
              className="h-11 w-11 items-center justify-center"
            >
              <Feather name="x" size={18} color="#4b4b4b" />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}
