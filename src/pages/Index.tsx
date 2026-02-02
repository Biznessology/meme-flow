import { useState, useRef, useCallback } from 'react';
import { ChatMessage, MessageType, ChatTheme, defaultThemes } from '@/types/chat';
import { PhoneFrame } from '@/components/chat/PhoneFrame';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ComponentPicker } from '@/components/chat/ComponentPicker';
import { MessageEditor } from '@/components/chat/MessageEditor';
import { ExportPanel } from '@/components/chat/ExportPanel';
import { ThemePicker } from '@/components/chat/ThemePicker';
import { SettingsPanel } from '@/components/chat/SettingsPanel';
import { Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'text',
    sender: 'bot',
    content: 'Hey! Want to grab dinner tonight?',
    timestamp: '6:30 PM',
  },
  {
    id: '2',
    type: 'text',
    sender: 'user',
    content: 'Sure! What are you thinking?',
    timestamp: '6:31 PM',
  },
  {
    id: '3',
    type: 'buttons',
    sender: 'bot',
    content: 'Pick a cuisine:',
    buttons: ['Italian 🍝', 'Japanese 🍣', 'Mexican 🌮'],
    timestamp: '6:32 PM',
  },
];

export default function Index() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newMessageType, setNewMessageType] = useState<MessageType | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ChatTheme>(defaultThemes[0]);
  const [contactName, setContactName] = useState('Alex');
  const phoneRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleAddComponent = (type: MessageType) => {
    setSelectedMessage(null);
    setIsCreatingNew(true);
    setNewMessageType(type);
  };

  const handleSaveMessage = (message: ChatMessage) => {
    if (isCreatingNew) {
      setMessages([...messages, message]);
    } else {
      setMessages(messages.map((m) => (m.id === message.id ? message : m)));
    }
    setSelectedMessage(null);
    setIsCreatingNew(false);
    setNewMessageType(null);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const handleClearAll = () => {
    setMessages([]);
    setSelectedMessage(null);
  };

  const handleExport = useCallback(async () => {
    if (!phoneRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(phoneRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'chat-meme.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Exported!",
        description: "Your chat meme has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">ChatMeme</h1>
              <p className="text-xs text-muted-foreground">Create interactive chat memes</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex gap-8 justify-center items-start">
          {/* Left Sidebar - Components & Settings */}
          <div className="w-72 space-y-6">
            <div className="sidebar-panel">
              <ComponentPicker onSelect={handleAddComponent} />
            </div>
            <div className="sidebar-panel">
              <ThemePicker currentTheme={currentTheme} onSelect={setCurrentTheme} />
            </div>
            <div className="sidebar-panel">
              <SettingsPanel 
                contactName={contactName} 
                onContactNameChange={setContactName} 
              />
            </div>
          </div>

          {/* Phone Preview */}
          <div 
            ref={phoneRef}
            className="flex-shrink-0"
            style={{
              ['--chat-sender' as string]: currentTheme.senderColor,
              ['--chat-receiver' as string]: currentTheme.receiverColor,
            }}
          >
            <PhoneFrame contactName={contactName}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs mt-1">Add components from the left panel</p>
                </div>
              ) : (
                messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isSelected={selectedMessage?.id === message.id}
                    onClick={() => {
                      setIsCreatingNew(false);
                      setNewMessageType(null);
                      setSelectedMessage(message);
                    }}
                    onDelete={() => handleDeleteMessage(message.id)}
                  />
                ))
              )}
            </PhoneFrame>
          </div>

          {/* Right Sidebar - Editor & Export */}
          <div className="w-72 space-y-6">
            <div className="sidebar-panel">
              {(selectedMessage || isCreatingNew) ? (
                <MessageEditor
                  message={selectedMessage}
                  isNew={isCreatingNew}
                  newType={newMessageType || undefined}
                  onSave={handleSaveMessage}
                  onCancel={() => {
                    setSelectedMessage(null);
                    setIsCreatingNew(false);
                    setNewMessageType(null);
                  }}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Select a message to edit</p>
                  <p className="text-xs mt-1">or add a new component</p>
                </div>
              )}
            </div>
            <div className="sidebar-panel">
              <ExportPanel onExport={handleExport} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          Create and share interactive chat memes • Built with ❤️
        </div>
      </footer>
    </div>
  );
}
