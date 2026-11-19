// ponytail: the prototype's step 3 pair — the step-2 answer as a tilted snapshot with two thought-puffs
// floating up from it, and the bubble the thought itself is written in (warm wash, thick soft base).
import React from "react";
import { Text, View } from "react-native";

const WASH = "#f6ecd8";
const SAND = "#ead7b5";

export function TRSnapshot({ text }: { text?: string }): React.JSX.Element | null {
  const trimmed = text?.trim();
  if (!trimmed) return null;
  return (
    <>
      <View
        className="mb-2 ml-1 self-start bg-white px-2 pb-3 pt-2"
        style={{ maxWidth: "78%", borderRadius: 6, transform: [{ rotate: "-2.5deg" }], borderWidth: 1, borderColor: "#e5e5e5" }}
      >
        <View className="rounded-[3px] bg-happy-surface-2 px-3 py-2">
          <Text className="text-t-sub font-semibold leading-[20px] text-happy-label">{trimmed}</Text>
        </View>
        <Text className="mx-1 mt-2 text-t-foot font-bold text-happy-label-2">What happened</Text>
      </View>
      <View className="mb-1 items-start gap-[5px]" style={{ marginLeft: 28 }} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: WASH, borderBottomWidth: 3, borderBottomColor: SAND }} />
        <View style={{ width: 20, height: 20, borderRadius: 10, marginLeft: 12, backgroundColor: WASH, borderBottomWidth: 3, borderBottomColor: SAND }} />
      </View>
    </>
  );
}

export function TRThoughtBubble({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={{ backgroundColor: WASH, borderRadius: 36, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 5, borderBottomColor: SAND }}>
      {children}
    </View>
  );
}

// step 9: the old thought as a crooked dashed frame, the new one as a straight wooden frame to write in
export function TROldThought({ text }: { text?: string }): React.JSX.Element | null {
  const trimmed = text?.trim();
  if (!trimmed) return null;
  return (
    <View
      className="mx-3 mt-5 px-4 py-3"
      style={{ borderWidth: 3, borderStyle: "dashed", borderColor: "#8fb184", borderRadius: 16, transform: [{ rotate: "-2deg" }] }}
    >
      <Text className="mb-0.5 text-t-foot font-bold text-happy-label-2">The stuck version</Text>
      <Text className="text-t-sub font-bold text-happy-label-2">{trimmed}</Text>
    </View>
  );
}

export function TRNewFrame({ label, children }: { label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <View className="mt-4 p-3" style={{ backgroundColor: "#ecd496", borderRadius: 20, borderBottomWidth: 5, borderBottomColor: "#d8b86e" }}>
      <View className="px-4 pb-4 pt-3" style={{ backgroundColor: "#fffaf0", borderRadius: 10 }}>
        <Text className="mb-0.5 text-t-foot font-bold text-happy-label-2">{label}</Text>
        {children}
      </View>
    </View>
  );
}
