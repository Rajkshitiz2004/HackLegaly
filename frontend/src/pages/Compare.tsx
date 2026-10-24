import React, { useState } from 'react';
import { 
  GitCompare, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  FileText,
  DollarSign,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { api } from '../api/client';
import { CompareResult } from '../types';

export const Compare: React.FC = () => {
  const sampleV1 = `RESIDENTIAL LEAVE AND LICENSE AGREEMENT (VERSION 1)
1. RENT: The Licensee shall pay a monthly license fee of Rs. 30,000 on or before the 10th of each calendar month.
2. SECURITY DEPOSIT: An interest-free refundable deposit of Rs. 60,000 (2 months rent) has been paid.
3. NOTICE PERIOD: Either party may terminate this agreement by providing 30 days prior written notice.
4. INSPECTION: Landlord shall give 24 hours prior written notice before entering premises.
5. LOCK-IN PERIOD: There is no lock-in period; either party may exit following due notice.`;

  const sampleV2 = `RESIDENTIAL LEAVE AND LICENSE AGREEMENT (VERSION 2 - REVISED)
1. RENT: The Licensee shall pay a monthly license fee of Rs. 36,000 on or before the 1st of each calendar month with 18% penal interest on delays.
2. SECURITY DEPOSIT: An interest-free refundable deposit of Rs. 1,80,000 (5 months rent) has been demanded.
3. NOTICE PERIOD: Licensor may terminate with 7 days notice. Licensee must give 90 days notice.
4. INSPECTION: Licensor reserves the right to inspect premises at any time without prior intimation.
5. LOCK-IN PERIOD: A mandatory 12-month lock-in period applies with forfeiture of entire deposit upon early exit.`;

  const [baseText, setBaseText] = useState(sampleV1);
  const [targetText, setTargetText] = useState(sampleV2);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!baseText.trim() || !targetText.trim()) {
      setError('Please provide text for both contract versions.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.compareDocuments(baseText, targetText);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1E6E2]">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
            <GitCompare className="w-8 h-8 text-[#203D35]" />
            Contract Version Comparison
          </h1>
          <p className="text-sm text-[#64716B]">
            Detect stealth clause changes, altered notice periods, deposit increases, and unilateral lock-in traps between two contract drafts.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setBaseText(sampleV1);
            setTargetText(sampleV2);
            handleCompare();
          }}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#DDEBE5] text-[#203D35] hover:bg-[#C4D1CB] border border-[#203D35]/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Tenancy Draft Diff Demo
        </button>
      </div>

      {/* Two Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-subtle bg-[#FFFFFF] p-5 space-y-2 border border-[#E1E6E2]">
          <span className="font-heading font-semibold text-xs text-[#203D35] uppercase tracking-wider block">
            Base Draft (e.g. Original Agreement / Version 1)
          </span>
          <textarea
            rows={10}
            value={baseText}
            onChange={(e) => setBaseText(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] text-[#24352F] focus:outline-[#203D35] leading-relaxed resize-none"
            placeholder="Paste original contract draft..."
          />
        </div>

        <div className="card-subtle bg-[#FFFFFF] p-5 space-y-2 border border-[#E1E6E2]">
          <span className="font-heading font-semibold text-xs text-[#203D35] uppercase tracking-wider block">
            Target Draft (e.g. Revised Counterparty Proposal)
          </span>
          <textarea
            rows={10}
            value={targetText}
            onChange={(e) => setTargetText(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] text-[#24352F] focus:outline-[#203D35] leading-relaxed resize-none"
            placeholder="Paste revised contract draft..."
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleCompare}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm bg-[#203D35] text-white hover:bg-[#294B40] disabled:opacity-40 shadow-sm transition-all"
        >
          <GitCompare className="w-4 h-4" />
          Run Semantic & Line Comparison
        </button>
      </div>

      {error && (
        <div className="p-4 bg-[#B42318]/10 text-[#B42318] border border-[#B42318]/30 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Comparison Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary Banner */}
          <div className="card-subtle bg-[#FFFFFF] p-6 border border-[#E1E6E2] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E1E6E2]">
              <h2 className="font-heading font-bold text-base text-[#203D35]">
                Plain-Language Comparison Summary
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[#237A52] font-semibold">+{result.added_lines_count} lines added</span>
                <span>•</span>
                <span className="text-[#B42318] font-semibold">-{result.removed_lines_count} lines altered</span>
              </div>
            </div>
            <p className="text-sm text-[#24352F] leading-relaxed bg-[#F7F6F0] p-4 rounded-xl border border-[#E1E6E2]">
              {result.summary}
            </p>
          </div>

          {/* Key Clause Shifts Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-subtle bg-[#FFFFFF] p-5 border border-[#E1E6E2] space-y-2">
              <div className="flex items-center gap-2 text-[#946200] font-heading font-semibold text-sm">
                <DollarSign className="w-4 h-4" />
                <span>Payment & Consideration Changes</span>
              </div>
              <p className="text-xs text-[#24352F] bg-[#FFF8E7] p-3 rounded-xl border border-[#946200]/20 leading-relaxed font-mono">
                {result.payment_changes}
              </p>
            </div>

            <div className="card-subtle bg-[#FFFFFF] p-5 border border-[#E1E6E2] space-y-2">
              <div className="flex items-center gap-2 text-[#B42318] font-heading font-semibold text-sm">
                <Clock className="w-4 h-4" />
                <span>Notice Period & Termination Alterations</span>
              </div>
              <p className="text-xs text-[#24352F] bg-[#B42318]/10 p-3 rounded-xl border border-[#B42318]/20 leading-relaxed font-mono">
                {result.termination_changes}
              </p>
            </div>

            <div className="card-subtle bg-[#FFFFFF] p-5 border border-[#E1E6E2] space-y-2">
              <div className="flex items-center gap-2 text-[#203D35] font-heading font-semibold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Liability & Indemnity Shifts</span>
              </div>
              <p className="text-xs text-[#24352F] bg-[#F7F6F0] p-3 rounded-xl border border-[#E1E6E2] leading-relaxed font-mono">
                {result.liability_changes}
              </p>
            </div>

            <div className="card-subtle bg-[#FFFFFF] p-5 border border-[#E1E6E2] space-y-2">
              <div className="flex items-center gap-2 text-[#2864A5] font-heading font-semibold text-sm">
                <FileText className="w-4 h-4" />
                <span>Notice & Communication Rules</span>
              </div>
              <p className="text-xs text-[#24352F] bg-[#F3F5F3] p-3 rounded-xl border border-[#E1E6E2] leading-relaxed font-mono">
                {result.notice_changes}
              </p>
            </div>
          </div>

          {/* Line Diff Viewer */}
          <div className="card-subtle bg-[#FFFFFF] p-6 border border-[#E1E6E2] space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#203D35] uppercase tracking-wider">
              Line-by-Line Difference Breakdown
            </h3>
            <div className="font-mono text-xs space-y-1 max-h-[300px] overflow-y-auto p-4 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2]">
              {result.diff_blocks.map((block, idx) => {
                if (block.type === 'unchanged') {
                  return (
                    <div key={idx} className="text-[#64716B] opacity-75">
                      {block.base_lines.map((l, i) => (
                        <div key={i}>  {l}</div>
                      ))}
                    </div>
                  );
                }
                if (block.type === 'removed') {
                  return (
                    <div key={idx} className="bg-[#B42318]/15 text-[#B42318] px-2 py-0.5 rounded">
                      {block.base_lines.map((l, i) => (
                        <div key={i}>- {l}</div>
                      ))}
                    </div>
                  );
                }
                if (block.type === 'added') {
                  return (
                    <div key={idx} className="bg-[#237A52]/15 text-[#237A52] px-2 py-0.5 rounded">
                      {block.target_lines.map((l, i) => (
                        <div key={i}>+ {l}</div>
                      ))}
                    </div>
                  );
                }
                if (block.type === 'modified') {
                  return (
                    <div key={idx} className="space-y-0.5">
                      <div className="bg-[#B42318]/15 text-[#B42318] px-2 py-0.5 rounded">
                        {block.base_lines.map((l, i) => (
                          <div key={i}>- {l}</div>
                        ))}
                      </div>
                      <div className="bg-[#237A52]/15 text-[#237A52] px-2 py-0.5 rounded">
                        {block.target_lines.map((l, i) => (
                          <div key={i}>+ {l}</div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
