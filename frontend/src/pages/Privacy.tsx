import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  ArrowRight, 
  Undo2, 
  FileCheck,
  Hash,
  ExternalLink
} from 'lucide-react';
import { api } from '../api/client';
import { SensitiveFinding, SecondScanResponse } from '../types';

export const Privacy: React.FC = () => {
  const [inputText, setInputText] = useState(
    `EMPLOYMENT ENGAGEMENT & IDENTITY RECORD

Candidate: Priya Mehra, D/o Shri Alok Mehra
Aadhaar Number: 4567 8901 2345
Permanent Account Number (PAN): BCDFE9876Q
Mobile Phone: +91 98765 12340
Email Address: priya.mehra@example.com
Bank Account Number: 50100234567891 at HDFC Bank, IFSC: HDFC0001234
Residential Address: Flat 302, Palm Meadows, Whitefield, Bengaluru 560066

The employee shall receive a monthly salary of Rs. 85,000 deposited directly into the bank account above.`
  );

  const [findings, setFindings] = useState<SensitiveFinding[]>([]);
  const [selectedFindings, setSelectedFindings] = useState<Record<number, boolean>>({});
  const [customTerm, setCustomTerm] = useState('');
  const [redactedText, setRedactedText] = useState('');
  const [contentHash, setContentHash] = useState('');
  const [secondScanResult, setSecondScanResult] = useState<SecondScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isRedacting, setIsRedacting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scan input text
  const handleDetect = async (textToScan?: string) => {
    const text = textToScan || inputText;
    if (!text.trim()) return;

    setIsScanning(true);
    setError(null);
    try {
      const res = await api.detectPII(text);
      setFindings(res.findings);
      setContentHash(res.content_hash);

      // Default select all
      const onMap: Record<number, boolean> = {};
      res.findings.forEach((_, idx) => onMap[idx] = true);
      setSelectedFindings(onMap);

      // Auto compute initial redaction
      const toRedact = res.findings.map(f => ({
        start_char: f.start_char,
        end_char: f.end_char,
        replacement_placeholder: f.replacement_placeholder,
        entity_type: f.entity_type,
        detected_text: f.detected_text,
      }));
      const redactRes = await api.redactText(text, toRedact);
      setRedactedText(redactRes.redacted_text);
      setContentHash(redactRes.content_hash);

      // Run second scan
      const scanRes = await api.runSecondScan(redactRes.redacted_text);
      setSecondScanResult(scanRes);
    } catch (err: any) {
      setError(err.message || 'Detection failed.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyCustomRedaction = async () => {
    setIsRedacting(true);
    setError(null);
    try {
      const toRedact = findings
        .filter((_, idx) => selectedFindings[idx])
        .map(f => ({
          start_char: f.start_char,
          end_char: f.end_char,
          replacement_placeholder: f.replacement_placeholder,
          entity_type: f.entity_type,
          detected_text: f.detected_text,
        }));

      const res = await api.redactText(inputText, toRedact);
      setRedactedText(res.redacted_text);
      setContentHash(res.content_hash);

      const scanRes = await api.runSecondScan(res.redacted_text);
      setSecondScanResult(scanRes);
    } catch (err: any) {
      setError(err.message || 'Redaction failed.');
    } finally {
      setIsRedacting(false);
    }
  };

  const loadPresetSample = (type: 'rental' | 'employment' | 'consumer') => {
    let sample = '';
    if (type === 'rental') {
      sample = `TENANCY AGREEMENT
Tenant: Vikramaditya Rao, PAN: ABCPR1234M, Aadhaar: 9812 3456 7890
Phone: 9820012345, Email: vikram.rao@example.com
Landlord: Suresh Patel, Account: 102938475610, IFSC: SBIN0004567
Address: Flat 5B, Shanti Niketan, Bandra West, Mumbai 400050. Rent: Rs. 45,000/month.`;
    } else if (type === 'employment') {
      sample = `OFFER LETTER
Employee: Sneha Kulkarni, Aadhaar: 3456 7890 1234, PAN: XYZPK5678L
Contact: +91 97654 32109, Email: sneha.k@example.com
Bank: Axis Bank A/c 918020034567891, IFSC: UTIB0000123
Location: Sector 62, Noida, Uttar Pradesh 201301.`;
    } else {
      sample = `CONSUMER INVOICE & COMPLAINT NOTICE
Customer: Arvind Nair, Phone: +91 99887 76655, Email: arvind.nair@example.com
Delivery Address: House 44, 2nd Main, Indiranagar, Bengaluru 560038
Order ID: OD9876543210, Transaction Ref: UPI/3289012345/Bank`;
    }
    setInputText(sample);
    handleDetect(sample);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-[#E1E6E2]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#203D35]" />
              Privacy Centre & Redaction Engine
            </h1>
            <p className="text-sm text-[#64716B]">
              Interactive PII sanitization workbench with dual-scan verification and cryptographic SHA-256 consent binding.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-semibold text-[#64716B]">Synthetic Presets:</span>
            <button
              type="button"
              onClick={() => loadPresetSample('rental')}
              className="text-xs px-2.5 py-1 rounded bg-[#DDEBE5] text-[#203D35] font-semibold hover:bg-[#C4D1CB]"
            >
              Rental
            </button>
            <button
              type="button"
              onClick={() => loadPresetSample('employment')}
              className="text-xs px-2.5 py-1 rounded bg-[#DDEBE5] text-[#203D35] font-semibold hover:bg-[#C4D1CB]"
            >
              Workplace
            </button>
            <button
              type="button"
              onClick={() => loadPresetSample('consumer')}
              className="text-xs px-2.5 py-1 rounded bg-[#DDEBE5] text-[#203D35] font-semibold hover:bg-[#C4D1CB]"
            >
              Consumer
            </button>
          </div>
        </div>
      </div>

      {/* Two-Panel Desktop Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1: Original Extracted Input (Left) */}
        <div className="lg:col-span-6 card-subtle bg-[#FFFFFF] p-5 space-y-4 border border-[#E1E6E2]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E6E2]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B42318]"></span>
              <h2 className="font-heading font-semibold text-sm text-[#203D35]">
                Panel A: Original Unredacted Text (High Risk)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => handleDetect()}
              disabled={isScanning}
              className="text-xs px-3 py-1 bg-[#203D35] text-white rounded-lg hover:bg-[#294B40] font-semibold flex items-center gap-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              Scan PII
            </button>
          </div>

          <textarea
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-xs font-mono p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] text-[#24352F] focus:outline-[#203D35] leading-relaxed resize-none"
            aria-label="Raw text to be redacted"
          />

          {/* Detected Entities Badges */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-semibold text-[#64716B]">Detected Entities ({findings.length}):</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {findings.map((f, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#B42318]/10 text-[#B42318] border border-[#B42318]/20"
                >
                  <EyeOff className="w-3 h-3" />
                  <strong>{f.entity_type}:</strong> {f.detected_text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Redacted Output (Right) */}
        <div className="lg:col-span-6 card-subtle bg-[#FFFFFF] p-5 space-y-4 border border-[#E1E6E2]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E1E6E2]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#237A52]"></span>
              <h2 className="font-heading font-semibold text-sm text-[#203D35]">
                Panel B: Proposed Redacted Result (Safe for AI)
              </h2>
            </div>
            {contentHash && (
              <span className="font-mono text-[10px] text-[#237A52] bg-[#DDEBE5] px-2 py-0.5 rounded font-bold">
                SHA-256: {contentHash.substring(0, 12)}...
              </span>
            )}
          </div>

          <div className="w-full h-[280px] p-3 bg-[#F7F6F0] rounded-xl border border-[#E1E6E2] text-xs font-mono text-[#24352F] overflow-y-auto whitespace-pre-wrap leading-relaxed">
            {redactedText || 'Run Scan PII or select a preset to preview redacted output...'}
          </div>

          {/* Second Scan Verification Badge */}
          {secondScanResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              secondScanResult.is_clean ? 'bg-[#237A52]/10 border-[#237A52]/30 text-[#237A52]' : 'bg-[#946200]/10 border-[#946200]/30 text-[#946200]'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span><strong>Second Scan:</strong> {secondScanResult.is_clean ? 'Clean (0 unredacted values)' : `${secondScanResult.total_residual_findings} residual values`}</span>
              </div>
              <span className="font-semibold text-[10px] uppercase">
                {secondScanResult.is_clean ? 'Passed' : 'Needs Review'}
              </span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleApplyCustomRedaction}
              disabled={isRedacting || findings.length === 0}
              className="px-4 py-2 bg-[#203D35] text-white text-xs font-semibold rounded-xl hover:bg-[#294B40] transition-colors shadow-xs"
            >
              Re-apply Redactions & Recalculate Hash
            </button>
          </div>
        </div>
      </div>

      {/* Security Architecture Explainer Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="card-subtle p-5 bg-[#FFFFFF] border border-[#E1E6E2] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center font-bold">
            <Lock className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-semibold text-sm text-[#203D35]">Character-Level Removal</h3>
          <p className="text-xs text-[#64716B] leading-relaxed">
            Visual black boxes in PDFs often leave underlying text selectable and scrapable. NyayaSetu permanently replaces the actual string bytes with non-reversible tokens prior to serialization.
          </p>
        </div>

        <div className="card-subtle p-5 bg-[#FFFFFF] border border-[#E1E6E2] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center font-bold">
            <Hash className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-semibold text-sm text-[#203D35]">SHA-256 Content Binding</h3>
          <p className="text-xs text-[#64716B] leading-relaxed">
            Consent is cryptographically tied to the exact SHA-256 digest of the redacted string. If a single character is modified or unmasked later, the backend gatekeeper immediately aborts processing.
          </p>
        </div>

        <div className="card-subtle p-5 bg-[#FFFFFF] border border-[#E1E6E2] space-y-2">
          <div className="w-8 h-8 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-heading font-semibold text-sm text-[#203D35]">Dual-Scan Guarantee</h3>
          <p className="text-xs text-[#64716B] leading-relaxed">
            Our engine runs an automated second-scan verification over the generated masked content before requesting user consent, alerting if any residual phone, email, or account number remains.
          </p>
        </div>
      </div>
    </div>
  );
};
