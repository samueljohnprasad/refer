// ponytail: exact SHEETS.help matching .agents/home.html — 988 / Crisis Text Line / 911, US-only disclaimer.
import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';

export function HelpSheet(): React.JSX.Element {
  return (
    <View className="px-1">
      <Text className="text-t-h font-bold leading-tight text-happy-label">Need to talk to someone?</Text>
      <Text className="text-t-body text-happy-label-2 mt-2 mb-4">
        You do not have to carry this alone. These are free, private and open day and night.
      </Text>

      <View className="border-b border-happy-sep">
        <Pressable
          onPress={() => Linking.openURL('tel:988')}
          className="py-3 border-t border-happy-sep"
        >
          <Text className="text-t-lead font-bold text-happy-accent">Call or text 988</Text>
          <Text className="text-t-foot font-semibold text-happy-label-3">Suicide and Crisis Lifeline</Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL('sms:741741?&body=HOME')}
          className="py-3 border-t border-happy-sep"
        >
          <Text className="text-t-lead font-bold text-happy-accent">Text HOME to 741741</Text>
          <Text className="text-t-foot font-semibold text-happy-label-3">Crisis Text Line</Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL('tel:911')}
          className="py-3 border-t border-happy-sep"
        >
          <Text className="text-t-lead font-bold text-happy-accent">In danger right now? Call 911</Text>
          <Text className="text-t-foot font-semibold text-happy-label-3">Emergency services</Text>
        </Pressable>
      </View>

      <Text className="text-t-foot text-happy-label-3 mt-3">Numbers shown are for the United States.</Text>
    </View>
  );
}
