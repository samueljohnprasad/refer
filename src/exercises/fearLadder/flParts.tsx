// ponytail: the small pieces every Fear Ladder step is built from, copied from .agents/fear-ladder.html:
// the question bubble (Happi beside it, or alone), your earlier answer as your own bubble, the paper field,
// the one-line note, flat quick replies, and the ten-cell 0-10 gauge. Presentation only; steps own state.
import React from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { PrototypeSlider } from "@/src/components/exercise/PrototypeSlider";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { StepHappiTitle } from "@/src/components/exercise/steps/StepHappiTitle";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";

export const FL = { ink: "#5f7f58", rim: "#29452a", sep: "#e5e5e5", label: "#142414", label3: "#767676" } as const;

/** the question: Happi + her bubble, or the bubble alone when a bigger drawing is already on screen */
export function FLAsk({ title, subtitle, happi = true }: { title: string; subtitle?: string; happi?: boolean }) {
  if (happi) return <StepHappiTitle title={title} subtitle={subtitle} />;
  return (
    <View className="mb-5 rounded-2xl bg-happy-tint p-4">
      <Text variant="h1" accessibilityRole="header" className="text-t-h leading-[28px]">{title}</Text>
      {subtitle ? <Text className="mt-2 text-t-body font-medium leading-[23px] text-happy-label-2">{subtitle}</Text> : null}
    </View>
  );
}

/** what you said earlier comes back as your own bubble */
export function FLSaid({ label, text }: { label: string; text?: string }) {
  const trimmed = text?.trim();
  if (!trimmed) return null;
  return (
    <View className="mb-4 items-end">
      <Text className="mb-1 text-t-foot font-semibold text-happy-label-3">{label}</Text>
      <View className="max-w-[85%] rounded-2xl rounded-br-[4px] bg-happy-ink px-4 py-3">
        <Text className="font-semibold leading-[22px] text-white">{trimmed}</Text>
      </View>
    </View>
  );
}

/** your reply is paper, not a box: big type on a hairline */
export function FLPaper({ value, onChangeText, placeholder, label, maxLength, editable = true, autoFocus }: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  label: string;
  maxLength: number;
  editable?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={FL.label3}
      accessibilityLabel={label}
      maxLength={maxLength}
      editable={editable}
      autoFocus={autoFocus}
      multiline
      textAlignVertical="top"
      style={{
        minHeight: 104,
        paddingVertical: 8,
        paddingHorizontal: 0,
        borderBottomWidth: 2,
        borderBottomColor: FL.sep,
        fontFamily: APP_FONT_FAMILIES.bold,
        fontSize: 20,
        lineHeight: 27,
        color: FL.label,
      }}
    />
  );
}

export function FLNote({ text, ok }: { text: string; ok?: boolean }) {
  return (
    <Text accessibilityLiveRegion="polite" className={`mt-2 min-h-[18px] px-1 text-t-foot ${ok ? "text-happy-accent" : "text-happy-label-3"}`}>
      {text}
    </Text>
  );
}

/** suggestions that fill a field: flat chips like suggested messages, scrolling sideways */
export function FLQuick({ items, onPick, label = "Or tap one to use it" }: { items: readonly string[]; onPick: (t: string) => void; label?: string }) {
  if (items.length === 0) return null;
  return (
    <View>
      <Text className="mt-6 text-t-foot font-semibold text-happy-label-3">{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingTop: 8, paddingBottom: 4 }} keyboardShouldPersistTaps="handled">
        {items.map((t) => (
          <Pressable
            key={t}
            onPress={() => {
              Haptics.selectionAsync().catch(() => {});
              onPick(t);
            }}
            accessibilityRole="button"
            className="max-w-[300px] rounded-2xl rounded-br-[4px] bg-happy-surface-2 px-4 py-3 active:bg-happy-tint"
          >
            <Text className="text-t-sub leading-[20px] text-happy-label">{t}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/** ten cells filled up to `value`, under the shared tall-thumb slider */
export function FLScale({ value, onChange, label, disabled }: { value: number; onChange: (v: number) => void; label: string; disabled?: boolean }) {
  return (
    <PrototypeSlider value={value} onChange={onChange} label={label} disabled={disabled}>
      {Array.from({ length: 10 }, (_, i) => (
        <View
          key={i}
          className="flex-1"
          style={{ borderRadius: 6, borderWidth: 2, borderColor: i < value ? FL.rim : FL.sep, backgroundColor: i < value ? FL.ink : "transparent" }}
        />
      ))}
    </PrototypeSlider>
  );
}
