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
  senderName?: string;
  buttons?: string[];
  listItems?: string[];
  selectedItems?: number[];
  cardTitle?: string;
  cardDescription?: string;
  cardImage?: string;
  imageUrl?: string;
  selectedDate?: string;
  timestamp?: string;
  allowOther?: boolean;
  otherText?: string;
  isOtherSelected?: boolean;
}

export interface ChatTheme {
  name: string;
  senderColor: string;
  receiverColor: string;
  backgroundColor: string;
}

export const teamsTheme: ChatTheme = {
  name: 'Teams',
  senderColor: '250 45% 55%',
  receiverColor: '220 14% 96%',
  backgroundColor: '220 14% 96%',
};
