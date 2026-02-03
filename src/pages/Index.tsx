import { useState, useRef, useCallback, useEffect } from 'react';
import { ChatMessage, MessageType } from '@/types/chat';
import { TeamsChatBubble } from '@/components/chat/TeamsChatBubble';
import { TeamsMessageInput } from '@/components/chat/TeamsMessageInput';
import { TeamsComponentPicker } from '@/components/chat/TeamsComponentPicker';
import { TeamsMessageEditor } from '@/components/chat/TeamsMessageEditor';
import { TeamsSidebar } from '@/components/chat/TeamsSidebar';
import { Download, Upload, Moon, Sun, Trash2, Menu, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ChatScenario } from '@/types/chat';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'text',
    sender: 'user',
    content: 'Hi',
    senderName: 'John',
    timestamp: '11:06',
  },
  {
    id: '2',
    type: 'text',
    sender: 'bot',
    content: 'Hi John, I can help you with Excess Overtime requests. What would you like to do?',
    senderName: 'Morris',
    timestamp: '11:06',
  },
  {
    id: '3',
    type: 'buttons',
    sender: 'bot',
    content: 'Choose an option:',
    buttons: ['Submit Excess OT Request', 'View My Past Requests'],
    senderName: 'Morris',
    timestamp: '11:06',
  },
];

