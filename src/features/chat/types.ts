export interface Message {
  id: string;
  text: string;
  sentAt: Date;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

/** HuggingFace / OpenAI-compatible message format for multi-turn context */
export interface HFMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface UserSnapshot {
  uuid: string;
  firstName: string;
  lastName: string;
  thumbnailUrl: string;
}

export interface ChatSession {
  userId: string;
  messages: Message[];
  lastMessageAt: Date;
  /** Running conversation context sent to the AI on each turn */
  aiHistory: HFMessage[];
  /** Snapshot of the user's data saved on first message */
  userSnapshot?: UserSnapshot;
}
