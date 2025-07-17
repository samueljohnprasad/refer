import { Tabs } from 'expo-router';
import * as React from 'react';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
        }}
      />
      <Tabs.Screen
        name="referrals"
        options={{
          title: 'Referrals',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
