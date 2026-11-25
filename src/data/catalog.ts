export type SeasonMode = 'standaard' | 'valentijn';

export type PageId =
  | 'home'
  | 'rozenboeketten'
  | 'trosrozen'
  | 'mixed'
  | 'extras'
  | 'bruiloften'
  | 'over-mira';

export type RoseColorId = 'rood' | 'wit' | 'roze' | 'bijzonder';

export type RoseQuantity = 20 | 30 | 40 | 50 | 60 | 80 | 100;

export interface RoseExtraPrices {
  sluier: number;
  lint: number;
  gipsnaam: number;
  gipsrand: number;
}

export interface StandaloneExtraPrices {
  losseSluier: number;
  losLint: number;
}

export interface PriceConfig {
  activeSeason: SeasonMode;
  seasonLabel: string;
  roses: {
    standaard: Record<RoseQuantity, number>;
    valentijn: Record<RoseQuantity, number>;
  };
  extrasWithBouquet: RoseExtraPrices;
  standaloneExtras: StandaloneExtraPrices;
  startingPrices: {
    trosrozen: number;
    mixed: number;
    manden: number;
  };
}

export interface HomepageCardConfig {
  id: string;
  targetPage: Exclude<PageId, 'home' | 'over-mira'>;
  label: string;
  sublabel: string;
  imageSrc: string;
}

export type OrderChannel = 'instagram' | 'whatsapp';

export interface SiteTexts {
  brandTitle: string;
  brandTitleItalic: string;
  navCtaLabel: string;
  about: {
    eyebrow: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    pickupLabel: string;
    pickupValue: string;
    pickupNote: string;
    orderLabel: string;
    orderNote: string;
    qualityLabel: string;
    qualityValue: string;
    qualityNote: string;
    portfolioLinkLabel: string;
  };
  pages: {
    rozenTitle: string;
    rozenDescription: string;
    rozenPackagingNote: string;
    trosrozenTitle: string;
    trosrozenDescription: string;
    mixedTitle: string;
    mixedDescription: string;
    extrasTitle: string;
    extrasDescription: string;
    bruiloftenTitle: string;
    bruiloftenDescription: string;
    bruiloftenFormTitle: string;
    bruiloftenFormDescription: string;
    portfolioTitle: string;
    portfolioDescription: string;
  };
  footer: {
    description: string;
    pickupLine: string;
    bottomNote: string;
  };
}

export interface WeddingGalleryItem {
  src: string;
  title: string;
}

export interface SiteConfig {
  heroSubtitle: string;
  heroCtaLabel: string;
  orderChannel: OrderChannel;
  whatsappNumber: string;
  logoSrc: string;
  aboutPhotoSrc: string;
  homepageCards: HomepageCardConfig[];
  roseColors: RoseColorOption[];
  catalogItems: CatalogItem[];
  weddingGallery: WeddingGalleryItem[];
  lookbookPhotos: LookbookPhoto[];
  prices: PriceConfig;
  texts: SiteTexts;
}

export const DEFAULT_PRICE_CONFIG: PriceConfig = {
  activeSeason: 'standaard',
  seasonLabel: 'Valentijnstarief (Seizoensprijzen)',
  roses: {
    standaard: {
      20: 45,
      30: 65,
      40: 85,
      50: 105,
      60: 125,
      80: 165,
      100: 195,
    },
    valentijn: {
      20: 65,
      30: 95,
      40: 120,
      50: 145,
      60: 175,
      80: 225,
      100: 265,
    },
  },
  extrasWithBouquet: {
    sluier: 25,
    lint: 15,
    gipsnaam: 20,
    gipsrand: 15,
  },
  standaloneExtras: {
    losseSluier: 25,
    losLint: 15,
  },
  startingPrices: {
    trosrozen: 55,
    mixed: 55,
    manden: 75,
  },
};

export const INSTAGRAM_HANDLE = 'mirabloomsnl';
export const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/mirabloomsnl/';
export const INSTAGRAM_DM_URL = 'https://ig.me/m/mirabloomsnl';
export const LOGO_PATH = '/assets/aistudio/IMG_1077_d341da83.jpeg';

export interface RoseColorOption {
  id: RoseColorId;
  name: string;
  subtitle: string;
  description: string;
  onRequestOnly?: boolean;
  swatchHex: string;
  images: { src: string; caption: string }[];
}

