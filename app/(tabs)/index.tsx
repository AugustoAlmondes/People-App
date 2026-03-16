import React, { useState, useMemo } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

import { UserFilters } from '@/src/features/users/types';
import { UserCard } from '@/src/features/users/components/UserCard';
import { FilterChip } from '@/src/shared/components/FilterChip';
import { FilterSheet } from '@/src/features/filters/components/FilterSheet';
import { EmptyState } from '@/src/shared/components/EmptyState';
import { ErrorState } from '@/src/shared/components/ErrorState';
import { SkeletonCard } from '@/src/features/users/components/SkeletonCard';
import { useUsers } from '@/src/features/users/hooks/useUsers';

export default function UsersListScreen() {
  const theme = useColorScheme();
  const colorPrimary = colors[theme].primary;
  
  const [filters, setFilters] = useState<UserFilters>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Switch to the real API!
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } = useUsers(filters);

  // Flatten infinite query pages into a single users array
  const users = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page: any) => page.results || []);
  }, [data]);

  const removeFilter = (key: keyof UserFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <ThemedText type="title">Pessoas</ThemedText>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterVisible(true)}>
          <Feather name="sliders" size={24} color={colorPrimary} />
        </TouchableOpacity>
      </View>
      <View style={styles.filterChipsRow}>
        {filters.gender && filters.gender !== 'todos' && (
          <FilterChip label={`Gênero: ${filters.gender}`} onRemove={() => removeFilter('gender')} />
        )}
        {filters.nat && (
          <FilterChip label={`Nacionalidade: ${filters.nat}`} onRemove={() => removeFilter('nat')} />
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <FlatList
          refreshControl={
            <RefreshControl 
              refreshing={isRefetching} 
              onRefresh={refetch} 
              colors={[colorPrimary]}
              tintColor={colorPrimary}
            />
          }
          data={isLoading ? Array.from({ length: 8 }) as any[] : users}
          keyExtractor={(item, index) => isLoading ? String(index) : item.login.uuid}
          renderItem={({ item }) => isLoading ? <SkeletonCard /> : <UserCard user={item} />}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            isError ? (
              <ErrorState 
                message="Tivemos um problema de comunicação com a randomuser.me."
                onRetry={refetch} 
              />
            ) : (
              <EmptyState 
                title="Nenhuma pessoa" 
                message="A API randomuser.me não gerou usuários (Retornou results: []). A API pode estar com instabilidades temporárias." 
                icon="users"
              />
            )
          }
          ListFooterComponent={isFetchingNextPage ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" color={colorPrimary} />
            </View>
          ) : null}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage && !isLoading) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
        />
        
        <FilterSheet 
          visible={isFilterVisible} 
          currentFilters={filters}
          onClose={() => setIsFilterVisible(false)}
          onApplyFilters={setFilters}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterButton: {
    padding: 8,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
