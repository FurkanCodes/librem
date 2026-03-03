import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'ios' ? Math.max(insets.bottom, 6) : Math.max(insets.bottom, 6);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1c1917',
        tabBarInactiveTintColor: 'rgba(28,25,23,0.4)',
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderTopColor: '#e7e5e4',
          borderTopWidth: 1,
          height: 72 + bottomInset,
          paddingTop: 8,
          paddingBottom: bottomInset,
        },
        tabBarItemStyle: { paddingTop: 2 },
        tabBarIconStyle: { marginBottom: 2 },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.12,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
