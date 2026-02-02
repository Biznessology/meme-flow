import { defaultThemes, ChatTheme } from '@/types/chat';
import { Check } from 'lucide-react';

interface ThemePickerProps {
  currentTheme: ChatTheme;
  onSelect: (theme: ChatTheme) => void;
}

export function ThemePicker({ currentTheme, onSelect }: ThemePickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Theme
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {defaultThemes.map((theme) => (
          <button
            key={theme.name}
            onClick={() => onSelect(theme)}
            className={`relative p-3 rounded-lg border transition-all ${
              currentTheme.name === theme.name
                ? 'border-primary bg-primary/10'
                : 'border-border/50 hover:border-border bg-secondary/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `hsl(${theme.senderColor})` }}
              />
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: `hsl(${theme.receiverColor})` }}
              />
            </div>
            <span className="text-xs font-medium">{theme.name}</span>
            {currentTheme.name === theme.name && (
              <Check className="absolute top-2 right-2 w-3 h-3 text-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
