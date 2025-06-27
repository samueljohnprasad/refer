import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs, useRouter } from 'expo-router';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../../components/Toggle/ThemeToggle';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { logout } from '@/store/authSlice';
import { useDispatch } from 'react-redux';
import { useLayoutStyles } from '../_layout';
import ReferNetHeader from '@/components/ReferNetHeader';
import { useNotifications } from '@/hooks/useNotifications';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const handleBell = () => {
    router.push('/notifications' as any);
  };
  const handleInfo = () => {
    router.push('/modal');
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: { backgroundColor: theme.colors.card },
        headerStyle: { backgroundColor: theme.colors.card },
        headerTintColor: theme.colors.text,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: () => (
            <ReferNetHeader
              onBell={handleBell}
              onInfo={handleInfo}
              unreadCount={unreadCount}
            />
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <TabBarIcon name="briefcase" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
