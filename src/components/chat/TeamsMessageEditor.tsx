import { useState, useEffect } from 'react';
import { ChatMessage, MessageType } from '@/types/chat';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, X } from 'lucide-react';

interface TeamsMessageEditorProps {
  type: MessageType;
  senderName: string;
  receiverName: string;
  onSave: (message: ChatMessage) => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

export function TeamsMessageEditor({
  type,
  senderName,
  receiverName,
  onSave,
  onCancel,
  isDarkMode,
}: TeamsMessageEditorProps) {
  const [sender, setSender] = useState<'user' | 'bot'>('bot');
  const [content, setContent] = useState('');
  const [buttons, setButtons] = useState<string[]>(['Option 1', 'Option 2']);
  const [listItems, setListItems] = useState<string[]>(['Item 1', 'Item 2', 'Item 3']);
  const [cardTitle, setCardTitle] = useState('Card Title');
  const [cardDescription, setCardDescription] = useState('Card description goes here');
  const [imageUrl, setImageUrl] = useState('');

  const inputClass = isDarkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
    : 'bg-white border-gray-300 text-gray-900';

  const labelClass = isDarkMode ? 'text-gray-200' : 'text-gray-700';

  const handleSave = () => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      sender,
      content,
      senderName: sender === 'user' ? senderName : receiverName,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    if (type === 'buttons') {
      message.buttons = buttons.filter(b => b.trim());
    }
    if (type === 'list') {
      message.listItems = listItems.filter(i => i.trim());
    }
    if (type === 'card') {
      message.cardTitle = cardTitle;
      message.cardDescription = cardDescription;
      message.buttons = buttons.filter(b => b.trim());
      message.cardImage = 'gradient';
    }
    if (type === 'image') {
      message.imageUrl = imageUrl;
    }

    onSave(message);
  };

  const addButton = () => setButtons([...buttons, `Option ${buttons.length + 1}`]);
  const removeButton = (index: number) => setButtons(buttons.filter((_, i) => i !== index));
  const updateButton = (index: number, value: string) => {
    const newButtons = [...buttons];
    newButtons[index] = value;
    setButtons(newButtons);
  };

  const addListItem = () => setListItems([...listItems, `Item ${listItems.length + 1}`]);
  const removeListItem = (index: number) => setListItems(listItems.filter((_, i) => i !== index));
  const updateListItem = (index: number, value: string) => {
    const newItems = [...listItems];
    newItems[index] = value;
    setListItems(newItems);
  };

  return (
    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h3 className={`font-semibold mb-4 ${labelClass}`}>
        Add {type.charAt(0).toUpperCase() + type.slice(1)} Message
      </h3>

      {/* Sender Selection */}
      <div className="mb-4">
        <Label className={labelClass}>Sender</Label>
        <RadioGroup value={sender} onValueChange={(v) => setSender(v as 'user' | 'bot')} className="flex gap-4 mt-2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="user" id="user" />
            <Label htmlFor="user" className={labelClass}>{senderName}</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="bot" id="bot" />
            <Label htmlFor="bot" className={labelClass}>{receiverName}</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Content - varies by type */}
      {type !== 'typing' && type !== 'card' && (
        <div className="mb-4">
          <Label className={labelClass}>Message</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter message content..."
            className={`mt-1 ${inputClass}`}
            rows={3}
          />
        </div>
      )}

      {/* Buttons editor */}
      {(type === 'buttons' || type === 'card') && (
        <div className="mb-4">
          <Label className={labelClass}>Buttons</Label>
          <div className="space-y-2 mt-2">
            {buttons.map((button, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={button}
                  onChange={(e) => updateButton(index, e.target.value)}
                  className={inputClass}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeButton(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addButton} className="mt-2">
              <Plus className="w-4 h-4 mr-1" /> Add Button
            </Button>
          </div>
        </div>
      )}

      {/* List items editor */}
      {type === 'list' && (
        <div className="mb-4">
          <Label className={labelClass}>List Items</Label>
          <div className="space-y-2 mt-2">
            {listItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateListItem(index, e.target.value)}
                  className={inputClass}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeListItem(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addListItem} className="mt-2">
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </div>
        </div>
      )}

      {/* Card editor */}
      {type === 'card' && (
        <div className="space-y-4 mb-4">
          <div>
            <Label className={labelClass}>Card Title</Label>
            <Input
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              className={`mt-1 ${inputClass}`}
            />
          </div>
          <div>
            <Label className={labelClass}>Card Description</Label>
            <Textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              className={`mt-1 ${inputClass}`}
              rows={2}
            />
          </div>
        </div>
      )}

      {/* Image URL */}
      {type === 'image' && (
        <div className="mb-4">
          <Label className={labelClass}>Image URL</Label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={`mt-1 ${inputClass}`}
          />
        </div>
      )}

      {/* Date picker content */}
      {type === 'datepicker' && (
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          This will display a date picker button in the chat.
        </p>
      )}

      {/* Typing indicator note */}
      {type === 'typing' && (
        <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          This will show an animated typing indicator.
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-teams-purple hover:bg-teams-purple-dark text-white">
          Add Message
        </Button>
      </div>
    </div>
  );
}
