import { ChatMessage } from '@/types/chat';
import { Calendar, Check } from 'lucide-react';

interface TeamsChatBubbleProps {
  message: ChatMessage;
  isDarkMode: boolean;
}

export function TeamsChatBubble({ message, isDarkMode }: TeamsChatBubbleProps) {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'typing':
        return (
          <div className="flex items-center gap-1 py-1">
            <div className="typing-dot" style={{ animationDelay: '0ms' }} />
            <div className="typing-dot" style={{ animationDelay: '150ms' }} />
            <div className="typing-dot" style={{ animationDelay: '300ms' }} />
          </div>
        );

      case 'buttons':
        return (
          <div>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {message.content}
            </p>
            <div className="flex flex-wrap gap-2">
              {message.buttons?.map((button, index) => (
                <button
                  key={index}
                  className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${
                    isDarkMode
                      ? 'border-teams-purple text-teams-purple hover:bg-teams-purple hover:text-white'
                      : 'border-teams-purple text-teams-purple hover:bg-teams-purple hover:text-white'
                  }`}
                >
                  {button}
                </button>
              ))}
            </div>
          </div>
        );

      case 'list':
        return (
          <div>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {message.content}
            </p>
            <div className="space-y-2">
              {message.listItems?.map((item, index) => (
                <label
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                    isDarkMode
                      ? 'hover:bg-white/5'
                      : 'hover:bg-black/5'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isDarkMode ? 'border-gray-500' : 'border-gray-400'
                  }`}>
                    {message.selectedItems?.includes(index) && (
                      <Check className="w-3 h-3 text-teams-purple" />
                    )}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'card':
        return (
          <div className={`rounded-lg overflow-hidden border ${
            isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
          }`}>
            {message.cardImage && (
              <div className="h-32 bg-gradient-to-br from-teams-purple to-purple-400" />
            )}
            <div className="p-3">
              <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {message.cardTitle}
              </h4>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {message.cardDescription}
              </p>
              {message.buttons && message.buttons.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {message.buttons.map((button, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 bg-teams-purple text-white text-xs rounded font-medium hover:bg-teams-purple-dark transition-colors"
                    >
                      {button}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'datepicker':
        return (
          <div>
            <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {message.content}
            </p>
            <button className={`flex items-center gap-2 px-3 py-2 rounded border text-sm ${
              isDarkMode
                ? 'border-gray-500 bg-gray-700 text-gray-200'
                : 'border-gray-300 bg-white text-gray-700'
            }`}>
              <Calendar className="w-4 h-4 text-teams-purple" />
              {message.selectedDate || 'Select a date'}
            </button>
          </div>
        );

      case 'image':
        return (
          <div>
            {message.content && (
              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {message.content}
              </p>
            )}
            <div className="rounded-lg overflow-hidden">
              <img
                src={message.imageUrl || 'https://via.placeholder.com/300x200'}
                alt="Shared image"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        );

      default:
        return (
          <p className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {message.content}
          </p>
        );
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 ${
          isUser
            ? isDarkMode
              ? 'bg-teams-sender-dark text-white'
              : 'bg-teams-sender text-gray-800'
            : isDarkMode
            ? 'bg-teams-receiver-dark text-white border-l-2 border-teams-purple'
            : 'bg-teams-receiver text-gray-800 border-l-2 border-teams-purple'
        }`}
      >
        {message.type !== 'typing' && (
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {message.senderName}
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {message.timestamp}
            </span>
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
}
