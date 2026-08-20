import React, { useState } from 'react';
import { Clock, ArrowRight, Lightbulb } from 'lucide-react';
import { SEED_GUIDES } from '../../data/seedData';
import { useApp } from '../../context/AppContext';

const DAILY_TIPS = [
  'Слушайте, чтобы понять, а не чтобы выдать заготовленный ответ. Спрашивайте про эмоции и отношение к событиям.',
  'Одежда по размеру и фигуре в 10 раз важнее дорогих брендов. Простая качественная футболка сидит идеально.',
  'Завершайте отличное первое свидание примерно на 75-й минуте на позитивной ноте — это создает приятное предвкушение.',
  'Предлагайте встречу на пике интересного диалога, а не когда темы уже иссякли.',
  'Уверенность — это не «я ей точно понравлюсь», а «мне будет комфортно и хорошо при любом исходе».',
];

export const GuidesView: React.FC = () => {
  const { setSelectedGuide } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('Все');

  const categories = ['Все', 'Первые свидания', 'Онлайн-дейтинг', 'Знакомства', 'Переписка'];

  const filteredGuides = selectedFilter === 'Все'
    ? SEED_GUIDES
    : SEED_GUIDES.filter((g) => g.category.toLowerCase() === selectedFilter.toLowerCase());

  const todayTipIndex = new Date().getDate() % DAILY_TIPS.length;
  const todayTip = DAILY_TIPS[todayTipIndex];

  return (
    <div className="space-y-6">
      {/* Daily Tip Highlight */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
        <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-semibold text-sky-800 uppercase tracking-wide">
            Мысль дня
          </span>
          <p className="text-sm text-slate-800 font-medium leading-relaxed">
            «{todayTip}»
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedFilter === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-slate-200">
                  {guide.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {guide.readTime}
                </span>
              </div>

              <h3 className="font-semibold text-base text-slate-900 group-hover:text-sky-600 transition leading-snug">
                {guide.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {guide.summary}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-medium">
              <span>Читать гайд</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
