import { ReactNode } from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
  contactName?: string;
  contactAvatar?: string;
}

export function PhoneFrame({ children, contactName = "Alex", contactAvatar }: PhoneFrameProps) {
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="phone-frame w-[340px] h-[680px] flex-shrink-0">
      <div className="phone-screen h-full flex flex-col">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-xs font-medium">{currentTime}</span>
          <div className="phone-notch absolute left-1/2 -translate-x-1/2" />
          <div className="flex items-center gap-1">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>

        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-semibold text-primary-foreground">
            {contactAvatar || contactName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{contactName}</h3>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {children}
        </div>

        {/* Input Bar (Visual Only) */}
        <div className="p-3 border-t border-border/30">
          <div className="flex items-center gap-2 bg-secondary/50 rounded-full px-4 py-2">
            <span className="text-sm text-muted-foreground flex-1">Message</span>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
