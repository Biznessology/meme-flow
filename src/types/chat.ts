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
  allowOther?: boolean;
  isOtherSelected?: boolean;
  otherText?: string;
  cardTitle?: string;
  cardDescription?: string;
  cardImage?: string;
  imageUrl?: string;
  selectedDate?: string;
  timestamp?: string;

  startDate?: Date;
  endDate?: Date;
  cardElements?: CardElement[];
}

export type CardElementType = 'text' | 'input' | 'textarea' | 'date' | 'dropdown' | 'checkbox';

export interface CardElement {
  id: string;
  type: CardElementType;
  label: string;
  placeholder?: string;
  options?: string; // Comma separated for dropdown
  value?: string | boolean;
}

export interface ChatScenario {
  id: string;
  name: string;
  messages: ChatMessage[];
  lastModified: number;
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