export const ROSE_COLORS: RoseColorOption[] = [
  {
    id: 'rood',
    name: 'Rode Rozen',
    subtitle: 'Dieprood · Klassiek',
    description:
      'Volle, fluweelrode rozen met lange stelen, strak verpakt in wit of zwart luxe papier. Ideaal voor aanzoeken, jubilea of een onvergetelijk gebaar.',
    swatchHex: '#6F1420',
    images: [
      {
        src: '/assets/aistudio/IMG_1076_cfcbf239.jpeg',
        caption: '100 rode rozen in wit papier met gepersonaliseerd satijnen lint',
      },
      {
        src: '/assets/aistudio/IMG_1062_e2100846.jpeg',
        caption: 'Rode rozen in zwart papier met zwart-gouden lint',
      },
      {
        src: '/assets/aistudio/IMG_1086_6c85d18f.jpeg',
        caption: 'Rode rozen met gipskruid initialen en parel-sluier',
      },
      {
        src: '/assets/aistudio/IMG_1045_516ea8a1.jpeg',
        caption: 'Rode rozen met gipskruid rand en gepersonaliseerd lint',
      },
      {
        src: '/assets/aistudio/IMG_1041_07e85625.jpeg',
        caption: 'Rode rozen afgewerkt met bedrukte witte tule sluier',
      },
      {
        src: '/assets/aistudio/IMG_1092_f031dcde.jpeg',
        caption: 'Rode rozen met gipskruid naam en handgeschreven kaart',
      },
    ],
  },
  {
    id: 'wit',
    name: 'Witte Rozen',
    subtitle: 'Ivoorwit · Tijdloos',
    description:
      'Pure, volle witte rozen in helder wit of zacht linnen papier. Geliefd voor bruiloften, Nikah, kraambezoek en elegante verrassingen.',
    swatchHex: '#F3EFE6',
    images: [
      {
        src: '/assets/aistudio/IMG_1075_94ec4dc6.jpeg',
        caption: 'Witte rozen in wit papier met wit satijnen lint',
      },
      {
        src: '/assets/aistudio/IMG_1090_f4425cee.jpeg',
        caption: 'XL wit rozenboeket met persoonlijk satijnen lint',
      },
      {
        src: '/assets/aistudio/IMG_1109_41ff7930.jpeg',
        caption: 'Detailopname wit rozenboeket met bruidshenna',
      },
      {
        src: '/assets/aistudio/IMG_1111_d4100895.jpeg',
        caption: 'Luxe trio met witte en rode rozen en MIRA Blooms lint',
      },
    ],
  },
  {
    id: 'roze',
    name: 'Roze Rozen',
    subtitle: 'Zachtroze & Blush',
    description:
      'Romantische zachtroze en blush rozen, prachtig te combineren met witte parel-tule of een gipskruid naam in het midden.',
    swatchHex: '#DFA8B3',
    images: [
      {
        src: '/assets/aistudio/IMG_1093_3c97a22f.jpeg',
        caption: 'Blush roze rozen met gipskruid naam en parel-sluier',
      },
      {
        src: '/assets/aistudio/IMG_1087_ed453463.jpeg',
        caption: 'Roze rozen in wit papier met gipskruid naam',
      },
      {
        src: '/assets/aistudio/IMG_1082_64424b17.jpeg',
        caption: 'Donkerroze en rode rozen met pareldetails in zwart papier',
      },
    ],
  },
  {
    id: 'bijzonder',
    name: 'Bijzondere Kleuren',
    subtitle: 'Lichtblauw, paars & maatwerk · Op aanvraag',
    description:
      'Op zoek naar lichtblauwe, lila, paarse of tweekleurige rozen? Deze kleuren worden speciaal per veilingdag ingekocht. De prijs bespreken we vooraf op aanvraag.',
    onRequestOnly: true,
    swatchHex: '#A7CFE0',
    images: [
      {
        src: '/assets/aistudio/IMG_1059_c9569ea9.jpeg',
        caption: 'Lichtblauwe & witte rozen met gipskruid naam in blauw papier',
      },
      {
        src: '/assets/aistudio/IMG_1035_d6e707c3.jpeg',
        caption: 'Paarse & lila tinten gecombineerd met zachtroze rozen',
      },
      {
        src: '/assets/aistudio/IMG_1082_64424b17.jpeg',
        caption: 'Tweekleurig rood en roze met parelaccenten',
      },
    ],
  },
];

export interface CatalogItem {
  id: string;
  category: 'trosrozen' | 'mixed' | 'losse-extras';
  title: string;
  subtitle: string;
  description: string;
  image: string;
  priceType: 'starting' | 'fixed';
  startingPriceKey?: 'trosrozen' | 'mixed' | 'manden';
  fixedPriceKey?: 'losseSluier' | 'losLint';
  note: string;
  budgetOptions?: string[];
}

