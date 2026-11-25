import { ArrowLeft, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  buildOrderChatUrl,
  formatEuro,
  isWhatsAppConfigured,
  PageId,
  RoseColorId,
  RoseQuantity,
  SiteConfig,
} from '../data/catalog';

interface RoseConfiguratorProps {
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
  onSubmitOrder: (title: string, message: string) => void;
}

const QUANTITIES: { qty: RoseQuantity; popular?: boolean }[] = [
  { qty: 20 },
  { qty: 30 },
  { qty: 40 },
  { qty: 50, popular: true },
  { qty: 60 },
  { qty: 80 },
  { qty: 100, popular: true },
];

export function RoseConfigurator({
  siteConfig,
  onNavigate,
  onSubmitOrder,
}: RoseConfiguratorProps) {
  const priceConfig = siteConfig.prices;
  const [selectedColorId, setSelectedColorId] = useState<RoseColorId>('rood');
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [quantity, setQuantity] = useState<RoseQuantity>(50);
  const [customColorNote, setCustomColorNote] = useState('');

  // Extras
  const [addSluier, setAddSluier] = useState(false);
  const [sluierTekst, setSluierTekst] = useState('');
  const [addLint, setAddLint] = useState(false);
  const [lintTekst, setLintTekst] = useState('');
  const [addGipsNaam, setAddGipsNaam] = useState(false);
  const [gipsNaamTekst, setGipsNaamTekst] = useState('');
  const [addGipsRand, setAddGipsRand] = useState(false);

  const [pickupDate, setPickupDate] = useState('');
  const [extraWensen, setExtraWensen] = useState('');

  const roseColors = siteConfig.roseColors;
  const activeColor =
    roseColors.find((c) => c.id === selectedColorId) ?? roseColors[0];

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [selectedColorId]);

  const activePrices = priceConfig.roses[priceConfig.activeSeason];
  const basePrice = activeColor.onRequestOnly ? null : activePrices[quantity];

  const extrasTotal =
    (addSluier ? priceConfig.extrasWithBouquet.sluier : 0) +
    (addLint ? priceConfig.extrasWithBouquet.lint : 0) +
    (addGipsNaam ? priceConfig.extrasWithBouquet.gipsnaam : 0) +
    (addGipsRand ? priceConfig.extrasWithBouquet.gipsrand : 0);

  const totalPrice = basePrice !== null ? basePrice + extrasTotal : null;

  const currentImage =
    activeColor.images[activePhotoIndex] ?? activeColor.images[0];

  const buildOrderMessage = () => {
    const lines: string[] = [
      `Hoi MIRA Blooms! Ik wil graag een rozenboeket bestellen:`,
      ``,
      `• Categorie: Rozenboeket — ${activeColor.name}`,
      `• Aantal rozen: ${quantity} stuks`,
    ];

    if (activeColor.onRequestOnly) {
      lines.push(
        `• Gewenste kleur: ${customColorNote.trim() || 'Bijzondere kleur (in overleg)'}`
      );
    }

    const chosenExtras: string[] = [];
    if (addSluier) {
      chosenExtras.push(
        `Sluier / veil (+${formatEuro(priceConfig.extrasWithBouquet.sluier)})${
          sluierTekst.trim() ? ` — tekst: "${sluierTekst.trim()}"` : ''
        }`
      );
    }
    if (addLint) {
      chosenExtras.push(
        `Gepersonaliseerd lint (+${formatEuro(priceConfig.extrasWithBouquet.lint)})${
          lintTekst.trim() ? ` — tekst: "${lintTekst.trim()}"` : ''
        }`
      );
    }
    if (addGipsNaam) {
      chosenExtras.push(
        `Gipskruid letters / naam (+${formatEuro(priceConfig.extrasWithBouquet.gipsnaam)})${
          gipsNaamTekst.trim() ? ` — naam/letters: "${gipsNaamTekst.trim()}"` : ''
        }`
      );
    }
    if (addGipsRand) {
      chosenExtras.push(
        `Gipskruid rand rondom (+${formatEuro(priceConfig.extrasWithBouquet.gipsrand)})`
      );
    }

    if (chosenExtras.length > 0) {
      lines.push(`• Extra’s:`);
      chosenExtras.forEach((ex) => lines.push(`  - ${ex}`));
    } else {
      lines.push(`• Extra’s: Geen extra’s`);
    }

    if (totalPrice !== null) {
      lines.push(
        `• Richtprijs (${
          priceConfig.activeSeason === 'valentijn'
            ? priceConfig.seasonLabel
            : 'standaard tarief'
        }): ${formatEuro(totalPrice)}`
      );
    } else {
      lines.push(`• Prijs: Op aanvraag (afhankelijk van kleur & veilingdag)`);
    }

    if (pickupDate.trim()) {
      lines.push(`• Gewenste afhaaldatum (Lisserbroek): ${pickupDate.trim()}`);
    }
    if (extraWensen.trim()) {
      lines.push(`• Opmerking: ${extraWensen.trim()}`);
    }

    lines.push(``, `Laat gerust weten of dit op deze datum lukt!`);
    return lines.join('\n');
  };

  const orderMessage = buildOrderMessage();
  const orderHref = buildOrderChatUrl(siteConfig, orderMessage);
  const usingWhatsApp = isWhatsAppConfigured(siteConfig);

  const handleOrder = () => {
    onSubmitOrder(
      `Rozenboeket (${quantity} ${activeColor.name.toLowerCase()})`,
      orderMessage
    );
  };

  return (
    <section
      id="rozenboeketten"
      className="min-h-[calc(100vh-4.5rem)] bg-[#FAF8F5] py-10 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#786E67] transition-colors hover:text-[#1D1917]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Terug naar voorpagina</span>
        </button>

        {/* Page Header */}
        <div className="mt-4 flex flex-col justify-between gap-4 border-b border-[#E6E0D8] pb-8 md:flex-row md:items-end">
          <div>
            <h1
              className="font-display text-3xl font-medium text-[#1D1917] sm:text-5xl"
              style={{ textWrap: 'balance' }}
            >
              {siteConfig.texts.pages.rozenTitle}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-[#57504B]">
              {siteConfig.texts.pages.rozenDescription}
            </p>
          </div>
          <div className="text-sm text-[#57504B] md:text-right">
            <p>
              Actief tarief:{' '}
              <span className="font-medium text-[#1D1917]">
                {priceConfig.activeSeason === 'valentijn'
                  ? priceConfig.seasonLabel
                  : 'Standaard prijzenlijst'}
              </span>
            </p>
            <p className="text-xs text-[#786E67]">
              {siteConfig.texts.pages.rozenPackagingNote}
            </p>
          </div>
        </div>

        {/* Color Tabs */}
        <div
          role="tablist"
          aria-label="Kies rozenkleur"
          className="mt-8 flex flex-wrap gap-2"
        >
          {roseColors.map((color) => {
            const isSelected = color.id === selectedColorId;
            return (
              <button
                key={color.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedColorId(color.id)}
                className={`inline-flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'border-[#5C1B28] bg-[#5C1B28] text-[#FAF8F5]'
                    : 'border-[#E6E0D8] bg-white text-[#1D1917] hover:border-[#C9BFB5] hover:bg-[#F2EFEA]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: color.swatchHex }}
                />
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Split: Left Gallery + Right Configurator */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: Photo Showcase for Selected Color */}
          <div className="lg:col-span-6">
            {currentImage && (
              <>
                <div className="relative overflow-hidden rounded-lg bg-[#EDE7DF]">
                  <img
                    src={currentImage.src}
                    alt={currentImage.caption}
                    referrerPolicy="no-referrer"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  {activeColor.images.length > 1 && (
                    <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between pointer-events-none">
                      <button
                        type="button"
                        aria-label="Vorige foto"
                        onClick={() =>
                          setActivePhotoIndex((prev) =>
                            prev === 0 ? activeColor.images.length - 1 : prev - 1
                          )
                        }
                        className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1D1917] shadow-sm transition-colors hover:bg-white"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Volgende foto"
                        onClick={() =>
                          setActivePhotoIndex((prev) =>
                            prev === activeColor.images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF8F5]/90 text-[#1D1917] shadow-sm transition-colors hover:bg-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm text-[#57504B]">{currentImage.caption}</p>

                {/* Thumbnails */}
                <div className="mt-4 grid grid-cols-6 gap-2">
                  {activeColor.images.map((img, idx) => (
                    <button
                      key={`${img.src}-${idx}`}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      aria-label={`Bekijk foto ${idx + 1}: ${img.caption}`}
                      className={`overflow-hidden rounded-md border transition-all ${
                        idx === activePhotoIndex
                          ? 'border-[#5C1B28] ring-1 ring-[#5C1B28]'
                          : 'border-[#E6E0D8] opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.src}
                        alt={img.caption}
                        referrerPolicy="no-referrer"
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right: Color Info, Quantity Selector, Extras & Order CTA */}
          <div className="lg:col-span-6">
            <div className="rounded-lg border border-[#E6E0D8] bg-white p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
                {activeColor.subtitle}
              </p>
              <h3 className="mt-1 font-display text-3xl font-medium text-[#1D1917]">
                {activeColor.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#57504B]">
                {activeColor.description}
              </p>

              {activeColor.onRequestOnly && (
                <div className="mt-5">
                  <label
                    htmlFor="custom-color-input"
                    className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                  >
                    Welke bijzondere kleur zoek je?
                  </label>
                  <input
                    id="custom-color-input"
                    type="text"
                    value={customColorNote}
                    onChange={(e) => setCustomColorNote(e.target.value)}
                    placeholder="Bijv. lichtblauw, lila, dieppaars of tweekleurig"
                    className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-[#1D1917] placeholder:text-[#9A9088] focus:border-[#5C1B28] focus:outline-none"
                  />
                </div>
              )}

              {/* Quantity & Fixed Prices */}
              <div className="mt-7 border-t border-[#E6E0D8] pt-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-[#1D1917]">
                    1. Kies het aantal rozen
                  </span>
                  <span className="text-xs text-[#786E67]">
                    50, 80 &amp; 100 worden het meest gekozen
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {QUANTITIES.map(({ qty }) => {
                    const selected = quantity === qty;
                    const price = activeColor.onRequestOnly
                      ? null
                      : activePrices[qty];
                    return (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setQuantity(qty)}
                        className={`flex flex-col items-start rounded-md border px-3.5 py-2.5 text-left transition-colors ${
                          selected
                            ? 'border-[#5C1B28] bg-[#5C1B28]/5 text-[#1D1917]'
                            : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#1D1917] hover:border-[#C9BFB5]'
                        }`}
                      >
                        <span className="text-sm font-semibold tabular-nums">
                          {qty} rozen
                        </span>
                        <span className="mt-0.5 text-xs text-[#57504B] tabular-nums">
                          {price !== null ? formatEuro(price) : 'Op aanvraag'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Extras */}
              <div className="mt-7 border-t border-[#E6E0D8] pt-6">
                <span className="block text-sm font-semibold text-[#1D1917]">
                  2. Voeg persoonlijke extra’s toe (optioneel)
                </span>
                <p className="mt-0.5 text-xs text-[#786E67]">
                  Sluier en lint zijn eventueel ook los verkrijgbaar onderaan bij extra’s.
                </p>

                <div className="mt-3.5 space-y-3">
                  {/* Sluier */}
                  <div className="rounded-md border border-[#E6E0D8] bg-[#FAF8F5] p-3.5">
                    <label className="flex cursor-pointer items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addSluier}
                          onChange={(e) => setAddSluier(e.target.checked)}
                          className="h-4 w-4 accent-[#5C1B28]"
                        />
                        <span className="text-sm font-medium text-[#1D1917]">
                          Sluier (veil) over het boeket
                        </span>
                      </span>
                      <span className="text-sm font-medium text-[#57504B] tabular-nums">
                        +{formatEuro(priceConfig.extrasWithBouquet.sluier)}
                      </span>
                    </label>
                    {addSluier && (
                      <input
                        type="text"
                        value={sluierTekst}
                        onChange={(e) => setSluierTekst(e.target.value)}
                        placeholder="Optionele tekst op de sluier (bijv. My most beautiful dua)"
                        className="mt-2.5 w-full rounded-md border border-[#D4CBC0] bg-white px-3 py-2 text-sm text-[#1D1917] placeholder:text-[#9A9088] focus:border-[#5C1B28] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Lint */}
                  <div className="rounded-md border border-[#E6E0D8] bg-[#FAF8F5] p-3.5">
                    <label className="flex cursor-pointer items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addLint}
                          onChange={(e) => setAddLint(e.target.checked)}
                          className="h-4 w-4 accent-[#5C1B28]"
                        />
                        <span className="text-sm font-medium text-[#1D1917]">
                          Gepersonaliseerd satijnen lint
                        </span>
                      </span>
                      <span className="text-sm font-medium text-[#57504B] tabular-nums">
                        +{formatEuro(priceConfig.extrasWithBouquet.lint)}
                      </span>
                    </label>
                    {addLint && (
                      <input
                        type="text"
                        value={lintTekst}
                        onChange={(e) => setLintTekst(e.target.value)}
                        placeholder="Tekst voor op het lint (bijv. Fouad ♥ Bahija of Eid Mubarak)"
                        className="mt-2.5 w-full rounded-md border border-[#D4CBC0] bg-white px-3 py-2 text-sm text-[#1D1917] placeholder:text-[#9A9088] focus:border-[#5C1B28] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Gipskruid naam / letters */}
                  <div className="rounded-md border border-[#E6E0D8] bg-[#FAF8F5] p-3.5">
                    <label className="flex cursor-pointer items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addGipsNaam}
                          onChange={(e) => setAddGipsNaam(e.target.checked)}
                          className="h-4 w-4 accent-[#5C1B28]"
                        />
                        <span className="text-sm font-medium text-[#1D1917]">
                          Letter of naam in gipskruid
                        </span>
                      </span>
                      <span className="text-sm font-medium text-[#57504B] tabular-nums">
                        +{formatEuro(priceConfig.extrasWithBouquet.gipsnaam)}
                      </span>
                    </label>
                    {addGipsNaam && (
                      <input
                        type="text"
                        value={gipsNaamTekst}
                        onChange={(e) => setGipsNaamTekst(e.target.value)}
                        placeholder="Naam of initialen (bijv. Sara of H ♥ C)"
                        className="mt-2.5 w-full rounded-md border border-[#D4CBC0] bg-white px-3 py-2 text-sm text-[#1D1917] placeholder:text-[#9A9088] focus:border-[#5C1B28] focus:outline-none"
                      />
                    )}
                  </div>

                  {/* Gipskruid rand */}
                  <div className="rounded-md border border-[#E6E0D8] bg-[#FAF8F5] p-3.5">
                    <label className="flex cursor-pointer items-center justify-between gap-3">
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={addGipsRand}
                          onChange={(e) => setAddGipsRand(e.target.checked)}
                          className="h-4 w-4 accent-[#5C1B28]"
                        />
                        <span className="text-sm font-medium text-[#1D1917]">
                          Gipskruid rand rondom het boeket
                        </span>
                      </span>
                      <span className="text-sm font-medium text-[#57504B] tabular-nums">
                        +{formatEuro(priceConfig.extrasWithBouquet.gipsrand)}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Date & Notes */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="rose-pickup-date"
                    className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                  >
                    Gewenste afhaaldatum
                  </label>
                  <input
                    id="rose-pickup-date"
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="rose-extra-notes"
                    className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                  >
                    Papierkleur of opmerking
                  </label>
                  <input
                    id="rose-extra-notes"
                    type="text"
                    value={extraWensen}
                    onChange={(e) => setExtraWensen(e.target.value)}
                    placeholder="Bijv. zwart papier of wit papier"
                    className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] placeholder:text-[#9A9088] focus:border-[#5C1B28] focus:outline-none"
                  />
                </div>
              </div>

              {/* Price Summary & CTA */}
              <div className="mt-7 border-t border-[#E6E0D8] pt-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#1D1917]">
                      {quantity} {activeColor.name.toLowerCase()}
                    </p>
                    <p className="text-xs text-[#786E67]">
                      Afhalen op afspraak in Lisserbroek
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-3xl font-semibold text-[#1D1917] tabular-nums">
                      {totalPrice !== null ? formatEuro(totalPrice) : 'Op aanvraag'}
                    </p>
                  </div>
                </div>

                <a
                  href={orderHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOrder}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#5C1B28] px-6 py-3.5 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#46131D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C1B28] focus-visible:ring-offset-2"
                >
                  <Check className="h-4 w-4" />
                  <span>
                    {usingWhatsApp
                      ? 'Direct bestellen via WhatsApp'
                      : 'Direct bestellen via Instagram DM'}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
