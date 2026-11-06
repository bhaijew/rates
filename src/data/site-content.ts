export interface OpeningHourItem {
  day: string;
  hours: string;
}

export interface ShowroomAmenity {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface PrivacySection {
  id: string;
  title: string;
  content: string;
}

export interface SiteContent {
  contact: {
    showroomName: string;
    phone: string;
    whatsapp: string;
    email: string;
    instagramHandle: string;
    instagramUrl: string;
    openingHoursSummary: string;
    addressLine1: string;
    city: string;
    postcode: string;
    country: string;
  };
  findUs: {
    addressFull: string;
    mapsEmbedUrl: string;
    openingHours: OpeningHourItem[];
    amenities: ShowroomAmenity[];
  };
  privacyPolicy: {
    lastUpdated: string;
    subtitle: string;
    sections: PrivacySection[];
  };
}

export const INITIAL_SITE_CONTENT: SiteContent = {
  contact: {
    showroomName: "Bhai Jewellers Flagship Showroom",
    phone: "01274 488801",
    whatsapp: "+447735727897",
    email: "info@bhaijeweller.com",
    instagramHandle: "@bhaijeweller",
    instagramUrl: "https://www.instagram.com/bhaijeweller",
    openingHoursSummary: "Monday – Sunday: 11:00 AM – 7:00 PM (Daily)",
    addressLine1: "17 Duckworth Lane",
    city: "Bradford",
    postcode: "BD9 5ER",
    country: "United Kingdom",
  },
  findUs: {
    addressFull: "17 Duckworth Lane, Bradford, BD9 5ER, United Kingdom",
    mapsEmbedUrl: "https://maps.google.com/maps?q=17%20Duckworth%20Lane,%20Bradford%20BD9%205ER&t=&z=16&ie=UTF8&iwloc=&output=embed",
    openingHours: [
      { day: "Monday", hours: "11:00 AM – 7:00 PM" },
      { day: "Tuesday", hours: "11:00 AM – 7:00 PM" },
      { day: "Wednesday", hours: "11:00 AM – 7:00 PM" },
      { day: "Thursday", hours: "11:00 AM – 7:00 PM" },
      { day: "Friday", hours: "11:00 AM – 7:00 PM" },
      { day: "Saturday", hours: "11:00 AM – 7:00 PM" },
      { day: "Sunday", hours: "11:00 AM – 7:00 PM" },
    ],
    amenities: [
      {
        id: "vip-suite",
        title: "Private VIP Bullion Suite",
        desc: "Discreet consultation lounge for high-value gold bullion bars, coins, and scrap buybacks.",
        icon: "🛡️",
      },
      {
        id: "xrf-lab",
        title: "On-Site Laser XRF Assay Lab",
        desc: "Instant non-destructive metal testing and Swiss-certified trade precision weighing.",
        icon: "🔬",
      },
      {
        id: "bridal-chambers",
        title: "22K Bridal Viewing Chambers",
        desc: "Exclusive private fitting chambers for bridal necklace sets, bangles, and bespoke orders.",
        icon: "💎",
      },
      {
        id: "hospitality",
        title: "VIP Hospitality Lounge",
        desc: "Complimentary luxury refreshments, tea, and espresso for all showroom guests.",
        icon: "☕",
      },
    ],
  },
  privacyPolicy: {
    lastUpdated: "November 2026",
    subtitle: "How Bhai Jeweller UK protects and processes your personal data.",
    sections: [
      {
        id: "collect",
        title: "1. Information We Collect",
        content: "When you browse our live rates, utilize our Zakat or scrap calculators, or contact us via WhatsApp or message forms, we only collect essential information required to fulfill your inquiry or complete your bullion transaction in compliance with UK anti-money laundering (AML) and KYC regulations.",
      },
      {
        id: "transactions",
        title: "2. Bullion Transactions & Identification",
        content: "Under UK regulations, buying or selling high-value precious metals may require valid photographic government ID (Passport or Driving Licence) and proof of address. All records are stored securely in encrypted systems.",
      },
      {
        id: "protection",
        title: "3. Data Protection & Sharing",
        content: "We never sell or disclose your personal details to third parties. Your data is strictly used for order processing, client communication, and statutory accounting requirements.",
      },
      {
        id: "controller",
        title: "4. Contacting Our Data Controller",
        content: "For questions regarding our privacy practices or to request data removal, please reach out via our official contact desk at Bhai Jeweller UK, 17 Duckworth Lane, Bradford BD9 5ER.",
      },
    ],
  },
};
