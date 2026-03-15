import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

export interface InfoItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}

interface InfoSectionProps {
  title: string;
  items: InfoItem[];
}

export function InfoSection({ title, items }: InfoSectionProps) {
  const theme = useColorScheme();

  return (
    <View style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>{title}</ThemedText>
      
      <ThemedView elevated style={styles.card}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <View 
              key={`${item.label}-${index}`} 
              style={[
                styles.itemRow, 
                !isLast && { borderBottomWidth: 1, borderBottomColor: colors[theme].border }
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors[theme].background }]}>
                <Feather name={item.icon} size={20} color={colors[theme].primaryLight} />
              </View>
              
              <View style={styles.textContainer}>
                <ThemedText type="secondary" style={styles.label}>{item.label}</ThemedText>
                <ThemedText style={styles.value}>{item.value}</ThemedText>
              </View>
            </View>
          );
        })}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 15,
  },
});
