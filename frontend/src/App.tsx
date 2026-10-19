import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/common/Toast';
import { SkipLink } from './components/layout/SkipLink';
import { ScrollProgress } from './components/common/ScrollProgress';
import { Header } from './components/layout/Header';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/common/CookieBanner';
import { BackToTop } from './components/common/BackToTop';
import { CommandPalette } from './components/common/CommandPalette';
import { FeedbackModal } from './components/common/FeedbackModal';
import { NetworkStatusBanner } from './components/common/NetworkStatusBanner';
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';
import { captureUtmParameters } from './utils/utm';

// Pages
import { Home } from './pages/Home';
import { CommandCenter } from './pages/CommandCenter';
import { NewInvestigation } from './pages/NewInvestigation';
import { InvestigationGraphPage } from './pages/InvestigationGraph';
import { CampaignIntel } from './pages/CampaignIntel';
import { ModelLab } from './pages/ModelLab';
import { History } from './pages/History';
import { ScamAcademy } from './pages/ScamAcademy';
import { About } from './pages/About';
import { SettingsPage } from './pages/Settings';
import { Styleguide } from './pages/Styleguide';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    captureUtmParameters();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200">
            <SkipLink />
            <ScrollProgress />
            
            <Header
              onOpenSearch={() => setIsSearchOpen(true)}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            />

            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            />

            <CommandPalette
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
            />

            <main id="main-content" className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/command-center" element={<CommandCenter />} />
                <Route path="/investigate" element={<NewInvestigation />} />
                <Route path="/graph" element={<InvestigationGraphPage />} />
                <Route path="/campaigns" element={<CampaignIntel />} />
                <Route path="/model-lab" element={<ModelLab />} />
                <Route path="/history" element={<History />} />
                <Route path="/academy" element={<ScamAcademy />} />
                <Route path="/about" element={<About />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/styleguide" element={<Styleguide />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            <Footer />
            <CookieBanner />
            <BackToTop />
            <FeedbackModal />
            <NetworkStatusBanner />
            <KeyboardShortcutsModal />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
