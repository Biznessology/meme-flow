import { MessageType } from '@/types/chat';
import { 
  MessageSquare, 
  MousePointerClick, 
  List, 
  CreditCard, 
  Calendar, 
  Image, 
  MoreHorizontal 
} from 'lucide-react';

interface TeamsComponentPickerProps {
  onSelect: (type: MessageType) => void;
  isDarkMode: boolean;
}

const components: { type: MessageType; icon: typeof MessageSquare; label: string }[] = [
  { type: 'text', icon: MessageSquare, label: 'Text' },
  { type: 'buttons', icon: MousePointerClick, label: 'Buttons' },
  { type: 'list', icon: List, label: 'List' },
  { type: 'card', icon: CreditCard, label: 'Card' },
  { type: 'datepicker', icon: Calendar, label: 'Date' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'typing', icon: MoreHorizontal, label: 'Typing' },
];

export function TeamsComponentPicker({ onSelect, isDarkMode }: TeamsComponentPickerProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {components.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}
        >
          <Icon className="w-4 h-4 text-teams-purple" />
          {label}
        </button>
      ))}
    </div>
  );
}
