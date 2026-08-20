import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ForumView } from './components/forum/ForumView';
import { GuidesView } from './components/guides/GuidesView';
import { ToolsView } from './components/tools/ToolsView';
import { PostDetailModal } from './components/forum/PostDetailModal';
import { CreatePostModal } from './components/forum/CreatePostModal';
import { GuideDetailModal } from './components/guides/GuideDetailModal';
import { CloudSettingsModal } from './components/modals/CloudSettingsModal';
import { UserProfileModal } from './components/modals/UserProfileModal';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    selectedPost, 
    setSelectedPost, 
    isCreateModalOpen, 
    setIsCreateModalOpen,
    selectedGuide,
    setSelectedGuide,
    isCloudModalOpen,
    setIsCloudModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Subheader */}
        <div className="mb-6">
          {activeTab === 'forum' && (
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Обсуждения и опыт
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Реальный опыт, разборы анкет, вопросы и советы от парней.
              </p>
            </div>
          )}

          {activeTab === 'guides' && (
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Гайды и советы
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Практичные рекомендации по переписке, свиданиям и уверенности.
              </p>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Инструменты Вингмана
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Генератор первых сообщений, идеи для свиданий, конструктор анкеты и чек-лист.
              </p>
            </div>
          )}

          {activeTab === 'saved' && (
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Сохраненные темы
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Ваши закладки с полезными советами.
              </p>
            </div>
          )}
        </div>

        {/* View Switcher */}
        {(activeTab === 'forum' || activeTab === 'saved') && <ForumView />}
        {activeTab === 'guides' && <GuidesView />}
        {activeTab === 'tools' && <ToolsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Вингман</span>
            <span>—</span>
            <span>Мужской форум и инструменты для знакомств</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCloudModalOpen(true)} 
              className="hover:text-slate-800 transition"
            >
              Облако
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsProfileModalOpen(true)} 
              className="hover:text-slate-800 transition"
            >
              Профиль
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {isCreateModalOpen && (
        <CreatePostModal
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {selectedGuide && (
        <GuideDetailModal
          guide={selectedGuide}
          onClose={() => setSelectedGuide(null)}
        />
      )}

      {isCloudModalOpen && (
        <CloudSettingsModal
          onClose={() => setIsCloudModalOpen(false)}
        />
      )}

      {isProfileModalOpen && (
        <UserProfileModal
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
