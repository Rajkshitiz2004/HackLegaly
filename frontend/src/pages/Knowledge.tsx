import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Building2, 
  Briefcase, 
  ShoppingBag, 
  FileCheck, 
  ShieldAlert, 
  TrendingUp, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/client';
import { KnowledgeArticle } from '../types';

export const Knowledge: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'ALL', label: 'All Categories' },
    { id: 'Tenant Rights', label: 'Tenant Rights', icon: Building2 },
    { id: 'Workplace Rights', label: 'Workplace Rights', icon: Briefcase },
    { id: 'Consumer Protection', label: 'Consumer Protection', icon: ShoppingBag },
    { id: 'Contract Basics', label: 'Contract Basics', icon: FileCheck },
    { id: 'Digital Safety', label: 'Digital Safety', icon: ShieldAlert },
    { id: 'Small-Business Legal Awareness', label: 'Small Business', icon: TrendingUp },
  ];

  const fetchArticles = () => {
    setLoading(true);
    api.getLegalGuides(selectedCategory === 'ALL' ? undefined : selectedCategory, searchQuery)
      .then(res => setArticles(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-[#E1E6E2]">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-[#203D35]" />
          Legal Knowledge Centre
        </h1>
        <p className="text-sm text-[#64716B] max-w-2xl">
          Plain-language legal guides, statutory references, and practical checklists curated specifically for everyday citizens in India.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64716B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
            placeholder="Search guides (e.g. deposit, notice period, e-Daakhil)..."
            className="w-full pl-9 pr-4 py-2.5 bg-[#FFFFFF] rounded-xl border border-[#E1E6E2] text-xs text-[#24352F] focus:outline-[#203D35] shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#203D35] text-white shadow-xs'
                  : 'bg-[#FFFFFF] text-[#64716B] hover:text-[#203D35] hover:bg-[#F3F5F3] border border-[#E1E6E2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#64716B] animate-pulse">
          Loading curated statutory guides...
        </div>
      ) : articles.length === 0 ? (
        <div className="card-subtle p-12 text-center bg-[#FFFFFF]">
          <BookOpen className="w-12 h-12 text-[#203D35]/30 mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-lg text-[#203D35]">No Guides Found</h3>
          <p className="text-xs text-[#64716B] mt-1">Try another search term or switch categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/knowledge/${article.slug}`}
              className="card-subtle card-hover p-6 bg-[#FFFFFF] flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#DDEBE5] text-[#203D35]">
                    {article.category}
                  </span>
                  <span className="text-[10px] text-[#64716B]">Verified Source</span>
                </div>
                <h3 className="font-heading font-bold text-base text-[#203D35] group-hover:text-[#294B40] transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-[#64716B] line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E1E6E2] flex items-center justify-between text-xs font-semibold text-[#203D35]">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
