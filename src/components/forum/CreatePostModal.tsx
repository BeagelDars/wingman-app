import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import type { PostCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface CreatePostModalProps {
  onClose: () => void;
}

const CATEGORIES: { id: PostCategory; label: string }[] = [
  { id: 'advice', label: 'Советы' },
  { id: 'texting', label: 'Переписка' },
  { id: 'approaching', label: 'Знакомства' },
  { id: 'first-dates', label: 'Первое свидание' },
  { id: 'profile-review', label: 'Разбор анкеты' },
  { id: 'mindset', label: 'Саморазвитие' },
  { id: 'success', label: 'История успеха' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose }) => {
  const { addPost, user } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('advice');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      await addPost(title.trim(), content.trim(), category, tags);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-900">Новая тема</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category Selector */}
          <div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                    category === cat.id
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Заголовок или вопрос..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>

          {/* Content */}
          <div>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Подробности, предыстория, скриншоты или вопрос..."
              className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-900 placeholder-slate-400 resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Теги через запятую (например: Тиндер, Кофе, Зал)"
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-500 text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">Автор: <strong className="text-slate-600">{user.name}</strong></span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={!title.trim() || !content.trim() || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg shadow-sm transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Публикация...' : 'Опубликовать'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
