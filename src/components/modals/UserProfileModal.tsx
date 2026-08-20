import React, { useState } from 'react';
import { X, User, Check, Bookmark, ThumbsUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { user, updateUserName } = useApp();
  const [nameInput, setNameInput] = useState(user.name);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-base font-semibold text-slate-900">Профиль</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
              <User className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Имя на форуме</span>
              <h3 className="font-semibold text-slate-900 text-sm">{user.name}</h3>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Сменить никнейм
            </label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="например: Алекс_Спорт, Марк99"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-sky-500 text-slate-900"
            />
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-0.5">
                <Bookmark className="w-3 h-3 text-amber-500" />
                <span>В закладках</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{user.savedPosts.length}</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-0.5">
                <ThumbsUp className="w-3 h-3 text-sky-500" />
                <span>Оценок</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{user.upvotedPosts.length}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{isSaved ? 'Сохранено' : 'Сохранить'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
