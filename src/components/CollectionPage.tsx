import { ArrowLeft, ArrowUpRight, X } from 'lucide-react';
import { useState } from 'react';
import {
  buildOrderChatUrl,
  CatalogItem,
  formatEuro,
  isWhatsAppConfigured,
  LookbookPhoto,
  PageId,
  SiteConfig,
} from '../data/catalog';

interface CollectionPageProps {
  mode: 'trosrozen' | 'mixed';
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
  onSubmitOrder: (title: string, message: string) => void;
}

export function CollectionPage({
  mode,
  siteConfig,
  onNavigate,
  onSubmitOrder,
}: CollectionPageProps) {
  const priceConfig = siteConfig.prices;
  const usingWhatsApp = isWhatsAppConfigured(siteConfig);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [addLint, setAddLint] = useState(false);
  const [lintText, setLintText] = useState('');
  const [addSluier, setAddSluier] = useState(false);
  const [colorPreference, setColorPreference] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState<LookbookPhoto | null>(null);

  const items = siteConfig.catalogItems.filter((item) => item.category === mode);
  const galleryPhotos = siteConfig.lookbookPhotos.filter(
    (photo) => photo.category === mode
  );

  const isTrosrozen = mode === 'trosrozen';
  const pageTitle = isTrosrozen
    ? siteConfig.texts.pages.trosrozenTitle
    : siteConfig.texts.pages.mixedTitle;
  const pageDescription = isTrosrozen
    ? siteConfig.texts.pages.trosrozenDescription
    : siteConfig.texts.pages.mixedDescription;

  const openOrderModal = (item: CatalogItem) => {
    setSelectedItem(item);
    setSelectedBudget(item.budgetOptions?.[1] ?? item.budgetOptions?.[0] ?? '');
    setAddLint(false);
    setLintText('');
    setAddSluier(false);
    setColorPreference('');
    setPickupDate('');
  };

  const buildCustomItemMessage = (item: CatalogItem | null): string => {
    if (!item) return '';
    const lines = [
      `Hoi MIRA Blooms! Ik wil graag informeren / bestellen voor:`,
      ``,
      `• Boeket: ${item.title}`,
    ];
    if (selectedBudget) {
      lines.push(`• Gewenst budget: ${selectedBudget}`);
    }
    if (colorPreference.trim()) {
      lines.push(`• Kleuren / bloemwensen: ${colorPreference.trim()}`);
    }
    if (addLint) {
      lines.push(
        `• Extra: Gepersonaliseerd lint (+${formatEuro(
          priceConfig.extrasWithBouquet.lint
        )})${lintText.trim() ? ` — tekst: "${lintText.trim()}"` : ''}`
      );
    }
    if (addSluier) {
      lines.push(
        `• Extra: Sluier / veil (+${formatEuro(
          priceConfig.extrasWithBouquet.sluier
        )})`
      );
    }
    if (pickupDate.trim()) {
      lines.push(`• Gewenste afhaaldatum (Lisserbroek): ${pickupDate.trim()}`);
    }
    lines.push(``, `Wat zijn de mogelijkheden voor deze datum?`);
    return lines.join('\n');
  };

  const buildPhotoMessage = (photo: LookbookPhoto | null): string => {
    if (!photo) return '';
    return [
      `Hoi MIRA Blooms! Ik zag deze creatie bij ${pageTitle} en wil graag iets vergelijkbaars bestellen:`,
      ``,
      `• Inspiratie: ${photo.title}`,
      `• Details: ${photo.detail}`,
      `• Afhalen op afspraak in Lisserbroek`,
      ``,
      `Wat zijn de mogelijkheden en richtprijs?`,
    ].join('\n');
  };

  const selectedItemMessage = buildCustomItemMessage(selectedItem);
  const selectedItemHref = buildOrderChatUrl(siteConfig, selectedItemMessage);

  const lightboxMessage = buildPhotoMessage(lightboxPhoto);
  const lightboxHref = buildOrderChatUrl(siteConfig, lightboxMessage);

  const handleConfirmCustomItem = () => {
    if (!selectedItem) return;
    const title = selectedItem.title;
    setSelectedItem(null);
    onSubmitOrder(title, selectedItemMessage);
  };

  const handleOrderPhoto = (photo: LookbookPhoto) => {
    setLightboxPhoto(null);
    onSubmitOrder(photo.title, buildPhotoMessage(photo));
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
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#57504B] sm:text-base">
            {pageDescription}
          </p>
        </div>

        {/* Curated Styles */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const startingPrice = item.startingPriceKey
              ? priceConfig.startingPrices[item.startingPriceKey]
              : 55;
            return (
              <article
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#E6E0D8] bg-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                <div>
                  <div className="overflow-hidden bg-[#EDE7DF]">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-wider text-[#786E67]">
                      {item.subtitle}
                    </p>
                    <h2 className="mt-1.5 font-display text-2xl font-medium text-[#1D1917]">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#57504B]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E6E0D8] px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1D1917] tabular-nums">
                      Vanaf {formatEuro(startingPrice)}
                    </p>
                    <p className="text-xs text-[#786E67]">{item.note}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openOrderModal(item)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#5C1B28] px-4 py-2 text-xs font-medium text-[#5C1B28] transition-colors hover:bg-[#5C1B28] hover:text-[#FAF8F5] whitespace-nowrap shrink-0"
                  >
                    <span>Selecteer</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Real Photo Inspiration Grid for this Category */}
        {galleryPhotos.length > 0 && (
          <div className="mt-16 border-t border-[#E6E0D8] pt-12">
            <h2 className="font-display text-2xl font-medium text-[#1D1917] sm:text-3xl">
              Voorbeelden uit deze collectie
            </h2>
            <p className="mt-1.5 text-sm text-[#57504B]">
              Klik op een foto om het boeket groter te bekijken of direct aan te vragen.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {galleryPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setLightboxPhoto(photo)}
                  className="group overflow-hidden rounded-lg border border-[#E6E0D8] bg-white text-left"
                >
                  <div className="overflow-hidden bg-[#EDE7DF]">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="px-3 py-2.5 text-xs font-medium text-[#1D1917] line-clamp-1">
                    {photo.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Budget & Preferences Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1917]/55 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-item-modal-title"
        >
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-[#E6E0D8] bg-[#FAF8F5] p-6 shadow-xl sm:p-8">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              aria-label="Sluiten"
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-[#57504B] hover:bg-[#EFEAE2]"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
              {selectedItem.subtitle}
            </p>
            <h3
              id="custom-item-modal-title"
              className="mt-1 font-display text-2xl font-medium text-[#1D1917]"
            >
              {selectedItem.title}
            </h3>
            <p className="mt-1.5 text-sm text-[#57504B]">
              Geef je gewenste budget en voorkeuren door. Wij denken met je mee op basis van de
              mooiste verse bloemen van het moment.
            </p>

            {selectedItem.budgetOptions && (
              <div className="mt-5">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#57504B]">
                  Kies je richtbudget
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedItem.budgetOptions.map((budget) => (
                    <button
                      key={budget}
                      type="button"
                      onClick={() => setSelectedBudget(budget)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium tabular-nums transition-colors ${
                        selectedBudget === budget
                          ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                          : 'border-[#E6E0D8] bg-white text-[#1D1917] hover:bg-[#F2EFEA]'
                      }`}
                    >
                      {budget}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="custom-color-pref"
                  className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                >
                  Kleurenpalet of bloemwensen
                </label>
                <input
                  id="custom-color-pref"
                  type="text"
                  value={colorPreference}
                  onChange={(e) => setColorPreference(e.target.value)}
                  placeholder="Bijv. zachtroze & wit, of zelfde stijl als op de foto"
                  className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-white px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                />
              </div>

              <div className="rounded-md border border-[#E6E0D8] bg-white p-3.5">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-[#1D1917]">
                    <input
                      type="checkbox"
                      checked={addLint}
                      onChange={(e) => setAddLint(e.target.checked)}
                      className="h-4 w-4 accent-[#5C1B28]"
                    />
                    Gepersonaliseerd lint toevoegen
                  </span>
                  <span className="text-sm text-[#57504B] tabular-nums">
                    +{formatEuro(priceConfig.extrasWithBouquet.lint)}
                  </span>
                </label>
                {addLint && (
                  <input
                    type="text"
                    value={lintText}
                    onChange={(e) => setLintText(e.target.value)}
                    placeholder="Tekst op het lint"
                    className="mt-2.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                  />
                )}
              </div>

              <div className="rounded-md border border-[#E6E0D8] bg-white p-3.5">
                <label className="flex cursor-pointer items-center justify-between">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-[#1D1917]">
                    <input
                      type="checkbox"
                      checked={addSluier}
                      onChange={(e) => setAddSluier(e.target.checked)}
                      className="h-4 w-4 accent-[#5C1B28]"
                    />
                    Sluier (veil) toevoegen
                  </span>
                  <span className="text-sm text-[#57504B] tabular-nums">
                    +{formatEuro(priceConfig.extrasWithBouquet.sluier)}
                  </span>
                </label>
              </div>

              <div>
                <label
                  htmlFor="custom-pickup-date"
                  className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                >
                  Gewenste afhaaldatum (Lisserbroek)
                </label>
                <input
                  id="custom-pickup-date"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-white px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                />
              </div>
            </div>

            <a
              href={selectedItemHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleConfirmCustomItem}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#5C1B28] px-5 py-3 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#46131D]"
            >
              {usingWhatsApp ? 'Direct naar WhatsApp' : 'Direct naar Instagram DM'}
            </a>
          </div>
        </div>
      )}

      {/* Photo Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1917]/80 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.title}
        >
          <div className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-lg border border-[#E6E0D8] bg-[#FAF8F5] shadow-2xl md:grid-cols-12">
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Sluiten"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1D1917] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="bg-[#1D1917] md:col-span-7">
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-full object-contain md:h-[460px] md:object-cover"
              />
            </div>
            <div className="flex flex-col justify-between p-6 md:col-span-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
                  {lightboxPhoto.categoryLabel}
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-medium text-[#1D1917]">
                  {lightboxPhoto.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#57504B]">
                  {lightboxPhoto.detail}
                </p>
              </div>
              <a
                href={lightboxHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleOrderPhoto(lightboxPhoto)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#5C1B28] px-4 py-2.5 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#46131D]"
              >
                {usingWhatsApp
                  ? 'Direct aanvragen via WhatsApp'
                  : 'Direct aanvragen via Instagram DM'}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
