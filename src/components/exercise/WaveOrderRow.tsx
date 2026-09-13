import React, { useMemo, useRef } from "react";
import { PanResponder, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface WaveOrderRowProps {
  stage: string;
  index: number;
  total: number;
  isMarked: boolean;
  isSelected: boolean;
  locked: boolean;
  onTap: () => void;
  onMove: (fromIndex: number, toIndex: number) => void;
}

// ponytail: quiet drag row with tap-to-swap and VoiceOver actions
export function WaveOrderRow({
  stage,
  index,
  total,
  isMarked,
  isSelected,
  locked,
  onTap,
  onMove,
}: WaveOrderRowProps) {
  const indexRef = useRef(index);
  indexRef.current = index;
  const totalRef = useRef(total);
  totalRef.current = total;
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          !locked && Math.abs(gestureState.dy) > 10,
        onPanResponderTerminationRequest: () => false,
        onPanResponderRelease: (_, gestureState) => {
          if (locked) return;
          const steps = Math.round(gestureState.dy / 56);
          if (steps !== 0) {
            const cur = indexRef.current;
            const target = Math.max(0, Math.min(totalRef.current - 1, cur + steps));
            if (target !== cur) onMoveRef.current(cur, target);
          }
        },
      }),
    [locked],
  );

  let containerClass =
    "min-h-[56px] flex-row items-center gap-3 rounded-[18px] px-4.5 py-3.5 border-[1.5px]";
  if (isMarked) {
    containerClass += " border-[#5F7F58] bg-[#F2F8EF]";
  } else if (isSelected) {
    containerClass +=
      " border-[#5F7F58] border-b-[3.5px] border-b-[#3C5B36] bg-[#FAF8F5] active:border-b-[1.5px] active:translate-y-[1px]";
  } else {
    containerClass +=
      " border-[#E2DDD5] border-b-[3.5px] border-b-[#C2BBB0] bg-[#FCFBF8] active:border-b-[1.5px] active:translate-y-[1px]";
  }

  return (
    <View {...panResponder.panHandlers}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          isMarked
            ? `Phase ${index + 1}: ${stage}. Correct position.`
            : `Phase ${index + 1}: ${stage}.`
        }
        accessibilityHint={
          isMarked
            ? undefined
            : "Double tap to select and swap, or use actions to reorder."
        }
        accessibilityActions={[
          ...(index > 0 ? [{ name: "moveEarlier", label: "Move earlier" }] : []),
          ...(index < total - 1
            ? [{ name: "moveLater", label: "Move later" }]
            : []),
        ]}
        onAccessibilityAction={(event) => {
          if (locked) return;
          if (event.nativeEvent.actionName === "moveEarlier") {
            onMove(index, index - 1);
          } else if (event.nativeEvent.actionName === "moveLater") {
            onMove(index, index + 1);
          }
        }}
        disabled={locked}
        onPress={onTap}
        className={containerClass}
      >
        <View
          className={
            isMarked
              ? "h-6 w-6 items-center justify-center rounded-full bg-[#D3E0CD]"
              : "h-6 w-6 items-center justify-center rounded-full bg-[#EEE8DD]"
          }
        >
          <Text
            className={
              isMarked
                ? "happy-font-body-bold text-xs text-[#29452A]"
                : "happy-font-body-bold text-xs text-[#82796A]"
            }
          >
            {index + 1}
          </Text>
        </View>

        <Text className="happy-font-body-semibold flex-1 text-[15px] leading-5 text-[#201E1D]">
          {stage}
        </Text>

        {isMarked ? (
          <Text className="happy-font-body-bold text-base text-[#29452A]">✓</Text>
        ) : (
          <Ionicons name="reorder-two-outline" size={20} color="#B5AEA4" />
        )}
      </Pressable>
    </View>
  );
}
