import React, { useState, useMemo } from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
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

import { MOCK_USERS } from '@/src/features/users/mockData';

export default function UsersListScreen() {
  const theme = useColorScheme();
  const colorPrimary = colors[theme].primary;
  
  const [filters, setFilters] = useState<UserFilters>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const users = useMemo(() => {
    return MOCK_USERS.filter((user) => {
      if (filters.gender && filters.gender !== 'todos' && user.gender !== filters.gender) {
        return false;
      }
      if (filters.nat && user.nat !== filters.nat) {
        return false;
      }
      return true;
    });
  }, [filters]);

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
          data={users}
          keyExtractor={(item) => item.login.uuid}
          renderItem={({ item }) => <UserCard user={item} />}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={<EmptyState />}
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
