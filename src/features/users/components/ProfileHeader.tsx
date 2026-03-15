import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import { User } from '../types';
import { Avatar } from '@/src/shared/components/Avatar';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

interface ProfileHeaderProps {
  user: User;
}

const FLAG_MAP: Record<string, string> = {
  BR: '🇧🇷', US: '🇺🇸', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪', AU: '🇦🇺',
  ES: '🇪🇸', CA: '🇨🇦', CH: '🇨🇭', IE: '🇮🇪', IN: '🇮🇳', IR: '🇮🇷',
  NL: '🇳🇱', NZ: '🇳🇿', TR: '🇹🇷', MX: '🇲🇽', FI: '🇫🇮',
};

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const theme = useColorScheme();
  const avatarScale = useSharedValue(0);

  useEffect(() => {
    avatarScale.value = withDelay(100, withSpring(1, { damping: 15, stiffness: 100 }));
  }, [avatarScale]);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }],
  }));

  const fullName = `${user.name.first} ${user.name.last}`;
  const username = `@${user.login.username}`;
  const flag = FLAG_MAP[user.nat.toUpperCase()] || '🏳️';
  const colorPrimary = colors[theme].primary;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors[theme].primaryLight, colors[theme].primary]}
        style={styles.gradientHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.avatarContainer, animatedAvatarStyle]}>
          <Avatar 
            uri={user.picture.large} 
            size={120} 
            borderColor={colors[theme].surface} 
          />
        </Animated.View>
        
        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.name}>{fullName}</ThemedText>
          <ThemedText type="secondary" style={styles.username}>{username} {flag}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  gradientHeader: {
    height: 140,
    width: '100%',
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: -60, // Overlap the gradient
    paddingHorizontal: 20,
  },
  avatarContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderRadius: 60, // Match avatar size
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
  },
});
