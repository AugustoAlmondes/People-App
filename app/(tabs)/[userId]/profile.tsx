import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, SafeAreaView, TouchableWithoutFeedbackComponent, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Entypo, Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { User } from '@/src/features/users/types';
import { ProfileHeader } from '@/src/features/users/components/ProfileHeader';
import { InfoSection, InfoItem } from '@/src/features/users/components/InfoSection';
import { useFavoritesStore } from '@/src/features/users/store/useFavoritesStore';


export default function UserProfileScreen() {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
  const { userStr } = useLocalSearchParams<{ userStr: string }>();
  const router = useRouter();
  const theme = useColorScheme();
  const user = userStr ? (JSON.parse(userStr) as User) : null;
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(1);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(user?.login.uuid!));

  const toggleFavoriteStore = useFavoritesStore((state) => state.toggleFavorite)

  const toggleFavorite = () => {
    if (user) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleFavoriteStore(user)
    };


    scale.value = withSequence(
      withTiming(1.3, { duration: 70 }),
      withSpring(1, { damping: 20, stiffness: 150 })
    );
  };

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));


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

  const personalItems: InfoItem[] = [
    { icon: 'user', label: 'Idade', value: `${20 + user.name.first.length} anos` }, // Mock age
    { icon: 'clock', label: 'Fuso Horário', value: 'GMT-3:00' }, // Mock timezone
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <View style={[styles.backButtonSafeArea, { paddingTop: insets.top }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors[theme].surfaceElevated }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color={colors[theme].text} />
          </TouchableOpacity>
        </View>

        <ProfileHeader user={user} />

        <Animated.View>
          <InfoSection title="Contato" items={contactItems} />
        </Animated.View>

        <Animated.View>
          <InfoSection title="Localização" items={locationItems} />
        </Animated.View>

        <Animated.View>
          <InfoSection title="Informações Pessoais" items={personalItems} />
        </Animated.View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Animated.View style={styles.fabContainer}>
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

        <AnimatedPressable
          style={[styles.favoriteButton, { backgroundColor: colors[theme].primary }]}
          onPress={toggleFavorite}
          hitSlop={15}
        >
          <Entypo
            name="heart"
            size={24}
            color={isFavorite ? colors[theme].accent : colors[theme].surface}
          />
        </AnimatedPressable>
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
    bottom: 50,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    left: 20,
    right: 20,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
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
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
});
