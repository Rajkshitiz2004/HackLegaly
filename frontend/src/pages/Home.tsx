import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scale, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  EyeOff, 
  AlertTriangle, 
  Search, 
  Building2, 
  Briefcase, 
  ShoppingBag, 
  FileCheck, 
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';
import { KnowledgeArticle } from '../types';

export const Home: React.FC = () => {
  const [guides, setGuides] = useState<KnowledgeArticle[]>([]);
  const [activeTab, setActiveTab] = useState<'redacted' | 'original'>('redacted');

  useEffect(() => {
    api.getLegalGuides()
      .then(res => setGuides(res.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#DDEBE5] text-[#203D35] border border-[#203D35]/15">
                <ShieldCheck className="w-4 h-4 text-[#203D35]" />
                <span>India-Focused Legal Awareness & Document Privacy</span>
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#203D35] tracking-tight leading-[1.12]">
                Understand Your Rights. <br className="hidden sm:inline" />
                <span className="text-[#294B40] underline decoration-[#DDEBE5] decoration-wavy decoration-2">Protect Your Privacy.</span>
              </h1>
              <p className="text-lg text-[#64716B] max-w-xl leading-relaxed">
                Understand everyday legal documents, demystify rental & workplace agreements, and review sensitive information with automated redaction before sending content to external AI.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/assistant"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[#203D35] text-[#FFFFFF] hover:bg-[#294B40] shadow-sm hover:shadow-md transition-all"
                >
                  <Scale className="w-4 h-4" />
                  Ask a Legal Question
                </Link>
                <Link
                  to="/documents"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[#DDEBE5] text-[#203D35] hover:bg-[#C4D1CB] border border-[#203D35]/20 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Simplify a Document
                </Link>
                <Link
                  to="/privacy"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-[#FFFFFF] text-[#24352F] hover:bg-[#F3F5F3] border border-[#E1E6E2] shadow-xs transition-all"
                >
                  <Lock className="w-4 h-4 text-[#237A52]" />
                  Protect My Document
                </Link>
              </div>

              {/* Privacy highlights */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#64716B]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#237A52]" />
                  <span>Aadhaar, PAN & PII Masking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#237A52]" />
                  <span>SHA-256 Consent Gatekeeper</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#237A52]" />
                  <span>Grounded in Indian Statutes</span>
                </div>
              </div>
            </div>

            {/* Interactive Document & Privacy Preview */}
            <div className="lg:col-span-5">
              <div className="card-subtle p-5 border border-[#E1E6E2] shadow-sm relative">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E1E6E2]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B42318]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#946200]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#237A52]"></span>
                    <span className="text-xs font-mono font-medium text-[#64716B] ml-2">document_privacy_review.preview</span>
                  </div>
                  <div className="flex bg-[#F3F5F3] p-0.5 rounded-lg text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setActiveTab('redacted')}
                      className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'redacted' ? 'bg-[#FFFFFF] text-[#203D35] shadow-xs font-semibold' : 'text-[#64716B]'}`}
                    >
                      Redacted Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('original')}
                      className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'original' ? 'bg-[#FFFFFF] text-[#203D35] shadow-xs font-semibold' : 'text-[#64716B]'}`}
                    >
                      Raw Input
                    </button>
                  </div>
                </div>

                {/* Content Box */}
                <div className="bg-[#F7F6F0] rounded-lg p-4 font-mono text-xs text-[#24352F] leading-relaxed border border-[#E1E6E2] min-h-[220px]">
                  {activeTab === 'redacted' ? (
                    <div>
                      <p className="text-[#64716B] mb-2">// Authorized for AI Processing (SHA-256 Verified)</p>
                      <p>
                        "This Agreement is entered into by <span className="bg-[#DDEBE5] text-[#203D35] px-1.5 py-0.5 rounded font-semibold border border-[#203D35]/20">[NAME_1]</span>, holding PAN <span className="bg-[#DDEBE5] text-[#203D35] px-1.5 py-0.5 rounded font-semibold border border-[#203D35]/20">[PAN_1]</span> and Aadhaar <span className="bg-[#DDEBE5] text-[#203D35] px-1.5 py-0.5 rounded font-semibold border border-[#203D35]/20">[AADHAAR_1]</span>. Rent of ₹35,000 shall be remitted to Account <span className="bg-[#DDEBE5] text-[#203D35] px-1.5 py-0.5 rounded font-semibold border border-[#203D35]/20">[ACCOUNT_NUMBER_1]</span>."
                      </p>
                      <div className="mt-4 pt-3 border-t border-[#E1E6E2] flex items-center justify-between text-[11px] text-[#237A52]">
                        <span className="flex items-center gap-1 font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" /> 4 PII Identifiers Removed
                        </span>
                        <span className="font-mono text-[10px] text-[#64716B]">Hash: 87ef0a...ca837</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[#B42318] mb-2">// High Privacy Risk - Raw Document with Sensitive Data</p>
                      <p>
                        "This Agreement is entered into by <mark className="bg-[#B42318]/15 text-[#B42318] px-1 rounded">Rajesh Kumar Sharma</mark>, holding PAN <mark className="bg-[#B42318]/15 text-[#B42318] px-1 rounded">ABCDE1234F</mark> and Aadhaar <mark className="bg-[#B42318]/15 text-[#B42318] px-1 rounded">9876 5432 1098</mark>. Rent of ₹35,000 shall be remitted to Account <mark className="bg-[#B42318]/15 text-[#B42318] px-1 rounded">987654321012</mark>."
                      </p>
                      <div className="mt-4 pt-3 border-t border-[#E1E6E2] flex items-center justify-between text-[11px] text-[#B42318]">
                        <span className="flex items-center gap-1 font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> Direct External Transmission BLOCKED
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-[#64716B]">
                  <span>Step 4 of 10: Redaction Review</span>
                  <Link to="/privacy" className="text-[#203D35] font-semibold hover:underline flex items-center gap-1">
                    Try interactive sandbox <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading font-bold text-3xl text-[#203D35]">How NyayaSetu Protects You</h2>
          <p className="text-sm text-[#64716B] mt-2">
            A three-step privacy-first architecture designed to ensure zero accidental exposure of confidential citizen data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-subtle p-6 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-[#DDEBE5] flex items-center justify-center text-[#203D35] font-heading font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-heading font-semibold text-lg text-[#203D35] mb-2">Local Extraction & Sensitivity Scan</h3>
            <p className="text-sm text-[#64716B] leading-relaxed">
              Upload a PDF, DOCX, or paste agreement text. Our engine instantly flags Aadhaar numbers, PAN cards, phone numbers, emails, addresses, and bank details without sending raw text to any cloud AI.
            </p>
          </div>

          <div className="card-subtle p-6 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-[#DDEBE5] flex items-center justify-center text-[#203D35] font-heading font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-heading font-semibold text-lg text-[#203D35] mb-2">Review Redactions & Second Scan</h3>
            <p className="text-sm text-[#64716B] leading-relaxed">
              You inspect the masked preview, add custom terms, and run a second scan to verify zero residual identifiers remain. You grant explicit, affirmative consent tied to the exact SHA-256 hash.
            </p>
          </div>

          <div className="card-subtle p-6 hover:shadow-md transition-shadow relative">
            <div className="w-10 h-10 rounded-xl bg-[#DDEBE5] flex items-center justify-center text-[#203D35] font-heading font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-heading font-semibold text-lg text-[#203D35] mb-2">Statutory Grounding & Action Plan</h3>
            <p className="text-sm text-[#64716B] leading-relaxed">
              The backend validates the cryptographic consent token and processes only the sanitized document. You receive plain-language summaries, clause risk ratings, statutory citations, and an actionable checklist.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Legal Topics */}
      <section className="bg-[#FFFFFF] border-y border-[#E1E6E2] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading font-bold text-2xl text-[#203D35]">Popular Legal Topics in India</h2>
              <p className="text-sm text-[#64716B]">Common contractual and statutory challenges faced by citizens.</p>
            </div>
            <Link to="/knowledge" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#203D35] hover:underline">
              Browse all legal guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/knowledge/tenant-rights-security-deposits" className="card-subtle card-hover p-5 group">
              <div className="w-9 h-9 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center mb-3 group-hover:bg-[#203D35] group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-base text-[#203D35] mb-1">Tenant Rights & Security Deposits</h3>
              <p className="text-xs text-[#64716B] line-clamp-2">
                Learn why deposit demands over 2 months contradict the Model Tenancy Act, and how to contest unfair deductions.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#203D35]">
                <span>Read Guide</span> <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link to="/knowledge/workplace-rights-notice-salary" className="card-subtle card-hover p-5 group">
              <div className="w-9 h-9 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center mb-3 group-hover:bg-[#203D35] group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-base text-[#203D35] mb-1">Workplace Rights & Notice Periods</h3>
              <p className="text-xs text-[#64716B] line-clamp-2">
                Why post-employment non-compete clauses are void under Section 27, and how to recover withheld salaries.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#203D35]">
                <span>Read Guide</span> <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link to="/knowledge/consumer-complaint-edaakhil-nch" className="card-subtle card-hover p-5 group">
              <div className="w-9 h-9 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center mb-3 group-hover:bg-[#203D35] group-hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-base text-[#203D35] mb-1">Consumer Complaints & e-Daakhil</h3>
              <p className="text-xs text-[#64716B] line-clamp-2">
                File disputes for defective e-commerce goods or services online using the official e-Daakhil and NCH 1915 portals.
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#203D35]">
                <span>Read Guide</span> <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Guarantees & AI Limitations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-subtle bg-[#203D35] text-[#FFFFFF] p-8 lg:p-10 border border-[#294B40] rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#294B40] text-[#DDEBE5] border border-[#DDEBE5]/20">
                <Lock className="w-3.5 h-3.5 text-[#DDEBE5]" />
                <span>Transparent Architectural Commitments</span>
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white">
                Privacy is an Architectural Safeguard, Not a Checkbox
              </h2>
              <p className="text-sm text-[#DDEBE5]/85 leading-relaxed">
                Most AI tools silently transmit your full document—including your PAN, Aadhaar, salary details, and home address—to third-party LLMs. NyayaSetu enforces cryptographic gatekeeping: our backend rejects any document request unless a matching cryptographic hash of the reviewed, redacted text has received explicit affirmative consent.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-[#DDEBE5]/90">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#DDEBE5] shrink-0 mt-0.5" />
                  <span><strong>Zero-Storage Ephemeral Default:</strong> Uploaded files are processed in-memory and discarded.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#DDEBE5] shrink-0 mt-0.5" />
                  <span><strong>No LLM Hallucination of Statutes:</strong> All legal recommendations cite official Indian acts and government portals.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#294B40] rounded-xl border border-[#DDEBE5]/20 text-center space-y-3">
              <Scale className="w-10 h-10 text-[#DDEBE5]" />
              <h3 className="font-heading font-semibold text-base text-white">Need Free Legal Help?</h3>
              <p className="text-xs text-[#DDEBE5]/80">
                Eligible citizens can receive free legal counsel under the Legal Services Authorities Act.
              </p>
              <a
                href="tel:15100"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold bg-[#FFFFFF] text-[#203D35] hover:bg-[#DDEBE5] transition-colors"
              >
                Call NALSA: 15100
              </a>
              <Link to="/resources" className="text-xs text-[#DDEBE5] underline hover:text-white">
                View verified helpline directory
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
