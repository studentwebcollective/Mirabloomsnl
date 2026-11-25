import {
  Check,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  CatalogItem,
  compressImageFile,
  isWhatsAppConfigured,
  LookbookCategory,
  LookbookPhoto,
  PageId,
  RoseColorId,
  RoseQuantity,
  SeasonMode,
  SiteConfig,
} from '../data/catalog';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteConfig: SiteConfig;
  onSaveConfig: (next: SiteConfig) => void;
}

type AdminTab = 'homepage' | 'fotos' | 'teksten' | 'prijzen';
type PhotoSubTab = 'over' | 'rozen' | 'producten' | 'bruiloften' | 'portfolio';

type PickTarget =
  | { type: 'homepage-card'; cardId: string; label: string; currentSrc: string }
  | { type: 'about-photo'; label: string; currentSrc: string }
  | { type: 'logo'; label: string; currentSrc: string }
  | {
      type: 'rose-image';
      colorId: RoseColorId;
      index: number;
      label: string;
      currentSrc: string;
    }
  | {
      type: 'rose-add';
      colorId: RoseColorId;
      label: string;
      currentSrc: string;
    }
  | {
      type: 'catalog-item';
      itemId: string;
      label: string;
      currentSrc: string;
    }
  | {
      type: 'wedding-item';
      index: number;
      label: string;
      currentSrc: string;
    }
  | {
      type: 'wedding-add';
      label: string;
      currentSrc: string;
    };

const ROSE_QUANTITIES: RoseQuantity[] = [20, 30, 40, 50, 60, 80, 100];

const CATEGORY_PAGE_OPTIONS: {
  value: Exclude<PageId, 'home' | 'over-mira'>;
  label: string;
}[] = [
  { value: 'rozenboeketten', label: 'Rozenboeketten' },
  { value: 'trosrozen', label: 'Trosrozen' },
  { value: 'mixed', label: 'Mixed Bouquets' },
  { value: 'extras', label: 'Losse Extra’s' },
  { value: 'bruiloften', label: 'Bruiloften' },
];

const PICKER_CATEGORIES: { id: LookbookCategory; label: string }[] = [
  { id: 'alles', label: 'Alle foto’s' },
  { id: 'rozenboeketten', label: 'Rozenboeketten' },
  { id: 'trosrozen', label: 'Trosrozen' },
  { id: 'mixed', label: 'Mixed & Manden' },
  { id: 'extras', label: 'Extra’s' },
  { id: 'bruiloften', label: 'Bruiloften' },
];

const LOOKBOOK_CATEGORY_LABELS: Record<
  Exclude<LookbookCategory, 'alles'>,
  string
> = {
  rozenboeketten: 'Rozenboeketten',
  trosrozen: 'Trosrozen',
  mixed: 'Mixed Bouquets',
  extras: 'Losse Extra’s',
  bruiloften: 'Bruiloften',
};