export const CATALOG_ITEMS: CatalogItem[] = [
  // Trosrozen
  {
    id: 'tros-creme-blush',
    category: 'trosrozen',
    title: 'Crème & Blush Trosrozen',
    subtitle: 'Trosrozen · Meerdere bloemknoppen per steel',
    description:
      'Vol en romantisch boeket van fijne crèmewitte en zachtroze trosrozen, speels verpakt in mat linnen papier.',
    image: '/assets/aistudio/IMG_1091_7ebff67a.jpeg',
    priceType: 'starting',
    startingPriceKey: 'trosrozen',
    note: 'Prijs varieert door soort & seizoen',
    budgetOptions: ['€55 – €75', '€75 – €110', '€110 – €150', '€150+'],
  },
  {
    id: 'tros-blush-lila',
    category: 'trosrozen',
    title: 'Blush, Oudroze & Lila Trosrozen',
    subtitle: 'Trosrozen · Garden-stijl',
    description:
      'Rijke variëteiten met volle rozenknoppen in poederroze en lila tinten, strak gewikkeld in crisp wit papier.',
    image: '/assets/aistudio/IMG_1080_2dc5b8af.jpeg',
    priceType: 'starting',
    startingPriceKey: 'trosrozen',
    note: 'Ook mogelijk met gipskruid naam',
    budgetOptions: ['€55 – €75', '€75 – €110', '€110 – €150', '€150+'],
  },
  {
    id: 'tros-kleurrijk-mix',
    category: 'trosrozen',
    title: 'Kleurrijke Trosrozen Mix',
    subtitle: 'Trosrozen · Wit, fuchsia & perzik',
    description:
      'Uitbundig boeket vol witte, roze en diep-fuchsia trosrozen met subtiele accenten. Ideaal voor verloving, Eid of felicitaties.',
    image: '/assets/aistudio/IMG_1084_df8a57e0.jpeg',
    priceType: 'starting',
    startingPriceKey: 'trosrozen',
    note: 'Verkrijgbaar met satijnen lint',
    budgetOptions: ['€65 – €95', '€95 – €135', '€135 – €180', '€180+'],
  },
  {
    id: 'tros-parel-feest',
    category: 'trosrozen',
    title: 'Trosrozen met Pareltule & Lint',
    subtitle: 'Trosrozen · Feestelijke afwerking',
    description:
      'Zachte perzik- en roze trosrozen afgewerkt met een met parels bezette tule rand en goudkleurig gelegenheidslint.',
    image: '/assets/aistudio/IMG_1078_485ecc00.jpeg',
    priceType: 'starting',
    startingPriceKey: 'trosrozen',
    note: 'Linttekst volledig naar wens',
    budgetOptions: ['€65 – €95', '€95 – €135', '€135 – €180', '€180+'],
  },
  {
    id: 'tros-sofia-gipsnaam',
    category: 'trosrozen',
    title: 'Blush Trosrozen met Gipskruid Naam',
    subtitle: 'Trosrozen · Gepersonaliseerd',
    description:
      'Romantische blush en witte trosrozen in zachtroze papier met een handgevormde naam in gipskruid.',
    image: '/assets/aistudio/IMG_1106_c6393e57.jpeg',
    priceType: 'starting',
    startingPriceKey: 'trosrozen',
    note: 'Naam of initialen naar wens',
    budgetOptions: ['€65 – €95', '€95 – €135', '€135 – €180', '€180+'],
  },
  {
    id: 'tros-xl-verloving',
    category: 'trosrozen',
    title: 'XL Trosrozen Verlovingsboeket',
    subtitle: 'Trosrozen · Groot formaat',
    description:
      'Indrukwekkend XL boeket van witte, roze en rode trosrozen afgewerkt met satijnen lint en datum.',
    image: '/assets/aistudio/IMG_1107_cb9fc042.jpeg',
    priceType: 'starting',
    startingPriceKey: 'trosrozen',
    note: 'Ideaal voor verloving & Nikah',
    budgetOptions: ['€95 – €135', '€135 – €175', '€175 – €225', '€225+'],
  },

  // Mixed Bouquets & Bloemenmanden
  {
    id: 'mixed-pioenen',
    category: 'mixed',
    title: 'Pioenrozen Boeket',
    subtitle: 'Mixed & Seizoensbloemen · Voorjaar/Zomer',
    description:
      'Zachte, volle pioenrozen in blush, ivoor of diep-magenta. Beschikbaar in het pioenenseizoen, samengesteld op jouw gewenste budget.',
    image: '/assets/aistudio/IMG_1079_bfcd2533.jpeg',
    priceType: 'starting',
    startingPriceKey: 'mixed',
    note: 'Seizoensgebonden bloemsoort',
    budgetOptions: ['€55 – €80', '€80 – €115', '€115 – €150', '€150+'],
  },
  {
    id: 'mixed-calla-craspedia',
    category: 'mixed',
    title: 'Pastel Mix met Calla & Craspedia',
    subtitle: 'Mixed Bouquet · Op maat & budget',
    description:
      'Een artistieke mix van zachtroze calla lelies, gele craspedia, anjers en crème tuinrozen. Strak gebonden in botergeel of linnen papier.',
    image: '/assets/aistudio/IMG_1103_359571b9.jpeg',
    priceType: 'starting',
    startingPriceKey: 'mixed',
    note: 'Samenstelling afgestemd op budget',
    budgetOptions: ['€55 – €75', '€75 – €110', '€110 – €150', '€150+'],
  },
  {
    id: 'mixed-lelie-roos',
    category: 'mixed',
    title: 'Lelie & Rozen Statement Boeket',
    subtitle: 'Mixed Bouquet · Organza afwerking',
    description:
      'Luchtige witte en roze lelies gecombineerd met tientallen zachtroze en crème rozen in gelaagd transparant papier.',
    image: '/assets/aistudio/IMG_1088_354e1f3f.jpeg',
    priceType: 'starting',
    startingPriceKey: 'mixed',
    note: 'Ook als cadeauboeket met knuffel',
    budgetOptions: ['€65 – €95', '€95 – €130', '€130 – €175', '€175+'],
  },
  {
    id: 'mixed-calla-zwart',
    category: 'mixed',
    title: 'Donkere Calla & Astilbe Mix',
    subtitle: 'Mixed Bouquet · Krachtig & modern',
    description:
      'Dieproze calla lelies, pluimastilbe en donkerrode trosrozen in contrasterend matzwart papier.',
    image: '/assets/aistudio/IMG_1036_cb5bce2a.jpeg',
    priceType: 'starting',
    startingPriceKey: 'mixed',
    note: 'Samenstelling naar dagverse voorraad',
    budgetOptions: ['€55 – €80', '€80 – €115', '€115 – €150', '€150+'],
  },
  {
    id: 'mixed-hortensia-roos',
    category: 'mixed',
    title: 'Witte Hortensia & Roze Trosrozen',
    subtitle: 'Mixed Bouquet · Rijk & wolkachtig',
    description:
      'Volle witte hortensia’s gecombineerd met zachtroze trosrozen en het kenmerkende MIRA Blooms lint.',
    image: '/assets/aistudio/IMG_1042_8f962426.jpeg',
    priceType: 'starting',
    startingPriceKey: 'mixed',
    note: 'Volle ronde vorm',
    budgetOptions: ['€65 – €95', '€95 – €130', '€130 – €170', '€170+'],
  },
  {
    id: 'mixed-bloemenmand',
    category: 'mixed',
    title: 'Rieten Bloemenmand met Lint',
    subtitle: 'Mixed Arrangement · Kraamcadeau & felicitatie',
    description:
      'Rijk gevulde mand met hortensia’s, anthuriums, allium en trosrozen, afgewerkt met een lange satijnen strik met eigen tekst.',
    image: '/assets/aistudio/IMG_1097_7034ec4e.jpeg',
    priceType: 'starting',
    startingPriceKey: 'manden',
    note: 'Inclusief gepersonaliseerd lint naar keuze',
    budgetOptions: ['€75 – €100', '€100 – €140', '€140 – €180', '€180+'],
  },

  // Losse Extra's
  {
    id: 'los-sluier',
    category: 'losse-extras',
    title: 'Losse Sluier (Veil)',
    subtitle: 'Losse verkoop · Afhalen in Lisserbroek',
    description:
      'Luxe witte tule sluier om over een boeket te draperen, naar wens afgewerkt met fijne pareltjes of jouw eigen korte tekst in sierletters.',
    image: '/assets/aistudio/IMG_1043_331a8875.jpeg',
    priceType: 'fixed',
    fixedPriceKey: 'losseSluier',
    note: 'Ook direct bij een rozenboeket te bestellen',
  },
  {
    id: 'los-lint',
    category: 'losse-extras',
    title: 'Los Gepersonaliseerd Lint',
    subtitle: 'Losse verkoop · Satijn naar wens bedrukt',
    description:
      'Breed satijnen lint bedrukt met namen, een datum, Eid Mubarak, Umrah Mubarak of een eigen lieve boodschap in goud, zwart of zilver.',
    image: '/assets/aistudio/IMG_1076_cfcbf239.jpeg',
    priceType: 'fixed',
    fixedPriceKey: 'losLint',
    note: 'Kleur lint & opdruk volledig naar keuze',
  },
];

