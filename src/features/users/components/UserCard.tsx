import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Entypo } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { User } from '../types';
import { Avatar } from '@/src/shared/components/Avatar';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';
import { useFavoritesStore } from '../store/useFavoritesStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface UserCardProps {
  user: User;
}

// Map some common nat codes to emoji flags
const FLAG_MAP: Record<string, string> = {
  BR: '🇧🇷', US: '🇺🇸', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', AU: '🇦🇺',
  ES: '🇪🇸', CA: '🇨🇦', CH: '🇨🇭', IE: '🇮🇪', IN: '🇮🇳', IR: '🇮🇷',
  NL: '🇳🇱', NZ: '🇳🇿', TR: '🇹🇷', MX: '🇲🇽', FI: '🇫🇮',
};

export function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const theme = useColorScheme();

  const isFavorite = useFavoritesStore((state) => state.isFavorite(user.login.uuid));
  const toggleFavoriteStore = useFavoritesStore((state) => state.toggleFavorite);

  const scale = useSharedValue(1);

  const toggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavoriteStore(user);

    scale.value = withSequence(
      withTiming(1.3, { duration: 70 }),
      withSpring(1, { damping: 20, stiffness: 150 })
    );
  };

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const flag = FLAG_MAP[user.nat.toUpperCase()] || '🏳️';
  const fullName = `${user.name.first} ${user.name.last}`;
  const locationText = `${user.location.city}, ${user.location.country} ${flag}`;
  const colorPrimary = colors[theme].primary;

  const handlePress = () => {
    // Pass minimal data or just the ID, usually we fetch detail or pass as params
    // Using Expo Router, we can pass as stringified params if needed or rely on ID to fetch from cache
    router.push({
      pathname: '/(tabs)/[userId]/profile',
      params: {
        userId: user.login.uuid,
        userStr: JSON.stringify(user)
      }
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <LinearGradient
        colors={[colors[theme].surfaceElevated, colors[theme].surface]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.contentRow}>
          <Avatar
            uri={user.picture.medium}
            size={56}
            borderColor={user.gender === 'female' ? colors[theme].accent : colorPrimary}
          />

          <View style={styles.textContainer}>
            <ThemedText type="defaultSemiBold" numberOfLines={1}>{fullName}</ThemedText>
            <ThemedText type="secondary" numberOfLines={1} style={{ marginTop: 2 }}>{locationText}</ThemedText>
          </View>

          <AnimatedPressable
            onPress={toggleFavorite}
            style={[styles.favoriteButton, heartStyle]}
            hitSlop={15}
          >
            <Entypo
              name="heart"
              size={24}
              color={isFavorite ? colors[theme].accent : colors[theme].textSecondary}
            />
          </AnimatedPressable>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  favoriteButton: {
    marginLeft: 12,
    padding: 4,
  },
});
