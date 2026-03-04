import React from 'react';

interface SidebarProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  chatHistory: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, onOpenSettings, chatHistory }) => {
  return (
    <div className="w-72 bg-[#f9f9f9] border-r border-gray-200 flex flex-col h-full hidden md:flex">
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
        >
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-plus text-xs"></i>
            New Chat
          </div>
          <i className="fa-regular fa-pen-to-square text-xs text-gray-400"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <div className="px-3 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
          Recent Activity
        </div>
        {chatHistory.length === 0 ? (
          <div className="px-3 py-6 text-xs text-gray-400 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200 mx-2">
            No history yet
          </div>
        ) : (
          chatHistory.map((chat, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-3 text-sm rounded-xl transition-all truncate group flex items-center gap-3 ${
                idx === 0 ? 'bg-gray-200/50 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="fa-regular fa-message text-[10px] opacity-40"></i>
              <span className="flex-1 truncate">{chat}</span>
            </button>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <i className="fa-solid fa-gear text-xs"></i>
          </div>
          Settings
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
