// ponytail: the prototype's crisis sheet — never blocks Continue, never discards text (`openHelp`).
import React from 'react';
import { Modal, View, Text, Pressable, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface CrisisSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function CrisisSheet({ visible, onClose }: CrisisSheetProps): React.JSX.Element {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="rounded-t-3xl bg-happy-bg px-4 pt-6 pb-8">
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" className="absolute right-3 top-3 h-11 w-11 items-center justify-center rounded-full bg-happy-surface-2">
            <Feather name="x" size={22} color="#4b4b4b" />
          </Pressable>
          <Text accessibilityRole="header" className="pr-11 text-t-h font-bold leading-[28px] text-happy-label">
            If you’re thinking about hurting yourself, you deserve support now.
          </Text>
          <Text className="mt-2 mb-4 font-medium text-happy-label-2">988 Suicide &amp; Crisis Lifeline · call or text 988</Text>
          <Pressable onPress={() => Linking.openURL('tel:988')} accessibilityRole="button" className="min-h-14 items-center justify-center rounded-pill px-5" style={{ backgroundColor: '#142414', borderBottomWidth: 4, borderBottomColor: '#000' }}>
            <Text className="text-lg font-bold text-white">Call 988</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL('sms:988')} accessibilityRole="button" className="mt-2 min-h-14 items-center justify-center rounded-pill px-5" style={{ backgroundColor: '#5f7f58', borderBottomWidth: 4, borderBottomColor: '#29452a' }}>
            <Text className="text-lg font-bold text-white">Text 988</Text>
          </Pressable>
          <Text className="mt-4 font-medium text-happy-label-2">In danger right now? Call 911.</Text>
          <Text className="mt-2 mb-4 font-medium text-happy-label-2">Happy isn’t an emergency service. If you might act on these thoughts, call now.</Text>
          <Pressable onPress={onClose} accessibilityRole="button" className="min-h-14 items-center justify-center rounded-pill bg-happy-surface-2 px-5">
            <Text className="text-lg font-bold text-happy-label">Keep writing</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
