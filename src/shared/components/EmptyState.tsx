import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '../hooks/useColorScheme';
import { colors } from '../theme/colors';
import { Feather } from '@expo/vector-icons';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: keyof typeof Feather.glyphMap;
}

export function EmptyState({ 
  title = 'Nenhum resultado', 
  message = 'Não encontramos nada com os filtros atuais.', 
  icon = 'inbox' 
}: EmptyStateProps) {
  const theme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: colors[theme].surfaceElevated }]}>
        <Feather name={icon} size={40} color={colors[theme].primaryLight} />
      </View>
      <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
      <ThemedText type="secondary" style={styles.message}>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
});
