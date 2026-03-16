import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Message } from '../types';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const theme = useColorScheme();
  const { text, isOwn, status, sentAt } = message;

  // Format the time as HH:mm
  const timeString = new Date(sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Animated.View 
      entering={FadeInDown.duration(300).springify()}
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer
      ]}
    >
      <View 
        style={[
          styles.bubble,
          isOwn 
            ? [styles.ownBubble, { backgroundColor: colors[theme].primary }]
            : [styles.otherBubble, { backgroundColor: colors[theme].surfaceElevated }]
        ]}
      >
        <ThemedText style={[styles.text, isOwn && styles.ownText]}>
          {text}
        </ThemedText>
        
        <View style={styles.footer}>
          <ThemedText style={[styles.time, isOwn && styles.ownTime]}>
            {timeString}
          </ThemedText>
          
          {isOwn && (
            <Feather 
              name={status === 'read' ? 'check-circle' : 'check'} 
              size={12} 
              color={status === 'read' ? '#fff' : 'rgba(255,255,255,0.7)'} 
              style={styles.statusIcon}
            />
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 4,
    flexDirection: 'row',
  },
  ownContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  ownText: {
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    color: 'gray',
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  statusIcon: {
    marginLeft: 4,
  },
});
