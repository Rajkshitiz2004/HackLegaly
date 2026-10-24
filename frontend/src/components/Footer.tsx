import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, HeartHandshake, PhoneCall, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#203D35] text-[#DDEBE5] border-t border-[#294B40] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#294B40] flex items-center justify-center text-[#DDEBE5] border border-[#DDEBE5]/20">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-xl text-[#FFFFFF]">NyayaSetu</span>
            </div>
            <p className="text-sm text-[#DDEBE5]/80 max-w-sm leading-relaxed">
              India-focused public legal-awareness and document-privacy platform. Empowering citizens to understand everyday contracts, notices, and disputes while mathematically protecting confidential PII with cryptographic consent.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#DDEBE5]/70">
              <ShieldCheck className="w-4 h-4 text-[#DDEBE5]" />
              <span>Zero-server document retention by default • SHA-256 Consent Binding</span>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#FFFFFF] uppercase tracking-wider mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-[#DDEBE5]/80">
              <li>
                <Link to="/assistant" className="hover:text-[#FFFFFF] transition-colors">
                  AI Legal Assistant
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-[#FFFFFF] transition-colors">
                  Document Simplifier
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#FFFFFF] transition-colors">
                  Privacy Centre & Redactor
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[#FFFFFF] transition-colors">
                  Contract Version Diff
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Knowledge */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#FFFFFF] uppercase tracking-wider mb-3">
              Knowledge & Help
            </h4>
            <ul className="space-y-2 text-sm text-[#DDEBE5]/80">
              <li>
                <Link to="/knowledge" className="hover:text-[#FFFFFF] transition-colors">
                  Legal Knowledge Centre
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-[#FFFFFF] transition-colors">
                  Official Resource Directory
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#FFFFFF] transition-colors">
                  Jurisdiction & Preferences
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FFFFFF] transition-colors">
                  About Project
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Helplines */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#FFFFFF] uppercase tracking-wider mb-3">
              Emergency Helplines
            </h4>
            <ul className="space-y-2 text-xs text-[#DDEBE5]/80">
              <li className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#DDEBE5]" />
                <span>NALSA Legal Aid: <strong className="text-white">15100</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#DDEBE5]" />
                <span>Consumer Helpline: <strong className="text-white">1915</strong></span>
              </li>
              <li className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#DDEBE5]" />
                <span>Cyber Crime Reporting: <strong className="text-white">1930</strong></span>
              </li>
              <li className="pt-2">
                <a
                  href="https://edaakhil.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[#DDEBE5] hover:underline"
                >
                  e-Daakhil Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-[#294B40] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#DDEBE5]/60">
          <p>© 2026 NyayaSetu. Open-source public interest legal awareness project for Hacktoberfest.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#FFFFFF] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#FFFFFF] transition-colors">
              Terms of Use
            </Link>
            <Link to="/about" className="hover:text-[#FFFFFF] transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
