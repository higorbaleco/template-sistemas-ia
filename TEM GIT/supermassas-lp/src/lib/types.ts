export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  agentName: string;
  status: 'AO VIVO' | 'offline';
  messages: ChatMessage[];
}

export interface Capability {
  id: string;
  title: string;
  description: string;
}
