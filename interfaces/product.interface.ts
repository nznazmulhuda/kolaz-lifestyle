type TSize = {
  sku: string; // "DJ-IND-SL-30-32" (Denim/Indigo/Slim/30W/32L)
  value: string; // "30x32" (Waist x Inseam), "M", "L"
  us?: string; // "30" (US waist size for jeans)
  eu?: string; // "44" (European size equivalent)
  uk?: string; // "32" (UK size equivalent)
  stock: number; // 15 (Available quantity)
  waist: number; // [30, 32, 34] (Available waist sizes)
  inseam: number; // [30, 32, 34] (Inseam options)
  thigh: number; // [12, 13, 14] (Thigh circumference)
  legOpening: number;
  size: string;
};

type TRatingBreakdown = {
  1: number; // 5 (Number of 1-star reviews)
  2: number; // 10
  3: number; // 23
  4: number; // 40
  5: number; // 50
};

type TRating = {
  average: number; // 4.2 (Average rating 1-5)
  count: number; // 128 (Total review count)
  breakdown?: TRatingBreakdown;
};

type TimeRange = "7d" | "1m" | "6m" | "1y" | "all";
type TopSellingQuery = {
  timeRange: TimeRange;
  page?: number;
  limit?: number;
};

type TDenimWash =
  | "raw" // Unwasched, dark indigo
  | "light-wash" // Faded blue
  | "medium-wash" // Standard blue
  | "dark-wash" // Deep blue
  | "black" // Solid black
  | "acid-wash" // Bleached patterns
  | "distressed"; // Artificially worn

type TJeansFit =
  | "skinny" // Tight through leg
  | "slim" // Close-fitting but not tight
  | "straight" // Uniform width
  | "bootcut" // Slightly flared
  | "relaxed" // Loose fit
  | "baggy"; // Very loose

type TRiseType =
  | "low-rise" // 7-8" below waist
  | "mid-rise" // 9-10"
  | "high-rise" // 11-12"
  | "ultra-high-rise"; // 13"+

type TDenimDetails = {
  wash: TDenimWash; // "raw" (Unwashed indigo)
  fit: TJeansFit; // "slim"
  rise: TRiseType; // "mid-rise"
  stretch: boolean; // false (For rigid denim)
  weight: number; // 14 (ounces per sq. yard)
  selvage: boolean; // true (Premium self-finished edges)
  fabricOrigin?: string; // "Japan" (Mill location)
  pocketStyle: {
    pockets: number; // number of pockets
    details: string; // positions of pockets, 2 front, 2 back,
    style?: string; // large, small, denim style, formal style, febric
  }; // number of pockets
  zipper: {
    material: string; // zipper material
    details: string; // zipper style, color, brand
  };
  button: {
    material: string; // zipper material
    details: string; // zipper style, color, brand
  };
};

type TColor = {
  name: string; // "Indigo Blue"
  hex: string; // "#191970" (Dark indigo)
  swatchImage?: string; // "/swatches/indigo-swatch.jpg" (Fabric close-up)
};

// Main product interface with example values
export type TDenimProduct = {
  _id: string; // "507f1f77bcf86cd799439011" (MongoDB ObjectID)
  sku: string; // "IRT-DJ-001" (IronThread Denim #001)
  name: string; // "Premium Selvedge Denim Jeans"
  slug: string; // "premium-selvedge-denim-jeans" (URL-friendly)
  description: string; // "<p>14oz Japanese selvedge denim...</p>"
  shortDescription?: string; // "Japanese selvedge, slim fit"
  sellCount: number;
  stock: number;

  // Denim-specific attributes
  denimDetails: TDenimDetails;

  // Visual properties
  color: TColor[];

  // Brand information
  brand: {
    id: string; // "ironthread"
    name: string; // "IronThread Denim Co."
    logo?: string; // "/brands/ironthread-logo.png"
    story?: string; // "Handcrafted since 1992..."
  };

  // Available sizes
  sizes: TSize[]; // [
  //   { value: "30x32", us: "30", eu: "44", stock: 5, sku: "IRT-DJ-001-30" },
  //   { value: "32x32", us: "32", eu: "46", stock: 8, sku: "IRT-DJ-001-32" }
  // ]

  // Material composition
  fabric: {
    composition: string; // "98% Cotton, 2% Spandex"
    weight: string; // "14oz" (Medium-heavy)
    texture?: string; // "Slub" (Uneven yarn texture)
  };

  // Pricing structure
  pricing: {
    basePrice: number; // 19900 (₹199.00 or $199.00)
    salePrice?: number; // 14900 (On discount)
    currency: string; // "INR" (ISO currency code)
    discountPercentage?: number; // 25 (25% off)
    isOnSale: boolean; // true
  };

  // Inventory status
  stockStatus: "in-stock" | "low-stock" | "out-of-stock" | "pre-order"; // "in-stock"
  restockDate?: Date; // new Date("2023-12-15") (For pre-orders)

  // Product categorization
  category: {
    main: string; // "Jeans"
    subCategories: string[]; // ["Men", "Denim"]
    hierarchy: string[]; // ["Clothing", "Bottoms", "Jeans"]
  };

  // Search/Filter tags
  tags: {
    style: string[]; // ["casual", "streetwear"]
    occasion: string[]; // ["everyday", "work"]
    features: string[]; // ["stretch", "premium"]
  };

  // Product media
  media: {
    coverImage: string; // "/products/denim-front.jpg"
    images: string[]; // ["/products/denim-back.jpg", ...]
    lookbook?: string[]; // ["/lookbook/denim-with-jacket.jpg"] (Styled shots)
    sizeGuideImage?: string; // "/size-guides/denim-chart.jpg"
    video?: string; // "/videos/denim-walkthrough.mp4"
  };

  // Customer ratings
  rating: TRating; // { average: 4.5, count: 42, breakdown: {...} }
  featuredReview?: {
    text: string; // "Perfect fit! The denim quality..."
    author: string; // "Alex Johnson"
    rating: number; // 5
  };

  // Marketing flags
  isFeatured: boolean; // true (Show on homepage)
  isNewArrival: boolean; // false
  isBestSeller: boolean; // true
  isSustainable?: boolean; // true (Eco-friendly badge)
  isDeleted: boolean; // false (Soft delete)

  // Timestamps
  createdAt: Date; // new Date("2023-10-15") (Product creation)
  updatedAt: Date; // new Date("2023-11-20") (Last update)
  releaseDate?: Date; // new Date("2023-12-01") (Limited editions)

  // Product relationships
  relatedProducts?: string[]; // ["507f1f77bcf86cd799439012"] (Similar items)
  frequentlyBoughtWith?: string[]; // ["507f1f77bcf86cd799439099"] (Belts, etc.)

  // Care instructions
  careInstructions: {
    washing: string; // "Machine wash cold inside out"
    drying: string; // "Line dry in shade"
    ironing?: string; // "Low heat, no steam"
    bleaching?: string; // "Do not bleach"
    dryCleaning?: string; // "Not recommended"
  };
};
