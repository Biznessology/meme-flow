import { MessageType } from '@/types/chat';
import { 
  MessageSquare, 
  MousePointer, 
  List, 
  LayoutGrid, 
  Calendar,
  Image,
  MoreHorizontal
} from 'lucide-react';

interface ComponentPickerProps {
  onSelect: (type: MessageType) => void;
}

const components: { type: MessageType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'text', label: 'Text', icon: MessageSquare, description: 'Simple text message' },
  { type: 'buttons', label: 'Buttons', icon: MousePointer, description: 'Message with action buttons' },
  { type: 'list', label: 'List', icon: List, description: 'Bulleted list items' },
  { type: 'card', label: 'Card', icon: LayoutGrid, description: 'Rich media card' },
  { type: 'datepicker', label: 'Date Picker', icon: Calendar, description: 'Date selection UI' },
  { type: 'image', label: 'Image', icon: Image, description: 'Photo or image' },
  { type: 'typing', label: 'Typing', icon: MoreHorizontal, description: 'Typing indicator' },
];

export function ComponentPicker({ onSelect }: ComponentPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Components
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {components.map((comp) => (
          <button
            key={comp.type}
            onClick={() => onSelect(comp.type)}
            className="component-card text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              <comp.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{comp.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{comp.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
