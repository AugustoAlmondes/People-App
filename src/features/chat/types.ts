export interface Message {
  id: string;
  text: string;
  sentAt: Date;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatSession {
  userId: string;
  messages: Message[];
  lastMessageAt: Date;
}