export function AdminPanelModal({
  isOpen,
  onClose,
  siteConfig,
  onSaveConfig,
}: AdminPanelModalProps) {
  const [draft, setDraft] = useState<SiteConfig>(siteConfig);
  const [activeTab, setActiveTab] = useState<AdminTab>('homepage');
  const [photoSubTab, setPhotoSubTab] = useState<PhotoSubTab>('portfolio');
  const [selectedRoseColor, setSelectedRoseColor] =
    useState<RoseColorId>('rood');
  const [productFilter, setProductFilter] = useState<
    'trosrozen' | 'mixed' | 'losse-extras'
  >('trosrozen');
  const [portfolioFilter, setPortfolioFilter] =
    useState<LookbookCategory>('alles');
  const [uploadPortfolioCategory, setUploadPortfolioCategory] = useState<
    Exclude<LookbookCategory, 'alles'>
  >('trosrozen');
  const [editPriceSeasonTab, setEditPriceSeasonTab] = useState<SeasonMode>(
    siteConfig.prices.activeSeason
  );
  const [pickTarget, setPickTarget] = useState<PickTarget | null>(null);
  const [pickerCategory, setPickerCategory] =
    useState<LookbookCategory>('alles');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDraft(siteConfig);
      setEditPriceSeasonTab(siteConfig.prices.activeSeason);
      setPickTarget(null);
      setUploadError(null);
      setSavedNotice(false);
    }
  }, [isOpen, siteConfig]);

  if (!isOpen) return null;

  const updateCard = (
    cardId: string,
    patch: Partial<SiteConfig['homepageCards'][number]>
  ) => {
    setDraft((prev) => ({
      ...prev,
      homepageCards: prev.homepageCards.map((card) =>
        card.id === cardId ? { ...card, ...patch } : card
      ),
    }));
  };

  const updateAboutText = (
    field: keyof SiteConfig['texts']['about'],
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      texts: {
        ...prev.texts,
        about: {
          ...prev.texts.about,
          [field]: value,
        },
      },
    }));
  };

  const updatePageText = (
    field: keyof SiteConfig['texts']['pages'],
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      texts: {
        ...prev.texts,
        pages: {
          ...prev.texts.pages,
          [field]: value,
        },
      },
    }));
  };

  const updateFooterText = (
    field: keyof SiteConfig['texts']['footer'],
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      texts: {
        ...prev.texts,
        footer: {
          ...prev.texts.footer,
          [field]: value,
        },
      },
    }));
  };

  const updateRosePrice = (
    season: SeasonMode,
    qty: RoseQuantity,
    value: string
  ) => {
    const num = Math.max(0, Number(value) || 0);
    setDraft((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        roses: {
          ...prev.prices.roses,
          [season]: {
            ...prev.prices.roses[season],
            [qty]: num,
          },
        },
      },
    }));
  };

  const applyPickedSrcToTarget = (
    target: PickTarget,
    src: string,
    titleSuggestion?: string
  ) => {
    setDraft((prev) => {
      switch (target.type) {
        case 'homepage-card':
          return {
            ...prev,
            homepageCards: prev.homepageCards.map((c) =>
              c.id === target.cardId ? { ...c, imageSrc: src } : c
            ),
          };
        case 'about-photo':
          return { ...prev, aboutPhotoSrc: src };
        case 'logo':
          return { ...prev, logoSrc: src };
        case 'rose-image':
          return {
            ...prev,
            roseColors: prev.roseColors.map((color) =>
              color.id === target.colorId
                ? {
                    ...color,
                    images: color.images.map((img, i) =>
                      i === target.index ? { ...img, src } : img
                    ),
                  }
                : color
            ),
          };
        case 'rose-add':
          return {
            ...prev,
            roseColors: prev.roseColors.map((color) =>
              color.id === target.colorId
                ? {
                    ...color,
                    images: [
                      ...color.images,
                      { src, caption: titleSuggestion || color.name },
                    ],
                  }
                : color
            ),
          };
        case 'catalog-item':
          return {
            ...prev,
            catalogItems: prev.catalogItems.map((item) =>
              item.id === target.itemId ? { ...item, image: src } : item
            ),
          };
        case 'wedding-item':
          return {
            ...prev,
            weddingGallery: prev.weddingGallery.map((w, i) =>
              i === target.index ? { ...w, src } : w
            ),
          };
        case 'wedding-add':
          return {
            ...prev,
            weddingGallery: [
              ...prev.weddingGallery,
              { src, title: titleSuggestion || 'Bruiloft creatie' },
            ],
          };
      }
    });
  };

  const processUpload = async (
    file: File | undefined,
    onDone: (dataUrl: string, cleanName: string) => void
  ) => {
    if (!file) return;
    setUploadError(null);
    try {
      const dataUrl = await compressImageFile(file);
      const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
      onDone(dataUrl, cleanName || 'Nieuwe foto');
    } catch {
      setUploadError('Kon deze afbeelding niet verwerken. Probeer een andere foto.');
    }
  };

  const handlePickerUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!pickTarget) return;
    await processUpload(file, (dataUrl, cleanName) => {
      applyPickedSrcToTarget(pickTarget, dataUrl, cleanName);
      setPickTarget(null);
    });
  };

  const handleDirectUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    onDone: (dataUrl: string, cleanName: string) => void
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    await processUpload(file, onDone);
  };

  const handleAddCatalogProduct = () => {
    const defaultImg =
      draft.lookbookPhotos.find((p) =>
        productFilter === 'trosrozen'
          ? p.category === 'trosrozen'
          : productFilter === 'mixed'
          ? p.category === 'mixed'
          : p.category === 'extras'
      )?.src ?? draft.lookbookPhotos[0]?.src ?? '';

    const newItem: CatalogItem = {
      id: `item-${Date.now()}`,
      category: productFilter,
      title:
        productFilter === 'trosrozen'
          ? 'Nieuwe Trosrozen'
          : productFilter === 'mixed'
          ? 'Nieuw Mixed Bouquet'
          : 'Nieuwe Extra',
      subtitle:
        productFilter === 'trosrozen'
          ? 'Trosrozen · Op maat & budget'
          : productFilter === 'mixed'
          ? 'Mixed Bouquet · Seizoensbloemen'
          : 'Losse verkoop · Afhalen in Lisserbroek',
      description: 'Vers op bestelling samengesteld naar jouw wensen.',
      image: defaultImg,
      priceType: productFilter === 'losse-extras' ? 'fixed' : 'starting',
      startingPriceKey:
        productFilter === 'trosrozen'
          ? 'trosrozen'
          : productFilter === 'mixed'
          ? 'mixed'
          : undefined,
      fixedPriceKey:
        productFilter === 'losse-extras' ? 'losseSluier' : undefined,
      note: 'Afhalen op afspraak in Lisserbroek',
      budgetOptions:
        productFilter === 'losse-extras'
          ? undefined
          : ['€55 – €75', '€75 – €110', '€110 – €150', '€150+'],
    };

    setDraft((prev) => ({
      ...prev,
      catalogItems: [newItem, ...prev.catalogItems],
    }));
  };

  const handleAddPortfolioUploads = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;
    setUploadError(null);

    const cat =
      portfolioFilter !== 'alles' ? portfolioFilter : uploadPortfolioCategory;
    const catLabel = LOOKBOOK_CATEGORY_LABELS[cat];

    const newPhotos: LookbookPhoto[] = [];
    for (const file of files) {
      try {
        const dataUrl = await compressImageFile(file);
        const cleanName = file.name
          .replace(/\.[^.]+$/, '')
          .replace(/[_-]+/g, ' ');
        newPhotos.push({
          id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          src: dataUrl,
          title: cleanName || catLabel,
          category: cat,
          categoryLabel: catLabel,
          detail: `${catLabel} · Handgemaakt door MIRA Blooms`,
        });
      } catch {
        setUploadError('Sommige foto’s konden niet worden verwerkt.');
      }
    }

    if (newPhotos.length > 0) {
      setDraft((prev) => ({
        ...prev,
        lookbookPhotos: [...newPhotos, ...prev.lookbookPhotos],
      }));
    }
  };

  const handleSave = () => {
    onSaveConfig(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const pickerPhotos =
    pickerCategory === 'alles'
      ? draft.lookbookPhotos
      : draft.lookbookPhotos.filter((p) => p.category === pickerCategory);

  const activeRoseColorObj =
    draft.roseColors.find((c) => c.id === selectedRoseColor) ??
    draft.roseColors[0];

  const filteredCatalogItems = draft.catalogItems.filter(
    (item) => item.category === productFilter
  );

  const filteredPortfolioPhotos =
    portfolioFilter === 'alles'
      ? draft.lookbookPhotos
      : draft.lookbookPhotos.filter((p) => p.category === portfolioFilter);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1917]/60 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-panel-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-[#E6E0D8] bg-[#FAF8F5] p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Sluiten"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-md text-[#57504B] hover:bg-[#EFEAE2]"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
          Admin Panel · Website &amp; Prijzen
        </p>
        <h3
          id="admin-panel-title"
          className="mt-1 font-display text-2xl font-medium text-[#1D1917] sm:text-3xl"
        >
          Foto’s, Teksten &amp; Prijzen Beheren
        </h3>

        {/* Admin Mode Tabs */}
        <div
          role="tablist"
          className="mt-5 inline-flex flex-wrap rounded-lg border border-[#E6E0D8] bg-white p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'homepage'}
            onClick={() => {
              setPickTarget(null);
              setActiveTab('homepage');
            }}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'homepage'
                ? 'bg-[#5C1B28] text-[#FAF8F5]'
                : 'text-[#57504B] hover:text-[#1D1917]'
            }`}
          >
            Voorpagina
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'fotos'}
            onClick={() => {
              setPickTarget(null);
              setActiveTab('fotos');
            }}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'fotos'
                ? 'bg-[#5C1B28] text-[#FAF8F5]'
                : 'text-[#57504B] hover:text-[#1D1917]'
            }`}
          >
            Alle Foto’s &amp; Producten
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'teksten'}
            onClick={() => {
              setPickTarget(null);
              setActiveTab('teksten');
            }}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'teksten'
                ? 'bg-[#5C1B28] text-[#FAF8F5]'
                : 'text-[#57504B] hover:text-[#1D1917]'
            }`}
          >
            Alle Teksten
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'prijzen'}
            onClick={() => {
              setPickTarget(null);
              setActiveTab('prijzen');
            }}
            className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors ${
              activeTab === 'prijzen'
                ? 'bg-[#5C1B28] text-[#FAF8F5]'
                : 'text-[#57504B] hover:text-[#1D1917]'
            }`}
          >
            Prijzen &amp; Valentijnstarief
          </button>
        </div>

        {uploadError && (
          <p className="mt-3 rounded-md border border-[#9B3B2B]/30 bg-[#9B3B2B]/10 px-3 py-2 text-xs text-[#9B3B2B]">
            {uploadError}
          </p>
        )}

        {/* SHARED VISUAL PHOTO PICKER OVERLAY */}
        {pickTarget ? (
          <div className="mt-6 rounded-lg border border-[#5C1B28]/30 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E0D8] pb-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#5C1B28]">
                  Foto kiezen voor: {pickTarget.label}
                </p>
                <p className="text-xs text-[#786E67]">
                  Kies een bestaande foto of upload een nieuwe foto vanaf je apparaat
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#46131D]">
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload nieuwe foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePickerUpload}
                    className="sr-only"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setPickTarget(null)}
                  className="rounded-md border border-[#D4CBC0] px-3 py-1.5 text-xs font-medium text-[#1D1917] hover:bg-[#FAF8F5]"
                >
                  Annuleren
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {PICKER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPickerCategory(cat.id)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                    pickerCategory === cat.id
                      ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                      : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#57504B]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid max-h-80 grid-cols-3 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-4 md:grid-cols-5">
              {pickerPhotos.map((photo) => {
                const isCurrent = pickTarget.currentSrc === photo.src;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      applyPickedSrcToTarget(pickTarget, photo.src, photo.title);
                      setPickTarget(null);
                    }}
                    className={`group overflow-hidden rounded-md border text-left transition-all ${
                      isCurrent
                        ? 'border-[#5C1B28] ring-2 ring-[#5C1B28]'
                        : 'border-[#E6E0D8] hover:border-[#5C1B28]'
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="aspect-[3/4] w-full object-cover"
                    />
                    <p className="truncate px-1.5 py-1 text-[10px] text-[#57504B]">
                      {photo.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {/* TAB 1: HOMEPAGE */}
            {activeTab === 'homepage' && (
              <div className="mt-6 space-y-6">
                {/* Hero Header Texts */}
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    Koptekst op de voorpagina
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="hero-subtitle-input"
                        className="block text-xs text-[#57504B]"
                      >
                        Subtitel onder MIRA Blooms
                      </label>
                      <input
                        id="hero-subtitle-input"
                        type="text"
                        value={draft.heroSubtitle}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            heroSubtitle: e.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="hero-cta-input"
                        className="block text-xs text-[#57504B]"
                      >
                        Tekst op de hoofdknop
                      </label>
                      <input
                        id="hero-cta-input"
                        type="text"
                        value={draft.heroCtaLabel}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            heroCtaLabel: e.target.value,
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917]"
                      />
                    </div>
                  </div>
                </div>

                {/* Bestelkanaal: Instagram DM vs WhatsApp */}
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    Bestelkanaal
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({ ...prev, orderChannel: 'instagram' }))
                      }
                      className={`rounded-md border px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                        draft.orderChannel === 'instagram'
                          ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                          : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#1D1917]'
                      }`}
                    >
                      Instagram DM (@mirabloomsnl)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({ ...prev, orderChannel: 'whatsapp' }))
                      }
                      className={`rounded-md border px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                        draft.orderChannel === 'whatsapp'
                          ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                          : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#1D1917]'
                      }`}
                    >
                      WhatsApp (tekst automatisch ingevuld)
                    </button>
                  </div>

                  {draft.orderChannel === 'whatsapp' && (
                    <div className="mt-3">
                      <label
                        htmlFor="wa-number-input"
                        className="block text-xs text-[#57504B]"
                      >
                        Jouw WhatsApp-nummer (bijv. 0612345678 of +31612345678)
                      </label>
                      <input
                        id="wa-number-input"
                        type="tel"
                        value={draft.whatsappNumber}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            whatsappNumber: e.target.value,
                          }))
                        }
                        placeholder="0612345678"
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917]"
                      />
                      {!isWhatsAppConfigured(draft) && (
                        <p className="mt-1 text-xs text-[#9B3B2B]">
                          Vul een geldig telefoonnummer in zodat bestelknoppen direct naar WhatsApp gaan.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 5 Category Cards Editor */}
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    De 5 grote foto’s &amp; categorieën op de voorpagina
                  </p>
                  {draft.homepageCards.map((card, idx) => (
                    <div
                      key={card.id}
                      className="flex flex-col gap-4 rounded-lg border border-[#E6E0D8] bg-white p-4 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-3 shrink-0">
                        <img
                          src={card.imageSrc}
                          alt={card.label}
                          referrerPolicy="no-referrer"
                          className="h-24 w-20 rounded-md border border-[#E6E0D8] object-cover"
                        />
                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setPickerCategory('alles');
                              setPickTarget({
                                type: 'homepage-card',
                                cardId: card.id,
                                label: card.label,
                                currentSrc: card.imageSrc,
                              });
                            }}
                            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#5C1B28] transition-colors hover:bg-[#5C1B28] hover:text-[#FAF8F5]"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>Kies foto</span>
                          </button>
                          <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-xs font-medium text-[#1D1917] hover:bg-[#EFEAE2]">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleDirectUpload(e, (dataUrl) =>
                                  updateCard(card.id, { imageSrc: dataUrl })
                                )
                              }
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                          <label className="block text-[11px] text-[#786E67]">
                            Titel foto {idx + 1}
                          </label>
                          <input
                            type="text"
                            value={card.label}
                            onChange={(e) =>
                              updateCard(card.id, { label: e.target.value })
                            }
                            className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm text-[#1D1917]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#786E67]">
                            Kleine tekst eronder
                          </label>
                          <input
                            type="text"
                            value={card.sublabel}
                            onChange={(e) =>
                              updateCard(card.id, { sublabel: e.target.value })
                            }
                            className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm text-[#1D1917]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#786E67]">
                            Opent pagina
                          </label>
                          <select
                            value={card.targetPage}
                            onChange={(e) =>
                              updateCard(card.id, {
                                targetPage: e.target.value as Exclude<
                                  PageId,
                                  'home' | 'over-mira'
                                >,
                              })
                            }
                            className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm text-[#1D1917]"
                          >
                            {CATEGORY_PAGE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ALLE FOTO'S & PRODUCTEN */}
            {activeTab === 'fotos' && (
              <div className="mt-6 space-y-5">
                {/* Sub-tabs */}
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'portfolio', label: 'Portfolio & Voorbeelden' },
                      { id: 'rozen', label: 'Rozenboeketten foto’s' },
                      {
                        id: 'producten',
                        label: 'Trosrozen, Mixed & Extra’s',
                      },
                      { id: 'bruiloften', label: 'Bruiloften galerij' },
                      { id: 'over', label: 'Over ons foto & Logo' },
                    ] as { id: PhotoSubTab; label: string }[]
                  ).map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setPhotoSubTab(sub.id)}
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                        photoSubTab === sub.id
                          ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                          : 'border-[#E6E0D8] bg-white text-[#57504B] hover:text-[#1D1917]'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>

                {/* SUBTAB: PORTFOLIO & VOORBEELDEN */}
                {photoSubTab === 'portfolio' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E6E0D8] bg-white p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {PICKER_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setPortfolioFilter(cat.id)}
                            className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                              portfolioFilter === cat.id
                                ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                                : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#57504B]'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {portfolioFilter === 'alles' && (
                          <select
                            value={uploadPortfolioCategory}
                            onChange={(e) =>
                              setUploadPortfolioCategory(
                                e.target.value as Exclude<
                                  LookbookCategory,
                                  'alles'
                                >
                              )
                            }
                            aria-label="Categorie voor nieuwe foto"
                            className="rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                          >
                            <option value="rozenboeketten">
                              Bij Rozenboeketten
                            </option>
                            <option value="trosrozen">Bij Trosrozen</option>
                            <option value="mixed">Bij Mixed Bouquets</option>
                            <option value="extras">Bij Losse Extra’s</option>
                            <option value="bruiloften">Bij Bruiloften</option>
                          </select>
                        )}
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#5C1B28] px-3.5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#46131D]">
                          <Plus className="h-3.5 w-3.5" />
                          <span>Foto’s toevoegen</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleAddPortfolioUploads}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {filteredPortfolioPhotos.map((photo) => (
                        <div
                          key={photo.id}
                          className="flex gap-3 rounded-lg border border-[#E6E0D8] bg-white p-3"
                        >
                          <div className="flex shrink-0 flex-col items-center gap-1.5">
                            <img
                              src={photo.src}
                              alt={photo.title}
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              className="h-24 w-20 rounded-md border border-[#E6E0D8] object-cover"
                            />
                            <label className="inline-flex w-full cursor-pointer items-center justify-center gap-1 rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2 py-1 text-[11px] font-medium text-[#1D1917] hover:bg-[#EFEAE2]">
                              <Upload className="h-3 w-3" />
                              <span>Vervang</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleDirectUpload(e, (dataUrl) =>
                                    setDraft((prev) => ({
                                      ...prev,
                                      lookbookPhotos: prev.lookbookPhotos.map(
                                        (p) =>
                                          p.id === photo.id
                                            ? { ...p, src: dataUrl }
                                            : p
                                      ),
                                    }))
                                  )
                                }
                                className="sr-only"
                              />
                            </label>
                          </div>

                          <div className="flex flex-1 flex-col gap-2">
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  lookbookPhotos: prev.lookbookPhotos.map((p) =>
                                    p.id === photo.id
                                      ? { ...p, title: e.target.value }
                                      : p
                                  ),
                                }))
                              }
                              placeholder="Titel"
                              className="w-full rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-xs font-medium text-[#1D1917]"
                            />
                            <input
                              type="text"
                              value={photo.detail}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  lookbookPhotos: prev.lookbookPhotos.map((p) =>
                                    p.id === photo.id
                                      ? { ...p, detail: e.target.value }
                                      : p
                                  ),
                                }))
                              }
                              placeholder="Korte omschrijving"
                              className="w-full rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-xs text-[#57504B]"
                            />
                            <div className="flex items-center justify-between gap-2">
                              <select
                                value={photo.category}
                                onChange={(e) => {
                                  const nextCat = e.target.value as Exclude<
                                    LookbookCategory,
                                    'alles'
                                  >;
                                  setDraft((prev) => ({
                                    ...prev,
                                    lookbookPhotos: prev.lookbookPhotos.map(
                                      (p) =>
                                        p.id === photo.id
                                          ? {
                                              ...p,
                                              category: nextCat,
                                              categoryLabel:
                                                LOOKBOOK_CATEGORY_LABELS[
                                                  nextCat
                                                ],
                                            }
                                          : p
                                    ),
                                  }));
                                }}
                                className="rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2 py-1 text-[11px] text-[#1D1917]"
                              >
                                <option value="rozenboeketten">
                                  Rozenboeketten
                                </option>
                                <option value="trosrozen">Trosrozen</option>
                                <option value="mixed">Mixed Bouquets</option>
                                <option value="extras">Losse Extra’s</option>
                                <option value="bruiloften">Bruiloften</option>
                              </select>
                              <button
                                type="button"
                                onClick={() =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    lookbookPhotos: prev.lookbookPhotos.filter(
                                      (p) => p.id !== photo.id
                                    ),
                                  }))
                                }
                                aria-label="Verwijder foto"
                                className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-[#9B3B2B] hover:bg-[#9B3B2B]/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Verwijder</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB: ROZENBOEKETTEN FOTO'S */}
                {photoSubTab === 'rozen' && activeRoseColorObj && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E6E0D8] bg-white p-4">
                      <div className="flex flex-wrap gap-2">
                        {draft.roseColors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            onClick={() => setSelectedRoseColor(color.id)}
                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
                              selectedRoseColor === color.id
                                ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                                : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#1D1917]'
                            }`}
                          >
                            <span
                              className="h-3 w-3 rounded-full border border-black/15"
                              style={{ backgroundColor: color.swatchHex }}
                            />
                            <span>{color.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPickerCategory('rozenboeketten');
                            setPickTarget({
                              type: 'rose-add',
                              colorId: activeRoseColorObj.id,
                              label: `${activeRoseColorObj.name} (foto toevoegen)`,
                              currentSrc: '',
                            });
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#5C1B28] hover:bg-[#5C1B28] hover:text-[#FAF8F5]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Kies uit galerij</span>
                        </button>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#46131D]">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload nieuwe foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleDirectUpload(e, (dataUrl, cleanName) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  roseColors: prev.roseColors.map((c) =>
                                    c.id === activeRoseColorObj.id
                                      ? {
                                          ...c,
                                          images: [
                                            ...c.images,
                                            { src: dataUrl, caption: cleanName },
                                          ],
                                        }
                                      : c
                                  ),
                                }))
                              )
                            }
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Color Title / Description */}
                    <div className="rounded-lg border border-[#E6E0D8] bg-white p-4 space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs text-[#57504B]">
                            Naam rozenkleur
                          </label>
                          <input
                            type="text"
                            value={activeRoseColorObj.name}
                            onChange={(e) =>
                              setDraft((prev) => ({
                                ...prev,
                                roseColors: prev.roseColors.map((c) =>
                                  c.id === activeRoseColorObj.id
                                    ? { ...c, name: e.target.value }
                                    : c
                                ),
                              }))
                            }
                            className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm text-[#1D1917]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-[#57504B]">
                            Kleine subtitel
                          </label>
                          <input
                            type="text"
                            value={activeRoseColorObj.subtitle}
                            onChange={(e) =>
                              setDraft((prev) => ({
                                ...prev,
                                roseColors: prev.roseColors.map((c) =>
                                  c.id === activeRoseColorObj.id
                                    ? { ...c, subtitle: e.target.value }
                                    : c
                                ),
                              }))
                            }
                            className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm text-[#1D1917]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-[#57504B]">
                          Beschrijving
                        </label>
                        <textarea
                          rows={2}
                          value={activeRoseColorObj.description}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              roseColors: prev.roseColors.map((c) =>
                                c.id === activeRoseColorObj.id
                                  ? { ...c, description: e.target.value }
                                  : c
                              ),
                            }))
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm text-[#1D1917]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {activeRoseColorObj.images.map((img, idx) => (
                        <div
                          key={`${img.src}-${idx}`}
                          className="flex gap-3 rounded-lg border border-[#E6E0D8] bg-white p-3"
                        >
                          <img
                            src={img.src}
                            alt={img.caption}
                            referrerPolicy="no-referrer"
                            className="h-24 w-20 shrink-0 rounded-md border border-[#E6E0D8] object-cover"
                          />
                          <div className="flex flex-1 flex-col justify-between gap-2">
                            <input
                              type="text"
                              value={img.caption}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  roseColors: prev.roseColors.map((c) =>
                                    c.id === activeRoseColorObj.id
                                      ? {
                                          ...c,
                                          images: c.images.map((im, i) =>
                                            i === idx
                                              ? { ...im, caption: e.target.value }
                                              : im
                                          ),
                                        }
                                      : c
                                  ),
                                }))
                              }
                              placeholder="Onderschrift foto"
                              className="w-full rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                            />
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setPickerCategory('rozenboeketten');
                                  setPickTarget({
                                    type: 'rose-image',
                                    colorId: activeRoseColorObj.id,
                                    index: idx,
                                    label: `${activeRoseColorObj.name} #${idx + 1}`,
                                    currentSrc: img.src,
                                  });
                                }}
                                className="rounded border border-[#5C1B28] px-2 py-1 text-[11px] font-medium text-[#5C1B28] hover:bg-[#5C1B28] hover:text-white"
                              >
                                Kies foto
                              </button>
                              <label className="cursor-pointer rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2 py-1 text-[11px] font-medium text-[#1D1917] hover:bg-[#EFEAE2]">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleDirectUpload(e, (dataUrl) =>
                                      setDraft((prev) => ({
                                        ...prev,
                                        roseColors: prev.roseColors.map((c) =>
                                          c.id === activeRoseColorObj.id
                                            ? {
                                                ...c,
                                                images: c.images.map((im, i) =>
                                                  i === idx
                                                    ? { ...im, src: dataUrl }
                                                    : im
                                                ),
                                              }
                                            : c
                                        ),
                                      }))
                                    )
                                  }
                                  className="sr-only"
                                />
                              </label>
                              {activeRoseColorObj.images.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraft((prev) => ({
                                      ...prev,
                                      roseColors: prev.roseColors.map((c) =>
                                        c.id === activeRoseColorObj.id
                                          ? {
                                              ...c,
                                              images: c.images.filter(
                                                (_, i) => i !== idx
                                              ),
                                            }
                                          : c
                                      ),
                                    }))
                                  }
                                  className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-[#9B3B2B] hover:bg-[#9B3B2B]/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB: TROSROZEN, MIXED & EXTRA'S PRODUCTEN */}
                {photoSubTab === 'producten' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E6E0D8] bg-white p-4">
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            { id: 'trosrozen', label: 'Trosrozen' },
                            { id: 'mixed', label: 'Mixed Bouquets' },
                            { id: 'losse-extras', label: 'Losse Extra’s' },
                          ] as const
                        ).map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setProductFilter(cat.id)}
                            className={`rounded-md border px-3 py-1.5 text-xs font-medium ${
                              productFilter === cat.id
                                ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                                : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#1D1917]'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleAddCatalogProduct}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#5C1B28] px-3.5 py-2 text-xs font-medium text-[#FAF8F5] hover:bg-[#46131D]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Boeket / product toevoegen</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {filteredCatalogItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-col gap-4 rounded-lg border border-[#E6E0D8] bg-white p-4 sm:flex-row"
                        >
                          <div className="flex shrink-0 items-center gap-3 sm:flex-col">
                            <img
                              src={item.image}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="h-28 w-24 rounded-md border border-[#E6E0D8] object-cover"
                            />
                            <div className="flex flex-col gap-1.5 sm:w-full">
                              <button
                                type="button"
                                onClick={() => {
                                  setPickerCategory(
                                    item.category === 'losse-extras'
                                      ? 'extras'
                                      : item.category
                                  );
                                  setPickTarget({
                                    type: 'catalog-item',
                                    itemId: item.id,
                                    label: item.title,
                                    currentSrc: item.image,
                                  });
                                }}
                                className="rounded border border-[#5C1B28] px-2.5 py-1 text-[11px] font-medium text-[#5C1B28] hover:bg-[#5C1B28] hover:text-white"
                              >
                                Kies foto
                              </button>
                              <label className="cursor-pointer rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-center text-[11px] font-medium text-[#1D1917] hover:bg-[#EFEAE2]">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleDirectUpload(e, (dataUrl) =>
                                      setDraft((prev) => ({
                                        ...prev,
                                        catalogItems: prev.catalogItems.map(
                                          (ci) =>
                                            ci.id === item.id
                                              ? { ...ci, image: dataUrl }
                                              : ci
                                        ),
                                      }))
                                    )
                                  }
                                  className="sr-only"
                                />
                              </label>
                            </div>
                          </div>

                          <div className="flex-1 space-y-2.5">
                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    catalogItems: prev.catalogItems.map((ci) =>
                                      ci.id === item.id
                                        ? { ...ci, title: e.target.value }
                                        : ci
                                    ),
                                  }))
                                }
                                placeholder="Titel"
                                className="rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm font-medium text-[#1D1917]"
                              />
                              <input
                                type="text"
                                value={item.subtitle}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    catalogItems: prev.catalogItems.map((ci) =>
                                      ci.id === item.id
                                        ? { ...ci, subtitle: e.target.value }
                                        : ci
                                    ),
                                  }))
                                }
                                placeholder="Subtitel"
                                className="rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#57504B]"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={item.description}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  catalogItems: prev.catalogItems.map((ci) =>
                                    ci.id === item.id
                                      ? { ...ci, description: e.target.value }
                                      : ci
                                  ),
                                }))
                              }
                              placeholder="Omschrijving"
                              className="w-full rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#57504B]"
                            />
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <input
                                type="text"
                                value={item.note}
                                onChange={(e) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    catalogItems: prev.catalogItems.map((ci) =>
                                      ci.id === item.id
                                        ? { ...ci, note: e.target.value }
                                        : ci
                                    ),
                                  }))
                                }
                                placeholder="Kleine notitie"
                                className="flex-1 rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-xs text-[#57504B]"
                              />
                              {item.category !== 'losse-extras' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraft((prev) => ({
                                      ...prev,
                                      catalogItems: prev.catalogItems.filter(
                                        (ci) => ci.id !== item.id
                                      ),
                                    }))
                                  }
                                  className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs text-[#9B3B2B] hover:bg-[#9B3B2B]/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Verwijder</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB: BRUILOFTEN GALERIJ */}
                {photoSubTab === 'bruiloften' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E6E0D8] bg-white p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                        Foto’s op de Bruiloften pagina
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPickerCategory('bruiloften');
                            setPickTarget({
                              type: 'wedding-add',
                              label: 'Nieuwe bruiloft foto',
                              currentSrc: '',
                            });
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#5C1B28] hover:bg-[#5C1B28] hover:text-white"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Kies uit galerij</span>
                        </button>
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#FAF8F5] hover:bg-[#46131D]">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Upload trouwfoto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleDirectUpload(e, (dataUrl, cleanName) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  weddingGallery: [
                                    ...prev.weddingGallery,
                                    { src: dataUrl, title: cleanName },
                                  ],
                                }))
                              )
                            }
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {draft.weddingGallery.map((photo, idx) => (
                        <div
                          key={`${photo.src}-${idx}`}
                          className="flex gap-3 rounded-lg border border-[#E6E0D8] bg-white p-3"
                        >
                          <img
                            src={photo.src}
                            alt={photo.title}
                            referrerPolicy="no-referrer"
                            className="h-24 w-20 shrink-0 rounded-md border border-[#E6E0D8] object-cover"
                          />
                          <div className="flex flex-1 flex-col justify-between gap-2">
                            <input
                              type="text"
                              value={photo.title}
                              onChange={(e) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  weddingGallery: prev.weddingGallery.map(
                                    (w, i) =>
                                      i === idx
                                        ? { ...w, title: e.target.value }
                                        : w
                                  ),
                                }))
                              }
                              className="w-full rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                            />
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setPickerCategory('bruiloften');
                                  setPickTarget({
                                    type: 'wedding-item',
                                    index: idx,
                                    label: photo.title,
                                    currentSrc: photo.src,
                                  });
                                }}
                                className="rounded border border-[#5C1B28] px-2 py-1 text-[11px] font-medium text-[#5C1B28] hover:bg-[#5C1B28] hover:text-white"
                              >
                                Kies foto
                              </button>
                              <label className="cursor-pointer rounded border border-[#D4CBC0] bg-[#FAF8F5] px-2 py-1 text-[11px] font-medium text-[#1D1917] hover:bg-[#EFEAE2]">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleDirectUpload(e, (dataUrl) =>
                                      setDraft((prev) => ({
                                        ...prev,
                                        weddingGallery: prev.weddingGallery.map(
                                          (w, i) =>
                                            i === idx
                                              ? { ...w, src: dataUrl }
                                              : w
                                        ),
                                      }))
                                    )
                                  }
                                  className="sr-only"
                                />
                              </label>
                              {draft.weddingGallery.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraft((prev) => ({
                                      ...prev,
                                      weddingGallery: prev.weddingGallery.filter(
                                        (_, i) => i !== idx
                                      ),
                                    }))
                                  }
                                  className="ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-[#9B3B2B] hover:bg-[#9B3B2B]/10"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUBTAB: OVER ONS FOTO & LOGO */}
                {photoSubTab === 'over' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                        Foto bij Over ons verhaal
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <img
                          src={draft.aboutPhotoSrc}
                          alt="Over ons foto"
                          referrerPolicy="no-referrer"
                          className="h-28 w-24 rounded-md border border-[#E6E0D8] object-cover"
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPickerCategory('alles');
                              setPickTarget({
                                type: 'about-photo',
                                label: 'Over ons foto',
                                currentSrc: draft.aboutPhotoSrc,
                              });
                            }}
                            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#5C1B28] hover:bg-[#5C1B28] hover:text-white"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>Kies uit galerij</span>
                          </button>
                          <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-xs font-medium text-[#1D1917] hover:bg-[#EFEAE2]">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload nieuwe foto</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleDirectUpload(e, (dataUrl) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    aboutPhotoSrc: dataUrl,
                                  }))
                                )
                              }
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                      <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                        Logo afbeelding
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <img
                          src={draft.logoSrc}
                          alt="Logo"
                          referrerPolicy="no-referrer"
                          className="h-28 w-24 rounded-md border border-[#E6E0D8] bg-white object-contain p-2"
                        />
                        <div className="flex flex-col gap-2">
                          <label className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-[#5C1B28] px-3 py-1.5 text-xs font-medium text-[#5C1B28] hover:bg-[#5C1B28] hover:text-white">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload nieuw logo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleDirectUpload(e, (dataUrl) =>
                                  setDraft((prev) => ({
                                    ...prev,
                                    logoSrc: dataUrl,
                                  }))
                                )
                              }
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ALLE TEKSTEN */}
            {activeTab === 'teksten' && (
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    Logo-naam &amp; Bovenbalk
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs text-[#57504B]">
                        Merknaam deel 1
                      </label>
                      <input
                        type="text"
                        value={draft.texts.brandTitle}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            texts: { ...prev.texts, brandTitle: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#57504B]">
                        Merknaam deel 2 (cursief)
                      </label>
                      <input
                        type="text"
                        value={draft.texts.brandTitleItalic}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            texts: {
                              ...prev.texts,
                              brandTitleItalic: e.target.value,
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#57504B]">
                        Knop rechtsboven
                      </label>
                      <input
                        type="text"
                        value={draft.texts.navCtaLabel}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            texts: { ...prev.texts, navCtaLabel: e.target.value },
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                  </div>
                </div>

                {/* Het Verhaal & Praktische Info onderaan de voorpagina */}
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    Over ons / Verhaal onderaan de voorpagina
                  </p>
                  <div className="mt-3 space-y-3">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-[#57504B]">
                          Kleine kop erboven
                        </label>
                        <input
                          type="text"
                          value={draft.texts.about.eyebrow}
                          onChange={(e) =>
                            updateAboutText('eyebrow', e.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#57504B]">
                          Hoofdtitel verhaal
                        </label>
                        <input
                          type="text"
                          value={draft.texts.about.heading}
                          onChange={(e) =>
                            updateAboutText('heading', e.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#57504B]">
                        Alinea 1
                      </label>
                      <textarea
                        rows={3}
                        value={draft.texts.about.paragraph1}
                        onChange={(e) =>
                          updateAboutText('paragraph1', e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#57504B]">
                        Alinea 2
                      </label>
                      <textarea
                        rows={3}
                        value={draft.texts.about.paragraph2}
                        onChange={(e) =>
                          updateAboutText('paragraph2', e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                      <div>
                        <label className="block text-[11px] text-[#786E67]">
                          Kolom 1 titel
                        </label>
                        <input
                          type="text"
                          value={draft.texts.about.pickupLabel}
                          onChange={(e) =>
                            updateAboutText('pickupLabel', e.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                        <input
                          type="text"
                          value={draft.texts.about.pickupValue}
                          onChange={(e) =>
                            updateAboutText('pickupValue', e.target.value)
                          }
                          className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                        <input
                          type="text"
                          value={draft.texts.about.pickupNote}
                          onChange={(e) =>
                            updateAboutText('pickupNote', e.target.value)
                          }
                          className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#786E67]">
                          Kolom 2 titel &amp; subtekst
                        </label>
                        <input
                          type="text"
                          value={draft.texts.about.orderLabel}
                          onChange={(e) =>
                            updateAboutText('orderLabel', e.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                        <input
                          type="text"
                          value={draft.texts.about.orderNote}
                          onChange={(e) =>
                            updateAboutText('orderNote', e.target.value)
                          }
                          className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#786E67]">
                          Kolom 3 titel &amp; teksten
                        </label>
                        <input
                          type="text"
                          value={draft.texts.about.qualityLabel}
                          onChange={(e) =>
                            updateAboutText('qualityLabel', e.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                        <input
                          type="text"
                          value={draft.texts.about.qualityValue}
                          onChange={(e) =>
                            updateAboutText('qualityValue', e.target.value)
                          }
                          className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                        <input
                          type="text"
                          value={draft.texts.about.qualityNote}
                          onChange={(e) =>
                            updateAboutText('qualityNote', e.target.value)
                          }
                          className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1D1917]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#57504B]">
                        Link naar portfolio
                      </label>
                      <input
                        type="text"
                        value={draft.texts.about.portfolioLinkLabel}
                        onChange={(e) =>
                          updateAboutText('portfolioLinkLabel', e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                  </div>
                </div>

                {/* Paginatitels & Beschrijvingen */}
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    Teksten per categoriepagina
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="border-b border-[#E6E0D8] pb-4">
                      <p className="text-xs font-medium text-[#1D1917]">
                        Rozenboeketten pagina
                      </p>
                      <input
                        type="text"
                        value={draft.texts.pages.rozenTitle}
                        onChange={(e) =>
                          updatePageText('rozenTitle', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <textarea
                        rows={2}
                        value={draft.texts.pages.rozenDescription}
                        onChange={(e) =>
                          updatePageText('rozenDescription', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <input
                        type="text"
                        value={draft.texts.pages.rozenPackagingNote}
                        onChange={(e) =>
                          updatePageText('rozenPackagingNote', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-xs text-[#1D1917]"
                      />
                    </div>

                    <div className="border-b border-[#E6E0D8] pb-4">
                      <p className="text-xs font-medium text-[#1D1917]">
                        Trosrozen pagina
                      </p>
                      <input
                        type="text"
                        value={draft.texts.pages.trosrozenTitle}
                        onChange={(e) =>
                          updatePageText('trosrozenTitle', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <textarea
                        rows={2}
                        value={draft.texts.pages.trosrozenDescription}
                        onChange={(e) =>
                          updatePageText('trosrozenDescription', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>

                    <div className="border-b border-[#E6E0D8] pb-4">
                      <p className="text-xs font-medium text-[#1D1917]">
                        Mixed Bouquets pagina
                      </p>
                      <input
                        type="text"
                        value={draft.texts.pages.mixedTitle}
                        onChange={(e) =>
                          updatePageText('mixedTitle', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <textarea
                        rows={2}
                        value={draft.texts.pages.mixedDescription}
                        onChange={(e) =>
                          updatePageText('mixedDescription', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>

                    <div className="border-b border-[#E6E0D8] pb-4">
                      <p className="text-xs font-medium text-[#1D1917]">
                        Losse Extra’s pagina
                      </p>
                      <input
                        type="text"
                        value={draft.texts.pages.extrasTitle}
                        onChange={(e) =>
                          updatePageText('extrasTitle', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <textarea
                        rows={2}
                        value={draft.texts.pages.extrasDescription}
                        onChange={(e) =>
                          updatePageText('extrasDescription', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>

                    <div className="border-b border-[#E6E0D8] pb-4">
                      <p className="text-xs font-medium text-[#1D1917]">
                        Bruiloften pagina
                      </p>
                      <input
                        type="text"
                        value={draft.texts.pages.bruiloftenTitle}
                        onChange={(e) =>
                          updatePageText('bruiloftenTitle', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <textarea
                        rows={2}
                        value={draft.texts.pages.bruiloftenDescription}
                        onChange={(e) =>
                          updatePageText(
                            'bruiloftenDescription',
                            e.target.value
                          )
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <input
                        type="text"
                        value={draft.texts.pages.bruiloftenFormTitle}
                        onChange={(e) =>
                          updatePageText('bruiloftenFormTitle', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <textarea
                        rows={2}
                        value={draft.texts.pages.bruiloftenFormDescription}
                        onChange={(e) =>
                          updatePageText(
                            'bruiloftenFormDescription',
                            e.target.value
                          )
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-[#1D1917]">
                        Portfolio pagina
                      </p>
                      <input
                        type="text"
                        value={draft.texts.pages.portfolioTitle}
                        onChange={(e) =>
                          updatePageText('portfolioTitle', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                      <textarea
                        rows={2}
                        value={draft.texts.pages.portfolioDescription}
                        onChange={(e) =>
                          updatePageText('portfolioDescription', e.target.value)
                        }
                        className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer teksten */}
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    Footer onderaan de website
                  </p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-xs text-[#57504B]">
                        Korte omschrijving
                      </label>
                      <textarea
                        rows={2}
                        value={draft.texts.footer.description}
                        onChange={(e) =>
                          updateFooterText('description', e.target.value)
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs text-[#57504B]">
                          Afhaalregel
                        </label>
                        <input
                          type="text"
                          value={draft.texts.footer.pickupLine}
                          onChange={(e) =>
                            updateFooterText('pickupLine', e.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#57504B]">
                          Regel rechtsonder
                        </label>
                        <input
                          type="text"
                          value={draft.texts.footer.bottomNote}
                          onChange={(e) =>
                            updateFooterText('bottomNote', e.target.value)
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PRICING & SEASON */}
            {activeTab === 'prijzen' && (
              <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                    Actief tarief op de website
                  </p>
                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          prices: { ...prev.prices, activeSeason: 'standaard' },
                        }))
                      }
                      className={`rounded-md border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        draft.prices.activeSeason === 'standaard'
                          ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                          : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#1D1917]'
                      }`}
                    >
                      Standaard prijzenlijst
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((prev) => ({
                          ...prev,
                          prices: { ...prev.prices, activeSeason: 'valentijn' },
                        }))
                      }
                      className={`rounded-md border px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        draft.prices.activeSeason === 'valentijn'
                          ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                          : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#1D1917]'
                      }`}
                    >
                      Seizoen / Valentijnsdag tarief
                    </button>
                  </div>
                  {draft.prices.activeSeason === 'valentijn' && (
                    <div className="mt-3">
                      <label
                        htmlFor="season-label-input"
                        className="block text-xs font-medium text-[#57504B]"
                      >
                        Naam van het seizoenstarief
                      </label>
                      <input
                        id="season-label-input"
                        type="text"
                        value={draft.prices.seasonLabel}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            prices: {
                              ...prev.prices,
                              seasonLabel: e.target.value,
                            },
                          }))
                        }
                        className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-1.5 text-sm text-[#1D1917]"
                      />
                    </div>
                  )}
                </div>

                {/* Rose Prices Editor */}
                <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                      Rozenboeketten prijzen (€)
                    </p>
                    <div className="inline-flex rounded-md border border-[#E6E0D8] bg-[#FAF8F5] p-0.5">
                      <button
                        type="button"
                        onClick={() => setEditPriceSeasonTab('standaard')}
                        className={`rounded px-2.5 py-1 text-xs font-medium ${
                          editPriceSeasonTab === 'standaard'
                            ? 'bg-white text-[#1D1917] shadow-xs'
                            : 'text-[#57504B]'
                        }`}
                      >
                        Standaard
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditPriceSeasonTab('valentijn')}
                        className={`rounded px-2.5 py-1 text-xs font-medium ${
                          editPriceSeasonTab === 'valentijn'
                            ? 'bg-white text-[#1D1917] shadow-xs'
                            : 'text-[#57504B]'
                        }`}
                      >
                        Valentijnsdag
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {ROSE_QUANTITIES.map((qty) => (
                      <div key={qty}>
                        <label className="block text-xs text-[#57504B]">
                          {qty} rozen (€)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.roses[editPriceSeasonTab][qty]}
                          onChange={(e) =>
                            updateRosePrice(
                              editPriceSeasonTab,
                              qty,
                              e.target.value
                            )
                          }
                          className="mt-1 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1.5 text-sm tabular-nums text-[#1D1917]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Extras & Starting Prices */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                      Extra’s &amp; Losse verkoop (€)
                    </p>
                    <div className="mt-3 space-y-2.5">
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Losse sluier</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.standaloneExtras.losseSluier}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                standaloneExtras: {
                                  ...prev.prices.standaloneExtras,
                                  losseSluier: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Los lint</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.standaloneExtras.losLint}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                standaloneExtras: {
                                  ...prev.prices.standaloneExtras,
                                  losLint: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Sluier bij boeket</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.extrasWithBouquet.sluier}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                extrasWithBouquet: {
                                  ...prev.prices.extrasWithBouquet,
                                  sluier: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Lint bij boeket</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.extrasWithBouquet.lint}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                extrasWithBouquet: {
                                  ...prev.prices.extrasWithBouquet,
                                  lint: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Gipsnaam / letters</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.extrasWithBouquet.gipsnaam}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                extrasWithBouquet: {
                                  ...prev.prices.extrasWithBouquet,
                                  gipsnaam: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Gipskruid rand</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.extrasWithBouquet.gipsrand}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                extrasWithBouquet: {
                                  ...prev.prices.extrasWithBouquet,
                                  gipsrand: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#E6E0D8] bg-white p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#57504B]">
                      Vanaf-prijzen overige categorieën (€)
                    </p>
                    <div className="mt-3 space-y-2.5">
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Trosrozen (vanaf)</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.startingPrices.trosrozen}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                startingPrices: {
                                  ...prev.prices.startingPrices,
                                  trosrozen: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Mixed bouquets (vanaf)</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.startingPrices.mixed}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                startingPrices: {
                                  ...prev.prices.startingPrices,
                                  mixed: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                      <label className="flex items-center justify-between gap-2 text-xs text-[#1D1917]">
                        <span>Bloemenmanden (vanaf)</span>
                        <input
                          type="number"
                          min={0}
                          value={draft.prices.startingPrices.manden}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              prices: {
                                ...prev.prices,
                                startingPrices: {
                                  ...prev.prices.startingPrices,
                                  manden: Number(e.target.value) || 0,
                                },
                              },
                            }))
                          }
                          className="w-24 rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-2.5 py-1 text-right text-sm tabular-nums"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Save Action Only */}
        <div className="mt-6 flex items-center justify-end border-t border-[#E6E0D8] pt-5">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-[#5C1B28] px-5 py-2.5 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#46131D]"
          >
            {savedNotice ? (
              <>
                <Check className="h-4 w-4" />
                <span>Wijzigingen opgeslagen</span>
              </>
            ) : (
              <span>Wijzigingen toepassen</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
