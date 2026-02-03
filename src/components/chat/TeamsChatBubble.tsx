import { ChatMessage } from '@/types/chat';
import { Calendar as CalendarIcon, Check, Trash2, Edit2, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TeamsChatBubbleProps {
  message: ChatMessage;
  isDarkMode: boolean;
  onDelete?: () => void;
  onUpdate?: (updates: Partial<ChatMessage>) => void;
  onEdit?: () => void;
}

export function TeamsChatBubble({ message, isDarkMode, onDelete, onUpdate, onEdit }: TeamsChatBubbleProps) {
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
                  data-export-button="true"
                  className={`px-3 py-1.5 rounded text-sm font-medium border transition-colors ${isDarkMode
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
                <div
                  key={index}
                  onClick={() => {
                    if (!onUpdate) return;
                    const selected = message.selectedItems || [];
                    const newSelected = selected.includes(index)
                      ? selected.filter((i) => i !== index)
                      : [...selected, index];
                    onUpdate({ selectedItems: newSelected });
                  }}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isDarkMode ? 'border-gray-500' : 'border-gray-400'
                      }`}
                  >
                    {message.selectedItems?.includes(index) && (
                      <Check className="w-3 h-3 text-teams-purple" />
                    )}
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {item}
                  </span>
                </div>
              ))}

              {/* Other Option */}
              {message.allowOther && (
                <div className="space-y-2">
                  <div
                    onClick={() => {
                      if (!onUpdate) return;
                      onUpdate({ isOtherSelected: !message.isOtherSelected });
                    }}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'
                      }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isDarkMode ? 'border-gray-500' : 'border-gray-400'
                        }`}
                    >
                      {message.isOtherSelected && (
                        <Check className="w-3 h-3 text-teams-purple" />
                      )}
                    </div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Other
                    </span>
                  </div>

                  {message.isOtherSelected && (
                    <div className="pl-10 pr-2">
                      <Input
                        value={message.otherText || ''}
                        onChange={(e) => onUpdate?.({ otherText: e.target.value })}
                        placeholder="Please specify..."
                        className={`h-8 text-sm ${isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
                          : 'bg-white border-gray-300 text-gray-900'
                          }`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'card':
        return (
          <div className={`rounded-lg overflow-hidden border ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
            }`}>

            <div className="p-3">
              <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {message.cardTitle}
              </h4>
              <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {message.cardDescription}
              </p>

              {/* Adaptive Elements */}
              {message.cardElements && message.cardElements.length > 0 && (
                <div className="mt-3 space-y-3">
                  {message.cardElements.map((element) => (
                    <div key={element.id} className="space-y-1">
                      {element.type !== 'checkbox' && (
                        <Label className={`text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {element.label}
                        </Label>
                      )}

                      {element.type === 'text' && (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {element.value as string || element.placeholder || 'Text content'}
                        </p>
                      )}

                      {element.type === 'input' && (
                        <Input
                          placeholder={element.placeholder}
                          className={`h-8 text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
                        />
                      )}

                      {element.type === 'textarea' && (
                        <Textarea
                          placeholder={element.placeholder}
                          className={`min-h-[60px] text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}
                        />
                      )}

                      {element.type === 'dropdown' && (
                        <Select>
                          <SelectTrigger className={`h-8 text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {element.options?.split(',').map(opt => (
                              <SelectItem key={opt.trim()} value={opt.trim()}>
                                {opt.trim()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {element.type === 'date' && (
                        <Button
                          variant="outline"
                          data-export-button="true"
                          className={`w-full justify-start text-left font-normal h-8 text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'
                            }`}
                        >
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          <span>Pick a date</span>
                        </Button>
                      )}

                      {element.type === 'checkbox' && (
                        <div className="flex items-center space-x-2">
                          <Checkbox id={element.id} />
                          <Label
                            htmlFor={element.id}
                            className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                          >
                            {element.label}
                          </Label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {message.buttons && message.buttons.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {message.buttons.map((button, index) => (
                    <button
                      key={index}
                      data-export-button="true"
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
            <Popover>
              <PopoverTrigger asChild>
                <button
                  data-export-button="true"
                  className={`flex items-center gap-2 px-3 py-2 rounded border text-sm w-full justify-start ${isDarkMode
                    ? 'border-gray-500 bg-gray-700 text-gray-200'
                    : 'border-gray-300 bg-white text-gray-700'
                    }`}
                >
                  <CalendarIcon className="w-4 h-4 text-teams-purple" />
                  {message.startDate ? (
                    message.endDate ? (
                      <>
                        {format(new Date(message.startDate), 'MMM dd')} -{' '}
                        {format(new Date(message.endDate), 'MMM dd, yyyy')}
                      </>
                    ) : (
                      format(new Date(message.startDate), 'MMM dd, yyyy')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={message.startDate ? new Date(message.startDate) : undefined}
                  selected={{
                    from: message.startDate ? new Date(message.startDate) : undefined,
                    to: message.endDate ? new Date(message.endDate) : undefined,
                  }}
                  onSelect={(range) => {
                    onUpdate?.({
                      startDate: range?.from,
                      endDate: range?.to
                    });
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
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
          <p className={`text-sm m-0 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {message.content}
          </p>
        );
    }
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group relative items-start gap-2`}
      draggable={true} // Although parent handles drag, having this attribute helps visuals
    >
      <div className="self-center opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 text-gray-400">
        <GripVertical className="w-4 h-4" />
      </div>
      {!isUser && (
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-center">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-teams-purple transition-colors"
            title="Edit message"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete message"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div
        data-export-bubble="true"
        className={`max-w-[85%] rounded-lg px-4 py-2 whitespace-pre-wrap flex flex-col gap-0.5 leading-normal ${isUser
          ? isDarkMode
            ? 'bg-teams-sender-dark text-white'
            : 'bg-teams-sender text-gray-800'
          : isDarkMode
            ? 'bg-teams-receiver-dark text-white border-l-2 border-teams-purple'
            : 'bg-teams-receiver text-gray-800 border-l-2 border-teams-purple'
          }`}
      >
        {message.type !== 'typing' && (
          <div className="flex items-center gap-2">
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

      {isUser && (
        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-center">
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-teams-purple transition-colors"
            title="Edit message"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete message"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
