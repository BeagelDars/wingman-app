import React from 'react';
import { ChevronUp, ChevronDown, MessageSquare, Bookmark, Pin } from 'lucide-react';
import type { Post } from '../../types';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
}

const CATEGORY_LABELS: Record<string, { name: string; color: string }> = {
  advice: { name: 'Советы', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  texting: { name: 'Переписка', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  approaching: { name: 'Знакомства', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  'first-dates': { name: 'Первое свидание', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'profile-review': { name: 'Разбор анкеты', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  mindset: { name: 'Саморазвитие', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  success: { name: 'История успеха', color: 'bg-teal-50 text-teal-700 border-teal-200' },
};

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
}

function formatCommentsCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return `${count} ответов`;
  if (mod10 === 1) return `${count} ответ`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} ответа`;
  return `${count} ответов`;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { votePost, toggleSavePost, setSelectedPost, user } = useApp();

  const isUpvoted = user.upvotedPosts.includes(post.id);
  const isDownvoted = user.downvotedPosts.includes(post.id);
  const isSaved = user.savedPosts.includes(post.id);

  const categoryInfo = CATEGORY_LABELS[post.category] || {
    name: post.category,
    color: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-slate-300 hover:shadow-sm transition flex gap-3 sm:gap-4">
      {/* Vote Controls */}
      <div className="flex flex-col items-center justify-start bg-slate-50/80 border border-slate-100 rounded-lg p-1 min-w-[36px] h-fit">
        <button
          onClick={(e) => {
            e.stopPropagation();
            votePost(post.id, 'up');
          }}
          className={`p-1 rounded hover:bg-slate-200/60 transition ${
            isUpvoted ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-700'
          }`}
          aria-label="Поддержать"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className={`text-xs font-semibold my-0.5 ${
          isUpvoted ? 'text-sky-600' : isDownvoted ? 'text-rose-600' : 'text-slate-700'
        }`}>
          {post.votes}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            votePost(post.id, 'down');
          }}
          className={`p-1 rounded hover:bg-slate-200/60 transition ${
            isDownvoted ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
          }`}
          aria-label="Снизить"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Area */}
      <div 
        onClick={() => setSelectedPost(post)}
        className="flex-1 cursor-pointer min-w-0"
      >
        {/* Meta Bar */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 mb-1.5">
          {post.isPinned && (
            <span className="flex items-center gap-1 text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
              <Pin className="w-3 h-3" /> Закреплено
            </span>
          )}
          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${categoryInfo.color}`}>
            {categoryInfo.name}
          </span>
          <span className="font-medium text-slate-700">{post.author}</span>
          <span>•</span>
          <span>{formatTimeAgo(post.createdAt)}</span>
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-1.5 hover:text-sky-600 transition line-clamp-2">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {post.content.replace(/[#*`>]/g, '')}
        </p>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-600 hover:text-slate-900 transition">
              <MessageSquare className="w-3.5 h-3.5" />
              {formatCommentsCount(post.commentCount || 0)}
            </span>

            {post.tags && post.tags.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                {post.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSavePost(post.id);
            }}
            className={`p-1.5 rounded-lg border transition flex items-center gap-1 ${
              isSaved 
                ? 'bg-amber-50 border-amber-200 text-amber-700' 
                : 'border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-700'
            }`}
            title={isSaved ? 'Удалить из закладок' : 'Сохранить'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};
