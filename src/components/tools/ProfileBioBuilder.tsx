import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Archetype {
  id: string;
  name: string;
  desc: string;
  prompts: { prompt: string; answer: string; app: string }[];
  bio: string;
}

const ARCHETYPES: Archetype[] = [
  {
    id: 'outdoors',
    name: 'Активный и спорт',
    desc: 'Для тех, кто любит спорт, походы, путешествия, скалодромы и активные выходные',
    bio: 'Ищу компанию на утренний кофе перед тренировкой и вечернюю пиццу. Люблю горы, пробовать новые виды спорта и находить самые вкусные пекарни в городе.',
    prompts: [
      {
        app: 'Анкета',
        prompt: 'Мои простые радости:',
        answer: 'Свежий горный воздух в 7 утра, чистый трек на пробежке и пицца после долгой тренировки, которая кажется в 10 раз вкуснее.',
      },
      {
        app: 'Анкета',
        prompt: 'Вместе мы могли бы:',
        answer: 'Сорваться в спонтанную поездку на выходные, поспорить о лучшем завтраке и изучить все смотровые площадки города.',
      },
      {
        app: 'Анкета',
        prompt: 'Ключ к моему сердцу:',
        answer: 'Вручить мне стаканчик холодного фильтр-кофе и сказать, что мы выезжаем за город.',
      },
    ],
  },
  {
    id: 'creative',
    name: 'Творческий и эстет',
    desc: 'Для тех, кто увлечен музыкой, дизайном, винилом, кино и вкусной едой',
    bio: 'Заряжаюсь хорошим эспрессо, музыкой на виниле и поиском аутентичных мест с пастой. Всегда открыт к рекомендациям классных концертов и выставок.',
    prompts: [
      {
        app: 'Анкета',
        prompt: 'Моя цель на ближайшее время:',
        answer: 'Обустроить уютный уголок для прослушивания пластинок, научиться варить идеальный флэт уайт и завести собаку.',
      },
      {
        app: 'Анкета',
        prompt: 'Две правды и одна ложь:',
        answer: 'Играл в гаражной инди-группе 2 года / Испек 40+ буханок тартин-хлеба с нуля / Ни разу в жизни не смотрел Гарри Поттера.',
      },
      {
        app: 'Анкета',
        prompt: 'Лучшая история из поездки:',
        answer: 'Случайно забрел на местный семейный праздник в Португалии и в итоге учился танцевать с местными жителями до 2 ночи.',
      },
    ],
  },
  {
    id: 'witty',
    name: 'С юмором и легкий',
    desc: 'Для тех, кто ценит добрую самоиронию, настолки, комедию и уютные вечера',
    bio: 'Ветеран гонок в Mario Kart и ценитель десертов. Ищу человека, готового разделить страсть к поиску самого хрустящего круассана.',
    prompts: [
      {
        app: 'Анкета',
        prompt: 'Буду подшучивать над тобой, если:',
        answer: 'Ты утверждаешь, что ананасам место на пицце, или пытаешься ориентироваться в городе без навигатора.',
      },
      {
        app: 'Анкета',
        prompt: 'Идеальное воскресенье:',
        answer: 'Неспешный кофе под любимый подкаст, прогулка по маркету и приготовление сложного ужина под хорошую музыку.',
      },
      {
        app: 'Анкета',
        prompt: 'Ищу человека, который:',
        answer: 'Одинаково комфортно чувствует себя и на классной вечеринке, и дома за просмотром детективного сериала в теплом худи.',
      },
    ],
  },
  {
    id: 'ambitious',
    name: 'Целеустремленный и спокойный',
    desc: 'Для тех, кто сфокусирован на развитии, карьере, тренировках и балансе',
    bio: 'Люблю создавать интересные проекты и жить осознанно. Баланс — это спорт утром, фокусная работа днем и приятные разговоры за ужином вечером.',
    prompts: [
      {
        app: 'Анкета',
        prompt: 'Главное, что обо мне стоит знать:',
        answer: 'Серьезно отношусь к своим целям, но никогда не отношусь со звериной серьезностью к себе. Умение посмеяться над собой обязательно.',
      },
      {
        app: 'Анкета',
        prompt: 'Мой иррациональный страх:',
        answer: 'Заказать в ресторане не то блюдо и весь вечер завидовать чужой тарелке.',
      },
      {
        app: 'Анкета',
        prompt: 'Давай сразу договоримся о том, что:',
        answer: 'Живая встреча за кофе в разы лучше двухнедельной переписки в чате.',
      },
    ],
  },
];

export const ProfileBioBuilder: React.FC = () => {
  const [selectedArchId, setSelectedArchId] = useState<string>('outdoors');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedArch = ARCHETYPES.find((a) => a.id === selectedArchId) || ARCHETYPES[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Archetype Selector */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              onClick={() => setSelectedArchId(arch.id)}
              className={`p-3 rounded-xl text-left border transition ${
                selectedArchId === arch.id
                  ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-400'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="text-xs font-semibold text-slate-900 mb-0.5">{arch.name}</div>
              <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{arch.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generated Bio & Prompts */}
      <div className="space-y-4">
        {/* Short Bio */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wide">
              Краткое описание анкеты
            </span>
            <button
              onClick={() => handleCopy(selectedArch.bio, 'bio')}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-50 transition"
            >
              {copiedKey === 'bio' ? (
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

          <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
            {selectedArch.bio}
          </p>
        </div>

        {/* Prompt Combinations */}
        <div className="space-y-3">
          {selectedArch.prompts.map((p, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-700">{p.prompt}</span>
                <button
                  onClick={() => handleCopy(`${p.prompt}\n${p.answer}`, `prompt-${idx}`)}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 px-2 py-0.5 rounded-lg hover:bg-slate-50 transition"
                >
                  {copiedKey === `prompt-${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey === `prompt-${idx}` ? 'Скопировано' : 'Копировать'}</span>
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {p.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
