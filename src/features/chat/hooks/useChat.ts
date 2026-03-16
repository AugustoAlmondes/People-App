import { useCallback, useState } from 'react';
import { useChatStoreBase } from '../store';

const AUTOREPLIES = [
  'Isso soa interessante!',
  'Legal! Me fale mais sobre isso.',
  'Uau, impressionante.',
  'Não sei se concordo totalmente, mas faz sentido.',
  'Hahaha, verdade!',
  'Entendi. Pode me mandar um e-mail sobre?',
  'Com certeza 👍',
  'Estou ocupado agora, te chamo depois.',
];

export function useChat(userId: string) {
  const [isTyping, setIsTyping] = useState(false);
  
  // Extracting only what we need for this specific user
  const session = useChatStoreBase((state) => state.getSession(userId));
  const _sendMessage = useChatStoreBase((state) => state.sendMessage);
  const _receiveMessage = useChatStoreBase((state) => state.receiveMessage);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      
      _sendMessage(userId, text);
      setIsTyping(true);

      // Simulate a random delayed response between 1.5s and 3s
      const delay = Math.random() * 1500 + 1500;
      setTimeout(() => {
        const randomReply = AUTOREPLIES[Math.floor(Math.random() * AUTOREPLIES.length)];
        _receiveMessage(userId, randomReply);
        setIsTyping(false);
      }, delay);
    },
    [userId, _sendMessage, _receiveMessage]
  );

  return {
    messages: session?.messages || [],
    isTyping,
    sendMessage,
  };
}
