import { useState } from 'react';
import { Pressable, Text as RNText, View } from 'react-native';
import { Host, BottomSheet, Button, RNHostView, VStack, Group } from '@expo/ui/swift-ui';
import { presentationDragIndicator } from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetWithRNContent({ children }: { children: React.ReactNode }) {
    const [isPresented, setIsPresented] = useState(false);

    return (
        <Host style={{ flex: 1 }}>
            <VStack>
                <Button label="Open Sheet" onPress={() => setIsPresented(true)} />
                <BottomSheet isPresented={isPresented} onIsPresentedChange={setIsPresented} fitToContents>
                    <Group modifiers={[presentationDragIndicator('visible')]}>
                        <RNHostView matchContents>
                            <View style={{ padding: 24 }}>
                                {children}
                            </View>
                        </RNHostView>
                    </Group>
                </BottomSheet>
            </VStack>
        </Host>
    );
}
