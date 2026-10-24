import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  PhoneCall, 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  Scale, 
  Building2, 
  ShoppingBag, 
  Briefcase, 
  ShieldAlert, 
  TrendingUp,
  MapPin
} from 'lucide-react';
import { api } from '../api/client';
import { LegalAidResource } from '../types';

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<LegalAidResource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Resources' },
    { id: 'LEGAL_AID', label: 'Free Legal Aid' },
    { id: 'CONSUMER_DISPUTE', label: 'Consumer Disputes' },
    { id: 'LABOUR', label: 'Labour & Employment' },
    { id: 'CYBERCRIME', label: 'Cybercrime & Fraud' },
    { id: 'SMALL_BUSINESS', label: 'Small Business & MSME' },
  ];

  useEffect(() => {
    setLoading(true);
    api.getResources(selectedCategory === 'ALL' ? undefined : selectedCategory)
      .then(res => setResources(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const filteredResources = resources.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.helpline_phone && r.helpline_phone.includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-[#E1E6E2]">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
          <LifeBuoy className="w-8 h-8 text-[#203D35]" />
          Verified Indian Legal Resources & Helplines
        </h1>
        <p className="text-sm text-[#64716B] max-w-2xl">
          Directory of official, maintained government dispute resolution portals, statutory helplines, and free legal aid authorities across India.
        </p>
      </div>

      {/* Emergency Helpline Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-subtle bg-[#FFFFFF] p-4 border border-[#E1E6E2] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#64716B]">Free Legal Aid (NALSA)</span>
            <p className="font-heading font-bold text-xl text-[#203D35]">15100</p>
          </div>
          <a
            href="tel:15100"
            className="p-2.5 rounded-xl bg-[#203D35] text-white hover:bg-[#294B40] transition-colors"
            title="Call NALSA"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        </div>

        <div className="card-subtle bg-[#FFFFFF] p-4 border border-[#E1E6E2] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#64716B]">Consumer Helpline (NCH)</span>
            <p className="font-heading font-bold text-xl text-[#203D35]">1915</p>
          </div>
          <a
            href="tel:1915"
            className="p-2.5 rounded-xl bg-[#203D35] text-white hover:bg-[#294B40] transition-colors"
            title="Call Consumer Helpline"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        </div>

        <div className="card-subtle bg-[#FFFFFF] p-4 border border-[#E1E6E2] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#64716B]">Cyber Crime Reporting</span>
            <p className="font-heading font-bold text-xl text-[#203D35]">1930</p>
          </div>
          <a
            href="tel:1930"
            className="p-2.5 rounded-xl bg-[#203D35] text-white hover:bg-[#294B40] transition-colors"
            title="Call Cyber Crime"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64716B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by portal name, category, or helpline number..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFFFFF] rounded-xl border border-[#E1E6E2] text-xs text-[#24352F] focus:outline-[#203D35]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-[#203D35] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#64716B] hover:text-[#203D35] hover:bg-[#F3F5F3] border border-[#E1E6E2]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#64716B] animate-pulse">
          Loading verified resources...
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="card-subtle p-12 text-center bg-[#FFFFFF]">
          <LifeBuoy className="w-12 h-12 text-[#203D35]/30 mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-lg text-[#203D35]">No Resources Found</h3>
          <p className="text-xs text-[#64716B] mt-1">Try another search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map((res) => (
            <div key={res.id} className="card-subtle bg-[#FFFFFF] p-6 space-y-4 border border-[#E1E6E2] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEBE5] text-[#203D35]">
                    {res.category.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#237A52] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Portal
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#203D35] leading-snug">
                  {res.name}
                </h3>
                <p className="text-xs text-[#64716B] leading-relaxed">
                  {res.description}
                </p>
                {res.address && (
                  <p className="text-[11px] text-[#64716B] flex items-center gap-1 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#203D35] shrink-0" />
                    <span>{res.address}</span>
                  </p>
                )}
              </div>

              <div className="pt-4 mt-2 border-t border-[#E1E6E2] flex flex-wrap items-center justify-between gap-3 text-xs">
                {res.helpline_phone && (
                  <a
                    href={`tel:${res.helpline_phone.split('/')[0].trim()}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#203D35] hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{res.helpline_phone}</span>
                  </a>
                )}
                {res.official_url && (
                  <a
                    href={res.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#203D35] text-white hover:bg-[#294B40] font-semibold transition-colors ml-auto"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
