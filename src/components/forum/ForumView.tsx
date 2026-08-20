import React from 'react';
import { Flame, Sparkles, Trophy, Plus, RefreshCw, MessageSquare } from 'lucide-react';
import { PostCard } from './PostCard';
import { useApp } from '../../context/AppContext';

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'advice', label: 'Советы' },
  { id: 'texting', label: 'Переписка' },
  { id: 'approaching', label: 'Знакомства' },
  { id: 'first-dates', label: 'Первое свидание' },
  { id: 'profile-review', label: 'Разбор анкеты' },
  { id: 'mindset', label: 'Саморазвитие' },
  { id: 'success', label: 'Успех' },
];

export const ForumView: React.FC = () => {
  const { 
    posts, 
    isLoading, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery, 
    sortMode, 
    setSortMode, 
    setIsCreateModalOpen,
    refreshPosts,
    activeTab,
    user
  } = useApp();

  // Filter posts
  let filteredPosts = posts.filter((post) => {
    // Check saved tab
    if (activeTab === 'saved') {
      if (!user.savedPosts.includes(post.id)) return false;
    }

    // Check category
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }

    // Check search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      const matchTags = post.tags?.some((t) => t.toLowerCase().includes(q));
      const matchAuthor = post.author.toLowerCase().includes(q);
      return matchTitle || matchContent || matchTags || matchAuthor;
    }

    return true;
  });

  // Sort posts
  filteredPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortMode === 'new') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortMode === 'top') {
      return b.votes - a.votes;
    }
    // 'hot'
    const scoreA = a.votes + (a.commentCount || 0) * 2;
    const scoreB = b.votes + (b.commentCount || 0) * 2;
    return scoreB - scoreA;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills Bar */}
      {activeTab !== 'saved' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Sorting & Filter status */}
      <div className="flex items-center justify-between gap-2 pt-1 pb-1">
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setSortMode('hot')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
              sortMode === 'hot'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Популярное</span>
          </button>
          <button
            onClick={() => setSortMode('new')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
              sortMode === 'new'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Новое</span>
          </button>
          <button
            onClick={() => setSortMode('top')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
              sortMode === 'top'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span>Лучшее</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-600 hover:underline"
            >
              Сбросить поиск
            </button>
          )}

          <button
            onClick={() => refreshPosts()}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
            title="Обновить ленту"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Post List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse space-y-3">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-5 bg-slate-100 rounded w-3/4" />
              <div className="h-12 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-slate-800 text-base">
            {activeTab === 'saved' ? 'В закладках пока пусто' : 'Обсуждений не найдено'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {activeTab === 'saved'
              ? 'Нажмите на иконку закладки у любого поста, чтобы сохранить его.'
              : 'Поделитесь опытом, задайте вопрос или попросите совет.'}
          </p>
          {activeTab !== 'saved' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Создать тему</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};
