import React from 'react';

interface SidebarProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  chatHistory: string[];
  currentChatId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onOpenSettings, chatHistory, currentChatId }) => {
  return (
    <div className="w-64 bg-[#f9f9f9] border-r border-gray-200 flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          <i className="fa-solid fa-plus"></i>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <div className="px-2 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Recent Chats
        </div>
        {chatHistory.length === 0 ? (
          <div className="px-3 py-2 text-xs text-gray-400 italic">No recent chats</div>
        ) : (
          chatHistory.map((chat, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors truncate ${
                idx === 0 ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {chat}
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <i className="fa-solid fa-gear"></i>
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
