import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  onClose?: () => void;
  initialValue?: string;
  isSettings?: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onClose, initialValue = '', isSettings = false }) => {
  const [key, setKey] = useState(initialValue);

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl mx-4 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isSettings ? 'API Settings' : 'Welcome to Inception AI'}
          </h2>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          {isSettings
            ? 'Update your Inception Labs API key below. Changes are saved locally.'
            : 'To start chatting, please provide your Inception Labs API key. Your key is stored securely in your browser\'s local storage.'
          }
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="INCEPTION_API_KEY"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 font-mono text-sm"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all shadow-lg active:scale-[0.98]"
          >
            {isSettings ? 'Save Changes' : 'Get Started'}
          </button>

          <p className="text-[10px] text-gray-400 text-center">
            Need a key? Visit <a href="https://platform.inceptionlabs.ai" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">inceptionlabs.ai</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
