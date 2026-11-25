import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import {
  buildOrderChatUrl,
  isWhatsAppConfigured,
  PageId,
  SiteConfig,
} from '../data/catalog';

interface NavbarProps {
  currentPage: PageId;
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
  onOpenQuickOrder: (title: string, message: string) => void;
}

const DEFAULT_NAV_PAGES: Exclude<PageId, 'home' | 'over-mira'>[] = [
  'rozenboeketten',
  'trosrozen',
  'mixed',
  'extras',
  'bruiloften',
];

export function Navbar({
  currentPage,
  siteConfig,
  onNavigate,
  onOpenQuickOrder,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = DEFAULT_NAV_PAGES.map((page) => {
    const card = siteConfig.homepageCards.find((c) => c.targetPage === page);
    return {
      page,
      label: card?.label ?? page,
    };
  });

  const quickMessage =
    'Hoi MIRA Blooms! Ik heb een vraag over een boeket of bestelling (afhalen in Lisserbroek). Kunnen jullie mij helpen?';
  const quickHref = buildOrderChatUrl(siteConfig, quickMessage);
  const ctaLabel = siteConfig.texts.navCtaLabel;

  const handleSelectPage = (page: PageId) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#E6E0D8] bg-[#FAF8F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark (single-line) */}
        <button
          type="button"
          onClick={() => handleSelectPage('home')}
          className="font-display text-2xl font-semibold tracking-tight text-[#1D1917] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1B28]"
        >
          {siteConfig.texts.brandTitle}{' '}
          <span className="italic font-normal">
            {siteConfig.texts.brandTitleItalic}
          </span>
        </button>

        {/* Zone 2: Exact 5 single-line category links matching homepage cards */}
        <nav
          aria-label="Hoofdnavigatie"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#57504B]"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                type="button"
                onClick={() => handleSelectPage(item.page)}
                className={`relative py-1 transition-colors duration-150 whitespace-nowrap shrink-0 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:bg-[#5C1B28] after:transition-transform after:duration-200 ${
                  isActive
                    ? 'text-[#1D1917] after:scale-x-100'
                    : 'hover:text-[#1D1917] after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={quickHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenQuickOrder('Algemene bestelling', quickMessage)}
            className="hidden sm:inline-flex items-center justify-center rounded-md bg-[#5C1B28] px-4 py-2 text-xs font-medium tracking-wide text-[#FAF8F5] transition-colors duration-150 hover:bg-[#46131D] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1B28] focus-visible:ring-offset-2"
          >
            {ctaLabel}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Menu sluiten' : 'Menu openen'}
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#E6E0D8] text-[#1D1917] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1B28]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#E6E0D8] bg-[#FAF8F5] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleSelectPage('home')}
              className={`py-1.5 text-left text-sm font-medium ${
                currentPage === 'home' ? 'text-[#5C1B28]' : 'text-[#1D1917]'
              }`}
            >
              Voorpagina
            </button>
            {navItems.map((item) => (
              <button
                key={item.page}
                type="button"
                onClick={() => handleSelectPage(item.page)}
                className={`py-1.5 text-left text-sm font-medium ${
                  currentPage === item.page
                    ? 'text-[#5C1B28]'
                    : 'text-[#1D1917] hover:text-[#5C1B28]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSelectPage('over-mira')}
              className={`py-1.5 text-left text-sm font-medium ${
                currentPage === 'over-mira' ? 'text-[#5C1B28]' : 'text-[#1D1917]'
              }`}
            >
              Over Mira
            </button>
            <a
              href={quickHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setMobileOpen(false);
                onOpenQuickOrder('Algemene bestelling', quickMessage);
              }}
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-[#5C1B28] px-4 py-2.5 text-sm font-medium text-[#FAF8F5]"
            >
              {ctaLabel}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
