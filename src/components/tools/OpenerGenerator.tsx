import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { SEED_OPENERS } from '../../data/seedData';

const CONTEXTS = [
  { id: 'hinge_prompt', label: 'Анкета в приложении' },
  { id: 'tinder_bio', label: 'Фото / Питомец / Поездка' },
  { id: 'cafe_approach', label: 'Кафе / Книжный' },
  { id: 'gym_hobby', label: 'Спорт / Зал / Хобби' },
  { id: 'instagram_story', label: 'Ответ на сторис' },
];

const TONES = [
  { id: 'playful', label: 'С юмором' },
  { id: 'witty', label: 'Остроумный' },
  { id: 'casual', label: 'Непринужденный' },
  { id: 'thoughtful', label: 'Вдумчивый' },
];

const CUSTOM_TEMPLATES: Record<string, { opener: string; why: string; followUp: string }[]> = {
  hinge_prompt: [
    {
      opener: 'Твое фото из путешествия подняло планку на максимум. Какое место из увиденных ты бы повторила прямо завтра?',
      why: 'Фокусируется на приятных воспоминаниях и страсти вместо сухих шаблонных фраз.',
      followUp: 'Какое самое необычное блюдо ты там попробовала?',
    },
    {
      opener: 'Интересно узнать предысторию второго пункта в анкете — это эпичная история или спонтанный хаос?',
      why: 'Создает легкую интригу и дает возможность рассказать интересную историю.',
      followUp: 'Повторила бы такой опыт снова?',
    },
  ],
  tinder_bio: [
    {
      opener: 'Твой пес на четвертой фотке выглядит так, будто он главный в доме. Как его зовут?',
      why: 'Искренний интерес к питомцу дает максимальный процент теплых ответов.',
      followUp: 'Он дружелюбный к гостям или строгий охранник?',
    },
    {
      opener: 'Вид на фотке из похода просто космический! В каких горах это было?',
      why: 'Подчеркивает ее активную сторону и предлагает поделиться любимым местом.',
      followUp: 'Больше любишь сложные горные подъемы или спокойные прогулки у воды?',
    },
  ],
  cafe_approach: [
    {
      opener: 'Извини, твой десерт выглядит потрясающе — как он называется? Выбираю, что заказать.',
      why: 'Ноль давления, естественно привязано к обстановке и легко для ответа.',
      followUp: 'Ты здесь работаешь над чем-то интересным или просто отдыхаешь?',
    },
    {
      opener: 'Привет! Не удержался спросить: как тебе эта книга? Давно присматриваюсь к автору.',
      why: 'Показывает интерес к ее вкусу без навязчивости.',
      followUp: 'Что еще посоветуешь из похожего жанра?',
    },
  ],
  gym_hobby: [
    {
      opener: 'Привет! У тебя отличная техника на этом упражнении. Давно тренируешься?',
      why: 'Комплимент дисциплине и результату вместо банальных оценок внешности.',
      followUp: 'Готовишься к соревнованиям или занимаешься для души?',
    },
  ],
  instagram_story: [
    {
      opener: 'Выглядит очень атмосферно! Это у нас в городе или в поездке?',
      why: 'Простая реакция на историю, не требующая долгих раздумий.',
      followUp: 'Стоит сходить туда на выходных?',
    },
  ],
};

export const OpenerGenerator: React.FC = () => {
  const [selectedContext, setSelectedContext] = useState<string>('hinge_prompt');
  const [selectedTone, setSelectedTone] = useState<string>('playful');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const matchedOpeners = SEED_OPENERS.filter(
    (o) => o.context === selectedContext && o.tone === selectedTone
  );

  const fallbackList = CUSTOM_TEMPLATES[selectedContext] || CUSTOM_TEMPLATES.hinge_prompt;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        {/* Context */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {CONTEXTS.map((ctx) => (
              <button
                key={ctx.id}
                onClick={() => setSelectedContext(ctx.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedContext === ctx.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {ctx.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tone */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTone(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  selectedTone === t.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {matchedOpeners.length > 0 ? (
          matchedOpeners.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-900 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1">
                  «{item.opener}»
                </p>
                <button
                  onClick={() => handleCopy(item.opener, item.id)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 shrink-0 transition"
                  title="Скопировать"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5">
                  <span className="font-semibold text-emerald-900 block mb-0.5">Почему работает:</span>
                  <span className="text-slate-600">{item.whyItWorks}</span>
                </div>
                <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-2.5">
                  <span className="font-semibold text-sky-900 block mb-0.5">Вопрос дальше:</span>
                  <span className="text-slate-600">«{item.goodFollowUp}»</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          fallbackList.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-900 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 flex-1">
                  «{item.opener}»
                </p>
                <button
                  onClick={() => handleCopy(item.opener, 'fb-' + idx)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs flex items-center gap-1 shrink-0 transition"
                >
                  {copiedId === 'fb-' + idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5">
                  <span className="font-semibold text-emerald-900 block mb-0.5">Почему работает:</span>
                  <span className="text-slate-600">{item.why}</span>
                </div>
                <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-2.5">
                  <span className="font-semibold text-sky-900 block mb-0.5">Вопрос дальше:</span>
                  <span className="text-slate-600">«{item.followUp}»</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
