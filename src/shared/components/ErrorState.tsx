import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '../hooks/useColorScheme';
import { colors } from '../theme/colors';
import { Feather } from '@expo/vector-icons';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }: ErrorStateProps) {
  const theme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <Feather name="alert-circle" size={48} color={colors[theme].error} style={styles.icon} />
      <ThemedText style={styles.message} type="secondary">{message}</ThemedText>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors[theme].primary }]} 
        onPress={onRetry}
        activeOpacity={0.8}
      >
        <ThemedText style={styles.buttonText}>Tentar novamente</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  icon: {
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
