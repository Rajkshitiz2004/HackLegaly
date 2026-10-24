import React from 'react';
import { Scale, ShieldCheck, HeartHandshake, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-[#E1E6E2]">
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#203D35] flex items-center gap-2">
          <Scale className="w-8 h-8 text-[#203D35]" />
          About NyayaSetu
        </h1>
        <p className="text-sm text-[#64716B]">
          An India-focused legal-awareness and document-privacy platform designed for Hacktoberfest.
        </p>
      </div>

      {/* Mission */}
      <div className="card-subtle bg-[#FFFFFF] p-8 space-y-4 border border-[#E1E6E2]">
        <h2 className="font-heading font-bold text-xl text-[#203D35]">Our Mission</h2>
        <p className="text-sm text-[#24352F] leading-relaxed">
          In India, millions of citizens sign rental leases, employment contracts, loan agreements, and vendor terms without fully understanding the binding legal implications. Furthermore, with the rapid rise of consumer AI tools, users frequently paste confidential documents into chatbots—exposing Aadhaar numbers, PAN cards, bank account details, and private contractual terms.
        </p>
        <p className="text-sm text-[#24352F] leading-relaxed">
          <strong>NyayaSetu</strong> was built to solve both challenges simultaneously: making everyday Indian legal information accessible, while architecturally guaranteeing that sensitive personal data is redacted and cryptographically authorized before external AI processing can ever take place.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-subtle bg-[#FFFFFF] p-6 space-y-2 border border-[#E1E6E2]">
          <div className="w-8 h-8 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center font-bold mb-2">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-[#203D35]">Zero-Leakage Privacy Engine</h3>
          <p className="text-xs text-[#64716B] leading-relaxed">
            Our privacy engine detects Indian PII (Aadhaar, PAN, phone, IFSC, bank accounts, and addresses) and permanently removes underlying text bytes. A backend gatekeeper mathematically enforces SHA-256 consent before any cloud LLM invocation.
          </p>
        </div>

        <div className="card-subtle bg-[#FFFFFF] p-6 space-y-2 border border-[#E1E6E2]">
          <div className="w-8 h-8 rounded-lg bg-[#DDEBE5] text-[#203D35] flex items-center justify-center font-bold mb-2">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-semibold text-base text-[#203D35]">Curated Statutory Grounding</h3>
          <p className="text-xs text-[#64716B] leading-relaxed">
            Substantive legal explanations are grounded in verified central and state enactments—including the Model Tenancy Act, 2021, Consumer Protection Act, 2019, Indian Contract Act, 1872, and the Digital Personal Data Protection Act, 2023.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-6 bg-[#F7F6F0] rounded-2xl border border-[#E1E6E2] space-y-2">
        <h3 className="font-heading font-bold text-sm text-[#203D35]">Important Public Service Notice</h3>
        <p className="text-xs text-[#64716B] leading-relaxed">
          NyayaSetu is an educational awareness assistant designed to demystify legal concepts for non-experts. It does not provide formal legal representation, advocacy, or legal advice. If you face an active court dispute, imminent eviction, or require legal representation, please approach the National Legal Services Authority (NALSA) at <strong>15100</strong> or contact a certified advocate.
        </p>
      </div>
    </div>
  );
};
