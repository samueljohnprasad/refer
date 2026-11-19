// ponytail: the prototype's writing controls (.agents/thought-reframing.html): a bare field with no box of
// its own (the viewfinder / thought bubble / frame around it is the box), the one-line note, the
// quick-reply chips and the fact row. Presentation only; steps own the state.
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

const INK = "#5f7f58";
const INK_RIM = "#29452a";

export function TRInput({ value, onChangeText, placeholder, label, maxLength, editable = true, size = "lg", onFocus }: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  label: string;
  maxLength: number;
  editable?: boolean;
  size?: "xl" | "lg";
  onFocus?: () => void;
}) {
  const xl = size === "xl";
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onFocus={onFocus}
      placeholder={placeholder}
      placeholderTextColor="#6b6b6b"
      accessibilityLabel={label}
      maxLength={maxLength}
      editable={editable}
      multiline
      textAlignVertical="top"
      style={{
        minHeight: xl ? 144 : 96,
        padding: 0,
        fontFamily: APP_FONT_FAMILIES.bold,
        fontSize: xl ? 24 : 20,
        lineHeight: xl ? 31 : 28,
        color: "#142414",
      }}
    />
  );
}

/** step 2: a viewfinder, so the answer is what a camera would have caught */
export function TRViewfinder(props: React.ComponentProps<typeof TRInput>) {
  return (
    <View className="rounded-[20px] bg-happy-surface-2 px-4 pb-3 pt-4">
      <TRInput {...props} size="xl" />
    </View>
  );
}

export function TRNote({ text, ok }: { text: string; ok?: boolean }) {
  return (
    <Text accessibilityLiveRegion="polite" className={`mt-2 min-h-[18px] text-t-foot font-semibold ${ok ? "text-happy-accent" : "text-happy-label-3"}`}>
      {text}
    </Text>
  );
}

export function TRQuickReplies({ label, items, onPick, selected }: {
  label: string;
  items: readonly string[];
  onPick: (text: string) => void;
  selected?: string;
}) {
  if (items.length === 0) return null;
  return (
    <View>
      <Text className="mt-6 text-t-foot font-bold text-happy-label-2">{label}</Text>
      <View className="mt-2 flex-row flex-wrap gap-2">
        {items.map((t) => {
          const on = selected === t;
          return (
            <Pressable
              key={t}
              onPress={() => onPick(t)}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              className="min-h-11 max-w-full justify-center rounded-full px-4 py-2 active:scale-[0.97]"
              style={{ backgroundColor: on ? "#eef3ea" : "#f7f7f7", borderWidth: 2, borderColor: on ? INK : "transparent" }}
            >
              <Text className="text-t-sub font-semibold leading-[20px] text-happy-label">{t}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** steps 7-8: one fact at a time, a stone beside the field, a round add button at its end */
export function TRFactRow({ marker, value, onChangeText, onAdd, canAdd, placeholder, editable = true }: {
  marker: React.ReactNode;
  value: string;
  onChangeText: (t: string) => void;
  onAdd: () => void;
  canAdd: boolean;
  placeholder: string;
  editable?: boolean;
}) {
  return (
    <View className="flex-row items-end gap-2 rounded-[28px] bg-happy-surface-2 py-1 pl-4 pr-1">
      <View className="self-center">{marker}</View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6b6b6b"
        accessibilityLabel={placeholder}
        maxLength={240}
        editable={editable}
        multiline
        blurOnSubmit
        returnKeyType="done"
        onSubmitEditing={() => canAdd && onAdd()}
        style={{ flex: 1, minHeight: 44, maxHeight: 144, paddingVertical: 12, fontFamily: APP_FONT_FAMILIES.semiBold, fontSize: 17, lineHeight: 23, color: "#142414" }}
      />
      <Pressable
        onPress={onAdd}
        disabled={!canAdd}
        accessibilityRole="button"
        accessibilityLabel="Put this fact on the scale"
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: canAdd ? INK : "#e5e5e5", borderBottomWidth: 4, borderBottomColor: canAdd ? INK_RIM : "#cfcfcf" }}
      >
        <Feather name="plus" size={22} color={canAdd ? "#fff" : "#4b4b4b"} />
      </Pressable>
    </View>
  );
}
