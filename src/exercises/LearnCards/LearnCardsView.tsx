import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, ReduceMotion } from "react-native-reanimated";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseInlineFeedback } from "@/src/components/exercise/CourseExerciseInlineFeedback";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import type {
  LearnCardsData,
  LearningCard,
} from "@/src/exercises/LearnCards/data";

interface LearnCardsViewProps extends LearnCardsData {
  phase: string;
  cardIndex: number;
  selectedOptionId: string | null;
  locked: boolean;
  onSelectRecallOption: (optionId: string) => void;
}

export function LearnCardsView(props: LearnCardsViewProps) {
  if (props.phase === "recall" && props.recall)
    return <RecallView {...props} recall={props.recall} />;
  const cardIndex = Math.min(
    props.cardIndex,
    Math.max(props.cards.length - 1, 0),
  );
  return (
    <CardView
      title={props.title}
      instruction={props.instruction}
      card={props.cards[cardIndex]}
      cardIndex={cardIndex}
      cardCount={props.cards.length}
    />
  );
}

function CardView({
  title,
  instruction,
  card,
  cardIndex,
  cardCount,
}: {
  title: string;
  instruction: string | null;
  card?: LearningCard;
  cardIndex: number;
  cardCount: number;
}) {
  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading title={title} instruction={instruction} />
      {card ? (
        <Animated.View
          key={card.id}
          entering={FadeIn.duration(180).reduceMotion(ReduceMotion.System)}
          className="gap-2 rounded-2xl border border-brand-border bg-brand-surface-soft px-5 py-[18px]"
        >
          <Text className="happy-font-body-bold text-[13px] leading-[18px] text-ink-soft">{`${cardIndex + 1} of ${cardCount}${card.kicker ? ` · ${card.kicker}` : ""}`}</Text>
          <Text
            accessibilityRole="header"
            className="happy-font-body-bold text-xl leading-[25px] text-ink"
          >
            {card.title}
          </Text>
          <Text className="happy-font-body text-[17px] leading-6 text-ink">
            {card.body}
          </Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function RecallView({
  title,
  recall,
  selectedOptionId,
  locked,
  onSelectRecallOption,
}: LearnCardsViewProps & { recall: NonNullable<LearnCardsData["recall"]> }) {
  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={title}
        instruction={recall.instruction}
        prompt={recall.prompt}
      />
      <View accessibilityRole="radiogroup" className="gap-[9px]">
        {recall.options.map((option) => {
          const selected = selectedOptionId === option.id;
          const result =
            locked && selected
              ? option.id === recall.correctOptionId
                ? "correct"
                : "incorrect"
              : undefined;
          return (
            <View key={option.id}>
              <CourseExerciseOptionButton
                label={option.label}
                selected={selected}
                result={result}
                role="radio"
                disabled={locked}
                onPress={() => onSelectRecallOption(option.id)}
              />
              {locked && selected && option.feedback ? (
                <CourseExerciseInlineFeedback
                  correct={option.id === recall.correctOptionId}
                  message={option.feedback}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}