export type LookbookCategory =
  | 'alles'
  | 'rozenboeketten'
  | 'trosrozen'
  | 'mixed'
  | 'extras'
  | 'bruiloften';

export interface LookbookPhoto {
  id: string;
  src: string;
  title: string;
  category: Exclude<LookbookCategory, 'alles'>;
  categoryLabel: string;
  detail: string;
}

export const LOOKBOOK_PHOTOS: LookbookPhoto[] = [
  {
    id: 'lb-1',
    src: '/assets/aistudio/IMG_1076_cfcbf239.jpeg',
    title: 'XL Rode Rozen · Satijnen Lint',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Rode rozen in strak wit papier met persoonlijk lint "Fouad & Bahija"',
  },
  {
    id: 'lb-2',
    src: '/assets/aistudio/IMG_1075_94ec4dc6.jpeg',
    title: 'Witte Rozen · Klassiek Wit',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Vol rond boeket witte rozen met wit satijnen lint',
  },
  {
    id: 'lb-3',
    src: '/assets/aistudio/IMG_1093_3c97a22f.jpeg',
    title: 'Blush Rozen · Gipskruid Naam',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Zachtroze rozen met handgevormde naam "Layan" en parel-sluier',
  },
  {
    id: 'lb-4',
    src: '/assets/aistudio/IMG_1059_c9569ea9.jpeg',
    title: 'Lichtblauwe & Witte Rozen',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Bijzondere kleur op aanvraag met gipskruid naam "Suleyman"',
  },
  {
    id: 'lb-5',
    src: '/assets/aistudio/IMG_1090_f4425cee.jpeg',
    title: 'XL Witte Rozen · Opdrachtlint',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Groot boeket witte rozen met uitgebreid tekstlint',
  },
  {
    id: 'lb-6',
    src: '/assets/aistudio/IMG_1087_ed453463.jpeg',
    title: 'Roze Rozen · Gipskruid "Sara"',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Roze rozen met handgemaakte naam in gipskruid',
  },
  {
    id: 'lb-7',
    src: '/assets/aistudio/IMG_1060_0770c9e2.jpeg',
    title: 'Rode Rozen · Zwart MIRA Lint',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Dieprode rozen afgewerkt met zwart MIRA Blooms lint',
  },
  {
    id: 'lb-8',
    src: '/assets/aistudio/IMG_1062_e2100846.jpeg',
    title: 'Rode Rozen · "An answered dua"',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'XL rode rozen in zwart papier met goudbedrukt zwart lint',
  },
  {
    id: 'lb-9',
    src: '/assets/aistudio/IMG_1074_20ecf423.jpeg',
    title: 'Duo Rode Rozen · Gipskruid Rand',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Rode rozen omlijst met een rand van gipskruid en zwart lint',
  },
  {
    id: 'lb-10',
    src: '/assets/aistudio/IMG_1086_6c85d18f.jpeg',
    title: 'Rode Rozen · Initialen "H & C"',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Gipskruid initialen met hartje en witte tule parel-sluier',
  },
  {
    id: 'lb-11',
    src: '/assets/aistudio/IMG_1081_057da72a.jpeg',
    title: 'Umrah Mubarak · Gipskruid Tekst',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Volledige tekst gevormd uit gipskruid op rode rozen',
  },
  {
    id: 'lb-12',
    src: '/assets/aistudio/IMG_1043_331a8875.jpeg',
    title: 'Sluier met Persoonlijke Tekst',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Witte tule sluier met sierletters over rode rozen',
  },
  {
    id: 'lb-13',
    src: '/assets/aistudio/IMG_1041_07e85625.jpeg',
    title: 'Verjaardags-sluier over Rode Rozen',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Fijne witte sluier "Happy birthday Princess"',
  },
  {
    id: 'lb-14',
    src: '/assets/aistudio/IMG_1045_516ea8a1.jpeg',
    title: 'Gipskruid Rand & Goudlint',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Rode rozen met gipskruid rand en crèmekleurig datumlint',
  },
  {
    id: 'lb-15',
    src: '/assets/aistudio/IMG_1092_f031dcde.jpeg',
    title: 'Rode Rozen · "Dilara" & Lakzegel',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Gipskruid naam op dieprode rozen met luxe envelop',
  },
  {
    id: 'lb-16',
    src: '/assets/aistudio/IMG_1082_64424b17.jpeg',
    title: 'Rood & Roze Rozen met Parels',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Tweekleurig rozenboeket met parelaccenten en parelrand',
  },
  {
    id: 'lb-17',
    src: '/assets/aistudio/IMG_1109_41ff7930.jpeg',
    title: 'Henna & Witte Rozen',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Detailopname van een groot wit rozenboeket met lint',
  },
  {
    id: 'lb-18',
    src: '/assets/aistudio/IMG_1111_d4100895.jpeg',
    title: 'Trio Cadeauboeketten',
    category: 'rozenboeketten',
    categoryLabel: 'Rozenboeketten',
    detail: 'Witte, rode en blush boeketten afgewerkt met MIRA Blooms lint',
  },
  {
    id: 'lb-19',
    src: '/assets/aistudio/IMG_1080_2dc5b8af.jpeg',
    title: 'Blush & Lila Trosrozen',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Volle trosrozen in zachtroze en lila tinten',
  },
  {
    id: 'lb-20',
    src: '/assets/aistudio/IMG_1091_7ebff67a.jpeg',
    title: 'Crème & Blush Trosrozen',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Zachte tuin- en trosrozen met gepersonaliseerd satijnen lint',
  },
  {
    id: 'lb-21',
    src: '/assets/aistudio/IMG_1084_df8a57e0.jpeg',
    title: 'Kleurrijke Trosrozen Mix',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Witte, koraalroze en magenta trosrozen met blauwe details',
  },
  {
    id: 'lb-22',
    src: '/assets/aistudio/IMG_1107_cb9fc042.jpeg',
    title: 'XL Trosrozen · "Zehra & Bilal"',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Groot boeket witte, roze en rode trosrozen voor verloving',
  },
  {
    id: 'lb-23',
    src: '/assets/aistudio/IMG_1078_485ecc00.jpeg',
    title: 'Trosrozen met Parel-tule',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Perzik en roze trosrozen met gouden Eid Mubarak lint en parelrand',
  },
  {
    id: 'lb-24',
    src: '/assets/aistudio/IMG_1037_7628c956.jpeg',
    title: 'Pastel Trosrozen · Umrah Mubarak',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Zachte perzik- en roze trosrozen in wit papier',
  },
  {
    id: 'lb-25',
    src: '/assets/aistudio/IMG_1055_a650c011.jpeg',
    title: 'Ivoor & Blush Trosrozen · "S & Y"',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Romantisch verlovingsboeket in taupe papier',
  },
  {
    id: 'lb-26',
    src: '/assets/aistudio/IMG_1057_b5b7dd74.jpeg',
    title: 'Crème & Roze Trosrozen',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Trosrozen met fijn gipskruid en wit satijnen lint',
  },
  {
    id: 'lb-27',
    src: '/assets/aistudio/IMG_1054_58b0e5c2.jpeg',
    title: 'Naturel Trosrozen & Tuinrozen',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Zonder lint, pure focus op de bloemen in taupe papier',
  },
  {
    id: 'lb-28',
    src: '/assets/aistudio/IMG_1106_c6393e57.jpeg',
    title: 'Blush Trosrozen · "Sofia"',
    category: 'trosrozen',
    categoryLabel: 'Trosrozen',
    detail: 'Zachtroze en crème trosrozen in roze papier met gipskruid naam',
  },
  {
    id: 'lb-29',
    src: '/assets/aistudio/IMG_1079_bfcd2533.jpeg',
    title: 'Roze Pioenrozen Boeket',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Volle lichtroze pioenrozen in wit papier',
  },
  {
    id: 'lb-30',
    src: '/assets/aistudio/IMG_1058_45dff6db.jpeg',
    title: 'Roze & Witte Pioenrozen',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Pioenrozen afgewerkt met transparant MIRA Blooms lint',
  },
  {
    id: 'lb-31',
    src: '/assets/aistudio/IMG_1061_d338ae4b.jpeg',
    title: 'Magenta & Witte Pioenrozen',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Contrasterende pioenrozen met Eid Mubarak lint',
  },
  {
    id: 'lb-32',
    src: '/assets/aistudio/IMG_1108_4e1fb177.jpeg',
    title: 'Champagne Tuinrozen & Anjers',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Zachte champagne- en oudroze tinten in wit papier',
  },
  {
    id: 'lb-33',
    src: '/assets/aistudio/IMG_1088_354e1f3f.jpeg',
    title: 'Lelies & Rozen in Organza Papier',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Witte en roze lelies met blush rozen in gelaagd papier',
  },
  {
    id: 'lb-34',
    src: '/assets/aistudio/IMG_1089_25ae6fc8.jpeg',
    title: 'Detail Lelie & Rozen Boeket',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Close-up van openende lelies en MIRA Blooms lint',
  },
  {
    id: 'lb-35',
    src: '/assets/aistudio/IMG_1085_05c4b2f6.jpeg',
    title: 'Lelie Cadeauboeket op Maat',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Roze lelies en gipskruid gecombineerd met knuffel',
  },
  {
    id: 'lb-36',
    src: '/assets/aistudio/IMG_1103_359571b9.jpeg',
    title: 'Calla, Craspedia & Tuinrozen',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Pastel gemengd boeket in warm lichtgeel papier',
  },
  {
    id: 'lb-37',
    src: '/assets/aistudio/IMG_1104_c3f83466.jpeg',
    title: 'Detail Calla & Craspedia',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Textuurrijk gemengd boeket met roze calla lelies',
  },
  {
    id: 'lb-38',
    src: '/assets/aistudio/IMG_1105_86f6afe2.jpeg',
    title: 'Afstudeerboeket · Mondhygiënist',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Gemengd boeket met persoonlijk afstudeerlint',
  },
  {
    id: 'lb-39',
    src: '/assets/aistudio/IMG_1036_cb5bce2a.jpeg',
    title: 'Roze Calla & Astilbe in Zwart',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Stijlvol donker boeket met fuchsia trosrozen en calla',
  },
  {
    id: 'lb-40',
    src: '/assets/aistudio/IMG_1035_d6e707c3.jpeg',
    title: 'Paarse Chrysanten & Blush Rozen',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Rijke paarse en pastelroze combinatie in oudroze papier',
  },
  {
    id: 'lb-41',
    src: '/assets/aistudio/IMG_1042_8f962426.jpeg',
    title: 'Witte Hortensia & Roze Trosrozen',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Vol wolkerig boeket met witte hortensia en roze trosrozen',
  },
  {
    id: 'lb-42',
    src: '/assets/aistudio/IMG_1097_7034ec4e.jpeg',
    title: 'Duo Bloemenmanden op Maat',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Twee luxe rieten manden met persoonlijke satijnen strik',
  },
  {
    id: 'lb-43',
    src: '/assets/aistudio/IMG_1047_d7e8ab70.jpeg',
    title: 'Kraamcadeau Bloemenmand',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Roze en witte hortensia’s met rode anthurium',
  },
  {
    id: 'lb-44',
    src: '/assets/aistudio/IMG_1048_7982ea86.jpeg',
    title: 'Roze Hortensia Bloemenmand',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Volle roze hortensiamand met satijnen felicitatielint',
  },
  {
    id: 'lb-45',
    src: '/assets/aistudio/IMG_1050_abb6be99.jpeg',
    title: 'Witte Hortensia & Groene Anthurium',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Bloemenmand met paarse allium en tekst "With hardship comes ease"',
  },
  {
    id: 'lb-46',
    src: '/assets/aistudio/temp_image_B27FF6DC-883F-4046-91C4-5668A129647B_060e6d45.jpeg',
    title: 'Moederdag / Familie Bloemenmand',
    category: 'mixed',
    categoryLabel: 'Mixed Bouquets',
    detail: 'Witte hortensia’s, anthurium en roze trosrozen in mand',
  },
  {
    id: 'lb-46b',
    src: '/assets/aistudio/IMG_1051_89c309ab.jpeg',
    title: 'Detail Groene Anthurium & Allium',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Close-up van handgedrukt satijnen lint op bloemenmand',
  },
  {
    id: 'lb-46c',
    src: '/assets/aistudio/IMG_1053_5ac8d7ce.jpeg',
    title: 'Detail Rode Anthurium & Lint',
    category: 'extras',
    categoryLabel: 'Losse Extra’s',
    detail: 'Satijnen kraamlint "Welcome to the world babygirl"',
  },
  {
    id: 'lb-47',
    src: '/assets/aistudio/IMG_1094_7d156930.jpeg',
    title: 'Bruidsboeket · Witte Calla & Veronica',
    category: 'bruiloften',
    categoryLabel: 'Bruiloften',
    detail: 'Modern handgebonden bruidsboeket met witte calla lelies en rozen',
  },
  {
    id: 'lb-48',
    src: '/assets/aistudio/IMG_1095_efed392d.jpeg',
    title: 'Bruidsboeket in Avondlicht',
    category: 'bruiloften',
    categoryLabel: 'Bruiloften',
    detail: 'Witte calla lelies, avalanche rozen en veronica',
  },
  {
    id: 'lb-49',
    src: '/assets/aistudio/IMG_1113_85774ef8.jpeg',
    title: 'Bruidsboeket · Roze Calla & Anjers',
    category: 'bruiloften',
    categoryLabel: 'Bruiloften',
    detail: 'Zachtroze calla lelies en perzik anjers bij kanten bruidsjurk',
  },
  {
    id: 'lb-50',
    src: '/assets/aistudio/IMG_1046_8de95aff.jpeg',
    title: 'Detailopname Bruidsboeket',
    category: 'bruiloften',
    categoryLabel: 'Bruiloften',
    detail: 'Witte lisianthus, roze calla en satijnen handvat',
  },
  {
    id: 'lb-51',
    src: '/assets/aistudio/IMG_1096_19191d71.jpeg',
    title: 'Trouwauto Motorkap Bloemstuk',
    category: 'bruiloften',
    categoryLabel: 'Bruiloften',
    detail: 'Hortensia, rozen en eucalyptus op de motorkap van de trouwauto',
  },
  {
    id: 'lb-52',
    src: '/assets/aistudio/IMG_1039_59779a99.jpeg',
    title: 'Trouwauto Portier Corsage',
    category: 'bruiloften',
    categoryLabel: 'Bruiloften',
    detail: 'Fijne portierdecoratie met oudroze rozen, gipskruid en wit lint',
  },
];

