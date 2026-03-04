import React, { useState, useEffect } from 'react';
import MetricsCard from './components/MetricsCard';
import ChatWindow from './components/ChatWindow';
import ApiKeyModal from './components/ApiKeyModal';
import { sendMessageToInception, Message } from './services/inceptionService';

const App: React.FC = () => {
    const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem('INCEPTION_API_KEY'));
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [inputTokens, setInputTokens] = useState(0);
    const [outputTokens, setOutputTokens] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const handleSaveKey = (key: string) => {
        localStorage.setItem('INCEPTION_API_KEY', key);
        setApiKey(key);
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            {!apiKey && <ApiKeyModal onSave={handleSaveKey} />}
            
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inception AI Chat</h1>
                    <p className="text-gray-500 text-sm">Powered by mercury-2</p>
                </div>
                {apiKey && (
                    <button
                        onClick={() => setApiKey(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 underline"
                    >
                        Update API Key
                    </button>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <MetricsCard
                    label="Input Tokens"
                    value={inputTokens}
                    color="bg-green-500"
                    subtext="Last 24 hours"
                />
                <MetricsCard
                    label="Output Tokens"
                    value={outputTokens}
                    color="bg-purple-500"
                    subtext="Last 24 hours"
                />
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[500px]">
                <ChatWindow messages={messages} isLoading={isLoading} />

                {error && (
                    <div className="px-4 py-2 bg-red-50 text-red-600 text-xs border-t border-red-100 flex items-center justify-between">
                        <span>Error: {error}</span>
                        <button onClick={() => setError(null)} className="font-bold">×</button>
                    </div>
                )}

                <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-gray-50 flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-400 transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-3 rounded-lg transition-all shadow-md active:scale-95"
                    >
                        <i className={`fa-solid ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                    </button>
                </form>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-400">
                    Mercury-2 model | API Version v1 | Distributed via Inception Labs
                </p>
            </div>
        </div>
    );
};

export default App;
