import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  CheckSquare, 
  Square, 
  Share2,
  Scale
} from 'lucide-react';
import { api } from '../api/client';
import { KnowledgeArticle } from '../types';

export const GuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<KnowledgeArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (slug) {
      setLoading(true);
      api.getLegalGuideBySlug(slug)
        .then(res => setArticle(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const toggleCheck = (item: string) => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-[#64716B] animate-pulse">
        Loading statutory legal guide...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-heading font-bold text-xl text-[#203D35]">Legal Guide Not Found</h2>
        <Link to="/knowledge" className="inline-flex items-center gap-2 text-xs font-semibold text-[#203D35] underline">
          <ArrowLeft className="w-4 h-4" /> Return to Knowledge Centre
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link & Category */}
      <div className="flex items-center justify-between">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64716B] hover:text-[#203D35]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Knowledge Centre
        </Link>
        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#DDEBE5] text-[#203D35]">
          {article.category}
        </span>
      </div>

      {/* Main Guide Content */}
      <article className="card-subtle bg-[#FFFFFF] p-8 space-y-6 border border-[#E1E6E2]">
        <div className="space-y-3 pb-6 border-b border-[#E1E6E2]">
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] leading-tight">
            {article.title}
          </h1>
          <p className="text-sm text-[#64716B] leading-relaxed">
            {article.summary}
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#64716B]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#237A52]" />
              Verified Statutory Guidance
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#203D35]" />
              Applicable: Republic of India
            </span>
          </div>
        </div>

        {/* Markdown Render Body */}
        <div className="text-sm text-[#24352F] space-y-5 leading-relaxed font-sans">
          {article.content_markdown.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('# ')) {
              return null; // Skip top title since rendered above
            }
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-heading font-bold text-lg text-[#203D35] pt-3">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- [ ] ')) {
              const itemText = paragraph.replace('- [ ] ', '');
              const isChecked = !!checklist[itemText];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(itemText)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    isChecked ? 'bg-[#DDEBE5]/40 border-[#237A52]/30' : 'bg-[#F7F6F0] border-[#E1E6E2]'
                  }`}
                >
                  <button type="button" className="text-[#203D35]">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-[#237A52]" /> : <Square className="w-4 h-4 text-[#64716B]" />}
                  </button>
                  <span className={`text-xs ${isChecked ? 'line-through text-[#64716B]' : 'text-[#203D35] font-medium'}`}>
                    {itemText}
                  </span>
                </div>
              );
            }
            return (
              <p key={idx} className="text-xs sm:text-sm text-[#24352F] leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Statutory Helplines footer */}
        <div className="mt-8 pt-6 border-t border-[#E1E6E2] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F7F6F0] p-4 rounded-xl">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#203D35]" />
            <span className="text-xs text-[#203D35] font-semibold">
              Need free statutory assistance on this topic?
            </span>
          </div>
          <Link
            to="/resources"
            className="px-4 py-2 bg-[#203D35] text-white rounded-lg text-xs font-semibold hover:bg-[#294B40] transition-colors"
          >
            View Official Redressal Portals
          </Link>
        </div>
      </article>
    </div>
  );
};
