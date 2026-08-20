import React, { useState } from 'react';
import { X, Cloud, Check, Download, Database, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getSavedCloudConfig, SUPABASE_SQL_SCHEMA, getLocalPosts, getLocalComments } from '../../lib/supabase';

interface CloudSettingsModalProps {
  onClose: () => void;
}

export const CloudSettingsModal: React.FC<CloudSettingsModalProps> = ({ onClose }) => {
  const { isCloudConnected, connectCloud } = useApp();
  const currentConfig = getSavedCloudConfig();

  const [url, setUrl] = useState(currentConfig.supabaseUrl || '');
  const [anonKey, setAnonKey] = useState(currentConfig.supabaseAnonKey || '');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = connectCloud(url.trim(), anonKey.trim());
    if (ok) {
      setStatusMessage('Настройки облака сохранены.');
      setTimeout(() => {
        setStatusMessage(null);
        onClose();
      }, 1200);
    }
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleExportData = () => {
    const posts = getLocalPosts();
    const comments = getLocalComments();
    const dataStr = JSON.stringify({ posts, comments, exportedAt: new Date().toISOString() }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wingman-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-semibold text-slate-900">Облачная синхронизация</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Current Status */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
            isCloudConnected 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="font-semibold">
                {isCloudConnected ? 'Подключено к Supabase Realtime' : 'Локальный режим (без интернета)'}
              </span>
            </div>
            <span className="text-[11px] opacity-75">
              {isCloudConnected ? 'Синхронизация активна' : 'Автономно'}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Параметры подключения
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                URL проекта
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Публичный ключ (Anon Key)
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="sb_publishable_... или eyJhbGciOi..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-sky-500 text-slate-900 font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleCopySchema}
                className="flex items-center gap-1 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3 py-1.5 rounded-lg transition"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Database className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'SQL скопирован!' : 'Копировать SQL схему'}</span>
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium rounded-lg shadow-sm transition"
              >
                Сохранить
              </button>
            </div>
          </form>

          {statusMessage && (
            <div className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Backup & Export */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-slate-800">Резервная копия</h4>
              <p className="text-[11px] text-slate-500">Скачать все обсуждения и комментарии в формате JSON</p>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 text-xs text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Экспорт</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
