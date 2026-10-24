import React from 'react';
import { AlertCircle } from 'lucide-react';

export const LegalDisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-[#DDEBE5]/60 border-b border-[#C4D1CB] py-2 px-4 text-xs text-[#24352F] flex items-center justify-center gap-2">
      <AlertCircle className="w-4 h-4 text-[#203D35] shrink-0" aria-hidden="true" />
      <span>
        <strong>Public Legal Awareness Tool:</strong> NyayaSetu simplifies legal documents and informs citizens of their rights. It does not provide formal legal counsel or replace a qualified advocate. For court representation or free statutory legal aid, dial NALSA Helpline <strong className="underline">15100</strong>.
      </span>
    </div>
  );
};
