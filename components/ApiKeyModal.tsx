import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  initialValue?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, initialValue = '' }) => {
  const [key, setKey] = useState(initialValue);

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Enter Inception API Key</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Please provide your Inception Labs API key to start chatting. Your key is saved locally in your browser.
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="INCEPTION_API_KEY"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
        >
          Save & Start Chatting
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;
