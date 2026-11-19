// ponytail: .agents/fear-ladder.html's summary, built straight from it: before and now as two clouds, what
// you learned, then the record (the fear, the ladder with the climbed rung ticked, what you expected, the
// anxiety shift, what's next) as sections on the ground, separated by rules only. The prototype has no
// coping-card button and no "try this next" exercise link, so neither is here.
import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/src/components/ui/Text";
import { rungRating, rungsByEase } from "@/src/domains/exercises/domain/fearLadder";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import type { FearLadderResponse, StepProps } from "@/src/types/exerciseFlow";
import { FLSky } from "./flArt";
import { FLAsk, FL } from "./flParts";
import { FLRoute, FLRungRow } from "./flLadderSteps";
import { nextLine, shiftCopy } from "./flShift";

function Section({ title, first, children }: { title: string; first?: boolean; children: React.ReactNode }) {
  return (
    <View className="pb-6 pt-4" style={first ? undefined : { borderTopWidth: 1, borderTopColor: FL.sep }}>
      <Text className="mb-2 text-t-foot font-semibold text-happy-label-2">{title}</Text>
      {children}
    </View>
  );
}

const Body = ({ children, italic }: { children: React.ReactNode; italic?: boolean }) => (
  <Text className="text-t-body leading-[24px] text-happy-label" style={italic ? { fontFamily: APP_FONT_FAMILIES.mediumItalic } : undefined}>{children}</Text>
);

export const FLSummaryStep: React.FC<StepProps<FearLadderResponse>> = ({ response }) => {
  const { rungs, rungRatings, pickedRung, startAnxiety: pre, postAnxiety: now } = response;
  const byEase = rungsByEase(rungs, rungRatings);
  const upRung = byEase[byEase.indexOf(pickedRung) + 1];
  const shift = shiftCopy(pre, now);

  return (
    <View style={{ paddingBottom: 24 }}>
      <View className="mb-6 flex-row items-center justify-center gap-2">
        <View className="items-center"><FLSky f={pre / 10} width={128} /><Text className="text-t-foot font-bold text-happy-label-2">Before</Text></View>
        <Feather name="arrow-right" size={22} color={FL.label3} />
        <View className="items-center"><FLSky f={now / 10} width={128} /><Text className="text-t-foot font-bold text-happy-label-2">Now</Text></View>
      </View>

      <FLAsk title="You stayed with it." subtitle="Staying with the fear teaches your brain it is safer than it predicted." happi={false} />

      <View className="mb-8 rounded-2xl bg-happy-tint p-6">
        <Text className="mb-1 text-t-foot font-semibold text-happy-label-2">What you learned</Text>
        <Text className="mt-2 font-display text-t-title leading-[30px] text-happy-label">{response.learned.trim()}</Text>
      </View>

      <View style={{ borderTopWidth: 1, borderTopColor: FL.sep }}>
        <Section title="The fear" first><Body>{response.fear.trim()}</Body></Section>
        <Section title="Your ladder">
          <FLRoute>
            {[...byEase].reverse().map((text) => {
              const done = text === pickedRung;
              return (
                <FLRungRow
                  key={text}
                  text={text}
                  tone={done ? "done" : "rest"}
                  tag={done ? "Done" : text === upRung ? "Next up" : undefined}
                  num={done ? <Feather name="check" size={18} color="#fff" /> : rungRating(rungRatings, text)}
                />
              );
            })}
          </FLRoute>
        </Section>
        <Section title="You expected"><Body italic>{response.prediction.trim()}</Body></Section>
        <Section title="Anxiety shift">
          <View className="flex-row items-end gap-6">
            {[{ n: pre, l: "Before" }, { n: now, l: "Now" }].map(({ n, l }) => (
              <View key={l}>
                <Text className="font-display text-[56px] leading-[48px] text-happy-label" style={{ fontVariant: ["tabular-nums"] }}>{n}</Text>
                <Text className="mt-2 text-t-foot font-semibold text-happy-label-2">{l}</Text>
              </View>
            ))}
            <Text className="flex-1 pb-1 font-semibold text-happy-label-2">{shift.verdict}</Text>
          </View>
          <Text className="mt-2 px-1 text-t-foot text-happy-label-3">{shift.note}</Text>
        </Section>
        <Section title="Next"><Body>{nextLine(now, upRung)}</Body></Section>
      </View>

      <Text className="mt-6 text-center text-t-foot text-happy-label-3">Completing saves this reflection to your exercise history.</Text>
    </View>
  );
};
