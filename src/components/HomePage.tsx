import { PageId, SiteConfig } from '../data/catalog';
import { AboutStoryBlock } from './AboutSection';

interface HomePageProps {
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
}

export function HomePage({ siteConfig, onNavigate }: HomePageProps) {
  return (
    <>
      <section className="bg-[#F3EFE9] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center">
          {/* Centered Editorial Header */}
          <div className="max-w-2xl text-center">
            <h1 className="font-display text-5xl font-medium tracking-tight text-[#1D1917] sm:text-6xl lg:text-7xl">
              {siteConfig.texts.brandTitle}{' '}
              <span className="italic font-normal">
                {siteConfig.texts.brandTitleItalic}
              </span>
            </h1>
            <p className="mt-3 text-base text-[#57504B] sm:text-lg">
              {siteConfig.heroSubtitle}
            </p>

            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={() => onNavigate('rozenboeketten')}
                className="inline-flex items-center justify-center rounded-md bg-[#5C1B28] px-7 py-3.5 text-xs font-medium uppercase tracking-widest text-[#FAF8F5] transition-colors duration-150 hover:bg-[#46131D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1B28] focus-visible:ring-offset-2"
              >
                {siteConfig.heroCtaLabel}
              </button>
            </div>
          </div>

          {/* 5 Large Clickable Category Photo Frames */}
          <div className="mt-12 w-full sm:mt-14 lg:mt-16">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
              {siteConfig.homepageCards.map((card, index) => {
                const isLastOddMobile =
                  index === siteConfig.homepageCards.length - 1;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => onNavigate(card.targetPage)}
                    className={`group flex flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1B28] focus-visible:ring-offset-4 ${
                      isLastOddMobile ? 'col-span-2 sm:col-span-1' : ''
                    }`}
                  >
                    <div className="w-full overflow-hidden rounded-sm border border-[#E2DBD1] bg-white p-2 shadow-sm transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-md">
                      <div className="overflow-hidden bg-[#EDE7DF]">
                        <img
                          src={card.imageSrc}
                          alt={card.label}
                          referrerPolicy="no-referrer"
                          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    </div>

                    <div className="mt-3 px-0.5 text-center">
                      <span className="block font-display text-xl font-medium text-[#1D1917] transition-colors group-hover:text-[#5C1B28] sm:text-2xl">
                        {card.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#786E67]">
                        {card.sublabel}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Het verhaal achter MIRA Blooms directly at the bottom of the homepage */}
      <section className="border-t border-[#E6E0D8] bg-[#FAF8F5] py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AboutStoryBlock
            siteConfig={siteConfig}
            onNavigate={onNavigate}
            showPortfolioLink
          />
        </div>
      </section>
    </>
  );
}
