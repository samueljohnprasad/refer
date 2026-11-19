// ponytail: step 9's "both stacks to stand on" — the facts for and against, each one tap to open (the
// prototype's <details>). Local open/closed state only; the facts come straight from the response.
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

function Stack({ kind, items }: { kind: "for" | "against"; items: readonly string[] }) {
  const [open, setOpen] = useState(false);
  const count = items.length;
  const marker = kind === "for"
    ? { width: 14, height: 12, borderRadius: 3, backgroundColor: "#5f7f58", borderBottomWidth: 3, borderBottomColor: "#44633f" }
    : { width: 14, height: 13, borderRadius: 7, backgroundColor: "#f5b942", borderBottomWidth: 3, borderBottomColor: "#e09a24" };
  const heading = count === 0
    ? kind === "for" ? "No facts backing it up" : "No facts against it"
    : kind === "for"
      ? `${count} ${count === 1 ? "fact backs" : "facts back"} it up`
      : `${count} ${count === 1 ? "fact goes" : "facts go"} against it`;
  return (
    <View className="border-b border-happy-sep">
      <Pressable
        disabled={count === 0}
        onPress={() => setOpen((v) => !v)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open, disabled: count === 0 }}
        className="min-h-12 flex-row items-center gap-2 px-1"
      >
        <View style={marker} />
        <Text className="flex-1 text-t-sub font-bold text-happy-label">{heading}</Text>
        {count > 0 && <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color="#4b4b4b" />}
      </Pressable>
      {open && (
        <View className="gap-1 pb-3 pl-[30px] pr-1">
          {items.map((t, i) => (
            <Text key={`${i}-${t}`} className="text-t-sub font-semibold text-happy-label-2">{t}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

export function TREvidenceStacks({ evidenceFor, evidenceAgainst }: { evidenceFor?: readonly string[]; evidenceAgainst?: readonly string[] }): React.JSX.Element {
  return (
    <View>
      <Stack kind="for" items={evidenceFor ?? []} />
      <Stack kind="against" items={evidenceAgainst ?? []} />
    </View>
  );
}
