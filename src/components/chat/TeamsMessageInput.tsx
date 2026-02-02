import { useState } from 'react';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TeamsMessageInputProps {
  name: string;
  onNameChange: (name: string) => void;
  onSend: (message: string) => void;
  buttonLabel: string;
  buttonColor: 'teams';
  isDarkMode: boolean;
}

export function TeamsMessageInput({
  name,
  onNameChange,
  onSend,
  buttonLabel,
  isDarkMode,
}: TeamsMessageInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
      }`}>
        <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
      </div>
      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Name"
        className={`w-40 ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      />
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={buttonLabel === 'Send' ? 'Outgoing message' : 'Incoming message'}
        className={`flex-1 ${
          isDarkMode 
            ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />
      <Button
        onClick={handleSubmit}
        className="bg-teams-purple hover:bg-teams-purple-dark text-white min-w-[100px]"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
