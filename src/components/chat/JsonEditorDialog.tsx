import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, AlertCircle, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JsonEditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentData: any;
    onImport: (data: any) => void;
    isDarkMode?: boolean;
}

export function JsonEditorDialog({
    open,
    onOpenChange,
    currentData,
    onImport,
    isDarkMode
}: JsonEditorDialogProps) {
    const [jsonContent, setJsonContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    // Update internal state when dialog opens or data changes
    useEffect(() => {
        if (open) {
            setJsonContent(JSON.stringify(currentData, null, 2));
            setError(null);
            setCopied(false);
        }
    }, [open, currentData]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast({
                title: "Copied to clipboard",
                description: "You can now paste this into an LLM to generate more scenarios.",
            });
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Please try manually selecting and copying.",
                variant: "destructive",
            });
        }
    };

    const handleImport = () => {
        try {
            const parsed = JSON.parse(jsonContent);

            // Basic validation
            if (!parsed || typeof parsed !== 'object') {
                throw new Error("Invalid JSON: Root must be an object");
            }

            if (!Array.isArray(parsed.messages)) {
                throw new Error("Invalid JSON: 'messages' must be an array");
            }

            onImport(parsed);
            onOpenChange(false);
            toast({
                title: "Import successful",
                description: "Chat state has been updated.",
            });
        } catch (err: any) {
            setError(err.message || "Invalid JSON syntax");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`max-w-3xl h-[80vh] flex flex-col ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
                <DialogHeader>
                    <DialogTitle>JSON Editor</DialogTitle>
                    <DialogDescription className={isDarkMode ? 'text-gray-400' : ''}>
                        View and edit the raw chat data. You can copy this to use with AI assistants or paste externally generated scenarios here.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 relative min-h-0 border rounded-md overflow-hidden">
                    <Textarea
                        value={jsonContent}
                        onChange={(e) => {
                            setJsonContent(e.target.value);
                            setError(null);
                        }}
                        className={`w-full h-full resize-none font-mono text-xs p-4 border-0 focus-visible:ring-0 ${isDarkMode ? 'bg-gray-900 text-green-400' : 'bg-slate-50 text-slate-900'
                            }`}
                    />

                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute top-2 right-2 h-8 w-8 opacity-70 hover:opacity-100"
                        onClick={handleCopy}
                        title="Copy JSON"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>

                {error && (
                    <div className="text-red-500 text-sm flex items-center gap-2 mt-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className={isDarkMode ? 'border-gray-600 hover:bg-gray-700' : ''}>
                        Cancel
                    </Button>
                    <Button onClick={handleImport} className="bg-teams-purple hover:bg-teams-purple-dark text-white">
                        Apply Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
