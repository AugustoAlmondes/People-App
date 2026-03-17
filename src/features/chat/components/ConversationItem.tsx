import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Avatar } from '@/src/shared/components/Avatar';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';
import { ChatSession } from '../types';

interface ConversationItemProps {
  session: ChatSession;
  index: number;
  onPress: () => void;
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'ontem';
  return `${days}d`;
}

export function ConversationItem({ session, index, onPress }: ConversationItemProps) {
  const theme = useColorScheme();
  const { userSnapshot, messages, lastMessageAt } = session;

  if (!userSnapshot) return null;

  const lastMessage = messages[0]; // messages are stored newest-first
  const previewText = lastMessage
    ? (lastMessage.isOwn ? `Você: ${lastMessage.text}` : lastMessage.text)
    : 'Nenhuma mensagem ainda';

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300).springify()}>
      <TouchableOpacity
        style={[styles.container, { borderBottomColor: colors[theme].border }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Avatar uri={userSnapshot.thumbnailUrl} size={54} />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <ThemedText type="defaultSemiBold" style={styles.name} numberOfLines={1}>
              {userSnapshot.firstName} {userSnapshot.lastName}
            </ThemedText>
            <ThemedText style={[styles.time, { color: colors[theme].textSecondary }]}>
              {formatRelativeTime(lastMessageAt)}
            </ThemedText>
          </View>
          <ThemedText
            style={[styles.preview, { color: colors[theme].textSecondary }]}
            numberOfLines={1}
          >
            {previewText}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
  },
  preview: {
    fontSize: 13,
    lineHeight: 18,
  },
});
