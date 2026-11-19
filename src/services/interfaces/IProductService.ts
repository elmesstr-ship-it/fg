import { Category, Product, ProductReview } from "@/types/product";

export interface IProductService {
  getProducts(params?: {
    category?: string;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "newest" | "price_asc" | "price_desc" | "rating";
  }): Promise<Product[]>;

  getProductBySlug(slug: string): Promise<Product | null>;
  getProductById(id: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  getFeaturedProducts(): Promise<Product[]>;
  getRelatedProducts(productId: string, categoryId: string): Promise<Product[]>;
  
  // Administrative Operations
  createProduct(data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">): Promise<Product>;
  updateProduct(id: string, data: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  updateProductStock(productId: string, delta: number, source?: "admin_dashboard" | "telegram_bot"): Promise<Product>;
  
  // Reviews
  addReview(productId: string, review: Omit<ProductReview, "id" | "createdAt">): Promise<ProductReview>;
  getProductReviews(productId: string): Promise<ProductReview[]>;
}
