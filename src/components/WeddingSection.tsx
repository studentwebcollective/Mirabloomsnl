import { ArrowLeft } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  buildOrderChatUrl,
  isWhatsAppConfigured,
  PageId,
  SiteConfig,
} from '../data/catalog';

interface WeddingSectionProps {
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
  onSubmitOrder: (title: string, message: string) => void;
}

const OCCASION_TYPES = [
  'Bruidsboeket',
  'Trouwauto decoratie',
  'Tafeldecoratie & bloemstukken',
  'Nikah / Verlovingsboeket',
  'Speciale gelegenheid / diner',
];

export function WeddingSection({
  siteConfig,
  onNavigate,
  onSubmitOrder,
}: WeddingSectionProps) {
  const [name, setName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'Bruidsboeket',
  ]);
  const [colorStyle, setColorStyle] = useState('');
  const [budget, setBudget] = useState('€250 – €500');
  const [notes, setNotes] = useState('');
  const dmAnchorRef = useRef<HTMLAnchorElement>(null);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  };

  const buildInquiryMessage = () => {
    const lines = [
      `Hoi MIRA Blooms! Ik wil graag een vrijblijvende aanvraag doen voor bruids- of gelegenheidsbloemwerk:`,
      ``,
      `• Naam: ${name.trim() || 'Niet ingevuld'}`,
      `• Datum gelegenheid: ${eventDate.trim() || 'Nog te bepalen'}`,
      `• Type bloemwerk: ${
        selectedTypes.length > 0 ? selectedTypes.join(', ') : 'In overleg'
      }`,
      `• Kleurenpalet / stijl: ${colorStyle.trim() || 'In overleg'}`,
      `• Richtbudget: ${budget}`,
    ];

    if (notes.trim()) {
      lines.push(`• Wensen / toelichting: ${notes.trim()}`);
    }

    lines.push(
      ``,
      `Ik stuur in dit gesprek eventueel ook graag mijn inspiratiefoto’s mee!`
    );
    return lines.join('\n');
  };

  const inquiryMessage = buildInquiryMessage();
  const inquiryHref = buildOrderChatUrl(siteConfig, inquiryMessage);
  const usingWhatsApp = isWhatsAppConfigured(siteConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOrder('Aanvraag Bruiloft & Events', inquiryMessage);
    dmAnchorRef.current?.click();
  };

  return (
    <section
      id="bruiloften"
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

        <div className="mt-4 border-b border-[#E6E0D8] pb-8">
          <h1
            className="font-display text-3xl font-medium text-[#1D1917] sm:text-5xl"
            style={{ textWrap: 'balance' }}
          >
            {siteConfig.texts.pages.bruiloftenTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#57504B] sm:text-base">
            {siteConfig.texts.pages.bruiloftenDescription}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: Real Wedding & Car Decor Gallery */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-6">
            {siteConfig.weddingGallery.map((photo, idx) => (
              <figure
                key={`${photo.src}-${idx}`}
                className="overflow-hidden rounded-lg border border-[#E6E0D8] bg-white"
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="aspect-[4/5] w-full object-cover"
                />
                <figcaption className="px-3 py-2.5 text-xs font-medium text-[#57504B]">
                  {photo.title}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Right: Inquiry Form */}
          <div className="lg:col-span-6">
            <form
              onSubmit={handleSubmit}
              className="rounded-lg border border-[#E6E0D8] bg-white p-6 sm:p-8"
            >
              <h2 className="font-display text-2xl font-medium text-[#1D1917]">
                {siteConfig.texts.pages.bruiloftenFormTitle}
              </h2>
              <p className="mt-1.5 text-sm text-[#57504B]">
                {siteConfig.texts.pages.bruiloftenFormDescription}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="wedding-name"
                    className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                  >
                    Jouw naam
                  </label>
                  <input
                    id="wedding-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bijv. Amira"
                    className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="wedding-date"
                    className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                  >
                    Datum gelegenheid
                  </label>
                  <input
                    id="wedding-date"
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-5">
                <span className="block text-xs font-medium uppercase tracking-wider text-[#57504B]">
                  Waar ben je naar op zoek?
                </span>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {OCCASION_TYPES.map((type) => {
                    const active = selectedTypes.includes(type);
                    return (
                      <label
                        key={type}
                        className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                          active
                            ? 'border-[#5C1B28] bg-[#5C1B28]/5 text-[#1D1917]'
                            : 'border-[#E6E0D8] bg-[#FAF8F5] text-[#57504B]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleType(type)}
                          className="h-4 w-4 accent-[#5C1B28]"
                        />
                        <span>{type}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="wedding-colors"
                    className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                  >
                    Kleuren &amp; bloemstijl
                  </label>
                  <input
                    id="wedding-colors"
                    type="text"
                    value={colorStyle}
                    onChange={(e) => setColorStyle(e.target.value)}
                    placeholder="Bijv. ivoorwit, blush & eucalyptus"
                    className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="wedding-budget"
                    className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                  >
                    Richtbudget
                  </label>
                  <select
                    id="wedding-budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                  >
                    <option>€150 – €250</option>
                    <option>€250 – €500</option>
                    <option>€500 – €900</option>
                    <option>€900+ (volledige aankleding)</option>
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="wedding-notes"
                  className="block text-xs font-medium uppercase tracking-wider text-[#57504B]"
                >
                  Wensen, aantallen of inspiratiefoto’s
                </label>
                <textarea
                  id="wedding-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Vertel iets over het aantal tafels, het gewenste bruidsboeket of geef aan dat je foto’s wilt sturen via Instagram."
                  className="mt-1.5 w-full rounded-md border border-[#D4CBC0] bg-[#FAF8F5] px-3 py-2 text-sm text-[#1D1917] focus:border-[#5C1B28] focus:outline-none"
                />
              </div>

              <a
                ref={dmAnchorRef}
                href={inquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              >
                Open chat
              </a>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-[#5C1B28] px-5 py-3 text-sm font-medium text-[#FAF8F5] transition-colors hover:bg-[#46131D]"
              >
                {usingWhatsApp ? 'Direct naar WhatsApp' : 'Direct naar Instagram DM'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
