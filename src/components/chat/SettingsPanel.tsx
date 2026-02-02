import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsPanelProps {
  contactName: string;
  onContactNameChange: (name: string) => void;
}

export function SettingsPanel({ contactName, onContactNameChange }: SettingsPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Settings
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="contactName">Contact Name</Label>
        <Input
          id="contactName"
          value={contactName}
          onChange={(e) => onContactNameChange(e.target.value)}
          placeholder="Enter contact name"
          className="bg-secondary/50 border-border/50"
        />
      </div>
    </div>
  );
}
