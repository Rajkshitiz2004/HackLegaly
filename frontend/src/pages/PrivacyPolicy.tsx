import React from 'react';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-3 pb-4 border-b border-[#E1E6E2]">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
          <Lock className="w-8 h-8 text-[#203D35]" />
          Privacy Policy & Data Protection Guarantees
        </h1>
        <p className="text-sm text-[#64716B]">
          Effective Date: October 2026 • Compliant with Indian DPDP Act, 2023 Principles
        </p>
      </div>

      <div className="card-subtle bg-[#FFFFFF] p-8 space-y-6 border border-[#E1E6E2] text-sm text-[#24352F] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-[#203D35]">1. Ephemeral Processing by Default</h2>
          <p>
            NyayaSetu does not permanently store raw document contents, uploaded contracts, or unmasked sensitive personal information on centralized databases. All document extraction and PII detection operate in volatile memory scoped strictly to your current session.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-[#203D35]">2. Indian PII Sanitization Standards</h2>
          <p>
            Before document text is ever forwarded to an AI provider for simplification, our engine scans for:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-[#64716B]">
            <li>12-digit Indian Aadhaar Numbers</li>
            <li>10-character Permanent Account Numbers (PAN)</li>
            <li>Indian Mobile Phone Numbers (+91 / 10 digits)</li>
            <li>Bank Account Numbers and Indian Financial System Codes (IFSC)</li>
            <li>Personal Email Addresses and Physical Residential Addresses</li>
            <li>Named contracting parties and custom user-specified terms</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-[#203D35]">3. Cryptographic Consent Gatekeeping</h2>
          <p>
            In compliance with Section 6 of the Digital Personal Data Protection Act (DPDP Act 2023), processing requires affirmative, specific consent. NyayaSetu calculates a SHA-256 cryptographic hash of the reviewed, redacted text. If the text has not been reviewed, or if the text hash differs from the authorized token, the backend API strictly terminates the request with HTTP 403 Forbidden.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-heading font-bold text-lg text-[#203D35]">4. Zero Third-Party Advertising Trackers</h2>
          <p>
            We do not sell, rent, or monetize citizen inquiries or legal documents. No third-party ad pixels or tracking beacons operate on our document processing endpoints.
          </p>
        </section>
      </div>
    </div>
  );
};
