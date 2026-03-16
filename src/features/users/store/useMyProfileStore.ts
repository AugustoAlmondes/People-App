import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface MyProfileState {
  profile: User | null;
  updateProfile: (updates: Partial<User>) => void;
  updateAvatar: (uri: string) => void;
  initializeProfile: (defaultProfile: User) => void;
}

export const useMyProfileStore = create<MyProfileState>()(
  persist(
    (set) => ({
      profile: null,

      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),

      updateAvatar: (uri) => set((state) => {
        if (!state.profile) return state;
        return {
          profile: {
            ...state.profile,
            picture: {
              ...state.profile.picture,
              large: uri,
              medium: uri,
              thumbnail: uri
            }
          }
        };
      }),

      initializeProfile: (defaultProfile) => set((state) => {
        // Only initialize if it doesn't exist yet (first app open)
        if (!state.profile) {
          return { profile: defaultProfile };
        }
        return state;
      })
    }),
    {
      name: 'my-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
