import { Button } from '@/components/ui/button';
import { Download, Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportPanelProps {
  onExport: () => void;
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    toast({
      title: "Coming soon!",
      description: "Copy to clipboard feature will be available soon.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Coming soon!",
      description: "Share feature will be available soon.",
    });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Export
      </h3>
      <div className="space-y-2">
        <Button 
          onClick={onExport}
          className="w-full justify-start gap-2"
        >
          <Download className="w-4 h-4" />
          Download as PNG
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCopyToClipboard}
          className="w-full justify-start gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy to Clipboard
        </Button>
        <Button 
          variant="outline"
          onClick={handleShare}
          className="w-full justify-start gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share Link
        </Button>
      </div>
    </div>
  );
}
