import { Stack } from 'expo-router';
import AppleIntelligenceScreen from '@/src/screens/AppleIntelligenceScreen/AppleIntelligenceScreen';
import { GlassView } from 'expo-glass-effect';

export default function AppleIntelligence(): React.ReactElement {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Apple Intelligence',
          headerTransparent: true,
          headerBackButtonDisplayMode: 'minimal',
          headerBackground: () => (
            <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />
          ),
        }}
      />
      <AppleIntelligenceScreen />
    </>
  );
}
