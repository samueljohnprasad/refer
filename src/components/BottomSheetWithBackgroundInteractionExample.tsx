import { useState } from 'react';
import { Host, BottomSheet, Button, Text, VStack, Group } from '@expo/ui/swift-ui';
import {
    presentationDetents,
    presentationBackgroundInteraction,
} from '@expo/ui/swift-ui/modifiers';

export default function BottomSheetWithBackgroundInteractionExample() {
    const [isPresented, setIsPresented] = useState(true);

    return (
        <Host style={{ flex: 1 }}>
            <VStack>
                <BottomSheet isPresented={isPresented} onIsPresentedChange={setIsPresented}>
                    <Group
                        modifiers={[
                            presentationDetents(['medium', 'large']),
                            presentationBackgroundInteraction({ type: 'enabledUpThrough', detent: 'medium' }),
                        ]}>
                        <Text>Interact with content behind when at medium height.</Text>
                    </Group>
                </BottomSheet>
            </VStack>
        </Host>
    );
}
