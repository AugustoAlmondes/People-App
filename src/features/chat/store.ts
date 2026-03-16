import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatSession, Message } from './types';
import * as Crypto from 'expo-crypto';

interface ChatStore {
  sessions: Record<string, ChatSession>;
  sendMessage: (userId: string, text: string) => void;
  receiveMessage: (userId: string, text: string) => void;
  getSession: (userId: string) => ChatSession | undefined;
}

export const useChatStoreBase = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: {},

      sendMessage: (userId, text) => {
        const newMessage: Message = {
          id: Crypto.randomUUID(),
          text,
          sentAt: new Date(),
          isOwn: true,
          status: 'sent',
        };

        set((state) => {
          const currentSession = state.sessions[userId] || {
            userId,
            messages: [],
            lastMessageAt: new Date(0),
          };

          return {
            sessions: {
              ...state.sessions,
              [userId]: {
                ...currentSession,
                messages: [newMessage, ...currentSession.messages], // Insert at top for inverted FlatList
                lastMessageAt: newMessage.sentAt,
              },
            },
          };
        });

        // Simulate reading the message after 1 second
        setTimeout(() => {
          set((state) => {
            const currentSession = state.sessions[userId];
            if (!currentSession) return state;

            const updatedMessages = currentSession.messages.map((m) =>
              m.id === newMessage.id ? { ...m, status: 'read' as const } : m
            );

            return {
              sessions: {
                ...state.sessions,
                [userId]: {
                  ...currentSession,
                  messages: updatedMessages,
                },
              },
            };
          });
        }, 1000);
      },

      receiveMessage: (userId, text) => {
        const newMessage: Message = {
          id: Crypto.randomUUID(),
          text,
          sentAt: new Date(),
          isOwn: false,
          status: 'delivered',
        };

        set((state) => {
          const currentSession = state.sessions[userId] || {
            userId,
            messages: [],
            lastMessageAt: new Date(0),
          };

          return {
            sessions: {
              ...state.sessions,
              [userId]: {
                ...currentSession,
                messages: [newMessage, ...currentSession.messages],
                lastMessageAt: newMessage.sentAt,
              },
            },
          };
        });
      },

      getSession: (userId) => {
        return get().sessions[userId];
      },
    }),
    {
      name: 'people-app-chat-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // We need to parse ISO dates back to Date objects since JSON.stringify converts them to strings
      merge: (persistedState: any, currentState) => {
        if (!persistedState || !persistedState.sessions) return currentState;
        
        const parsedSessions: Record<string, ChatSession> = {};
        for (const [userId, session] of Object.entries<any>(persistedState.sessions)) {
          parsedSessions[userId] = {
            userId: session.userId,
            lastMessageAt: new Date(session.lastMessageAt),
            messages: session.messages.map((m: any) => ({
              ...m,
              sentAt: new Date(m.sentAt),
            })),
          };
        }
        
        return {
          ...currentState,
          sessions: parsedSessions,
        };
      },
    }
  )
);
