export type MessageType = 
  | 'text' 
  | 'buttons' 
  | 'list' 
  | 'card' 
  | 'datepicker' 
  | 'image'
  | 'typing';

export interface ChatMessage {
  id: string;
  type: MessageType;
  sender: 'user' | 'bot';
  content: string;
  buttons?: string[];
  listItems?: string[];
  cardTitle?: string;
  cardDescription?: string;
  cardImage?: string;
  imageUrl?: string;
  timestamp?: string;
}

export interface ChatTheme {
  name: string;
  senderColor: string;
  receiverColor: string;
  backgroundColor: string;
}

export const defaultThemes: ChatTheme[] = [
  {
    name: 'iMessage',
    senderColor: '210 100% 52%',
    receiverColor: '220 15% 22%',
    backgroundColor: '220 15% 10%',
  },
  {
    name: 'WhatsApp',
    senderColor: '142 70% 35%',
    receiverColor: '220 15% 20%',
    backgroundColor: '220 20% 8%',
  },
  {
    name: 'Telegram',
    senderColor: '200 80% 45%',
    receiverColor: '220 15% 22%',
    backgroundColor: '220 15% 10%',
  },
  {
    name: 'Discord',
    senderColor: '235 86% 65%',
    receiverColor: '223 7% 20%',
    backgroundColor: '225 6% 13%',
  },
];
