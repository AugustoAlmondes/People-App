import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { ThemedView } from '@/src/shared/components/ThemedView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { Avatar } from '@/src/shared/components/Avatar';
import { useColorScheme } from '@/src/shared/hooks/useColorScheme';
import { colors } from '@/src/shared/theme/colors';
import { useMyProfileStore } from '@/src/features/users/store/useMyProfileStore';
import { User } from '@/src/features/users/types';

export default function EditProfileScreen() {
  const router = useRouter();
  const theme = useColorScheme();
  
  const profile = useMyProfileStore((state) => state.profile);
  const updateProfile = useMyProfileStore((state) => state.updateProfile);
  const updateAvatar = useMyProfileStore((state) => state.updateAvatar);
  const initializeProfile = useMyProfileStore((state) => state.initializeProfile);

  // Default fallback if creating a fresh profile
  const defaultUser: User = {
    login: { uuid: 'my-uuid', username: 'me' },
    name: { title: '', first: '', last: '' },
    email: '',
    phone: '',
    cell: '',
    location: { city: '', state: '', country: '', coordinates: { latitude: '', longitude: '' } },
    picture: { large: '', medium: '', thumbnail: '' },
    nat: 'BR',
    gender: 'none',
  };

  const currentProfile = profile || defaultUser;

  // Local state for the form
  const [firstName, setFirstName] = useState(currentProfile.name.first);
  const [lastName, setLastName] = useState(currentProfile.name.last);
  const [email, setEmail] = useState(currentProfile.email);
  const [phone, setPhone] = useState(currentProfile.phone);
  const [cell, setCell] = useState(currentProfile.cell);
  const [city, setCity] = useState(currentProfile.location.city);
  const [stateName, setStateName] = useState(currentProfile.location.state);
  const [country, setCountry] = useState(currentProfile.location.country);
  const [avatarUri, setAvatarUri] = useState(currentProfile.picture.large);

  useEffect(() => {
    // If we mount the edit screen and have NO profile, let's initialize a blank one in store.
    if (!profile) {
      initializeProfile(defaultUser);
    }
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Desculpe, precisamos de permissões de rolo de câmera para fazer isso funcionar!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // 1. Update Profile Fields
    updateProfile({
      name: { title: currentProfile.name.title, first: firstName, last: lastName },
      email,
      phone,
      cell,
      location: { 
        ...currentProfile.location,
        city,
        state: stateName,
        country
      }
    });

    // 2. Update Avatar if changed
    if (avatarUri !== currentProfile.picture.large) {
      updateAvatar(avatarUri);
    }

    Alert.alert('Sucesso', 'Perfil salvo com sucesso!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header Modal */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={{ color: colors[theme].primary }}>Cancelar</ThemedText>
          </TouchableOpacity>
          <ThemedText type="defaultSemiBold" style={styles.title}>Editar Perfil</ThemedText>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <ThemedText style={{ color: colors[theme].primary, fontWeight: 'bold' }}>Salvar</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} automaticallyAdjustKeyboardInsets>
          
          {/* Avatar Edit Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Avatar uri={avatarUri} size={100} borderColor={colors[theme].primary} />
              <TouchableOpacity style={[styles.editBadge, { backgroundColor: colors[theme].primary }]} onPress={handlePickImage}>
                <Feather name="camera" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ThemedText type="secondary" style={styles.avatarHint}>Toque na câmera para alterar a foto</ThemedText>
          </View>

          {/* Form Fields Section */}
          <View style={styles.formSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Pessoais</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Nome</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Ex: João"
                placeholderTextColor={colors[theme].textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Sobrenome</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                value={lastName}
                onChangeText={setLastName}
                placeholder="Ex: Silva"
                placeholderTextColor={colors[theme].textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>E-mail</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="joao@example.com"
                placeholderTextColor={colors[theme].textSecondary}
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Contato</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Telefone Fixo</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="(00) 0000-0000"
                placeholderTextColor={colors[theme].textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Celular</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                value={cell}
                onChangeText={setCell}
                keyboardType="phone-pad"
                placeholder="(00) 90000-0000"
                placeholderTextColor={colors[theme].textSecondary}
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Localização</ThemedText>
            
            <View style={styles.inputGroup}>
              <ThemedText type="defaultSemiBold" style={styles.label}>Cidade</ThemedText>
              <TextInput 
                style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                value={city}
                onChangeText={setCity}
                placeholder="Ex: São Paulo"
                placeholderTextColor={colors[theme].textSecondary}
              />
            </View>
            
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText type="defaultSemiBold" style={styles.label}>Estado</ThemedText>
                <TextInput 
                  style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                  value={stateName}
                  onChangeText={setStateName}
                  placeholder="Ex: SP"
                  placeholderTextColor={colors[theme].textSecondary}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText type="defaultSemiBold" style={styles.label}>País</ThemedText>
                <TextInput 
                  style={[styles.input, { color: colors[theme].text, borderColor: colors[theme].border, backgroundColor: colors[theme].surfaceElevated }]} 
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Ex: Brasil"
                  placeholderTextColor={colors[theme].textSecondary}
                />
              </View>
            </View>
          </View>
          
          {/* Spacer for bottom */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : 40,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  saveButton: {
    padding: 8,
    marginRight: -8,
  },
  title: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatarWrapper: {
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  avatarHint: {
    marginTop: 12,
    fontSize: 13,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
