import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface FavoritesState {
  favorites: User[];
  toggleFavorite: (user: User) => void;
  isFavorite: (userId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (user) => {
        const currentFavorites = get().favorites;
        const exists = currentFavorites.some((fav) => fav.login.uuid === user.login.uuid);

        if (exists) {
          set({
            favorites: currentFavorites.filter((fav) => fav.login.uuid !== user.login.uuid),
          });
        } else {
          set({
            favorites: [...currentFavorites, user],
          });
        }
      },

      isFavorite: (userId) => {
        return get().favorites.some((fav) => fav.login.uuid === userId);
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
