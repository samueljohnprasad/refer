// ponytail: Happi asks one question (.agents/abc-analysis.html's `.ask`): mascot + speech bubble, the
// instruction (if any) sits under it as plain text. Happi steps aside once a crisis phrase was seen.
import React from 'react';
import { View, Text } from 'react-native';
import { HappiStage } from '@/src/domains/onboarding/ui/presentation/components/HappiStage';
import { useHappiGuideMotion, ActingPose } from '@/src/domains/onboarding/ui/containers/useHappiGuideMotion';

export function AbcAsk({ question, sub, pose = ActingPose.Abc, solo = false }: { question: string; sub?: string; pose?: ActingPose; solo?: boolean }): React.JSX.Element {
  const motion = useHappiGuideMotion();
  React.useEffect(() => { motion.setPose(pose); }, [motion, pose]);
  return (
    <View>
      <View className="flex-row items-end gap-2 mt-4 mb-6">
        {!solo && <View style={{ width: 84, marginBottom: -4 }}><HappiStage motion={motion} size="ask" width={84} /></View>}
        <View className="flex-1 self-center px-4 py-3 rounded-2xl bg-happy-tint">
          <Text accessibilityRole="header" className="font-display text-t-h leading-[28px] text-happy-label">{question}</Text>
        </View>
      </View>
      {sub ? <Text className="-mt-3 mb-4 text-t-sub leading-[22px] text-happy-label-2">{sub}</Text> : null}
    </View>
  );
}
