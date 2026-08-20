import React from 'react';
import { 
  Compass, 
  MessageSquare, 
  BookOpen, 
  Wrench, 
  Bookmark, 
  Plus, 
  Search, 
  CloudOff, 
  User as UserIcon 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    setIsCreateModalOpen,
    isCloudConnected,
    setIsCloudModalOpen,
    setIsProfileModalOpen,
    user 
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('forum')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm transition group-hover:bg-sky-700">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Вингман</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('forum')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'forum'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Форум</span>
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'guides'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Гайды</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'tools'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Инструменты</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
              activeTab === 'saved'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Закладки</span>
          </button>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-xs relative hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по темам..."
            className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-100/80 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cloud Status Pill */}
          <button
            onClick={() => setIsCloudModalOpen(true)}
            title={isCloudConnected ? 'Облако подключено' : 'Локальный режим'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
              isCloudConnected 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {isCloudConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Облако</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Локально</span>
              </>
            )}
          </button>

          {/* User Profile */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-700 transition"
          >
            <UserIcon className="w-3.5 h-3.5 text-slate-500" />
            <span className="max-w-[100px] truncate">{user.name}</span>
          </button>

          {/* New Post Button */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-medium shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Написать</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-1.5 px-2 bg-white">
        <button
          onClick={() => setActiveTab('forum')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium ${
            activeTab === 'forum' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Форум</span>
        </button>
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium ${
            activeTab === 'guides' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Гайды</span>
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium ${
            activeTab === 'tools' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Инструменты</span>
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-xs font-medium ${
            activeTab === 'saved' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Закладки</span>
        </button>
      </div>
    </header>
  );
};
