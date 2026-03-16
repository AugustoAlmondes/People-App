import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';
import { Feather } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[colorScheme].primary,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Usuários',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'house',
                android: 'home',
                web: 'home',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-profile"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="[userId]"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
