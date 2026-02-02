import { ChatMessage } from '@/types/chat';

interface TeamsChatBubbleProps {
  message: ChatMessage;
  isDarkMode: boolean;
}

export function TeamsChatBubble({ message, isDarkMode }: TeamsChatBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? isDarkMode
              ? 'bg-teams-sender-dark text-white'
              : 'bg-teams-sender text-gray-800'
            : isDarkMode
            ? 'bg-teams-receiver-dark text-white border-l-2 border-teams-purple'
            : 'bg-teams-receiver text-gray-800 border-l-2 border-teams-purple'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {message.senderName}
          </span>
          <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {message.timestamp}
          </span>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          {message.content}
        </p>
      </div>
    </div>
  );
}
