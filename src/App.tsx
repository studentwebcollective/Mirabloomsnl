import { Check } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AdminPanelModal } from './components/AdminPanelModal';
import { CollectionPage } from './components/CollectionPage';
import { ExtrasPage } from './components/ExtrasPage';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { Navbar } from './components/Navbar';
import { RoseConfigurator } from './components/RoseConfigurator';
import { WeddingSection } from './components/WeddingSection';
import {
  copyOrderText,
  DEFAULT_SITE_CONFIG,
  INSTAGRAM_HANDLE,
  isWhatsAppConfigured,
  PageId,
  SiteConfig,
} from './data/catalog';

const STORAGE_KEY = 'mirablooms_site_config_v2';

const VALID_PAGES: PageId[] = [
  'home',
  'rozenboeketten',
  'trosrozen',
  'mixed',
  'extras',
  'bruiloften',
  'over-mira',
];

function getInitialPage(): PageId {
  const hash = window.location.hash.replace('#', '') as PageId;
  return VALID_PAGES.includes(hash) ? hash : 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage);

  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<SiteConfig>;
        return {
          ...DEFAULT_SITE_CONFIG,
          ...parsed,
          logoSrc: parsed.logoSrc || DEFAULT_SITE_CONFIG.logoSrc,
          aboutPhotoSrc: parsed.aboutPhotoSrc || DEFAULT_SITE_CONFIG.aboutPhotoSrc,
          homepageCards: parsed.homepageCards?.length
            ? parsed.homepageCards
            : DEFAULT_SITE_CONFIG.homepageCards,
          roseColors: parsed.roseColors?.length
            ? parsed.roseColors
            : DEFAULT_SITE_CONFIG.roseColors,
          catalogItems: parsed.catalogItems?.length
            ? parsed.catalogItems
            : DEFAULT_SITE_CONFIG.catalogItems,
          weddingGallery: parsed.weddingGallery?.length
            ? parsed.weddingGallery
            : DEFAULT_SITE_CONFIG.weddingGallery,
          lookbookPhotos: parsed.lookbookPhotos?.length
            ? parsed.lookbookPhotos
            : DEFAULT_SITE_CONFIG.lookbookPhotos,
          prices: parsed.prices ?? DEFAULT_SITE_CONFIG.prices,
          texts: {
            ...DEFAULT_SITE_CONFIG.texts,
            ...parsed.texts,
            about: {
              ...DEFAULT_SITE_CONFIG.texts.about,
              ...parsed.texts?.about,
            },
            pages: {
              ...DEFAULT_SITE_CONFIG.texts.pages,
              ...parsed.texts?.pages,
            },
            footer: {
              ...DEFAULT_SITE_CONFIG.texts.footer,
              ...parsed.texts?.footer,
            },
          },
        };
      }
    } catch {
      // Ignore storage errors and fall back to default config
    }
    return DEFAULT_SITE_CONFIG;
  });

  const [toastTitle, setToastTitle] = useState<string | null>(null);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteConfig));
    } catch {
      // Ignore storage write errors
    }
  }, [siteConfig]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      if (VALID_PAGES.includes(hash)) {
        setCurrentPage(hash);
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = useCallback((page: PageId) => {
    setCurrentPage(page);
    const nextHash = page === 'home' ? '' : `#${page}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash || window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDirectOrder = useCallback(
    (title: string, message: string) => {
      if (isWhatsAppConfigured(siteConfig)) {
        // WhatsApp pre-fills the message directly via ?text=... in the link
        return;
      }
      copyOrderText(message);
      setToastTitle(title);
      window.setTimeout(() => {
        setToastTitle((prev) => (prev === title ? null : prev));
      }, 6000);
    },
    [siteConfig]
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#1D1917]">
      <Navbar
        currentPage={currentPage}
        siteConfig={siteConfig}
        onNavigate={navigateTo}
        onOpenQuickOrder={handleDirectOrder}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage siteConfig={siteConfig} onNavigate={navigateTo} />
        )}

        {currentPage === 'rozenboeketten' && (
          <RoseConfigurator
            siteConfig={siteConfig}
            onNavigate={navigateTo}
            onSubmitOrder={handleDirectOrder}
          />
        )}

        {currentPage === 'trosrozen' && (
          <CollectionPage
            mode="trosrozen"
            siteConfig={siteConfig}
            onNavigate={navigateTo}
            onSubmitOrder={handleDirectOrder}
          />
        )}

        {currentPage === 'mixed' && (
          <CollectionPage
            mode="mixed"
            siteConfig={siteConfig}
            onNavigate={navigateTo}
            onSubmitOrder={handleDirectOrder}
          />
        )}

        {currentPage === 'extras' && (
          <ExtrasPage
            siteConfig={siteConfig}
            onNavigate={navigateTo}
            onSubmitOrder={handleDirectOrder}
          />
        )}

        {currentPage === 'bruiloften' && (
          <WeddingSection
            siteConfig={siteConfig}
            onNavigate={navigateTo}
            onSubmitOrder={handleDirectOrder}
          />
        )}

        {currentPage === 'over-mira' && (
          <AboutSection
            siteConfig={siteConfig}
            onNavigate={navigateTo}
            onSubmitOrder={handleDirectOrder}
          />
        )}
      </main>

      <Footer
        siteConfig={siteConfig}
        onNavigate={navigateTo}
        onOpenAdminPanel={() => setAdminPanelOpen(true)}
      />

      {toastTitle && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-[#E6E0D8] bg-[#1D1917] px-4 py-3 text-xs text-[#FAF8F5] shadow-lg"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C5E0C9]" />
          <div>
            <p className="font-medium">
              Besteltekst gekopieerd ({toastTitle})
            </p>
            <p className="mt-0.5 text-[#D8D1C7]">
              Instagram ondersteunt geen automatisch vooringevulde tekst — plak de tekst in de chat met @{INSTAGRAM_HANDLE} en druk op verzenden.
            </p>
          </div>
        </div>
      )}

      <AdminPanelModal
        isOpen={adminPanelOpen}
        onClose={() => setAdminPanelOpen(false)}
        siteConfig={siteConfig}
        onSaveConfig={setSiteConfig}
      />
    </div>
  );
}
