// ponytail: exact .arc list matching .agents/exercises.html — hollow dot where you started,
// filled dot where you landed, connected by a line; the user's own words stay theirs, never the
// card's title. Pure presentation: takes a ThoughtArcModel, renders it.
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/src/components/ui/Text';
import type { ThoughtArcModel } from '../../../domain/timelineEntry';

export interface ThoughtArcProps {
  arc: ThoughtArcModel;
}

function ArcDot({ hollow }: { hollow: boolean }): React.JSX.Element {
  return (
    <View
      className="absolute left-0 top-1 w-[11px] h-[11px] rounded-full"
      style={hollow
        ? { backgroundColor: '#fff', borderWidth: 2, borderColor: '#5f7f58' }
        : { backgroundColor: '#5f7f58' }}
    />
  );
}

export function ThoughtArc({ arc }: ThoughtArcProps): React.JSX.Element {
  return (
    <View className="flex-col gap-4">
      <View className="relative pl-[22px]">
        <ArcDot hollow />
        {arc.toText && (
          <View className="absolute left-[4.5px] top-[18px] bottom-[-20px] w-0.5 bg-[#a9bfa0] rounded-full" />
        )}
        <Text className="text-t-foot happy-font-body-bold text-happy-label-3 leading-5">{arc.fromLabel}</Text>
        <Text className="text-t-sub happy-font-body-medium text-happy-label-2 mt-0.5" style={{ lineHeight: 21 }}>
          "{arc.fromText}"
        </Text>
      </View>

      {arc.toText && (
        <View className="relative pl-[22px]">
          <ArcDot hollow={false} />
          <Text className="text-t-foot happy-font-body-bold text-happy-label-3 leading-5">{arc.toLabel}</Text>
          <Text className="text-t-body happy-font-body-bold text-happy-label mt-0.5" style={{ lineHeight: 24 }}>
            {arc.toText}
          </Text>
        </View>
      )}
    </View>
  );
}
