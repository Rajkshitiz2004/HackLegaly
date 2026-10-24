import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  MapPin, 
  ShieldCheck, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Activity, 
  Database,
  Cpu
} from 'lucide-react';
import { api } from '../api/client';
import { Jurisdiction } from '../types';

export const Settings: React.FC = () => {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [selectedJur, setSelectedJur] = useState('IN-CENTRAL');
  const [readingLevel, setReadingLevel] = useState('standard');
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    api.getJurisdictions()
      .then(res => setJurisdictions(res))
      .catch(() => {});

    checkHealth();
  }, []);

  const checkHealth = () => {
    setHealthLoading(true);
    api.getHealth()
      .then(res => setSystemHealth(res))
      .catch(() => {})
      .finally(() => setHealthLoading(false));
  };

  const handleSave = () => {
    localStorage.setItem('preferred_jurisdiction', selectedJur);
    localStorage.setItem('reading_level', readingLevel);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const clearLocalData = () => {
    localStorage.clear();
    sessionStorage.clear();
    alert('Local browser session and preferences cleared.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-[#E1E6E2]">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
          <SettingsIcon className="w-8 h-8 text-[#203D35]" />
          Settings & Preferences
        </h1>
        <p className="text-sm text-[#64716B]">
          Configure your default Indian jurisdiction, plain-language reading level, and audit system status.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="card-subtle bg-[#FFFFFF] p-6 space-y-6 border border-[#E1E6E2]">
        {/* Jurisdiction preference */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#203D35]">
            Default State / National Jurisdiction:
          </label>
          <p className="text-xs text-[#64716B]">
            Determines which state rent control acts, tenancy frameworks, and local legal aid resources are prioritized by default.
          </p>
          <select
            value={selectedJur}
            onChange={(e) => setSelectedJur(e.target.value)}
            className="w-full max-w-md p-2.5 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] text-xs font-semibold text-[#203D35]"
          >
            {jurisdictions.map((j) => (
              <option key={j.code} value={j.code}>
                {j.name} {j.level === 'COUNTRY' ? '(National Central)' : '(State)'}
              </option>
            ))}
          </select>
        </div>

        {/* Reading Level */}
        <div className="space-y-2 pt-4 border-t border-[#E1E6E2]">
          <label className="block text-sm font-semibold text-[#203D35]">
            Explanation Detail & Reading Level:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
            <label className={`p-3 rounded-xl border cursor-pointer text-xs ${
              readingLevel === 'standard' ? 'bg-[#DDEBE5]/40 border-[#203D35]' : 'bg-[#FFFFFF] border-[#E1E6E2]'
            }`}>
              <input
                type="radio"
                name="readingLevel"
                value="standard"
                checked={readingLevel === 'standard'}
                onChange={() => setReadingLevel('standard')}
                className="accent-[#203D35] mr-2"
              />
              <span className="font-semibold text-[#203D35]">Everyday Plain English</span>
              <p className="text-[11px] text-[#64716B] mt-1">Simple language, short sentences, and everyday examples.</p>
            </label>
            <label className={`p-3 rounded-xl border cursor-pointer text-xs ${
              readingLevel === 'statutory' ? 'bg-[#DDEBE5]/40 border-[#203D35]' : 'bg-[#FFFFFF] border-[#E1E6E2]'
            }`}>
              <input
                type="radio"
                name="readingLevel"
                value="statutory"
                checked={readingLevel === 'statutory'}
                onChange={() => setReadingLevel('statutory')}
                className="accent-[#203D35] mr-2"
              />
              <span className="font-semibold text-[#203D35]">In-Depth Statutory</span>
              <p className="text-[11px] text-[#64716B] mt-1">Includes statutory section numbers and legal provisions.</p>
            </label>
          </div>
        </div>

        {/* Local Retention */}
        <div className="space-y-2 pt-4 border-t border-[#E1E6E2]">
          <label className="block text-sm font-semibold text-[#203D35]">
            Client-Side Privacy & Storage:
          </label>
          <p className="text-xs text-[#64716B]">
            All document text and chat sessions are stored only in volatile memory during your session.
          </p>
          <button
            type="button"
            onClick={clearLocalData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#B42318] bg-[#B42318]/10 hover:bg-[#B42318]/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Browser Session Storage
          </button>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#203D35] text-white rounded-xl text-xs font-semibold hover:bg-[#294B40] transition-colors"
          >
            Save Preferences
          </button>
          {saveSuccess && (
            <span className="text-xs text-[#237A52] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved!
            </span>
          )}
        </div>
      </div>

      {/* Backend & Model Audit Status Card */}
      <div className="card-subtle bg-[#FFFFFF] p-6 space-y-4 border border-[#E1E6E2]">
        <div className="flex items-center justify-between pb-2 border-b border-[#E1E6E2]">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#203D35]" />
            <h3 className="font-heading font-semibold text-sm text-[#203D35]">
              System Operational & Model Status
            </h3>
          </div>
          <button
            type="button"
            onClick={checkHealth}
            disabled={healthLoading}
            className="text-xs text-[#203D35] hover:underline flex items-center gap-1 font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${healthLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>
        </div>

        {systemHealth && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] space-y-1">
              <span className="text-[10px] text-[#64716B] block">API Service:</span>
              <span className="font-bold text-[#237A52]">{systemHealth.status}</span>
            </div>
            <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] space-y-1">
              <span className="text-[10px] text-[#64716B] block">Relational Database:</span>
              <span className="font-bold text-[#203D35]">{systemHealth.database}</span>
            </div>
            <div className="p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] space-y-1">
              <span className="text-[10px] text-[#64716B] block">AI Provider Engine:</span>
              <span className="font-bold text-[#203D35]">{systemHealth.ai_provider}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