export const WEDDING_GALLERY: WeddingGalleryItem[] = [
  {
    src: '/assets/aistudio/IMG_1094_7d156930.jpeg',
    title: 'Bruidsboeket Witte Calla & Rozen',
  },
  {
    src: '/assets/aistudio/IMG_1113_85774ef8.jpeg',
    title: 'Bruidsboeket Roze Calla & Anjers',
  },
  {
    src: '/assets/aistudio/IMG_1096_19191d71.jpeg',
    title: 'Trouwauto Motorkap Decoratie',
  },
  {
    src: '/assets/aistudio/IMG_1039_59779a99.jpeg',
    title: 'Trouwauto Portier Corsage',
  },
  {
    src: '/assets/aistudio/IMG_1095_efed392d.jpeg',
    title: 'Avondceremonie Bruidsboeket',
  },
  {
    src: '/assets/aistudio/IMG_1046_8de95aff.jpeg',
    title: 'Detail Handgebonden Bruidsboeket',
  },
];

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  heroSubtitle: 'The Art of Floral Elegance',
  heroCtaLabel: 'STEL BOEKET SAMEN',
  orderChannel: 'instagram',
  whatsappNumber: '',
  logoSrc: LOGO_PATH,
  aboutPhotoSrc: '/assets/aistudio/IMG_1058_45dff6db.jpeg',
  homepageCards: [
    {
      id: 'card-rozen',
      targetPage: 'rozenboeketten',
      label: 'Rozenboeketten',
      sublabel: 'Rood, wit, roze & op aanvraag',
      imageSrc: '/assets/aistudio/IMG_1076_cfcbf239.jpeg',
    },
    {
      id: 'card-trosrozen',
      targetPage: 'trosrozen',
      label: 'Trosrozen',
      sublabel: 'Volle knoppen & zachte tinten',
      imageSrc: '/assets/aistudio/IMG_1091_7ebff67a.jpeg',
    },
    {
      id: 'card-mixed',
      targetPage: 'mixed',
      label: 'Mixed Bouquets',
      sublabel: 'Pioenen, calla & manden',
      imageSrc: '/assets/aistudio/IMG_1079_bfcd2533.jpeg',
    },
    {
      id: 'card-extras',
      targetPage: 'extras',
      label: 'Losse Extra’s',
      sublabel: 'Sluier €25 & lint €15',
      imageSrc: '/assets/aistudio/IMG_1093_3c97a22f.jpeg',
    },
    {
      id: 'card-bruiloften',
      targetPage: 'bruiloften',
      label: 'Bruiloften',
      sublabel: 'Bruidsboeket & trouwauto',
      imageSrc: '/assets/aistudio/IMG_1094_7d156930.jpeg',
    },
  ],
  roseColors: ROSE_COLORS,
  catalogItems: CATALOG_ITEMS,
  weddingGallery: WEDDING_GALLERY,
  lookbookPhotos: LOOKBOOK_PHOTOS,
  prices: DEFAULT_PRICE_CONFIG,
  texts: {
    brandTitle: 'MIRA',
    brandTitleItalic: 'Blooms',
    navCtaLabel: 'Stel een vraag',
    about: {
      eyebrow: 'Het verhaal achter MIRA Blooms',
      heading: 'Passie voor bloemen, aandacht voor elk detail',
      paragraph1:
        'Al ruim drie jaar werk ik met veel liefde in de bloemenwereld. Die passie voor bloemen combineer ik met mijn studie Bedrijfskunde aan de Vrije Universiteit en mijn plezier in ondernemen.',
      paragraph2:
        'De naam MIRA Blooms heeft voor mij een mooie betekenis. Blooms staat voor opbloeien, omdat ik geloof dat je na elke beproeving weer tot bloei kunt komen. Met elk boeket wil ik dat gevoel van aandacht en elegantie meegeven.',
      pickupLabel: 'Afhaallocatie',
      pickupValue: 'Lisserbroek',
      pickupNote: 'Uitsluitend afhalen op afspraak',
      orderLabel: 'Bestellen',
      orderNote: '@mirabloomsnl · Direct persoonlijk contact',
      qualityLabel: 'Kwaliteit',
      qualityValue: 'Dagvers ingekocht',
      qualityNote: 'Elk boeket wordt vers op bestelling gemaakt',
      portfolioLinkLabel: 'Bekijk alle eerdere creaties in het portfolio',
    },
    pages: {
      rozenTitle: 'Rozenboeketten',
      rozenDescription:
        'Kies jouw rozenkleur, het gewenste aantal en eventuele persoonlijke extra’s.',
      rozenPackagingNote:
        'Prijzen zijn inclusief luxe papierverpakking · Afhalen in Lisserbroek',
      trosrozenTitle: 'Trosrozen',
      trosrozenDescription:
        'Meerdere volle bloemknoppen op één steel in zachte pastel- of feestelijke tinten. Omdat soorten en beschikbaarheid per veilingdag verschillen, kies je eenvoudig een stijl en jouw gewenste budget.',
      mixedTitle: 'Mixed Bouquets & Bloemenmanden',
      mixedDescription:
        'Gemengde boeketten met seizoensbloemen zoals pioenrozen, calla lelies, hortensia’s en luxe bloemenmanden. Samengesteld op basis van jouw wensen en richtbudget.',
      extrasTitle: 'Losse Sluier & Gepersonaliseerd Lint',
      extrasDescription:
        'Wil je een eigen boeket of cadeau persoonlijk afmaken? Onze tule sluiers en bedrukte satijnen linten zijn zowel los als direct bij een boeket te bestellen.',
      bruiloftenTitle: 'Bruiloften & Special Occasions',
      bruiloftenDescription:
        'Handgebonden bruidsboeketten, bloemstukken voor op de trouwauto en stijlvolle tafeldecoraties. Alles wordt op aanvraag afgestemd op jullie dag en inspiratiefoto’s.',
      bruiloftenFormTitle: 'Aanvraagformulier bruidswerk & events',
      bruiloftenFormDescription:
        'Vul je gegevens en wensen in. Je aanvraag wordt overzichtelijk klaargezet voor de chat, waar je ook direct inspiratiefoto’s kunt meesturen.',
      portfolioTitle: 'Alle Creaties',
      portfolioDescription:
        'Klik op een foto om het boeket van dichtbij te bekijken of direct een vergelijkbare stijl aan te vragen.',
    },
    footer: {
      description:
        'Handgemaakte rozenboeketten, trosrozen, gemengde boeketten en bruidswerk. Uitsluitend afhalen op afspraak in Lisserbroek.',
      pickupLine: 'Afhaallocatie: Lisserbroek (op afspraak)',
      bottomNote: 'Bestellen via chat · Vers op bestelling gemaakt',
    },
  },
};

export function compressImageFile(
  file: File,
  maxDim = 960,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Kon afbeelding niet lezen'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Ongeldige afbeelding'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function formatEuro(amount: number): string {
  return `€${amount.toFixed(0)}`;
}

export function normalizeWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('06') && digits.length === 10) {
    return `31${digits.slice(1)}`;
  }
  return digits;
}

export function isWhatsAppConfigured(siteConfig: SiteConfig): boolean {
  return (
    siteConfig.orderChannel === 'whatsapp' &&
    normalizeWhatsAppNumber(siteConfig.whatsappNumber).length >= 9
  );
}

export function buildOrderChatUrl(siteConfig: SiteConfig, message: string): string {
  const waDigits = normalizeWhatsAppNumber(siteConfig.whatsappNumber);
  if (siteConfig.orderChannel === 'whatsapp' && waDigits.length >= 9) {
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(message)}`;
  }
  return INSTAGRAM_DM_URL;
}

export function copyOrderText(text: string): void {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch {
    // Fallback below
  }

  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      void navigator.clipboard.writeText(text);
    }
  } catch {
    // Ignore clipboard API restrictions
  }
}
