import React, { useMemo } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

import { useChatStoreBase } from '@/src/features/chat/store';
import { ConversationItem } from '@/src/features/chat/components/ConversationItem';
import { ChatSession } from '@/src/features/chat/types';

export default function ConversationsScreen() {
  const theme = useColorScheme();
  const router = useRouter();
  const sessions = useChatStoreBase((state) => state.sessions);

  // Sort sessions by most recent message, only include sessions with a snapshot
  const sortedSessions: ChatSession[] = useMemo(() => {
    return Object.values(sessions)
      .filter((s) => s.userSnapshot != null && s.messages.length > 0)
      .sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
      );
  }, [sessions]);

  const handleOpen = (session: ChatSession) => {
    if (!session.userSnapshot) return;
    const minimalUser = {
      login: { uuid: session.userSnapshot.uuid, username: '' },
      name: { title: '', first: session.userSnapshot.firstName, last: session.userSnapshot.lastName },
      picture: {
        large: session.userSnapshot.thumbnailUrl,
        medium: session.userSnapshot.thumbnailUrl,
        thumbnail: session.userSnapshot.thumbnailUrl,
      },
      email: '',
      phone: '',
      cell: '',
      location: { city: '', state: '', country: '', coordinates: { latitude: '', longitude: '' } },
      nat: '',
      gender: '',
    };

    router.push({
      pathname: '/(tabs)/[userId]/chat',
      params: {
        userId: session.userId,
        userStr: JSON.stringify(minimalUser),
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={[styles.header, { borderBottomColor: colors[theme].border }]}>
          <ThemedText type="title">Conversas</ThemedText>
        </View>

        <FlatList
          data={sortedSessions}
          keyExtractor={(item) => item.userId}
          renderItem={({ item, index }) => (
            <ConversationItem
              session={item}
              index={index}
              onPress={() => handleOpen(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Nenhuma conversa"
              message="Inicie uma conversa com alguém a partir da tela de Pessoas."
              icon="message-circle"
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sortedSessions.length === 0 ? styles.emptyContainer : undefined}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
