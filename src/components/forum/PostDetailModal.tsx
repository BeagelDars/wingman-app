import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  MessageSquare, 
  Bookmark, 
  Send, 
  CornerDownRight, 
  Share2, 
  Check 
} from 'lucide-react';
import type { Post, Comment } from '../../types';
import { useApp } from '../../context/AppContext';

interface PostDetailModalProps {
  post: Post;
  onClose: () => void;
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

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const { 
    votePost, 
    toggleSavePost, 
    user, 
    getCommentsForPost, 
    addCommentToPost, 
    voteComment 
  } = useApp();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const isUpvoted = user.upvotedPosts.includes(post.id);
  const isDownvoted = user.downvotedPosts.includes(post.id);
  const isSaved = user.savedPosts.includes(post.id);

  const categoryInfo = CATEGORY_LABELS[post.category] || {
    name: post.category,
    color: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  useEffect(() => {
    let mounted = true;
    setIsLoadingComments(true);
    getCommentsForPost(post.id).then((data) => {
      if (mounted) {
        setComments(data);
        setIsLoadingComments(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [post.id]);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await addCommentToPost(post.id, newCommentText.trim());
      setComments((prev) => [...prev, created]);
      setNewCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateReply = async (parentId: string) => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const created = await addCommentToPost(post.id, replyText.trim(), parentId);
      setComments((prev) => [...prev, created]);
      setReplyText('');
      setReplyingToId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const topLevelComments = comments.filter((c) => !c.parentId);
  const getReplies = (commentId: string) => comments.filter((c) => c.parentId === commentId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded text-xs font-medium border ${categoryInfo.color}`}>
              {categoryInfo.name}
            </span>
            <span className="text-xs font-medium text-slate-700">{post.author}</span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400">{formatTimeAgo(post.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition text-xs flex items-center gap-1"
              title="Скопировать ссылку"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Скопировано' : 'Поделиться'}</span>
            </button>

            <button
              onClick={() => toggleSavePost(post.id)}
              className={`p-1.5 rounded-lg border transition ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-700'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-500'
              }`}
              title={isSaved ? 'Удалить из закладок' : 'Сохранить'}
            >
              <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-6 flex-1">
          {/* Post Header & Body */}
          <div className="flex gap-4">
            {/* Votes */}
            <div className="flex flex-col items-center justify-start bg-slate-50 border border-slate-200 rounded-lg p-1 min-w-[36px] h-fit">
              <button
                onClick={() => votePost(post.id, 'up')}
                className={`p-1 rounded hover:bg-slate-200/60 transition ${
                  isUpvoted ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className={`text-xs font-semibold my-0.5 ${
                isUpvoted ? 'text-sky-600' : isDownvoted ? 'text-rose-600' : 'text-slate-700'
              }`}>
                {post.votes}
              </span>
              <button
                onClick={() => votePost(post.id, 'down')}
                className={`p-1 rounded hover:bg-slate-200/60 transition ${
                  isDownvoted ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Post Title & Text */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug">
                {post.title}
              </h1>

              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap space-y-3">
                {post.content}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Ответы ({comments.length})
            </h3>

            {/* Add Comment Input */}
            <form onSubmit={handleCreateComment} className="mb-6">
              <div className="relative">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Напишите совет или свое мнение..."
                  rows={3}
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition text-slate-800 placeholder-slate-400 resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-400">От имени: {user.name}</span>
                  <button
                    type="submit"
                    disabled={!newCommentText.trim() || isSubmitting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg shadow-sm transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Ответить</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            {isLoadingComments ? (
              <div className="py-6 text-center text-xs text-slate-400">Загрузка ответов...</div>
            ) : topLevelComments.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                Пока нет ответов. Будьте первым, кто поделится мыслями!
              </div>
            ) : (
              <div className="space-y-4">
                {topLevelComments.map((comment) => {
                  const replies = getReplies(comment.id);
                  const isCommentUpvoted = user.upvotedComments.includes(comment.id);

                  return (
                    <div key={comment.id} className="bg-slate-50/60 rounded-xl p-3.5 border border-slate-100 space-y-2">
                      {/* Comment Header */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{comment.author}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(comment.createdAt)}</span>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {comment.content}
                      </p>

                      {/* Comment Actions */}
                      <div className="flex items-center gap-3 pt-1 text-xs">
                        <button
                          onClick={() => voteComment(comment.id, 'up')}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded border transition ${
                            isCommentUpvoted 
                              ? 'bg-sky-50 border-sky-200 text-sky-700 font-semibold' 
                              : 'border-slate-200 hover:bg-slate-200/50 text-slate-500'
                          }`}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>{comment.votes}</span>
                        </button>

                        <button
                          onClick={() => {
                            setReplyingToId(replyingToId === comment.id ? null : comment.id);
                            setReplyText('');
                          }}
                          className="text-slate-500 hover:text-slate-800 font-medium transition"
                        >
                          Ответить
                        </button>
                      </div>

                      {/* Reply Box */}
                      {replyingToId === comment.id && (
                        <div className="mt-2 pl-3 border-l-2 border-sky-300 pt-2 space-y-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Ответ пользователю ${comment.author}...`}
                            rows={2}
                            className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 resize-none"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setReplyingToId(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                            >
                              Отмена
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCreateReply(comment.id)}
                              disabled={!replyText.trim() || isSubmitting}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-medium rounded-md"
                            >
                              Отправить
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Nested Replies */}
                      {replies.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-slate-200 space-y-2.5">
                          {replies.map((reply) => {
                            const isReplyUpvoted = user.upvotedComments.includes(reply.id);
                            return (
                              <div key={reply.id} className="bg-white rounded-lg p-2.5 border border-slate-100 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <CornerDownRight className="w-3 h-3 text-slate-400" />
                                  <span className="font-semibold text-slate-800">{reply.author}</span>
                                  <span>•</span>
                                  <span>{formatTimeAgo(reply.createdAt)}</span>
                                </div>
                                <p className="text-xs text-slate-700 whitespace-pre-wrap pl-4 leading-relaxed">
                                  {reply.content}
                                </p>
                                <div className="pl-4 pt-1">
                                  <button
                                    onClick={() => voteComment(reply.id, 'up')}
                                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[11px] transition ${
                                      isReplyUpvoted 
                                        ? 'bg-sky-50 border-sky-200 text-sky-700 font-semibold' 
                                        : 'border-slate-200 hover:bg-slate-100 text-slate-500'
                                    }`}
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                    <span>{reply.votes}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
