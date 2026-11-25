import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  buildOrderChatUrl,
  isWhatsAppConfigured,
  LookbookCategory,
  LookbookPhoto,
  SiteConfig,
} from '../data/catalog';

interface LookbookGalleryProps {
  siteConfig: SiteConfig;
  onSubmitOrder: (title: string, message: string) => void;
}

const CATEGORIES: { id: LookbookCategory; label: string }[] = [
  { id: 'alles', label: 'Alles' },
  { id: 'rozenboeketten', label: 'Rozenboeketten' },
  { id: 'trosrozen', label: 'Trosrozen' },
  { id: 'mixed', label: 'Mixed Bouquets' },
  { id: 'extras', label: 'Losse Extra’s' },
  { id: 'bruiloften', label: 'Bruiloften' },
];

export function LookbookGallery({
  siteConfig,
  onSubmitOrder,
}: LookbookGalleryProps) {
  const usingWhatsApp = isWhatsAppConfigured(siteConfig);
  const [activeCategory, setActiveCategory] = useState<LookbookCategory>('alles');
  const [showAll, setShowAll] = useState(true);
  const [lightboxPhoto, setLightboxPhoto] = useState<LookbookPhoto | null>(null);

  const filteredPhotos =
    activeCategory === 'alles'
      ? siteConfig.lookbookPhotos
      : siteConfig.lookbookPhotos.filter((p) => p.category === activeCategory);

  const visiblePhotos =
    activeCategory === 'alles' && !showAll
      ? filteredPhotos.slice(0, 16)
      : filteredPhotos;

  useEffect(() => {
    if (!lightboxPhoto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxPhoto(null);
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const navigateLightbox = (direction: 1 | -1) => {
    if (!lightboxPhoto) return;
    const idx = filteredPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    if (idx === -1) return;
    const nextIdx =
      (idx + direction + filteredPhotos.length) % filteredPhotos.length;
    setLightboxPhoto(filteredPhotos[nextIdx]);
  };

  const buildPhotoMessage = (photo: LookbookPhoto | null): string => {
    if (!photo) return '';
    return [
      `Hoi MIRA Blooms! Ik zag deze creatie op de website en wil graag iets vergelijkbaars bestellen:`,
      ``,
      `• Inspiratie: ${photo.title}`,
      `• Details: ${photo.detail}`,
      `• Afhalen op afspraak in Lisserbroek`,
      ``,
      `Kun je mij laten weten wat de mogelijkheden en prijs zijn?`,
    ].join('\n');
  };

  const lightboxHref = buildOrderChatUrl(
    siteConfig,
    buildPhotoMessage(lightboxPhoto)
  );

  const handleRequestSimilar = (photo: LookbookPhoto) => {
    setLightboxPhoto(null);
    onSubmitOrder(`Aanvraag: ${photo.title}`, buildPhotoMessage(photo));
  };

  return (
    <section className="bg-[#FAF8F5] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 border-b border-[#E6E0D8] pb-8 md:flex-row md:items-end">
          <div>
            <h2
              className="font-display text-3xl font-medium text-[#1D1917] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              {siteConfig.texts.pages.portfolioTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[#57504B]">
              {siteConfig.texts.pages.portfolioDescription}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter galerij"
            className="flex flex-wrap gap-1.5"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setShowAll(true);
                }}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                    : 'border-[#E6E0D8] bg-white text-[#57504B] hover:text-[#1D1917]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {visiblePhotos.map((photo) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxPhoto(photo)}
              className="group relative overflow-hidden rounded-lg border border-[#E6E0D8] bg-[#EDE7DF] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1B28]"
            >
              <img
                src={photo.src}
                alt={photo.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3.5 pt-10 opacity-100 sm:opacity-0 sm:transition-opacity sm:duration-200 sm:group-hover:opacity-100">
                <p className="text-[11px] uppercase tracking-wider text-white/80">
                  {photo.categoryLabel}
                </p>
                <p className="mt-0.5 text-sm font-medium text-white line-clamp-1">
                  {photo.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        {activeCategory === 'alles' && !showAll && filteredPhotos.length > 16 && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center rounded-md border border-[#D4CBC0] bg-white px-6 py-2.5 text-sm font-medium text-[#1D1917] transition-colors hover:bg-[#F2EFEA]"
            >
              Toon alle {filteredPhotos.length} foto’s
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1917]/80 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxPhoto.title}
        >
          <div className="relative grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-lg border border-[#E6E0D8] bg-[#FAF8F5] shadow-2xl md:grid-cols-12">
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              aria-label="Sluiten"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1D1917] hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative bg-[#1D1917] md:col-span-7">
              <img
                src={lightboxPhoto.src}
                alt={lightboxPhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-full object-contain md:h-[520px] md:object-cover"
              />
              <button
                type="button"
                aria-label="Vorige foto"
                onClick={() => navigateLightbox(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1D1917] hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Volgende foto"
                onClick={() => navigateLightbox(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1D1917] hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col justify-between p-6 md:col-span-5 md:p-8">
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

              <div className="mt-8 border-t border-[#E6E0D8] pt-5">
                <p className="text-xs text-[#786E67]">
                  Afhalen op afspraak in Lisserbroek · Aanpasbaar naar wens
                </p>
                <a
                  href={lightboxHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleRequestSimilar(lightboxPhoto)}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#5C1B28] px-4 py-2.5 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#46131D]"
                >
                  {usingWhatsApp
                    ? 'Direct aanvragen via WhatsApp'
                    : 'Direct aanvragen via Instagram DM'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
