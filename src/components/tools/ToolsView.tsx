import React, { useState } from 'react';
import { MessageSquare, MapPin, UserCheck, CheckSquare } from 'lucide-react';
import { OpenerGenerator } from './OpenerGenerator';
import { DateIdeaGenerator } from './DateIdeaGenerator';
import { ProfileBioBuilder } from './ProfileBioBuilder';
import { PreDateChecklist } from './PreDateChecklist';

type ToolId = 'openers' | 'dates' | 'bio' | 'checklist';

const TOOLS: { id: ToolId; label: string; icon: React.ReactNode }[] = [
  { id: 'openers', label: 'Первые фразы (Опенеры)', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'dates', label: 'Идеи для свиданий', icon: <MapPin className="w-4 h-4" /> },
  { id: 'bio', label: 'Конструктор анкеты', icon: <UserCheck className="w-4 h-4" /> },
  { id: 'checklist', label: 'Чек-лист перед свиданием', icon: <CheckSquare className="w-4 h-4" /> },
];

export const ToolsView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('openers');

  return (
    <div className="space-y-6">
      {/* Subnav Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              activeTool === tool.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {tool.icon}
            <span>{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tool Body */}
      {activeTool === 'openers' && <OpenerGenerator />}
      {activeTool === 'dates' && <DateIdeaGenerator />}
      {activeTool === 'bio' && <ProfileBioBuilder />}
      {activeTool === 'checklist' && <PreDateChecklist />}
    </div>
  );
};
