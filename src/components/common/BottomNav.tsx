import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Search, PlusCircle, MessageSquare, UserCheck } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, setIsPostJobOpen, conversations } = useApp();

  const totalUnreadChat = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 pb-safe shadow-lg">
      <div className="max-w-md mx-auto px-4 py-1.5 flex items-center justify-between">
        {/* Home */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'home'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">{t.navHome}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'search'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">{t.navSearch}</span>
        </button>

        {/* Center Post Job Button - Large & High Contrast */}
        <button
          onClick={() => setIsPostJobOpen(true)}
          className="flex flex-col items-center justify-center flex-1 -mt-4 group active:scale-95 transition"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition">
            <PlusCircle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-orange-700 mt-0.5 whitespace-nowrap">
            {t.navPost}
          </span>
        </button>

        {/* Chat */}
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition relative ${
            activeTab === 'chat'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${activeTab === 'chat' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {totalUnreadChat > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {totalUnreadChat}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">{t.navChat}</span>
        </button>

        {/* My Work / Profile */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition ${
            activeTab === 'dashboard'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-900 font-medium'
          }`}
        >
          <UserCheck className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5">My Work</span>
        </button>
      </div>
    </nav>
  );
};
