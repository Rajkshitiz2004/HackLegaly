import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  AlertCircle, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  RotateCcw, 
  Trash2, 
  BookOpen, 
  HelpCircle,
  MapPin,
  Clock,
  Info
} from 'lucide-react';
import { api } from '../api/client';
import { Jurisdiction, LegalAssistantResponse } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  response?: LegalAssistantResponse;
  timestamp: string;
}

export const Assistant: React.FC = () => {
  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [selectedJur, setSelectedJur] = useState<string>('IN-CENTRAL');
  const [suggestedQuestions, setSuggestedQuestions] = useState<any[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load jurisdictions
    api.getJurisdictions()
      .then(res => setJurisdictions(res))
      .catch(() => {});

    // Load suggested questions
    api.getSuggestedQuestions()
      .then(res => setSuggestedQuestions(res))
      .catch(() => {});
  }, []);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    setError(null);
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await api.askLegalAssistant(textToSend, selectedJur);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        content: res.simple_explanation,
        response: res,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate legal guidance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (stepTitle: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepTitle]: !prev[stepTitle]
    }));
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Jurisdiction Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E1E6E2]">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
            <Scale className="w-7 h-7 text-[#203D35]" />
            AI Legal Rights Assistant
          </h1>
          <p className="text-sm text-[#64716B]">
            Ask questions about tenancy, workplace concerns, consumer disputes, and contracts in India.
          </p>
        </div>

        {/* State / Region Jurisdiction selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-[#FFFFFF] p-1.5 rounded-xl border border-[#E1E6E2] shadow-xs">
          <MapPin className="w-4 h-4 text-[#203D35] ml-1" />
          <select
            value={selectedJur}
            onChange={(e) => setSelectedJur(e.target.value)}
            className="text-xs font-semibold text-[#203D35] bg-transparent focus:outline-none cursor-pointer pr-2"
            aria-label="Select Applicable Jurisdiction"
          >
            {jurisdictions.map((j) => (
              <option key={j.code} value={j.code}>
                {j.name} {j.level === 'COUNTRY' ? '(National)' : '(State)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suggested Questions (Chips) */}
      {messages.length === 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[#64716B] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#203D35]" />
            Suggested Everyday Legal Questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSend(q.query)}
                className="text-left text-xs bg-[#FFFFFF] hover:bg-[#DDEBE5] border border-[#E1E6E2] hover:border-[#203D35]/30 text-[#24352F] px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-2 group"
              >
                <span className="font-semibold text-[#203D35]">{q.category}:</span>
                <span className="text-[#64716B] group-hover:text-[#24352F]">{q.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="space-y-6 min-h-[300px]">
        {messages.length === 0 ? (
          <div className="card-subtle p-8 text-center bg-[#FFFFFF] border-dashed border-[#C4D1CB]">
            <Scale className="w-12 h-12 text-[#203D35]/40 mx-auto mb-3" />
            <h3 className="font-heading font-semibold text-lg text-[#203D35]">Start a Legal Awareness Inquiry</h3>
            <p className="text-xs text-[#64716B] max-w-md mx-auto mt-1">
              Select your state above and type your question below. All substantive answers are grounded in verified central and state legal acts.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              {/* User Bubble */}
              {m.sender === 'user' ? (
                <div className="bg-[#203D35] text-[#FFFFFF] rounded-2xl rounded-tr-xs px-4 py-3 max-w-xl text-sm shadow-xs">
                  <p>{m.content}</p>
                  <span className="block text-[10px] text-[#DDEBE5]/70 text-right mt-1">{m.timestamp}</span>
                </div>
              ) : (
                /* Assistant Structured 6-Section Card */
                <div className="card-subtle bg-[#FFFFFF] border border-[#E1E6E2] rounded-2xl p-6 max-w-3xl w-full shadow-sm space-y-6">
                  {/* Top Metadata & Provider Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E1E6E2] text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#237A52]"></span>
                      <span className="font-semibold text-[#203D35]">Grounded Legal Response</span>
                      <span className="text-[#64716B]">• {m.response?.model_name || 'Gemini 2.5'}</span>
                    </div>
                    {m.response?.is_demo_mode && (
                      <span className="px-2 py-0.5 rounded bg-[#DDEBE5] text-[#203D35] font-semibold text-[10px] border border-[#203D35]/20">
                        Demo Mode Engine
                      </span>
                    )}
                  </div>

                  {/* 1. Simple Explanation */}
                  <div className="space-y-1.5">
                    <h4 className="font-heading font-bold text-sm text-[#203D35] uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-[#203D35]" />
                      1. Simple Plain-Language Explanation
                    </h4>
                    <p className="text-sm text-[#24352F] leading-relaxed bg-[#F7F6F0] p-3.5 rounded-xl border border-[#E1E6E2]">
                      {m.response?.simple_explanation}
                    </p>
                  </div>

                  {/* 2. Relevant Legal Information */}
                  {m.response?.legal_information && (
                    <div className="space-y-1.5">
                      <h4 className="font-heading font-bold text-sm text-[#203D35] uppercase tracking-wider flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-[#203D35]" />
                        2. Relevant Legal Information (Statutes & Acts)
                      </h4>
                      <div className="text-sm text-[#24352F] whitespace-pre-line leading-relaxed pl-3 border-l-2 border-[#203D35]">
                        {m.response?.legal_information}
                      </div>
                    </div>
                  )}

                  {/* 3. Important Conditions & Exceptions */}
                  {m.response?.conditions_exceptions && (
                    <div className="space-y-1.5">
                      <h4 className="font-heading font-bold text-sm text-[#946200] uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-[#946200]" />
                        3. Important Conditions & Exceptions
                      </h4>
                      <p className="text-xs text-[#64716B] bg-[#FFF8E7] p-3 rounded-xl border border-[#946200]/20 leading-relaxed">
                        {m.response?.conditions_exceptions}
                      </p>
                    </div>
                  )}

                  {/* 4. Practical Next Steps (Interactive Checklist) */}
                  {m.response?.next_steps && m.response.next_steps.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-heading font-bold text-sm text-[#203D35] uppercase tracking-wider flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-[#237A52]" />
                        4. Practical Next Steps & Action Checklist
                      </h4>
                      <div className="space-y-2">
                        {m.response.next_steps.map((step) => {
                          const isDone = !!completedSteps[step.title];
                          return (
                            <div
                              key={step.title}
                              onClick={() => toggleStep(step.title)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                                isDone ? 'bg-[#DDEBE5]/40 border-[#237A52]/30' : 'bg-[#FFFFFF] border-[#E1E6E2] hover:border-[#C4D1CB]'
                              }`}
                            >
                              <button type="button" className="mt-0.5 text-[#203D35] shrink-0" aria-label="Toggle step completion">
                                {isDone ? (
                                  <CheckSquare className="w-4 h-4 text-[#237A52]" />
                                ) : (
                                  <Square className="w-4 h-4 text-[#64716B]" />
                                )}
                              </button>
                              <div className="text-xs space-y-0.5">
                                <span className={`font-semibold ${isDone ? 'line-through text-[#64716B]' : 'text-[#203D35]'}`}>
                                  {step.title}
                                </span>
                                <p className="text-[#64716B]">{step.description}</p>
                                {step.rationale && (
                                  <span className="block text-[11px] text-[#203D35]/80 font-mono mt-1">
                                    Why: {step.rationale}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 5. Trusted Sources */}
                  {m.response?.sources && m.response.sources.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#E1E6E2]">
                      <h4 className="font-heading font-bold text-xs text-[#203D35] uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#203D35]" />
                        5. Verified Statutory Citations & Official Sources
                      </h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {m.response.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.official_url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-[#F3F5F3] hover:bg-[#DDEBE5] text-[#203D35] border border-[#E1E6E2] transition-colors"
                          >
                            <span>{s.short_name} {s.section_number}</span>
                            <ExternalLink className="w-3 h-3 text-[#64716B]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. When to Seek Professional Help */}
                  {m.response?.professional_help_advice && (
                    <div className="p-3 bg-[#F3F5F3] rounded-xl text-xs text-[#64716B] flex items-start gap-2 border border-[#E1E6E2]">
                      <HelpCircle className="w-4 h-4 text-[#203D35] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#203D35]">When to Seek Legal Representation: </strong>
                        {m.response.professional_help_advice}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-3 text-xs text-[#64716B] py-3 px-4 bg-[#FFFFFF] rounded-xl border border-[#E1E6E2] w-fit shadow-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#203D35] animate-ping"></span>
            <span>Grounding query in Indian statutes and regulations...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-[#B42318]/10 border border-[#B42318]/30 rounded-xl text-xs text-[#B42318] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSend()}
              className="px-2.5 py-1 rounded bg-[#B42318] text-white font-semibold hover:bg-[#901c13]"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-4 bg-[#FFFFFF] p-3 rounded-2xl border border-[#E1E6E2] shadow-md space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your legal question (e.g., 'Can my landlord refuse to return deposit without receipt?')..."
            rows={2}
            className="w-full resize-none p-2.5 text-sm bg-transparent focus:outline-none text-[#24352F] placeholder-[#64716B]/60"
            aria-label="Legal Question Input"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                className="p-2.5 rounded-xl text-[#64716B] hover:text-[#B42318] hover:bg-[#F3F5F3] transition-colors"
                title="Clear conversation"
                aria-label="Clear conversation history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-[#203D35] text-white hover:bg-[#294B40] disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all"
              aria-label="Send Question"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between text-[11px] text-[#64716B] px-1">
          <span>Press Enter to send, Shift+Enter for new line.</span>
          <span>Scope: {selectedJur === 'IN-CENTRAL' ? 'All-India Central Laws' : `State Laws (${selectedJur})`}</span>
        </div>
      </div>
    </div>
  );
};
