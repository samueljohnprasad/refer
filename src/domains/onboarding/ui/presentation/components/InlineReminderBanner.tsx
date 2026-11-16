// ponytail: exact Inline Reminder matching .agents/onboarding.html and happy-ui tokens
import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { ReminderPreset } from '../../../domain/enums';

export interface InlineReminderBannerProps {
  isSet: boolean;
  activeTime: string | null;
  onPickPreset: (preset: ReminderPreset) => void;
  onChangeTime: () => void;
}

export function InlineReminderBanner({
  isSet,
  activeTime,
  onPickPreset,
  onChangeTime,
}: InlineReminderBannerProps): React.JSX.Element {
  if (isSet) {
    return (
      <View className="flex-row items-center justify-between p-4 bg-happy-surface-2 rounded-m mb-4">
        <Text className="text-t-sub font-bold text-happy-label">
          Reminder set for {activeTime}
        </Text>
        <Pressable onPress={onChangeTime} className="p-1 min-h-[44px] justify-center">
          <Text className="text-t-foot font-bold text-happy-accent">Change</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="w-full my-4">
      <Text className="text-t-body font-bold text-happy-label mb-2">
        Want a nudge for your next one?
      </Text>

      {/* Flat banner preview matching prototype .note */}
      <View className="flex-row items-center gap-3 p-3.5 bg-happy-surface-2 rounded-m mb-3">
        <Image
          source={require('@/assets/icons/icon-panda.png')}
          className="w-7 h-7 rounded-[7px]"
        />
        <View className="flex-1">
          <Text className="text-t-foot font-semibold text-happy-label">Happy</Text>
          <Text className="text-t-foot font-medium text-happy-label-2 mt-0.5 leading-snug">
            Ready to catch one more thought? 2 minutes.
          </Text>
        </View>
        <Text className="text-t-cap font-medium text-happy-label-3 self-start mt-0.5">now</Text>
      </View>

      {/* Tactile option cards matching .pick */}
      <View className="flex-col gap-2.5">
        <Pressable
          onPress={() => onPickPreset(ReminderPreset.Morning)}
          className="flex-row items-center gap-3 w-full min-h-[68px] p-2.5 pr-4 rounded-[20px] border-2 border-b-[5px] border-happy-sep bg-happy-surface active:translate-y-[2px] active:border-b-2"
        >
          <View className="w-12 h-12 rounded-[14px] bg-happy-surface-2 items-center justify-center">
            <Sun size={24} color="#f5b942" />
          </View>
          <Text className="text-t-body font-bold text-happy-label">Morning</Text>
          <Text className="text-t-foot font-semibold text-happy-label-3 ml-auto">8:00 AM</Text>
        </Pressable>

        <Pressable
          onPress={() => onPickPreset(ReminderPreset.Evening)}
          className="flex-row items-center gap-3 w-full min-h-[68px] p-2.5 pr-4 rounded-[20px] border-2 border-b-[5px] border-happy-sep bg-happy-surface active:translate-y-[2px] active:border-b-2"
        >
          <View className="w-12 h-12 rounded-[14px] bg-happy-surface-2 items-center justify-center">
            <Moon size={24} color="#a493d6" />
          </View>
          <Text className="text-t-body font-bold text-happy-label">Evening</Text>
          <Text className="text-t-foot font-semibold text-happy-label-3 ml-auto">8:00 PM</Text>
        </Pressable>
      </View>
    </View>
  );
}
