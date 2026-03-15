import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useColorScheme } from '../hooks/useColorScheme';

interface AvatarProps {
  uri?: string;
  size?: number;
  borderColor?: string;
  status?: 'online' | 'offline';
}

export function Avatar({ uri, size = 50, borderColor, status }: AvatarProps) {
  const theme = useColorScheme();
  const defaultBorderColor = colors[theme].border;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri: uri || 'https://via.placeholder.com/150' }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: borderColor || defaultBorderColor,
            borderWidth: 2,
          },
        ]}
      />
      {status === 'online' && (
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: colors[theme].online,
              borderColor: colors[theme].surface,
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: (size * 0.25) / 2,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
