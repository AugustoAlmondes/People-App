import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useFavoritesStore } from '@/src/features/users/store/useFavoritesStore';
import { UserCard } from '@/src/features/users/components/UserCard';
import { EmptyState } from '@/src/shared/components/EmptyState';

export default function FavoritesScreen() {
  const favorites = useFavoritesStore((state) => state.favorites);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <ThemedText type="title">Favoritos</ThemedText>
      </View>
      <ThemedText type="secondary" style={styles.subtitle}>
        {favorites.length} {favorites.length === 1 ? 'pessoa favoritada' : 'pessoas favoritadas'}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.login.uuid}
          renderItem={({ item }) => <UserCard user={item} />}
          contentContainerStyle={[
            styles.listContainer, 
            favorites.length === 0 && { flex: 1 }
          ]}
          ListHeaderComponent={favorites.length > 0 ? renderHeader : null}
          ListEmptyComponent={
             <View style={styles.emptyContainer}>
               <View style={styles.emptyHeader}>
                 <ThemedText type="title">Favoritos</ThemedText>
               </View>
               <EmptyState 
                 title="Nenhum favorito"
                 message="Você ainda não adicionou ninguém aos seus favoritos."
                 icon="heart"
               />
             </View>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
  },
  emptyHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  }
});