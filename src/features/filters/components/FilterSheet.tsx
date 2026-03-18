import React, { useState } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';
import { UserFilters } from '@/src/features/users/types';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  currentFilters: UserFilters;
  onApplyFilters: (filters: UserFilters) => void;
}

const GENDERS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Masculino', value: 'male' },
  { label: 'Feminino', value: 'female' }
];

const NATIONALITIES = [
  { label: 'Brasil 🇧🇷', value: 'BR' },
  { label: 'Estados Unidos 🇺🇸', value: 'US' },
  { label: 'Reino Unido 🇬🇧', value: 'GB' },
  { label: 'França 🇫🇷', value: 'FR' },
  { label: 'Alemanha 🇩🇪', value: 'DE' },
  { label: 'Austrália 🇦🇺', value: 'AU' },
  { label: 'Espanha 🇪🇸', value: 'ES' },
  { label: 'Canadá 🇨🇦', value: 'CA' },
];

export function FilterSheet({ visible, onClose, currentFilters, onApplyFilters }: FilterSheetProps) {
  const theme = useColorScheme();
  const [internalFilters, setInternalFilters] = useState<UserFilters>(currentFilters);

  const handleApply = () => {
    onApplyFilters(internalFilters);
    onClose();
  };

  const handleClear = () => {
    setInternalFilters({});
  };

  const toggleGender = (gender: any) => {
    setInternalFilters(prev => ({ ...prev, gender }));
  };

  const toggleNationality = (nat: string) => {
    setInternalFilters(prev => ({ ...prev, nat: prev.nat === nat ? undefined : nat }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={styles.sheetContainer} elevated>
          <View style={styles.header}>
            <ThemedText type="subtitle">Filtros</ThemedText>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Feather name="x" size={24} color={colors[theme].text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Gênero</ThemedText>
            <View style={styles.chipsRow}>
              {GENDERS.map(g => {
                const isSelected = internalFilters.gender === g.value || (!internalFilters.gender && g.value === 'todos');
                return (
                  <TouchableOpacity
                    key={g.value}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: isSelected ? colors[theme].primary : 'transparent',
                        borderColor: isSelected ? colors[theme].primary : colors[theme].border,
                      }
                    ]}
                    onPress={() => toggleGender(g.value)}
                  >
                    <ThemedText style={{ color: isSelected ? '#FFF' : colors[theme].text }}>
                      {g.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Nationality Section */}
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Nacionalidade</ThemedText>
            <View style={styles.chipsRow}>
              {NATIONALITIES.map(n => {
                const isSelected = internalFilters.nat === n.value;
                return (
                  <TouchableOpacity
                    key={n.value}
                    style={[
                      styles.chip,
                      { 
                        backgroundColor: isSelected ? colors[theme].primary : 'transparent',
                        borderColor: isSelected ? colors[theme].primary : colors[theme].border,
                      }
                    ]}
                    onPress={() => toggleNationality(n.value)}
                  >
                    <ThemedText style={{ color: isSelected ? '#FFF' : colors[theme].text }}>
                      {n.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
            
          </ScrollView>

          {/* Footer actions */}
          <View style={[styles.footer, { borderTopColor: colors[theme].border }]}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <ThemedText type="secondary" style={styles.clearText}>Limpar</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.applyButton, { backgroundColor: colors[theme].primary }]} 
              onPress={handleApply}
            >
              <ThemedText style={styles.applyText}>Aplicar Filtros</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '70%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 12,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    padding: 20,
    paddingBottom: 30, // For bottom safe area approx
  },
  clearButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  clearText: {
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 14,
  },
  applyText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
