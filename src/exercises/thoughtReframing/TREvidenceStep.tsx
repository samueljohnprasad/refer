// ponytail: steps 7 and 8 as the prototype draws them: the balance, a legend, (step 8 only) Happi's
// Socratic question, then one fact at a time into a row, the facts as stones, starter facts underneath.
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { StepShell, StepTitle } from "./customStepShared";
import { TRBalanceCard } from "./TRBalanceCard";
import { TRFactList, type TRFactKind } from "./TRFactList";
import { TRFactRow, TRQuickReplies } from "./TRFields";
import { TRSaidBubble } from "./TRSaidBubble";
import { SOCRATIC, hasWords, sceneFor } from "./trWriting";

const COPY: Record<TRFactKind, { title: string; subtitle: string }> = {
  for: { title: "What backs the thought up?", subtitle: "Things that happened. Feelings don’t count here, you named those already." },
  against: { title: "And what goes against it?", subtitle: "Anything that makes the thought less certain." },
};

const Stone = ({ kind }: { kind: TRFactKind }) =>
  kind === "for" ? (
    <View style={{ width: 14, height: 12, borderRadius: 3, backgroundColor: "#5f7f58", borderBottomWidth: 3, borderBottomColor: "#44633f" }} />
  ) : (
    <View style={{ width: 14, height: 13, borderRadius: 7, backgroundColor: "#f5b942", borderBottomWidth: 3, borderBottomColor: "#e09a24" }} />
  );

function SocraticAsk() {
  const [i, setI] = useState(0);
  return (
    <View className="mb-4 flex-row items-center gap-2">
      <View className="flex-1 rounded-2xl bg-happy-tint px-4 py-3">
        <Text className="text-t-body font-bold leading-[23px] text-happy-label">{SOCRATIC[i]}</Text>
      </View>
      <Pressable
        onPress={() => setI((n) => (n + 1) % SOCRATIC.length)}
        accessibilityRole="button"
        accessibilityLabel="Ask a different question"
        className="h-11 w-11 items-center justify-center"
      >
        <Feather name="refresh-cw" size={22} color="#44633f" />
      </Pressable>
    </View>
  );
}

export function TREvidenceStep({ kind, response, onUpdate, onNext, readOnly, setPrimaryOverride }: StepProps<ThoughtReframingResponse> & { kind: TRFactKind }) {
  const field = kind === "for" ? "evidenceFor" : "evidenceAgainst";
  const items = response[field] ?? [];
  const forCount = (response.evidenceFor ?? []).length;
  const againstCount = (response.evidenceAgainst ?? []).length;
  const [draft, setDraft] = useState("");
  const { title, subtitle } = COPY[kind];
  const canAdd = hasWords(draft);
  const starters = (kind === "for" ? sceneFor(response.situation).evFor : sceneFor(response.situation).evAgainst).filter((t) => !items.includes(t));

  const add = (raw: string): boolean => {
    const t = raw.trim();
    if (!hasWords(t) || items.includes(t)) return false;
    onUpdate({ [field]: [...items, t] } as Partial<ThoughtReframingResponse>);
    return true;
  };

  useEffect(() => {
    setPrimaryOverride?.({ label: items.length ? "Continue" : "Skip for now", action: onNext, disabled: false });
  }, [items.length, onNext, setPrimaryOverride]);

  return (
    <StepShell>
      <TRSaidBubble text={response.automaticThought} />
      <StepTitle title={title} subtitle={subtitle} />
      <TRBalanceCard forCount={forCount} againstCount={againstCount} current={kind} />
      {kind === "against" && !readOnly && <SocraticAsk />}
      {!readOnly && (
        <TRFactRow
          marker={<Stone kind={kind} />}
          value={draft}
          onChangeText={setDraft}
          onAdd={() => add(draft) && setDraft("")}
          canAdd={canAdd}
          placeholder="Add a fact"
        />
      )}
      <TRFactList items={items} kind={kind} readOnly={readOnly} onRemove={(i) => onUpdate({ [field]: items.filter((_, n) => n !== i) } as Partial<ThoughtReframingResponse>)} />
      {!readOnly && <TRQuickReplies label="Or start from one of these" items={starters} onPick={add} />}
    </StepShell>
  );
}

export const TREvidenceForStep = (p: StepProps<ThoughtReframingResponse>) => <TREvidenceStep kind="for" {...p} />;
export const TREvidenceAgainstStep = (p: StepProps<ThoughtReframingResponse>) => <TREvidenceStep kind="against" {...p} />;
