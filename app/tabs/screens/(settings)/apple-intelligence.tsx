import { Stack, useRouter } from 'expo-router';
import AppleIntelligenceScreen from '@/src/screens/AppleIntelligenceScreen/AppleIntelligenceScreen';
import { GlassView } from 'expo-glass-effect';

export default function AppleIntelligence(): React.ReactElement {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Apple Intelligence',
          headerTransparent: true,
          headerBackButtonDisplayMode: 'minimal',
          headerLeft: () => null,
          headerBackground: () => (
            <GlassView glassEffectStyle="clear" style={{ flex: 1 }} />
          ),
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <AppleIntelligenceScreen />
    </>
  );
}
