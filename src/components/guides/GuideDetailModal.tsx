import React from 'react';
import { X, Clock, CheckCircle2 } from 'lucide-react';
import type { Guide } from '../../types';

interface GuideDetailModalProps {
  guide: Guide;
  onClose: () => void;
}

export const GuideDetailModal: React.FC<GuideDetailModalProps> = ({ guide, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-0.5 rounded font-medium">
              {guide.category}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {guide.readTime}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 space-y-6 flex-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
              {guide.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {guide.summary}
            </p>
          </div>

          {/* Key Takeaways Box */}
          {guide.keyTakeaways && guide.keyTakeaways.length > 0 && (
            <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-semibold text-sky-900 uppercase tracking-wider">
                Главные выводы
              </h4>
              <ul className="space-y-1.5">
                {guide.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 leading-normal">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Body */}
          <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap space-y-4 prose-headings:font-bold prose-headings:text-slate-900">
            {guide.content}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
