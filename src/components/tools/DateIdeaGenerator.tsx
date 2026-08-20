import React, { useState } from 'react';
import { Sparkles, Lightbulb, MessageCircle } from 'lucide-react';
import { SEED_DATE_IDEAS } from '../../data/seedData';

const VIBES = [
  { id: 'all', label: 'Любая атмосфера' },
  { id: 'casual', label: 'Прогулка и кофе' },
  { id: 'active', label: 'Активное и игры' },
  { id: 'creative', label: 'Творческое' },
  { id: 'drinks', label: 'Вечерний бар' },
];

const TIME_LABELS: Record<string, string> = {
  day: 'день',
  evening: 'вечер',
  anytime: 'в любое время',
};

const VIBE_LABELS: Record<string, string> = {
  casual: 'Прогулка',
  active: 'Активность',
  creative: 'Творчество',
  drinks: 'Бар',
};

export const DateIdeaGenerator: React.FC = () => {
  const [selectedVibe, setSelectedVibe] = useState<string>('all');
  const [selectedBudget, setSelectedBudget] = useState<string>('all');

  const filteredIdeas = SEED_DATE_IDEAS.filter((idea) => {
    if (selectedVibe !== 'all' && idea.vibe !== selectedVibe) return false;
    if (selectedBudget !== 'all' && idea.budget !== selectedBudget) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        {/* Vibe */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {VIBES.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVibe(v.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedVibe === v.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <div className="flex gap-1.5">
            {['all', '$', '$$', '$$$'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBudget(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedBudget === b
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {b === 'all' ? 'Любой бюджет' : b.replace(/\$/g, '₽')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Cards */}
      <div className="space-y-4">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {VIBE_LABELS[idea.vibe] || idea.vibe}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    {idea.budget.replace(/\$/g, '₽')}
                  </span>
                  <span className="text-xs text-slate-400">• {TIME_LABELS[idea.timeOfDay] || idea.timeOfDay}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {idea.title}
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-700 leading-relaxed">
              {idea.description}
            </p>

            {/* Pro Tip & Why it Works */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Почему работает
                </span>
                <p className="text-slate-600 leading-relaxed">{idea.whyItWorks}</p>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 space-y-1">
                <span className="font-semibold text-emerald-900 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Совет от Вингмана
                </span>
                <p className="text-slate-600 leading-relaxed">{idea.proTip}</p>
              </div>
            </div>

            {/* Conversation Prompts */}
            {idea.conversationStarters && (
              <div className="border-t border-slate-100 pt-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Темы для разговора
                </span>
                <ul className="space-y-1.5">
                  {idea.conversationStarters.map((q, idx) => (
                    <li key={idx} className="text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                      «{q}»
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
