export interface OfferItem {
  id: number;
  ref: string;
  title: string;
  specs: string;
  price: number;
  formattedPrice: string;
  date: string;
  category: "Necklaces" | "Chains" | "Rings" | "Bangles" | "Bullion" | "Earrings";
  purity: "22K" | "24K";
  image: string;
  description: string;
}

export const DAILY_OFFERS: OfferItem[] = [
  {
    id: 1,
    ref: "BJ-277501",
    title: "Necklace",
    specs: "18\" Inch & 3.4g",
    price: 415,
    formattedPrice: "£415",
    date: "05/11/26",
    category: "Necklaces",
    purity: "22K",
    image: "/offers/offer-1.jpg",
    description: "Delicate 22K yellow gold filigree necklace with handcrafted droplet stations. Perfect daily wear luxury."
  },
  {
    id: 2,
    ref: "BJ-277502",
    title: "Ladies Chain",
    specs: "20\" Inch & 6.8g",
    price: 595,
    formattedPrice: "£595",
    date: "05/11/26",
    category: "Chains",
    purity: "22K",
    image: "/offers/offer-2.jpg",
    description: "Solid 22 carat gold diamond-cut Singapore twist chain with premium parrot clasp."
  },
  {
    id: 3,
    ref: "BJ-277503",
    title: "Beaded Gold Necklace",
    specs: "18\" Inch & 4.2g",
    price: 485,
    formattedPrice: "£485",
    date: "05/11/26",
    category: "Necklaces",
    purity: "22K",
    image: "/offers/offer-3.jpg",
    description: "Artisanal hollow gold beaded necklace featuring high-polish accents and adjustable extender."
  },
  {
    id: 4,
    ref: "BJ-277504",
    title: "Necklace & Pendant",
    specs: "18\" Inch & 3.4g",
    price: 415,
    formattedPrice: "£415",
    date: "05/11/26",
    category: "Necklaces",
    purity: "22K",
    image: "/offers/offer-4.jpg",
    description: "Featured daily special offer. 22ct gold crafted necklace with delicate station beads."
  },
  {
    id: 5,
    ref: "BJ-277505",
    title: "Diamond Cut Bangles (Pair)",
    specs: "2.4 Size & 22.5g",
    price: 1980,
    formattedPrice: "£1,980",
    date: "05/11/26",
    category: "Bangles",
    purity: "22K",
    image: "/offers/offer-5.jpg",
    description: "Traditional dual-tone facet cut 22ct bangles reflecting intense natural shimmer."
  },
  {
    id: 6,
    ref: "BJ-277506",
    title: "Polki Solitaire Ring",
    specs: "Size N & 5.8g",
    price: 520,
    formattedPrice: "£520",
    date: "05/11/26",
    category: "Rings",
    purity: "22K",
    image: "/offers/offer-6.jpg",
    description: "Vintage inspired 22K gold cocktail ring with antique polki centerpiece setting."
  },
  {
    id: 7,
    ref: "BJ-277507",
    title: "Royal Jhumka Earrings",
    specs: "Length 42mm & 8.6g",
    price: 745,
    formattedPrice: "£745",
    date: "05/11/26",
    category: "Earrings",
    purity: "22K",
    image: "/offers/offer-7.jpg",
    description: "Handmade tiered 22K bridal jhumki earrings with hanging golden bells."
  },
  {
    id: 8,
    ref: "BJ-277508",
    title: "1 Tola Pure Gold Bar",
    specs: "999.9 Purity & 11.664g",
    price: 945,
    formattedPrice: "£945",
    date: "05/11/26",
    category: "Bullion",
    purity: "24K",
    image: "/bullion/gold-bar-tola.webp",
    description: "LBMA certified minted 1 tola (11.664g) 24 Karat pure investment bullion bar in tamper-evident assay."
  },
  {
    id: 9,
    ref: "BJ-277509",
    title: "Full Sovereign Coin Pendant",
    specs: "22K Mount & 9.1g Total",
    price: 780,
    formattedPrice: "£780",
    date: "05/11/26",
    category: "Necklaces",
    purity: "22K",
    image: "/offers/offer-9.jpg",
    description: "Genuine British 22K Full Sovereign coin set inside custom diamond-cut scroll pendant mount."
  },
  {
    id: 10,
    ref: "BJ-277510",
    title: "Men's Heavy Curb Chain",
    specs: "22\" Inch & 28.5g",
    price: 2450,
    formattedPrice: "£2,450",
    date: "05/11/26",
    category: "Chains",
    purity: "22K",
    image: "/offers/offer-10.jpg",
    description: "Substantial 6mm bevelled cuban curb chain in solid 22K hallmark gold."
  },
  {
    id: 11,
    ref: "BJ-277511",
    title: "Bridal Choker Necklace",
    specs: "Broad Collar & 38.2g",
    price: 3290,
    formattedPrice: "£3,290",
    date: "05/11/26",
    category: "Necklaces",
    purity: "22K",
    image: "/offers/offer-11.jpg",
    description: "Exquisite bridal heirloom choker necklace handcrafted with meenakari detailing."
  },
  {
    id: 12,
    ref: "BJ-277512",
    title: "Broad Kada Bangle",
    specs: "Size 2.6 & 19.4g",
    price: 1675,
    formattedPrice: "£1,675",
    date: "05/11/26",
    category: "Bangles",
    purity: "22K",
    image: "/offers/offer-12.jpg",
    description: "Traditional embossed floral motif Kada bangle with secure hinge and safety screw."
  },
  {
    id: 13,
    ref: "BJ-277513",
    title: "Floral Stud Earrings",
    specs: "Diameter 12mm & 3.8g",
    price: 340,
    formattedPrice: "£340",
    date: "05/11/26",
    category: "Earrings",
    purity: "22K",
    image: "/offers/offer-13.jpg",
    description: "Delicate blossom tops with screw-back post for secure every day luxury."
  },
  {
    id: 14,
    ref: "BJ-277514",
    title: "50g PAMP Suisse Gold Bar",
    specs: "24K 999.9 & 50.0g",
    price: 4050,
    formattedPrice: "£4,050",
    date: "05/11/26",
    category: "Bullion",
    purity: "24K",
    image: "/bullion/gold-bar-50g.webp",
    description: "Iconic Lady Fortuna minted 50g 24K gold investment bar with individual serial number."
  },
  {
    id: 15,
    ref: "BJ-277515",
    title: "Mangalsutra 22K Chain",
    specs: "18\" Inch & 9.6g",
    price: 830,
    formattedPrice: "£830",
    date: "05/11/26",
    category: "Chains",
    purity: "22K",
    image: "/offers/offer-15.jpg",
    description: "Modern auspicious black onyx bead and 22K gold twist necklace with central motif."
  },
  {
    id: 16,
    ref: "BJ-277516",
    title: "Dubai Statement Ring",
    specs: "Size P & 7.2g",
    price: 620,
    formattedPrice: "£620",
    date: "05/11/26",
    category: "Rings",
    purity: "22K",
    image: "/offers/offer-16.jpg",
    description: "Intricate laser-cut 22ct yellow gold dome cocktail ring."
  },
  {
    id: 17,
    ref: "BJ-277517",
    title: "Peacock Motif Bangle",
    specs: "Size 2.5 & 26.8g",
    price: 2310,
    formattedPrice: "£2,310",
    date: "05/11/26",
    category: "Bangles",
    purity: "22K",
    image: "/offers/offer-17.jpg",
    description: "Magnificent twin peacock embossed bangle with antique matte gold finish."
  },
  {
    id: 18,
    ref: "BJ-277518",
    title: "Half Sovereign Pendant",
    specs: "22K Mount & 5.2g",
    price: 440,
    formattedPrice: "£440",
    date: "05/11/26",
    category: "Necklaces",
    purity: "22K",
    image: "/offers/offer-18.jpg",
    description: "Authentic Half Sovereign gold coin held in stylish rope-border pendant bail."
  },
  {
    id: 19,
    ref: "BJ-277519",
    title: "Figaro Link Chain",
    specs: "20\" Inch & 11.5g",
    price: 990,
    formattedPrice: "£990",
    date: "05/11/26",
    category: "Chains",
    purity: "22K",
    image: "/offers/offer-19.jpg",
    description: "Classic 3+1 Italian style 22K gold Figaro chain, robust and timeless."
  },
  {
    id: 20,
    ref: "BJ-277520",
    title: "Pearl & Gold Drop Choker",
    specs: "Choker & 16.2g",
    price: 1390,
    formattedPrice: "£1,390",
    date: "05/11/26",
    category: "Necklaces",
    purity: "22K",
    image: "/offers/offer-20.jpg",
    description: "Freshwater cultured pearls hand-strung with 22K gold filigree pendant drop."
  }
];

