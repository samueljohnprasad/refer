// ponytail: the "Need to talk to someone now?" row every tab ends with (.agents/*.html `HELP`),
// owning its own sheet so each screen drops it in with one line.
import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '@/src/components/ui/Text';
import { HelpSheet } from '../presentation/views/HelpSheet';

export function HelpSheetModal({ visible, onClose }: { visible: boolean; onClose: () => void }): React.JSX.Element {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/40">
        <View className="bg-happy-bg rounded-t-3xl p-5 pb-8">
          <HelpSheet />
        </View>
      </View>
    </Modal>
  );
}

export function HelpRowWithSheet({ className = 'mt-8' }: { className?: string }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        className={`min-h-[52px] py-3 border-t border-happy-sep flex-row items-center gap-3 ${className}`}
      >
        <Feather name="life-buoy" size={22} color="#44633f" />
        <Text className="happy-font-body-bold text-[17px] leading-[22px] text-happy-label">
          Need to talk to someone now?
        </Text>
      </Pressable>
      <HelpSheetModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
