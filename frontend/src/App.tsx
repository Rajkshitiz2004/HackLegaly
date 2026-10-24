import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LegalDisclaimerBanner } from './components/LegalDisclaimerBanner';

// Pages
import { Home } from './pages/Home';
import { Assistant } from './pages/Assistant';
import { Documents } from './pages/Documents';
import { Privacy } from './pages/Privacy';
import { Knowledge } from './pages/Knowledge';
import { GuideDetail } from './pages/GuideDetail';
import { Compare } from './pages/Compare';
import { Resources } from './pages/Resources';
import { Settings } from './pages/Settings';
import { About } from './pages/About';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#F7F6F0] text-[#24352F]">
        <LegalDisclaimerBanner />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/knowledge/:slug" element={<GuideDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
