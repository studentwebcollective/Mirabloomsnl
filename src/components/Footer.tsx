import { INSTAGRAM_HANDLE, INSTAGRAM_PROFILE_URL, PageId, SiteConfig } from '../data/catalog';

interface FooterProps {
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
  onOpenAdminPanel: () => void;
}

export function Footer({ siteConfig, onNavigate, onOpenAdminPanel }: FooterProps) {
  const pageLabels = siteConfig.homepageCards;

  return (
    <footer className="border-t border-[#E6E0D8] bg-[#FAF8F5] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-[#E6E0D8] pb-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="font-display text-2xl font-semibold text-[#1D1917]"
            >
              {siteConfig.texts.brandTitle}{' '}
              <span className="italic font-normal">
                {siteConfig.texts.brandTitleItalic}
              </span>
            </button>
            <p className="mt-1 text-xs uppercase tracking-widest text-[#786E67]">
              {siteConfig.heroSubtitle}
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#57504B]">
              {siteConfig.texts.footer.description}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
              Pagina’s
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#57504B]">
              {pageLabels.map((card) => (
                <li key={card.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(card.targetPage)}
                    className="hover:text-[#1D1917]"
                  >
                    {card.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('over-mira')}
                  className="hover:text-[#1D1917]"
                >
                  Over ons &amp; Portfolio
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
              Contact &amp; Afhalen
            </p>
            <ul className="mt-3 space-y-2 text-sm text-[#57504B]">
              <li>{siteConfig.texts.footer.pickupLine}</li>
              <li>
                Instagram:{' '}
                <a
                  href={INSTAGRAM_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#5C1B28] underline underline-offset-4"
                >
                  @{INSTAGRAM_HANDLE}
                </a>
              </li>
              <li className="pt-2">
                <button
                  type="button"
                  onClick={onOpenAdminPanel}
                  className="text-xs font-medium text-[#5C1B28] underline underline-offset-4 transition-colors hover:text-[#1D1917]"
                >
                  Admin Panel (Teksten, foto’s &amp; prijzen)
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-2 text-xs text-[#786E67] sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.texts.brandTitle}{' '}
            {siteConfig.texts.brandTitleItalic}
          </p>
          <p>{siteConfig.texts.footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  );
}
