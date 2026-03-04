import React, { useState, useEffect } from 'react';
import MetricsCard from './components/MetricsCard';
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
            setError(err.message || 'An error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-white">
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

            <Sidebar
                onNewChat={handleNewChat}
                onOpenSettings={() => setShowSettings(true)}
                chatHistory={chatHistory}
            />

            <main className="flex-1 flex flex-col relative h-full">
                {/* Header/Metrics Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-center pointer-events-none">
                    <div className="flex gap-4 pointer-events-auto">
                        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In: {inputTokens}</span>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Out: {outputTokens}</span>
                        </div>
                    </div>
                </div>

                <ChatWindow messages={messages} isLoading={isLoading} />

                <div className="w-full max-w-3xl mx-auto px-4 pb-8">
                    {error && (
                        <div className="mb-4 px-4 py-2 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 flex items-center justify-between">
                            <span>Error: {error}</span>
                            <button onClick={() => setError(null)} className="font-bold">×</button>
                        </div>
                    )}

                    <form onSubmit={handleSend} className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message Inception AI..."
                            disabled={isLoading}
                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pr-14 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-sm group-hover:border-gray-300"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white w-10 h-10 rounded-xl transition-all flex items-center justify-center shadow-md active:scale-90"
                        >
                            <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-arrow-up'}`}></i>
                        </button>
                    </form>

                    <p className="mt-3 text-center text-[10px] text-gray-400">
                        Inception AI may provide inaccurate information. Check important info.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default App;
