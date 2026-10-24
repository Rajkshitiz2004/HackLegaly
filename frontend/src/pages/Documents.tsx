import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  HelpCircle, 
  Calendar, 
  ExternalLink,
  ChevronDown,
  Scale
} from 'lucide-react';
import { api } from '../api/client';
import { 
  SensitiveFinding, 
  DocumentAnalysisResult, 
  SecondScanResponse 
} from '../types';

export const Documents: React.FC = () => {
  // Workflow step state: 1 = Input, 2 = Redaction Review, 3 = Second Scan & Consent, 4 = Analysis Results
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Document state
  const [docText, setDocText] = useState('');
  const [docTitle, setDocTitle] = useState('My Agreement');
  const [docVersionId, setDocVersionId] = useState<string>('ephemeral-version');
  const [contentHash, setContentHash] = useState<string>('');

  // Privacy findings & redactions state
  const [findings, setFindings] = useState<SensitiveFinding[]>([]);
  const [selectedFindings, setSelectedFindings] = useState<Record<number, boolean>>({});
  const [customTerm, setCustomTerm] = useState('');
  const [customTermsList, setCustomTermsList] = useState<string[]>([]);
  const [redactedText, setRedactedText] = useState('');
  const [secondScanResult, setSecondScanResult] = useState<SecondScanResponse | null>(null);

  // Consent & Analysis state
  const [consentGranted, setConsentGranted] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to load synthetic rental agreement
  const loadSyntheticSample = async () => {
    setLoading(true);
    setError(null);
    try {
      const sample = await api.getSyntheticSample();
      setDocText(sample.text);
      setDocTitle(sample.title);
      setStatusMessage('Loaded synthetic Karnataka rental agreement with sample Aadhaar, PAN, and bank data.');
    } catch (e: any) {
      setError('Could not load sample.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1 -> 2: Text Extraction & Initial PII Scan
  const handleStartPrivacyScan = async () => {
    if (!docText.trim()) {
      setError('Please provide document text or upload a file.');
      return;
    }
    setLoading(true);
    setError(null);
    setStatusMessage('Scanning document for Indian PII identifiers (Aadhaar, PAN, bank accounts, phones)...');

    try {
      const detectRes = await api.detectPII(docText, customTermsList);
      setFindings(detectRes.findings);
      setContentHash(detectRes.content_hash);
      
      // Default: select all findings for automated masking
      const initialSelected: Record<number, boolean> = {};
      detectRes.findings.forEach((_, idx) => {
        initialSelected[idx] = true;
      });
      setSelectedFindings(initialSelected);

      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Detection failed.');
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  // Step 2 -> 3: Apply Redactions & Run Second Scan
  const handleApplyRedactionsAndScan = async () => {
    setLoading(true);
    setError(null);
    setStatusMessage('Applying safe character replacements and calculating cryptographic content hash...');

    try {
      // Collect selected findings to redact
      const toRedact = findings
        .filter((_, idx) => selectedFindings[idx])
        .map(f => ({
          start_char: f.start_char,
          end_char: f.end_char,
          replacement_placeholder: f.replacement_placeholder,
          entity_type: f.entity_type,
          detected_text: f.detected_text,
        }));

      const redactRes = await api.redactText(docText, toRedact, docVersionId);
      setRedactedText(redactRes.redacted_text);
      setContentHash(redactRes.content_hash);

      // Immediately run Step 6: Second Scan Verification
      setStatusMessage('Executing automated second-scan verification for residual identifiers...');
      const scanRes = await api.runSecondScan(redactRes.redacted_text);
      setSecondScanResult(scanRes);

      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Redaction failed.');
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  // Step 3 -> 4: Grant Affirmative Consent & Execute Analysis
  const handleConsentAndAnalyze = async () => {
    if (!consentGranted) {
      setError('You must affirmatively authorize processing before external AI analysis can proceed.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusMessage('Registering cryptographic consent on backend and verifying SHA-256 token...');

    try {
      // 1. Grant Backend Cryptographic Consent
      const consentRes = await api.grantConsent(contentHash, docVersionId, true);
      setConsentTimestamp(consentRes.consented_at);

      // 2. Perform Source-Grounded Document Analysis
      setStatusMessage('Analyzing authorized content, extracting clause risks, and grounding in statutory acts...');
      const analysis = await api.analyzeDocument(redactedText, contentHash, docVersionId);
      setAnalysisResult(analysis);

      setCurrentStep(4);
    } catch (err: any) {
      setError(err.message || 'Analysis blocked or failed.');
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Step Tracker */}
      <div className="space-y-4 pb-4 border-b border-[#E1E6E2]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
              <FileText className="w-7 h-7 text-[#203D35]" />
              Document Simplifier & Privacy Gateway
            </h1>
            <p className="text-sm text-[#64716B]">
              Simplify contracts, notices, and agreements with mandatory redaction and backend consent gatekeeping.
            </p>
          </div>
          <button
            type="button"
            onClick={loadSyntheticSample}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#DDEBE5] text-[#203D35] hover:bg-[#C4D1CB] border border-[#203D35]/20 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Synthetic Rental Agreement Fixture
          </button>
        </div>

        {/* Step Progression Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
          <div className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${currentStep >= 1 ? 'bg-[#DDEBE5] border-[#203D35]/30 text-[#203D35]' : 'bg-[#FFFFFF] border-[#E1E6E2] text-[#64716B]'}`}>
            <span className="w-5 h-5 rounded-full bg-[#203D35] text-white flex items-center justify-center font-bold text-[10px]">1</span>
            <span>Input Document</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${currentStep >= 2 ? 'bg-[#DDEBE5] border-[#203D35]/30 text-[#203D35]' : 'bg-[#FFFFFF] border-[#E1E6E2] text-[#64716B]'}`}>
            <span className="w-5 h-5 rounded-full bg-[#203D35] text-white flex items-center justify-center font-bold text-[10px]">2</span>
            <span>Review Redactions</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${currentStep >= 3 ? 'bg-[#DDEBE5] border-[#203D35]/30 text-[#203D35]' : 'bg-[#FFFFFF] border-[#E1E6E2] text-[#64716B]'}`}>
            <span className="w-5 h-5 rounded-full bg-[#203D35] text-white flex items-center justify-center font-bold text-[10px]">3</span>
            <span>Verify & Consent</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${currentStep >= 4 ? 'bg-[#DDEBE5] border-[#203D35]/30 text-[#203D35]' : 'bg-[#FFFFFF] border-[#E1E6E2] text-[#64716B]'}`}>
            <span className="w-5 h-5 rounded-full bg-[#203D35] text-white flex items-center justify-center font-bold text-[10px]">4</span>
            <span>Plain-Language Analysis</span>
          </div>
        </div>
      </div>

      {/* Status & Error Messages */}
      {statusMessage && (
        <div className="p-3 bg-[#DDEBE5] text-[#203D35] rounded-xl text-xs flex items-center gap-2 animate-pulse border border-[#203D35]/20">
          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
      {error && (
        <div className="p-4 bg-[#B42318]/10 text-[#B42318] border border-[#B42318]/30 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Select or Paste Document */}
      {currentStep === 1 && (
        <div className="card-subtle bg-[#FFFFFF] p-6 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E6E2]">
            <h2 className="font-heading font-bold text-lg text-[#203D35]">Step 1: Provide Document Content</h2>
            <span className="text-xs text-[#64716B]">Supports Plain Text, PDF & DOCX</span>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="doc-title-input" className="block text-xs font-semibold text-[#24352F] mb-1">
                Document Title (Optional):
              </label>
              <input
                id="doc-title-input"
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Leave and License Agreement - Flat 402"
                className="w-full text-sm p-2.5 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] focus:outline-[#203D35]"
              />
            </div>

            <div>
              <label htmlFor="doc-text-area" className="block text-xs font-semibold text-[#24352F] mb-1">
                Pasted Agreement Text:
              </label>
              <textarea
                id="doc-text-area"
                rows={12}
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Paste the full text of your agreement, notice, or employment letter here..."
                className="w-full text-xs font-mono p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] focus:outline-[#203D35] leading-relaxed"
              />
            </div>

            {/* Privacy Guarantee Note */}
            <div className="p-3 bg-[#F3F5F3] rounded-xl text-xs text-[#64716B] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#237A52] shrink-0" />
              <span><strong>Privacy Notice:</strong> Scanning happens locally in your active session. Raw text containing unmasked Aadhaar or PAN numbers is never forwarded to external AI providers.</span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleStartPrivacyScan}
                disabled={!docText.trim() || loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-[#203D35] text-white hover:bg-[#294B40] disabled:opacity-40 transition-all shadow-xs"
              >
                Scan for Sensitive Information
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Review Findings & Redactions */}
      {currentStep === 2 && (
        <div className="card-subtle bg-[#FFFFFF] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E1E6E2] gap-2">
            <div>
              <h2 className="font-heading font-bold text-lg text-[#203D35]">
                Step 2: Review & Apply Redactions ({findings.length} Identifiers Detected)
              </h2>
              <p className="text-xs text-[#64716B]">
                Review each finding. Checked items will be permanently masked with standard non-reversible placeholders.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allOn: Record<number, boolean> = {};
                  findings.forEach((_, idx) => allOn[idx] = true);
                  setSelectedFindings(allOn);
                }}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-[#DDEBE5] text-[#203D35]"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setSelectedFindings({})}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-[#F3F5F3] text-[#64716B]"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Findings List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
            {findings.map((f, idx) => (
              <label
                key={idx}
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                  selectedFindings[idx] ? 'bg-[#DDEBE5]/30 border-[#203D35]/30' : 'bg-[#FFFFFF] border-[#E1E6E2]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!selectedFindings[idx]}
                  onChange={(e) => setSelectedFindings(prev => ({ ...prev, [idx]: e.target.checked }))}
                  className="mt-1 accent-[#203D35]"
                />
                <div className="text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#203D35] text-white">
                      {f.entity_type}
                    </span>
                    <span className="font-mono text-[#64716B] text-[10px]">
                      Placeholder: {f.replacement_placeholder}
                    </span>
                  </div>
                  <p className="font-mono font-medium text-[#B42318] bg-[#F7F6F0] px-1.5 py-0.5 rounded border border-[#E1E6E2]">
                    "{f.detected_text}"
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Add Custom Redaction Term */}
          <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] space-y-2">
            <span className="text-xs font-semibold text-[#203D35]">Add Custom Confidential Term or Phrase:</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTerm}
                onChange={(e) => setCustomTerm(e.target.value)}
                placeholder="e.g. Specific Company Name, Confidential Project Code"
                className="text-xs p-2 bg-[#FFFFFF] rounded-lg border border-[#E1E6E2] flex-1"
              />
              <button
                type="button"
                onClick={() => {
                  if (customTerm.trim()) {
                    setCustomTermsList(prev => [...prev, customTerm.trim()]);
                    setCustomTerm('');
                    handleStartPrivacyScan();
                  }
                }}
                className="px-3 py-2 bg-[#203D35] text-white text-xs font-semibold rounded-lg hover:bg-[#294B40]"
              >
                Add & Rescan
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-semibold text-[#64716B] hover:text-[#203D35]"
            >
              Back to Input
            </button>
            <button
              type="button"
              onClick={handleApplyRedactionsAndScan}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-[#203D35] text-white hover:bg-[#294B40]"
            >
              Apply Redactions & Run Second Scan
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Second Scan & Explicit Cryptographic Consent */}
      {currentStep === 3 && (
        <div className="card-subtle bg-[#FFFFFF] p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E6E2]">
            <h2 className="font-heading font-bold text-lg text-[#203D35]">
              Step 3: Redacted Preview & Cryptographic Consent
            </h2>
            <span className="font-mono text-xs text-[#237A52] bg-[#DDEBE5] px-2.5 py-1 rounded-md border border-[#203D35]/20 font-semibold">
              SHA-256 Hash: {contentHash.substring(0, 16)}...
            </span>
          </div>

          {/* Second Scan Verification Banner */}
          {secondScanResult && (
            <div className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
              secondScanResult.is_clean ? 'bg-[#237A52]/10 border-[#237A52]/30 text-[#237A52]' : 'bg-[#946200]/10 border-[#946200]/30 text-[#946200]'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span><strong>Second Scan Result:</strong> {secondScanResult.warning_message}</span>
              </div>
              <span className="font-mono text-[10px]">Residual findings: {secondScanResult.total_residual_findings}</span>
            </div>
          )}

          {/* Redacted Preview Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#64716B]">
              <span>Proposed Content for External Analysis:</span>
              <span>All underlying personal identifiers permanently replaced</span>
            </div>
            <div className="p-4 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] text-xs font-mono leading-relaxed max-h-[220px] overflow-y-auto whitespace-pre-wrap text-[#24352F]">
              {redactedText}
            </div>
          </div>

          {/* Affirmative Consent Box (Backend Enforced) */}
          <div className="p-5 bg-[#DDEBE5]/40 rounded-xl border border-[#203D35]/20 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="consent-check"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-1 accent-[#203D35] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="consent-check" className="text-xs text-[#24352F] cursor-pointer space-y-1">
                <span className="font-bold block text-sm text-[#203D35]">
                  I affirmatively authorize external AI processing of this reviewed, redacted content.
                </span>
                <p className="text-[#64716B]">
                  Receiving Provider: <strong>Google Gemini (Backend Mediated)</strong>. Purpose: <strong>Document Simplification and Legal Awareness</strong>. This consent is cryptographically bound to the exact content hash above and expires in 2 hours.
                </p>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-semibold text-[#64716B] hover:text-[#203D35]"
            >
              Back to Redactions
            </button>
            <button
              type="button"
              onClick={handleConsentAndAnalyze}
              disabled={!consentGranted || loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-[#203D35] text-white hover:bg-[#294B40] disabled:opacity-40"
            >
              Confirm Consent & Analyze Document
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Analysis Results Display */}
      {currentStep === 4 && analysisResult && (
        <div className="space-y-8">
          {/* Top Overview Card */}
          <div className="card-subtle bg-[#FFFFFF] p-6 space-y-4 border border-[#E1E6E2]">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E1E6E2]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#237A52]"></span>
                <h2 className="font-heading font-bold text-lg text-[#203D35]">
                  Document Simplification Analysis
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded bg-[#DDEBE5] text-[#203D35] font-semibold">
                  Consent Verified • {analysisResult.model_name}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-2.5 py-1 rounded bg-[#F3F5F3] text-[#24352F] hover:bg-[#E1E6E2]"
                >
                  Analyze New Document
                </button>
              </div>
            </div>

            <p className="text-sm text-[#24352F] leading-relaxed bg-[#F7F6F0] p-4 rounded-xl border border-[#E1E6E2]">
              {analysisResult.plain_language_summary}
            </p>
          </div>

          {/* Potential Concerns Card */}
          {analysisResult.concerns && analysisResult.concerns.length > 0 && (
            <div className="card-subtle bg-[#FFFFFF] p-6 space-y-4 border border-[#E1E6E2]">
              <h3 className="font-heading font-bold text-base text-[#946200] uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#946200]" />
                Potential Contractual Concerns & Red Flags
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.concerns.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FFF8E7] border border-[#946200]/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-semibold text-sm text-[#946200]">
                        {c.concern_title}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#946200]/15 text-[#946200]">
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-xs text-[#24352F]">{c.description}</p>
                    {c.suggested_remedy && (
                      <p className="text-xs text-[#203D35] font-medium pt-1 border-t border-[#946200]/20">
                        <strong>Suggested Remedy:</strong> {c.suggested_remedy}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Clauses Card */}
          <div className="card-subtle bg-[#FFFFFF] p-6 space-y-4 border border-[#E1E6E2]">
            <h3 className="font-heading font-bold text-base text-[#203D35] uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#203D35]" />
              Important Clauses Explained
            </h3>
            <div className="space-y-3">
              {analysisResult.clauses.map((clause, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F7F6F0] border border-[#E1E6E2] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-semibold text-sm text-[#203D35]">
                      {clause.clause_title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      clause.risk_level === 'HIGH' ? 'bg-[#B42318]/15 text-[#B42318]' :
                      clause.risk_level === 'MEDIUM' ? 'bg-[#946200]/15 text-[#946200]' :
                      'bg-[#237A52]/15 text-[#237A52]'
                    }`}>
                      {clause.risk_level} RISK
                    </span>
                  </div>
                  <p className="text-xs text-[#64716B] font-mono italic">"{clause.raw_text}"</p>
                  <p className="text-xs text-[#24352F] pt-1">
                    <strong>What this means:</strong> {clause.simplified_explanation}
                  </p>
                  {clause.legal_context && (
                    <span className="block text-[10px] text-[#203D35] font-semibold">
                      Grounding: {clause.legal_context}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dates, Obligations & Deadlines */}
          {analysisResult.deadlines && analysisResult.deadlines.length > 0 && (
            <div className="card-subtle bg-[#FFFFFF] p-6 space-y-4 border border-[#E1E6E2]">
              <h3 className="font-heading font-bold text-base text-[#203D35] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#203D35]" />
                Key Deadlines & Notice Obligations
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {analysisResult.deadlines.map((d, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F3F5F3] border border-[#E1E6E2] text-xs space-y-1">
                    <span className="font-semibold text-[#203D35] block">{d.obligation_title}</span>
                    <p className="text-[#64716B]">{d.penalty_notes}</p>
                    {d.notice_period_days && (
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#DDEBE5] text-[#203D35]">
                        {d.notice_period_days} Days Notice Required
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions to Ask a Lawyer */}
          {analysisResult.questions_to_ask_lawyer && (
            <div className="card-subtle bg-[#FFFFFF] p-6 space-y-3 border border-[#E1E6E2]">
              <h3 className="font-heading font-bold text-base text-[#203D35] uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#203D35]" />
                Smart Questions to Clarify with a Lawyer
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#24352F]">
                {analysisResult.questions_to_ask_lawyer.map((q, idx) => (
                  <li key={idx} className="leading-relaxed">{q}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
