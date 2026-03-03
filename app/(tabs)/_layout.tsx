import { Tabs } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useReaderUIState } from '@/features/reader/ui-mock';

export default function TabLayout() {
  const { appTokens, state } = useReaderUIState();
  const hasHighlights = state.highlights.length > 0;
  const hasStreak = state.streak.streak > 0;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: appTokens.text,
        tabBarInactiveTintColor: appTokens.textMuted,
        tabBarStyle: {
          backgroundColor: appTokens.tabBar,
          borderTopColor: appTokens.tabBorder,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="book.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={26} name="heart.fill" color={color} />
              {hasHighlights ? (
                <View
                  style={{
                    position: 'absolute',
                    right: -1,
                    top: 0,
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: '#ef4444',
                    borderWidth: 2,
                    borderColor: appTokens.tabBar,
                  }}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <View>
              <IconSymbol size={26} name="person.crop.circle" color={color} />
              {hasStreak ? (
                <View
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 999,
                    paddingHorizontal: 4,
                    borderWidth: 2,
                    borderColor: appTokens.tabBar,
                    backgroundColor: appTokens.badge,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: appTokens.ctaText, fontSize: 9, fontWeight: '800' }}>
                    {state.streak.streak}
                  </Text>
                </View>
              ) : null}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
