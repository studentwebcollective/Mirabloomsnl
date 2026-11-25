import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  INSTAGRAM_HANDLE,
  isWhatsAppConfigured,
  PageId,
  SiteConfig,
} from '../data/catalog';
import { LookbookGallery } from './LookbookGallery';

interface AboutStoryBlockProps {
  siteConfig: SiteConfig;
  onNavigate?: (page: PageId) => void;
  showPortfolioLink?: boolean;
  asHeadingLevel?: 'h1' | 'h2';
}

export function AboutStoryBlock({
  siteConfig,
  onNavigate,
  showPortfolioLink = false,
  asHeadingLevel = 'h2',
}: AboutStoryBlockProps) {
  const usingWhatsApp = isWhatsAppConfigured(siteConfig);
  const HeadingTag = asHeadingLevel;
  const aboutTexts = siteConfig.texts.about;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
      {/* Brand Emblem & Portrait Bouquet */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
        <div className="flex items-center justify-center overflow-hidden rounded-lg border border-[#E6E0D8] bg-white p-6">
          <img
            src={siteConfig.logoSrc}
            alt="MIRA Blooms logo"
            referrerPolicy="no-referrer"
            className="max-h-56 w-auto object-contain"
          />
        </div>
        <div className="overflow-hidden rounded-lg border border-[#E6E0D8] bg-[#EDE7DF]">
          <img
            src={siteConfig.aboutPhotoSrc}
            alt="MIRA Blooms boeket"
            referrerPolicy="no-referrer"
            className="h-64 w-full object-cover sm:h-full"
          />
        </div>
      </div>

      {/* Brand Story & Practical Pickup Info */}
      <div className="lg:col-span-7">
        <p className="text-xs font-medium uppercase tracking-widest text-[#786E67]">
          {aboutTexts.eyebrow}
        </p>
        <HeadingTag
          className="mt-2 font-display text-3xl font-medium text-[#1D1917] sm:text-4xl lg:text-5xl"
          style={{ textWrap: 'balance' }}
        >
          {aboutTexts.heading}
        </HeadingTag>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#57504B] sm:text-base">
          <p>{aboutTexts.paragraph1}</p>
          <p>{aboutTexts.paragraph2}</p>
        </div>

        {/* Pickup & Order Practicalities */}
        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#E6E0D8] pt-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
              {aboutTexts.pickupLabel}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1D1917]">
              {aboutTexts.pickupValue}
            </p>
            <p className="mt-0.5 text-xs text-[#57504B]">
              {aboutTexts.pickupNote}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
              {aboutTexts.orderLabel}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1D1917]">
              {usingWhatsApp ? 'Via WhatsApp' : 'Via Instagram DM'}
            </p>
            <p className="mt-0.5 text-xs text-[#57504B]">
              {aboutTexts.orderNote || `@${INSTAGRAM_HANDLE}`}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[#786E67]">
              {aboutTexts.qualityLabel}
            </p>
            <p className="mt-1 text-sm font-medium text-[#1D1917]">
              {aboutTexts.qualityValue}
            </p>
            <p className="mt-0.5 text-xs text-[#57504B]">
              {aboutTexts.qualityNote}
            </p>
          </div>
        </div>

        {showPortfolioLink && onNavigate && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavigate('over-mira')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C1B28] underline underline-offset-4 transition-colors hover:text-[#1D1917]"
            >
              <span>{aboutTexts.portfolioLinkLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface AboutSectionProps {
  siteConfig: SiteConfig;
  onNavigate: (page: PageId) => void;
  onSubmitOrder: (title: string, message: string) => void;
}

export function AboutSection({
  siteConfig,
  onNavigate,
  onSubmitOrder,
}: AboutSectionProps) {
  return (
    <div className="bg-[#FAF8F5]">
      <section className="border-b border-[#E6E0D8] bg-[#F2EFEA]/60 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#786E67] transition-colors hover:text-[#1D1917]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Terug naar voorpagina</span>
          </button>

          <div className="mt-8">
            <AboutStoryBlock siteConfig={siteConfig} asHeadingLevel="h1" />
          </div>
        </div>
      </section>

      <LookbookGallery siteConfig={siteConfig} onSubmitOrder={onSubmitOrder} />
    </div>
  );
}
