import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow';
import ApiKeyModal from './components/ApiKeyModal';
import Sidebar from './components/Sidebar';
import { sendMessageToInception, Message } from './services/inceptionService';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('INCEPTION_API_KEY'));
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputTokens, setInputTokens] = useState(0);
    const [outputTokens, setOutputTokens] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [chatHistory, setChatHistory] = useState<string[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSaveKey = (key: string) => {
        localStorage.setItem('INCEPTION_API_KEY', key);
        setApiKey(key);
        setShowSettings(false);
    };

    const handleNewChat = () => {
        if (messages.length > 0) {
            const firstMsg = messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '');
            setChatHistory(prev => [firstMsg, ...prev.slice(0, 9)]);
        }
        setMessages([]);
        setError(null);
        setIsMobileMenuOpen(false);
    };

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || !apiKey || isLoading) return;

        const userMsg: Message = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendMessageToInception(newMessages, apiKey);
            const aiMsg = response.choices[0].message;
            setMessages(prev => [...prev, aiMsg]);
            
            if (response.usage) {
                setInputTokens(prev => prev + response.usage!.prompt_tokens);
                setOutputTokens(prev => prev + response.usage!.completion_tokens);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please check your API key.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white font-sans text-gray-900">
            {/* API Key Setup for New Users */}
            {!apiKey && <ApiKeyModal onSave={handleSaveKey} />}
            
            {/* Settings Modal */}
            {showSettings && (
                <ApiKeyModal
                    onSave={handleSaveKey}
                    onClose={() => setShowSettings(false)}
                    initialValue={apiKey || ''}
                    isSettings={true}
                />
            )}

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 z-40">
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-gray-500">
                    <i className="fa-solid fa-bars-staggered"></i>
                </button>
                <div className="flex-1 text-center font-bold text-sm tracking-tight">Inception Chat</div>
                <button onClick={handleNewChat} className="p-2 -mr-2 text-gray-500">
                    <i className="fa-regular fa-pen-to-square"></i>
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <div
                        className="w-72 h-full bg-white shadow-xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <Sidebar
                            onNewChat={handleNewChat}
                            onOpenSettings={() => {
                                setShowSettings(true);
                                setIsMobileMenuOpen(false);
                            }}
                            chatHistory={chatHistory}
                        />
                    </div>
                </div>
            )}

            <div className="hidden md:flex h-full">
                <Sidebar
                    onNewChat={handleNewChat}
                    onOpenSettings={() => setShowSettings(true)}
                    chatHistory={chatHistory}
                />
            </div>

            <main className="flex-1 flex flex-col relative h-full pt-14 md:pt-0">
                {/* Header/Metrics Overlay */}
                <div className="hidden md:flex absolute top-0 left-0 right-0 p-6 z-10 justify-center pointer-events-none">
                    <div className="flex gap-3 pointer-events-auto">
                        <div className="bg-white/60 backdrop-blur-xl border border-gray-100/50 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">In: {inputTokens}</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-xl border border-gray-100/50 rounded-2xl px-4 py-2 shadow-sm flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Out: {outputTokens}</span>
                        </div>
                    </div>
                </div>

                <ChatWindow messages={messages} isLoading={isLoading} />

                <div className="w-full max-w-3xl mx-auto px-4 pb-6 md:pb-10">
                    {error && (
                        <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 text-xs rounded-2xl border border-red-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-exclamation"></i>
                                <span>{error}</span>
                            </div>
                            <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            disabled={isLoading}
                            className="w-full bg-gray-50/50 border border-gray-200 rounded-[24px] px-6 py-4.5 pr-16 focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 focus:bg-white outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-sm group-hover:border-gray-300 text-base"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 text-white w-11 h-11 rounded-full transition-all flex items-center justify-center shadow-lg active:scale-90"
                        >
                            {isLoading ? (
                                <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-arrow-up"></i>
                            )}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-[10px] text-gray-400 font-medium tracking-wide">
                        Powered by Inception Labs Mercury-2
                    </p>
                </div>
            </main>
        </div>
    );
};

export default App;
