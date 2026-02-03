import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Plus, Trash2, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatScenario } from '@/types/chat';

interface TeamsSidebarProps {
    scenarios: ChatScenario[];
    currentScenarioId?: string;
    onSelectScenario: (scenario: ChatScenario) => void;
    onDeleteScenario: (id: string) => void;
    onNewChat: () => void;
    isDarkMode: boolean;
    isOpen: boolean;
    toggleSidebar: () => void;
}

export function TeamsSidebar({
    scenarios,
    currentScenarioId,
    onSelectScenario,
    onDeleteScenario,
    onNewChat,
    isDarkMode,
    isOpen,
    toggleSidebar
}: TeamsSidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "fixed md:relative z-30 h-full transition-all duration-300 ease-in-out border-r flex flex-col",
                isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-64 md:translate-x-0",
                isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
            )}>
                {/* Header */}
                <div className={cn(
                    "p-4 border-b flex items-center justify-between",
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                )}>
                    <h2 className={cn("font-semibold", isDarkMode ? "text-white" : "text-gray-900")}>
                        Chats
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNewChat}
                        className={isDarkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-200 text-gray-600"}
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>

                {/* Chat List */}
                <ScrollArea className="flex-1">
                    <div className="p-3 space-y-2">
                        {scenarios.length === 0 && (
                            <p className={cn("text-sm text-center py-4", isDarkMode ? "text-gray-500" : "text-gray-400")}>
                                No saved chats
                            </p>
                        )}

                        {scenarios.map((scenario) => (
                            <div
                                key={scenario.id}
                                className={cn(
                                    "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                                    currentScenarioId === scenario.id
                                        ? (isDarkMode ? "bg-teams-purple/20 text-white" : "bg-teams-purple/10 text-teams-purple")
                                        : (isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700")
                                )}
                                onClick={() => onSelectScenario(scenario)}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                                    <span className="truncate text-sm font-medium">
                                        {scenario.name}
                                    </span>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 h-6 w-6 ml-2 hover:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteScenario(scenario.id);
                                    }}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
}