export default function Index() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [senderName, setSenderName] = useState('John');
  const [receiverName, setReceiverName] = useState('Morris');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddingComponent, setIsAddingComponent] = useState(false);
  const [selectedType, setSelectedType] = useState<MessageType | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const [draggedItem, setDraggedItem] = useState<ChatMessage | null>(null);

  // Persistence State
  const [scenarios, setScenarios] = useState<ChatScenario[]>([]);
  const [currentScenarioId, setCurrentScenarioId] = useState<string | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');

  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load scenarios on mount
  useEffect(() => {
    const saved = localStorage.getItem('teams-chat-scenarios');
    if (saved) {
      try {
        setScenarios(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse scenarios', e);
      }
    }
  }, []);

  // Save scenarios to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('teams-chat-scenarios', JSON.stringify(scenarios));
  }, [scenarios]);

  const handleSaveScenario = () => {
    if (!newScenarioName.trim()) return;

    const newScenario: ChatScenario = {
      id: Date.now().toString(),
      name: newScenarioName,
      messages: messages,
      lastModified: Date.now()
    };

    setScenarios([newScenario, ...scenarios]);
    setCurrentScenarioId(newScenario.id);
    setIsSaveDialogOpen(false);
    setNewScenarioName('');

    toast({
      title: "Saved",
      description: "Chat scenario saved successfully.",
    });
  };

  const handleLoadScenario = (scenario: ChatScenario) => {
    setMessages(scenario.messages);
    setCurrentScenarioId(scenario.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close on mobile after selection
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
    if (currentScenarioId === id) {
      setCurrentScenarioId(undefined);
    }
    toast({
      title: "Deleted",
      description: "Scenario deleted.",
    });
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentScenarioId(undefined);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'text',
      sender: 'user',
      content,
      senderName,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages([...messages, newMessage]);
  };

  const handleReceiveMessage = (content: string) => {
    if (!content.trim()) return;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'text',
      sender: 'bot',
      content,
      senderName: receiverName,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages([...messages, newMessage]);
  };

  const handleAddComponent = (type: MessageType) => {
    setSelectedType(type);
  };

  const handleSaveComponent = (message: ChatMessage) => {
    if (editingMessage) {
      setMessages(messages.map((m) => (m.id === message.id ? message : m)));
      setEditingMessage(null);
    } else {
      setMessages([...messages, message]);
    }
    setSelectedType(null);
    setIsAddingComponent(false);
  };

  const handleClearAll = () => {
    setMessages([]);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleUpdateMessage = (id: string, updates: Partial<ChatMessage>) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const handleEditMessage = (message: ChatMessage) => {
    setEditingMessage(message);
    setSelectedType(message.type);
  };

  const handleDragStart = (e: React.DragEvent, item: ChatMessage) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent image to reduce visual clutter if needed, or default browser drag image
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = messages.findIndex(m => m.id === draggedItem.id);
    if (draggedIndex === index) return;

    const newMessages = [...messages];
    const item = newMessages.splice(draggedIndex, 1)[0];
    newMessages.splice(index, 0, item);

    setMessages(newMessages);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleExport = useCallback(async () => {
    if (!chatRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chatRef.current, {
        backgroundColor: isDarkMode ? '#292929' : '#f5f5f5',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = 'teams-chat.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      toast({
        title: "Downloaded!",
        description: "Your Teams chat has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }, [toast, isDarkMode]);

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-teams-dark' : 'bg-teams-light'}`}>

      <TeamsSidebar
        scenarios={scenarios}
        currentScenarioId={currentScenarioId}
        onSelectScenario={handleLoadScenario}
        onDeleteScenario={handleDeleteScenario}
        onNewChat={handleNewChat}
        isDarkMode={isDarkMode}
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className={`border-b ${isDarkMode ? 'border-teams-border-dark bg-teams-dark' : 'border-teams-border bg-white'} shrink-0`}>
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 rounded bg-teams-purple flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.35 8.04c-.68 0-1.29.2-1.82.54V7c0-1.1-.9-2-2-2h-3.18c-.36-.6-1.01-1-1.76-1s-1.4.4-1.76 1H5.65c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h9.88c.21 0 .42-.03.62-.08.57.53 1.33.85 2.17.85 1.77 0 3.21-1.44 3.21-3.21V11.25c0-1.77-1.44-3.21-3.18-3.21zM6 16.5v-9h8v9H6zm13.35.06c-.66 0-1.2-.54-1.2-1.2v-4.11c0-.66.54-1.2 1.2-1.2s1.2.54 1.2 1.2v4.11c0 .66-.54 1.2-1.2 1.2z" />
                </svg>
              </div>
              <span className={`text-lg font-semibold hidden md:inline-block ${isDarkMode ? 'text-white' : 'text-teams-purple'}`}>
                Fake Teams Chat
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Chat
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Scenario</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Enter scenario name..."
                      value={newScenarioName}
                      onChange={(e) => setNewScenarioName(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSaveScenario}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className={isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className={`text-2xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Ready, steady, chat!
            </h1>

            {/* Quick Message Inputs */}
            <div className="space-y-4 mb-6">
              <TeamsMessageInput
                name={senderName}
                onNameChange={setSenderName}
                onSend={handleSendMessage}
                buttonLabel="Send"
                buttonColor="teams"
                isDarkMode={isDarkMode}
              />
              <TeamsMessageInput
                name={receiverName}
                onNameChange={setReceiverName}
                onSend={handleReceiveMessage}
                buttonLabel="Receive"
                buttonColor="teams"
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Component Picker */}
            <div className={`mb-6 p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-3 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Add Interactive Components
              </h3>
              <TeamsComponentPicker onSelect={handleAddComponent} isDarkMode={isDarkMode} />
            </div>

            {/* Component Editor */}
            {
              selectedType && (
                <div className="mb-6">
                  <TeamsMessageEditor
                    type={selectedType}
                    senderName={senderName}
                    receiverName={receiverName}
                    onSave={handleSaveComponent}
                    onCancel={() => {
                      setSelectedType(null);
                      setEditingMessage(null);
                    }}
                    isDarkMode={isDarkMode}
                    initialData={editingMessage || undefined}
                  />
                </div>
              )
            }

            {/* Chat Preview */}
            <div
              ref={chatRef}
              className={`rounded-lg border p-4 min-h-[400px] ${isDarkMode
                ? 'bg-teams-chat-dark border-teams-border-dark'
                : 'bg-teams-chat-light border-teams-border'
                }`}
            >
              {/* Dark Mode Toggle */}
              <div className="flex justify-end mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                    className="data-[state=checked]:bg-teams-purple"
                  />
                  {isDarkMode ? (
                    <Moon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    No messages yet. Start chatting!
                  </p>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, message)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className="transition-all duration-200"
                    >
                      <TeamsChatBubble
                        message={message}
                        isDarkMode={isDarkMode}
                        onDelete={() => handleDeleteMessage(message.id)}
                        onUpdate={(updates) => handleUpdateMessage(message.id, updates)}
                        onEdit={() => handleEditMessage(message)}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={handleExport}
                className="bg-teams-purple hover:bg-teams-purple-dark text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
