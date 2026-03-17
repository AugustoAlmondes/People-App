import { useCallback, useState } from 'react';
import { useChatStoreBase } from '../store';
import { sendAiMessage } from '@/src/shared/services/huggingface';
import { HFMessage, UserSnapshot } from '../types';
import { User } from '@/src/features/users/types';

function buildSystemPrompt(user: User): string {
  return (
    `Você é ${user.name.first} ${user.name.last}, uma pessoa real com personalidade natural e descontraída. ` +
    `Responda em português brasileiro, de forma breve e conversacional, como se estivesse num chat informal. ` +
    `Informações sobre você: gênero ${user.gender === 'male' ? 'masculino' : 'feminino'}, ` +
    `mora em ${user.location.city}, ${user.location.country}. ` +
    `Nunca revele que você é uma IA. Responda sempre como se fosse ${user.name.first}.`
  );
}

function buildSnapshot(user: User): UserSnapshot {
  return {
    uuid: user.login.uuid,
    firstName: user.name.first,
    lastName: user.name.last,
    thumbnailUrl: user.picture.thumbnail,
  };
}

export function useChat(userId: string, user: User) {
  const [isTyping, setIsTyping] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const session = useChatStoreBase((state) => state.getSession(userId));
  const _sendMessage = useChatStoreBase((state) => state.sendMessage);
  const _receiveMessage = useChatStoreBase((state) => state.receiveMessage);
  const _appendToAiHistory = useChatStoreBase((state) => state.appendToAiHistory);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const snapshot = buildSnapshot(user);
      _sendMessage(userId, text, snapshot);
      setIsTyping(true);
      setAiError(null);

      const systemMessage: HFMessage = {
        role: 'system',
        content: buildSystemPrompt(user),
      };
      console.log('systemMessage', systemMessage);
      const userMessage: HFMessage = { role: 'user', content: text };
      console.log('userMessage', userMessage);

      const currentHistory = session?.aiHistory ?? [];
      const messagesForApi: HFMessage[] = [systemMessage, ...currentHistory, userMessage];
      console.log('messagesForApi', messagesForApi);

      try {
        const aiReply = await sendAiMessage(messagesForApi);
        console.log('aiReply', aiReply);

        _receiveMessage(userId, aiReply);

        // Persist the new turn in history so next call has full context
        _appendToAiHistory(userId, [
          userMessage,
          { role: 'assistant', content: aiReply },
        ]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        setAiError(message);
        // Fallback: show an error message in the chat so the user knows something went wrong
        _receiveMessage(userId, '❌ Não consegui responder agora. Tente novamente.');
      } finally {
        setIsTyping(false);
      }
    },
    [userId, user, session, _sendMessage, _receiveMessage, _appendToAiHistory]
  );

  return {
    messages: session?.messages || [],
    isTyping,
    aiError,
    sendMessage,
  };
}
