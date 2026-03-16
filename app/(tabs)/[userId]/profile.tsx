import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';

import { User } from '@/src/features/users/types';
import { ProfileHeader } from '@/src/features/users/components/ProfileHeader';
import { InfoSection, InfoItem } from '@/src/features/users/components/InfoSection';

export default function UserProfileScreen() {
  const { userStr } = useLocalSearchParams<{ userStr: string }>();
  const router = useRouter();
  const theme = useColorScheme();
  
  // In a real app we'd fetch or use global state if userStr wasn't passed natively.
  // For the frontend challenge + mock data, parsing the stringified object is fine.
  const user = userStr ? (JSON.parse(userStr) as User) : null;

  if (!user) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Usuário não encontrado.</ThemedText>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <ThemedText type="link">Voltar</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const contactItems: InfoItem[] = [
    { icon: 'phone', label: 'Telefone', value: user.phone },
    { icon: 'smartphone', label: 'Celular', value: user.cell },
    { icon: 'mail', label: 'E-mail', value: user.email },
  ];

  const locationItems: InfoItem[] = [
    { icon: 'map-pin', label: 'Local', value: `${user.location.city}, ${user.location.state}` },
    { icon: 'globe', label: 'País', value: user.location.country },
    { icon: 'navigation', label: 'Coordenadas', value: `${user.location.coordinates.latitude}, ${user.location.coordinates.longitude}` },
  ];

  // Random personal info since our mock data doesn't have age/timezone from randomuser.me yet
  // We'll mock it based on their name length or general values just for the layout
  const personalItems: InfoItem[] = [
    { icon: 'user', label: 'Idade', value: `${20 + user.name.first.length} anos` }, // Mock age
    { icon: 'clock', label: 'Fuso Horário', value: 'GMT-3:00' }, // Mock timezone
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Back Button Overlay */}
        <View style={styles.backButtonSafeArea}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors[theme].surfaceElevated }]} 
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color={colors[theme].text} />
          </TouchableOpacity>
        </View>

        <ProfileHeader user={user} />

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

      {/* Floating Action Button for Chat */}
      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.fabContainer}>
        <TouchableOpacity 
          style={[styles.chatButton, { backgroundColor: colors[theme].primary }]}
          activeOpacity={0.8}
          onPress={() => router.push({ 
            pathname: '/(tabs)/[userId]/chat', 
            params: { userId: user.login.uuid, userStr: JSON.stringify(user) } 
          })}
        >
          <Feather name="message-circle" size={20} color="#FFF" />
          <ThemedText style={styles.chatButtonText}>Iniciar conversa</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  chatButton: {
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
  chatButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});
