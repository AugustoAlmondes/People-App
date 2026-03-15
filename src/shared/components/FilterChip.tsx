import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import { colors } from '../theme/colors';
import { ThemedText } from './ThemedText';
import { Feather } from '@expo/vector-icons';

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  const theme = useColorScheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors[theme].primaryLight }]} 
      onPress={onRemove}
      activeOpacity={0.8}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Feather name="x" size={14} color="#FFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
});
