import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

import { ProfileHeader } from '@/src/features/users/components/ProfileHeader';
import { InfoSection, InfoItem } from '@/src/features/users/components/InfoSection';
import { useMyProfileStore } from '@/src/features/users/store/useMyProfileStore';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/src/shared/components/EmptyState';

export default function MyProfileScreen() {
  const theme = useColorScheme();
  const router = useRouter();
  const profile = useMyProfileStore((state) => state.profile);

  const contactItems: InfoItem[] = [
    { icon: 'phone', label: 'Telefone', value: profile?.phone ?? '' },
    { icon: 'smartphone', label: 'Celular', value: profile?.cell ?? '' },
    { icon: 'mail', label: 'E-mail', value: profile?.email ?? '' },
  ];

  const locationItems: InfoItem[] = [
    { icon: 'map-pin', label: 'Local', value: `${profile?.location?.city ?? ''}, ${profile?.location?.state ?? ''}` },
    { icon: 'globe', label: 'País', value: profile?.location?.country ?? '' },
    { icon: 'navigation', label: 'Coordenadas', value: `${profile?.location?.coordinates?.latitude ?? ''}, ${profile?.location?.coordinates?.longitude ?? ''}` },
  ];

  const personalItems: InfoItem[] = [
    { icon: 'user', label: 'Idade', value: `28 anos` }, // Hardcoded for now without DOB in local store, or mock it? Removing it can be an option if we adapt later
    { icon: 'clock', label: 'Fuso Horário', value: 'GMT-3:00' },
  ];

  if (!profile) {
    return (
      <ThemedView style={styles.container}>
        <EmptyState 
          title="Perfil não configurado" 
          message="Por favor, edite seu perfil para começar." 
          icon="user" 
        />
        <View style={{ padding: 20 }}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors[theme].primary }]}
            activeOpacity={0.8}
            onPress={() => router.push('/edit-profile' as any)}
          >
            <Feather name="edit-2" size={20} color="#FFF" />
            <ThemedText style={styles.primaryButtonText}>Criar Perfil</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* We don't need a back button here because it's a root tab */}
        <ProfileHeader user={profile} />

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <InfoSection title="Contato" items={contactItems} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <InfoSection title="Localização" items={locationItems} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <InfoSection title="Informações Pessoais" items={personalItems} />
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Buttons for Profile Settings */}
      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.fabContainer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton, { borderColor: colors[theme].border, backgroundColor: colors[theme].background }]}
            activeOpacity={0.8}
          >
            <Feather name="settings" size={20} color={colors[theme].text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: colors[theme].primary }]}
            activeOpacity={0.8}
            onPress={() => router.push('/edit-profile' as any)}
          >
            <Feather name="edit-2" size={20} color="#FFF" />
            <ThemedText style={styles.primaryButtonText}>Editar Perfil</ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for the FABs
  },
  bottomSpacer: {
    height: 40,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    width: 60, // Fixed width for icon-only button
  },
  primaryButton: {
    flex: 1, // Takes remaining space
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
