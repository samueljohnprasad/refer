// Example usage of MindfulBackground component

import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import MindfulBackground from './MindfulBackground';

// Example 1: Basic usage with day/night mode
const ExampleScreen1: React.FC = () => {
  return (
    <MindfulBackground>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <Text>Your screen content goes here!</Text>
        {/* Your existing UI components */}
      </SafeAreaView>
    </MindfulBackground>
  );
};

// Example 2: Custom particle count
const ExampleScreen2: React.FC = () => {
  return (
    <MindfulBackground particleCount={20}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Screen with fewer particles</Text>
      </SafeAreaView>
    </MindfulBackground>
  );
};

// Example 3: Disable day/night mode (use default pastels)
const ExampleScreen3: React.FC = () => {
  return (
    <MindfulBackground enableDayNightMode={false}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Screen with original pastel colors</Text>
      </SafeAreaView>
    </MindfulBackground>
  );
};

// Example 4: How to integrate with your voice recorder
const VoiceRecorderWithBackground: React.FC = () => {
  return (
    <MindfulBackground>
      {/* Your existing voice recorder content */}
      <SafeAreaView style={{ flex: 1 }}>
        {/* All your existing voice recorder JSX goes here */}
      </SafeAreaView>
    </MindfulBackground>
  );
};

export { ExampleScreen1, ExampleScreen2, ExampleScreen3, VoiceRecorderWithBackground };
