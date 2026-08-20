import React, { useState } from 'react';
import { CheckCircle, Circle, Sparkles, RefreshCw, Flame, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckItem {
  id: string;
  category: 'grooming' | 'outfit' | 'logistics' | 'mindset';
  text: string;
}

const CHECKLIST_ITEMS: CheckItem[] = [
  { id: 'g1', category: 'grooming', text: 'Свежая стрижка, уложенные волосы' },
  { id: 'g2', category: 'grooming', text: 'Аккуратно подстриженная борода или чистое бритье' },
  { id: 'g3', category: 'grooming', text: 'Легкий парфюм (1–2 распыления, не удушающий)' },
  { id: 'g4', category: 'grooming', text: 'Чистые ногти, почищенные зубы, мятные леденцы в кармане' },
  
  { id: 'o1', category: 'outfit', text: 'Одежда чистая, выглаженная и сидит по фигуре' },
  { id: 'o2', category: 'outfit', text: 'Чистая опрятная обувь' },
  { id: 'o3', category: 'outfit', text: 'Минималистичные часы или аккуратный аксессуар' },

  { id: 'l1', category: 'logistics', text: 'Проверен график работы заведения и маршрут' },
  { id: 'l2', category: 'logistics', text: 'Телефон заряжен минимум на 50%, оплата готова' },
  { id: 'l3', category: 'logistics', text: 'Запасной вариант места в 2–3 минутах пешком, если основное занято' },

  { id: 'm1', category: 'mindset', text: 'Напоминание: мы встречаемся как равные люди проверить коннект, а не сдавать экзамен' },
  { id: 'm2', category: 'mindset', text: 'Готовность слушать с искренним любопытством' },
  { id: 'm3', category: 'mindset', text: 'Тело расслаблено: опущенные плечи, спокойное дыхание, открытый взгляд' },
];

const PEP_TALKS = [
  "Ты отлично выглядишь, подготовился и идешь с позитивным настроем. Получай удовольствие от общения!",
  "Она согласилась на встречу, потому что ей уже интересен ты. Расслабься, слушай и будь собой.",
  "Тебе не нужно никого изображать или играть роль. Спокойная уверенность и искренность привлекают сильнее всего.",
  "Относись к этому как к встрече с интересным человеком. Ноль давления, только классная атмосфера.",
];

export const PreDateChecklist: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [currentPepTalk, setCurrentPepTalk] = useState<string>(PEP_TALKS[0]);

  const toggleItem = (id: string) => {
    let updated: string[];
    if (checkedIds.includes(id)) {
      updated = checkedIds.filter((item) => item !== id);
    } else {
      updated = [...checkedIds, id];
      if (updated.length === CHECKLIST_ITEMS.length) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
    setCheckedIds(updated);
  };

  const progress = Math.round((checkedIds.length / CHECKLIST_ITEMS.length) * 100);

  const getRandomPepTalk = () => {
    const next = PEP_TALKS[Math.floor(Math.random() * PEP_TALKS.length)];
    setCurrentPepTalk(next);
  };

  const categories = [
    { id: 'grooming', label: 'Уход и гигиена' },
    { id: 'outfit', label: 'Одежда и стиль' },
    { id: 'logistics', label: 'Оргвопросы и детали' },
    { id: 'mindset', label: 'Настрой и спокойствие' },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Готовность к встрече</h3>
            <p className="text-xs text-slate-500">
              Выполнено {checkedIds.length} из {CHECKLIST_ITEMS.length} ({progress}%)
            </p>
          </div>
          {progress === 100 && (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 100% готов!
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-sky-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Confidence Booster / Pep Talk */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50/50 border border-sky-100 rounded-xl p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Настрой перед выходом</span>
          </div>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            «{currentPepTalk}»
          </p>
        </div>
        <button
          onClick={getRandomPepTalk}
          className="p-1.5 rounded-lg border border-sky-200 hover:bg-white text-sky-700 transition shrink-0"
          title="Другая мысль"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Checklist Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const items = CHECKLIST_ITEMS.filter((i) => i.category === cat.id);
          return (
            <div key={cat.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {cat.label}
              </h4>
              <div className="space-y-2">
                {items.map((item) => {
                  const isChecked = checkedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer border transition ${
                        isChecked
                          ? 'bg-sky-50/50 border-sky-200 text-slate-900'
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/60'
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 text-sky-600">
                        {isChecked ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                      <span className={`text-xs leading-relaxed ${isChecked ? 'font-medium' : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Conversation Rescuers */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 space-y-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>3 запасных вопроса, если разговор зашел в тупик</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-slate-700">
            «Какое занятие или хобби ты давно хотела попробовать, но откладывала?»
          </div>
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-slate-700">
            «Если бы можно было есть только одно блюдо всю жизнь, что бы ты выбрала?»
          </div>
          <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-slate-700">
            «Какой самый спонтанный поступок ты совершала за последний год?»
          </div>
        </div>
      </div>
    </div>
  );
};
