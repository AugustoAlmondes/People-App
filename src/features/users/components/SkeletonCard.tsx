import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SkeletonBox } from '@/src/shared/components/SkeletonBox';
import { ThemedView } from '@/src/shared/components/ThemedView';

export function SkeletonCard() {
  return (
    <ThemedView elevated style={styles.card}>
      <View style={styles.contentRow}>
        <SkeletonBox width={56} height={56} borderRadius={28} />
        
        <View style={styles.textContainer}>
          <SkeletonBox width={140} height={20} style={{ marginBottom: 8 }} />
          <SkeletonBox width={100} height={16} />
        </View>

        <View style={styles.iconContainer}>
          <SkeletonBox width={24} height={24} borderRadius={12} />
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  iconContainer: {
    marginLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
