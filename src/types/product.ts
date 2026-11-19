export interface Category {
  id: string;
  slug: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image: string;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  sku: string;
  price: number;
  stock: number;
  attributes?: Record<string, string>;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: {
    ar: string;
    en: string;
  };
  shortDescription: {
    ar: string;
    en: string;
  };
  fullDescription: {
    ar: string;
    en: string;
  };
  categoryId: string;
  categoryName: {
    ar: string;
    en: string;
  };
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  sku: string;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating: number;
  reviewCount: number;
  specifications: Record<string, { ar: string; en: string }>;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  createdAt: string;
}
