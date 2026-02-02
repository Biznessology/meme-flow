import { useState, useEffect } from 'react';
import { ChatMessage, MessageType } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, Plus, Trash2 } from 'lucide-react';

interface MessageEditorProps {
  message: ChatMessage | null;
  onSave: (message: ChatMessage) => void;
  onCancel: () => void;
  isNew?: boolean;
  newType?: MessageType;
}

export function MessageEditor({ message, onSave, onCancel, isNew, newType }: MessageEditorProps) {
  const [editedMessage, setEditedMessage] = useState<ChatMessage | null>(null);
  const [buttons, setButtons] = useState<string[]>([]);
  const [listItems, setListItems] = useState<string[]>([]);

  useEffect(() => {
    if (message) {
      setEditedMessage(message);
      setButtons(message.buttons || ['Button 1', 'Button 2']);
      setListItems(message.listItems || ['Item 1', 'Item 2']);
    } else if (isNew && newType) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: newType,
        sender: 'bot',
        content: getDefaultContent(newType),
        buttons: newType === 'buttons' ? ['Yes', 'No'] : undefined,
        listItems: newType === 'list' ? ['First item', 'Second item'] : undefined,
        cardTitle: newType === 'card' ? 'Card Title' : undefined,
        cardDescription: newType === 'card' ? 'Card description goes here' : undefined,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setEditedMessage(newMessage);
      setButtons(newMessage.buttons || []);
      setListItems(newMessage.listItems || []);
    }
  }, [message, isNew, newType]);

  const getDefaultContent = (type: MessageType): string => {
    switch (type) {
      case 'text': return 'Hello! How can I help you today?';
      case 'buttons': return 'Please select an option:';
      case 'list': return 'Here are your options:';
      case 'card': return 'Check out this card!';
      case 'datepicker': return 'Please select a date:';
      case 'image': return '';
      case 'typing': return '';
      default: return '';
    }
  };

  if (!editedMessage) return null;

  const handleSave = () => {
    onSave({
      ...editedMessage,
      buttons: editedMessage.type === 'buttons' ? buttons : undefined,
      listItems: editedMessage.type === 'list' ? listItems : undefined,
    });
  };

  const addButton = () => setButtons([...buttons, `Button ${buttons.length + 1}`]);
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
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          {isNew ? 'New Message' : 'Edit Message'}
        </h3>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sender Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
        <Label htmlFor="sender" className="text-sm">Sender</Label>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${editedMessage.sender === 'bot' ? 'text-muted-foreground' : 'text-primary'}`}>
            You
          </span>
          <Switch
            id="sender"
            checked={editedMessage.sender === 'bot'}
            onCheckedChange={(checked) =>
              setEditedMessage({ ...editedMessage, sender: checked ? 'bot' : 'user' })
            }
          />
          <span className={`text-xs ${editedMessage.sender === 'bot' ? 'text-primary' : 'text-muted-foreground'}`}>
            Contact
          </span>
        </div>
      </div>

      {/* Content */}
      {editedMessage.type !== 'typing' && (
        <div className="space-y-2">
          <Label htmlFor="content">Message</Label>
          <Textarea
            id="content"
            value={editedMessage.content}
            onChange={(e) => setEditedMessage({ ...editedMessage, content: e.target.value })}
            placeholder="Enter message content..."
            className="min-h-[80px] bg-secondary/50 border-border/50"
          />
        </div>
      )}

      {/* Buttons Editor */}
      {editedMessage.type === 'buttons' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Buttons</Label>
            <button onClick={addButton} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {buttons.map((btn, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={btn}
                  onChange={(e) => updateButton(i, e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
                <button onClick={() => removeButton(i)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List Items Editor */}
      {editedMessage.type === 'list' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>List Items</Label>
            <button onClick={addListItem} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {listItems.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => updateListItem(i, e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
                <button onClick={() => removeListItem(i)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Editor */}
      {editedMessage.type === 'card' && (
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="cardTitle">Card Title</Label>
            <Input
              id="cardTitle"
              value={editedMessage.cardTitle || ''}
              onChange={(e) => setEditedMessage({ ...editedMessage, cardTitle: e.target.value })}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardDesc">Card Description</Label>
            <Textarea
              id="cardDesc"
              value={editedMessage.cardDescription || ''}
              onChange={(e) => setEditedMessage({ ...editedMessage, cardDescription: e.target.value })}
              className="min-h-[60px] bg-secondary/50 border-border/50"
            />
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="space-y-2">
        <Label htmlFor="timestamp">Time</Label>
        <Input
          id="timestamp"
          value={editedMessage.timestamp || ''}
          onChange={(e) => setEditedMessage({ ...editedMessage, timestamp: e.target.value })}
          placeholder="12:00 PM"
          className="bg-secondary/50 border-border/50"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          {isNew ? 'Add Message' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
