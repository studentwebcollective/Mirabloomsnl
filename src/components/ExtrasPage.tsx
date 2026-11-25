import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import {
  buildOrderChatUrl,
  CatalogItem,
  formatEuro,
  PageId,
  SiteConfig,
} from '../data/catalog';

interface ExtrasPageProps {
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
  onSubmitOrder: (title: string, message: string) => void;
}

export function ExtrasPage({
  siteConfig,
  onNavigate,
  onSubmitOrder,
}: ExtrasPageProps) {
  const priceConfig = siteConfig.prices;
  const [standaloneVeilText, setStandaloneVeilText] = useState('');
  const [standaloneRibbonText, setStandaloneRibbonText] = useState('');
  const [standaloneRibbonColor, setStandaloneRibbonColor] = useState(
    'Wit satijn met gouden letters'
  );

  const standaloneItems = siteConfig.catalogItems.filter(
    (item) => item.category === 'losse-extras'
  );
  const inspirationPhotos = siteConfig.lookbookPhotos.filter(
    (photo) => photo.category === 'extras'
  );

  const buildStandaloneMessage = (item: CatalogItem): string => {
    const isVeil = item.id === 'los-sluier';
    const price = isVeil
      ? priceConfig.standaloneExtras.losseSluier
      : priceConfig.standaloneExtras.losLint;

    const lines = [
      `Hoi MIRA Blooms! Ik wil graag een losse extra bestellen:`,
      ``,
      `• Product: ${item.title} (${formatEuro(price)})`,
    ];
    if (isVeil && standaloneVeilText.trim()) {
      lines.push(`• Gewenste tekst op sluier: "${standaloneVeilText.trim()}"`);
    }
    if (!isVeil) {
      lines.push(`• Kleur lint & opdruk: ${standaloneRibbonColor}`);
      if (standaloneRibbonText.trim()) {
        lines.push(`• Gewenste tekst op lint: "${standaloneRibbonText.trim()}"`);
      }
    }
    lines.push(`• Afhalen op afspraak in Lisserbroek`);
    return lines.join('\n');
  };

  const handleOrderStandalone = (item: CatalogItem) => {
    const isVeil = item.id === 'los-sluier';
    const price = isVeil
      ? priceConfig.standaloneExtras.losseSluier
      : priceConfig.standaloneExtras.losLint;
    onSubmitOrder(
      `${item.title} (${formatEuro(price)})`,
      buildStandaloneMessage(item)
    );
  };

  return (
    <section className="min-h-[calc(100vh-4.5rem)] bg-[#FAF8F5] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#786E67] transition-colors hover:text-[#1D1917]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Terug naar voorpagina</span>
        </button>

        <div className="mt-4 border-b border-[#E6E0D8] pb-8">
          <h1
            className="font-display text-3xl font-medium text-[#1D1917] sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            {siteConfig.texts.pages.extrasTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#57504B] sm:text-base">
            {siteConfig.texts.pages.extrasDescription}
          </p>
        </div>

        {/* Standalone Order Cards */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {standaloneItems.map((item) => {
            const isVeil = item.id === 'los-sluier';
            const price = isVeil
              ? priceConfig.standaloneExtras.losseSluier
              : priceConfig.standaloneExtras.losLint;

            return (
              <div
                key={item.id}
                className="grid grid-cols-1 overflow-hidden rounded-lg border border-[#E6E0D8] bg-white sm:grid-cols-12"
              >
                <div className="bg-[#EDE7DF] sm:col-span-5">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-64 w-full object-cover sm:h-full"
                  />
                </div>
                <div className="flex flex-col justify-between p-6 sm:col-span-7">
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-2xl font-medium text-[#1D1917]">
                        {item.title}
                      </h2>
                      <span className="font-display text-2xl font-semibold text-[#5C1B28] tabular-nums shrink-0">
                        {formatEuro(price)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#57504B]">
                      {item.description}
                    </p>

                    {isVeil ? (
                      <div className="mt-4">
                        <label
                          htmlFor="los-sluier-tekst"
                          className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                        >
                          Gewenste tekst (optioneel)
                        </label>
                        <input
                          id="los-sluier-tekst"
                          type="text"
                          value={standaloneVeilText}
                          onChange={(e) => setStandaloneVeilText(e.target.value)}
                          placeholder="Bijv. Happy birthday of Will you marry me"
                          className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] placeholder:text-[#9A9088] focus:border-[#5C1B28] focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        <div>
                          <label
                            htmlFor="los-lint-kleur"
                            className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                          >
                            Kleur lint &amp; bedrukking
                          </label>
                          <select
                            id="los-lint-kleur"
                            value={standaloneRibbonColor}
                            onChange={(e) => setStandaloneRibbonColor(e.target.value)}
                            className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                          >
                            <option>Wit satijn met gouden letters</option>
                            <option>Wit satijn met zwarte letters</option>
                            <option>Zwart satijn met gouden letters</option>
                            <option>Crème satijn met gouden letters</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="los-lint-tekst"
                            className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                          >
                            Tekst voor op het lint
                          </label>
                          <input
                            id="los-lint-tekst"
                            type="text"
                            value={standaloneRibbonText}
                            onChange={(e) => setStandaloneRibbonText(e.target.value)}
                            placeholder="Bijv. Namen, datum of korte boodschap"
                            className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] placeholder:text-[#9A9088] focus:border-[#5C1B28] focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <a
                    href={buildOrderChatUrl(siteConfig, buildStandaloneMessage(item))}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleOrderStandalone(item)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#5C1B28] px-4 py-2.5 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#46131D]"
                  >
                    Bestel {isVeil ? 'losse sluier' : 'los lint'} ({formatEuro(price)})
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Examples of Personalization */}
        <div className="mt-16 border-t border-[#E6E0D8] pt-12">
          <h2 className="font-display text-2xl font-medium text-[#1D1917] sm:text-3xl">
            Voorbeelden van sluiers, linten &amp; gipskruid
          </h2>
          <p className="mt-1.5 text-sm text-[#57504B]">
            Zo worden onze personalisaties op boeketten en manden aangebracht.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {inspirationPhotos.map((photo) => (
              <figure
                key={photo.id}
                className="overflow-hidden rounded-lg border border-[#E6E0D8] bg-white"
              >
                <div className="bg-[#EDE7DF]">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <figcaption className="p-3">
                  <p className="text-xs font-medium text-[#1D1917] line-clamp-1">
                    {photo.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#786E67] line-clamp-2">
                    {photo.detail}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
