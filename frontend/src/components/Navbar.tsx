import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Shield, Scale, FileText, BookOpen, GitCompare, LifeBuoy, Settings, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Scale },
    { name: 'AI Assistant', path: '/assistant', icon: Shield },
    { name: 'Document Simplifier', path: '/documents', icon: FileText },
    { name: 'Privacy Centre', path: '/privacy', icon: ShieldCheck },
    { name: 'Knowledge Centre', path: '/knowledge', icon: BookOpen },
    { name: 'Compare', path: '/compare', icon: GitCompare },
    { name: 'Resources', path: '/resources', icon: LifeBuoy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E1E6E2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#203D35]">
            <div className="w-10 h-10 rounded-xl bg-[#203D35] flex items-center justify-center text-[#DDEBE5] shadow-xs group-hover:bg-[#294B40] transition-colors">
              <Scale className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-[#203D35] tracking-tight">NyayaSetu</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#DDEBE5] text-[#203D35]">India</span>
              </div>
              <p className="text-[11px] text-[#64716B] leading-none">Rights Awareness & Document Privacy</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#DDEBE5] text-[#203D35] font-semibold'
                        : 'text-[#64716B] hover:text-[#203D35] hover:bg-[#F3F5F3]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Action Badges */}
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#237A52]/10 text-[#237A52] border border-[#237A52]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#237A52] animate-pulse"></span>
              Cryptographic Gatekeeper
            </span>
            <Link
              to="/documents"
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#203D35] text-[#FFFFFF] hover:bg-[#294B40] shadow-xs transition-colors"
            >
              Simplify Document
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#24352F] hover:bg-[#F3F5F3] focus-visible:outline-[#203D35]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E1E6E2] bg-[#FFFFFF] px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-[#DDEBE5] text-[#203D35] font-semibold'
                      : 'text-[#64716B] hover:text-[#203D35] hover:bg-[#F3F5F3]'
                  }`
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
          <div className="pt-3 border-t border-[#E1E6E2]">
            <Link
              to="/documents"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#203D35] text-white"
            >
              <FileText className="w-4 h-4" />
              Simplify a Document
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
