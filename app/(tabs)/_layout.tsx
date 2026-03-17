import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';
import { Entypo, Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors[colorScheme].primary,
        headerShown: false,
      }}>
        <Tabs.Screen
          name="conversations"
          options={{
            title: 'Conversas',
            tabBarIcon: ({ color }) => (
              <Entypo name="chat" size={20} color={color} />
            ),
          }}
        />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Entypo name="home" size={20} color={color} />
          ),
        }}
      />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoritos',
            tabBarIcon: ({ color }) => (
              <Entypo name="heart" size={20} color={color} />
            ),
          }}
        />
      <Tabs.Screen
        name="my-profile"
        options={{
          title: 'Meu Perfil',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-alt" size={18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="[userId]"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
