import { ChatMessage } from '@/types/chat';
import { Check, CheckCheck, Calendar, Image as ImageIcon } from 'lucide-react';

interface ChatBubbleProps {
  message: ChatMessage;
  onDelete?: () => void;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ChatBubble({ message, onDelete, isSelected, onClick }: ChatBubbleProps) {
  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <p className="text-sm leading-relaxed">{message.content}</p>;

      case 'buttons':
        return (
          <div className="space-y-2">
            <p className="text-sm leading-relaxed">{message.content}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {message.buttons?.map((btn, i) => (
                <button
                  key={i}
                  className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-1">
            <p className="text-sm font-medium mb-2">{message.content}</p>
            <ul className="space-y-1">
              {message.listItems?.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'card':
        return (
          <div className="rounded-lg overflow-hidden bg-black/20 border border-white/10">
            {message.cardImage && (
              <div className="h-24 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-white/50" />
              </div>
            )}
            <div className="p-3">
              <h4 className="font-semibold text-sm">{message.cardTitle || 'Card Title'}</h4>
              <p className="text-xs text-white/70 mt-1">{message.cardDescription || message.content}</p>
              <button className="mt-2 w-full py-1.5 text-xs font-medium rounded bg-primary/80 hover:bg-primary transition-colors">
                View Details
              </button>
            </div>
          </div>
        );

      case 'datepicker':
        return (
          <div className="space-y-2">
            <p className="text-sm">{message.content}</p>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-black/20 border border-white/10">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">Select a date...</span>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            {message.content && <p className="text-sm">{message.content}</p>}
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 h-32 flex items-center justify-center">
              {message.imageUrl ? (
                <img src={message.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-white/40" />
              )}
            </div>
          </div>
        );

      case 'typing':
        return (
          <div className="flex items-center gap-1 py-1">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        );

      default:
        return <p className="text-sm">{message.content}</p>;
    }
  };

  return (
    <div
      className={`flex animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}
      onClick={onClick}
    >
      <div
        className={`max-w-[85%] relative group cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-2xl' : ''
        } ${
          isUser
            ? 'chat-bubble-sender'
            : 'chat-bubble-receiver'
        }`}
      >
        {renderContent()}
        
        {/* Timestamp & Status */}
        <div className={`flex items-center gap-1 mt-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[10px] opacity-60">
            {message.timestamp || '12:00'}
          </span>
          {isUser && (
            <CheckCheck className="w-3 h-3 text-primary" />
          )}
        </div>

        {/* Delete button on hover */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
