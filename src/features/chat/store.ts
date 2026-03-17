import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatSession, HFMessage, Message, UserSnapshot } from './types';
import * as Crypto from 'expo-crypto';

interface ChatStore {
  sessions: Record<string, ChatSession>;
  sendMessage: (userId: string, text: string, snapshot?: UserSnapshot) => void;
  receiveMessage: (userId: string, text: string) => void;
  appendToAiHistory: (userId: string, messages: HFMessage[]) => void;
  getSession: (userId: string) => ChatSession | undefined;
}

export const useChatStoreBase = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: {},

      sendMessage: (userId, text, snapshot) => {
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
            aiHistory: [],
          };

          return {
            sessions: {
              ...state.sessions,
              [userId]: {
                ...currentSession,
                messages: [newMessage, ...currentSession.messages],
                lastMessageAt: newMessage.sentAt,
                // Save snapshot only once (when session is first created)
                userSnapshot: currentSession.userSnapshot ?? snapshot,
              },
            },
          };
        });

        // Mark as "read" after 1 second to simulate delivery
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
                [userId]: { ...currentSession, messages: updatedMessages },
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
            aiHistory: [],
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

      appendToAiHistory: (userId, messages) => {
        set((state) => {
          const currentSession = state.sessions[userId];
          if (!currentSession) return state;

          return {
            sessions: {
              ...state.sessions,
              [userId]: {
                ...currentSession,
                aiHistory: [...currentSession.aiHistory, ...messages],
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
      // Parse ISO date strings back to Date objects on hydration
      merge: (persistedState: any, currentState) => {
        if (!persistedState || !persistedState.sessions) return currentState;

        const parsedSessions: Record<string, ChatSession> = {};
        for (const [userId, session] of Object.entries<any>(persistedState.sessions)) {
          parsedSessions[userId] = {
            userId: session.userId,
            lastMessageAt: new Date(session.lastMessageAt),
            aiHistory: session.aiHistory ?? [],
            userSnapshot: session.userSnapshot,
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
