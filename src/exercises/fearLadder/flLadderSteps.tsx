// ponytail: building the ladder, rating each rung, and choosing where to start, as .agents/fear-ladder.html
// draws them. Rungs are strings and ratings are keyed by rung text (see FearLadderResponse), so removing
// or reordering never shifts an answer. No legacy composer, chips or choice cards.
import React, { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Text } from "@/src/components/ui/Text";
import { rungRating, rungsByEase, suggestedRung } from "@/src/domains/exercises/domain/fearLadder";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import type { FearLadderResponse, StepProps } from "@/src/types/exerciseFlow";
import { FLLadder } from "./flArt";
import { FL, FLAsk, FLQuick, FLSaid, FLScale } from "./flParts";

type Props = StepProps<FearLadderResponse>;

export const MIN_RUNGS = 3;
export const MAX_RUNGS = 5;

const buzz = () => Haptics.selectionAsync().catch(() => {});

const EASY_TO_HARD = [
  "Ask a coworker a quick question",
  "Share an opinion in a small group chat",
  "Speak for one minute in the team meeting",
] as const;

export const FLRungsStep: React.FC<Props> = ({ response, onUpdate, readOnly }) => {
  const [draft, setDraft] = useState("");
  const { rungs } = response;
  const full = rungs.length >= MAX_RUNGS;
  const canAdd = !readOnly && !full && draft.trim().length > 0;

  const put = (raw: string) => {
    const text = raw.trim();
    if (!text || full || rungs.includes(text)) return;
    buzz();
    onUpdate({ rungs: [...rungs, text] });
  };
  const add = () => {
    put(draft);
    setDraft("");
  };
  const remove = (text: string) => {
    const { [text]: _gone, ...rungRatings } = response.rungRatings;
    onUpdate({ rungs: rungs.filter((r) => r !== text), rungRatings });
  };
  const count = full ? "Ladder is full" : rungs.length < MIN_RUNGS ? `${rungs.length} of ${MIN_RUNGS} to start` : `${rungs.length} of ${MAX_RUNGS}`;

  return (
    <View>
      <FLSaid label="The fear" text={response.fear} />
      <FLAsk title="What are some smaller versions of it?" subtitle={`Add ${MIN_RUNGS} to ${MAX_RUNGS}, from gentle to hard. One rung lights up for each.`} happi={false} />
      <View className="mb-3 self-center"><FLLadder n={rungs.length} /></View>
      <View className="mb-4 flex-row items-end gap-2 rounded-[28px] bg-happy-surface-2 py-1 pl-4 pr-1">
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="One small step"
          placeholderTextColor={FL.label3}
          accessibilityLabel="One small step"
          maxLength={160}
          editable={!readOnly && !full}
          multiline
          blurOnSubmit
          returnKeyType="done"
          onSubmitEditing={() => canAdd && add()}
          style={{ flex: 1, minHeight: 44, maxHeight: 144, paddingVertical: 12, fontFamily: APP_FONT_FAMILIES.medium, fontSize: 17, lineHeight: 23, color: FL.label }}
        />
        <Pressable
          onPress={add}
          disabled={!canAdd}
          accessibilityRole="button"
          accessibilityLabel="Add"
          className="h-11 w-11 items-center justify-center rounded-full"
          style={{ backgroundColor: canAdd ? FL.ink : "transparent", borderBottomWidth: canAdd ? 4 : 0, borderBottomColor: FL.rim }}
        >
          <Feather name="plus" size={22} color={canAdd ? "#fff" : FL.label3} />
        </Pressable>
      </View>
      <Text className="mb-2 text-t-foot font-bold text-happy-label-3" accessibilityLiveRegion="polite">{count}</Text>
      {rungs.length > 0 ? (
        <View style={{ borderBottomWidth: 1, borderBottomColor: FL.sep }}>
          {rungs.map((text) => (
            <View key={text} className="min-h-11 flex-row items-center gap-2 py-2" style={{ borderTopWidth: 1, borderTopColor: FL.sep }}>
              <View className="mr-1 h-2 w-2 rounded-full bg-happy-ink" />
              <Text className="flex-1 text-t-body font-medium text-happy-label">{text}</Text>
              {readOnly ? null : (
                <Pressable onPress={() => remove(text)} accessibilityRole="button" accessibilityLabel={`Remove ${text}`} className="h-11 w-11 items-center justify-center rounded-full active:bg-happy-surface-2">
                  <Feather name="x" size={22} color={FL.label3} />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      ) : null}
      {readOnly ? null : <FLQuick items={EASY_TO_HARD} onPick={put} />}
    </View>
  );
};

export const FLRateStep: React.FC<Props> = ({ response, onUpdate, readOnly }) => (
  <View>
    <FLAsk title="How scary is each one?" subtitle="Rate every rung from 0 to 10. The ladder lines itself up." />
    <View>
      {response.rungs.map((text, i) => {
        const value = rungRating(response.rungRatings, text);
        return (
          <View
            key={text}
            className="pb-2 pt-4"
            style={{ borderTopWidth: 1, borderTopColor: FL.sep, borderBottomWidth: i === response.rungs.length - 1 ? 1 : 0, borderBottomColor: FL.sep }}
          >
            <View className="flex-row items-baseline justify-between gap-3">
              <Text className="flex-1 font-bold leading-[21px] text-happy-label">{text}</Text>
              <Text className="font-display text-t-lead text-happy-accent">{value}</Text>
            </View>
            <View className="mt-1">
              <FLScale value={value} label={text} disabled={readOnly} onChange={(v) => onUpdate({ rungRatings: { ...response.rungRatings, [text]: v } })} />
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

/** one rung of the route: its rating in a circle, its words, an optional tag. `onPress` makes it a choice. */
export function FLRungRow({ text, num, tag, tone = "rest", onPress }: {
  text: string;
  num: React.ReactNode;
  tag?: string;
  tone?: "rest" | "on" | "done";
  onPress?: () => void;
}) {
  const on = tone === "on";
  const inked = tone !== "rest";
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={onPress ? { selected: on } : undefined}
      className="min-h-[68px] flex-row items-center gap-3 rounded-2xl px-4 py-3 active:opacity-90"
      style={{
        borderWidth: 2,
        borderColor: on ? FL.ink : FL.sep,
        borderBottomWidth: on ? 4 : 2,
        borderBottomColor: on ? FL.rim : FL.sep,
        backgroundColor: on ? "#f2f8ef" : "#fff",
      }}
    >
      <View className="h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: inked ? FL.ink : "#f2f8ef" }}>
        {typeof num === "number" || typeof num === "string"
          ? <Text className="font-semibold" style={{ color: inked ? "#fff" : "#44633f", fontVariant: ["tabular-nums"] }}>{num}</Text>
          : num}
      </View>
      <Text className="flex-1 font-bold leading-[21px]" style={{ color: tone === "done" ? "#4b4b4b" : FL.label }}>{text}</Text>
      {tag ? (
        <View className="rounded-full px-3 py-0.5" style={{ backgroundColor: on ? "#fff" : "#f2f8ef" }}>
          <Text className="text-t-foot font-bold text-happy-accent">{tag}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

/** the ladder as a route, hardest on top: rows joined by a line */
export function FLRoute({ children }: { children: React.ReactNode[] }) {
  const rows = React.Children.toArray(children);
  return (
    <View>
      {rows.map((row, i) => (
        <View key={i} style={{ marginBottom: i < rows.length - 1 ? 12 : 0 }}>
          {row}
          {i < rows.length - 1 ? <View style={{ position: "absolute", left: 33, top: "100%", height: 12, width: 2, backgroundColor: FL.sep }} /> : null}
        </View>
      ))}
    </View>
  );
}

export const FLPickStep: React.FC<Props> = ({ response, onUpdate, readOnly }) => {
  const { rungs, rungRatings, pickedRung } = response;
  const suggested = suggestedRung(rungs, rungRatings);
  const picked = rungs.includes(pickedRung) ? pickedRung : suggested;
  const startAnxiety = picked ? rungRating(rungRatings, picked) : response.startAnxiety;

  // a suggested rung is chosen on arrival, and "before" always follows that rung's current rating
  useEffect(() => {
    if (readOnly || !picked) return;
    if (picked !== pickedRung || startAnxiety !== response.startAnxiety) onUpdate({ pickedRung: picked, startAnxiety });
  }, [readOnly, picked, pickedRung, startAnxiety, response.startAnxiety, onUpdate]);

  return (
    <View>
      <FLAsk title="Here is your ladder. Where do you want to start?" subtitle="Start low. Around 3 or 4 out of 10 is a good first rung." />
      <FLRoute>
        {[...rungsByEase(rungs, rungRatings)].reverse().map((text) => (
          <FLRungRow
            key={text}
            text={text}
            num={rungRating(rungRatings, text)}
            tone={text === picked ? "on" : "rest"}
            tag={text === picked ? "Start here" : text === suggested ? "Suggested" : undefined}
            onPress={readOnly ? undefined : () => { buzz(); onUpdate({ pickedRung: text, startAnxiety: rungRating(rungRatings, text) }); }}
          />
        ))}
      </FLRoute>
    </View>
  );
};
