import { IProductService } from "../interfaces/IProductService";
import { Category, Product, ProductReview } from "@/types/product";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_REVIEWS } from "./mockData";

export class MockProductService implements IProductService {
  private products: Product[] = [...MOCK_PRODUCTS];
  private categories: Category[] = [...MOCK_CATEGORIES];
  private reviews: Record<string, ProductReview[]> = { ...MOCK_REVIEWS };

  async getProducts(params?: {
    category?: string;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "newest" | "price_asc" | "price_desc" | "rating";
  }): Promise<Product[]> {
    let result = [...this.products];

    if (params?.category) {
      result = result.filter(
        (p) =>
          p.categoryId === params.category ||
          p.categoryName.en.toLowerCase().includes(params.category!.toLowerCase()) ||
          p.slug.includes(params.category!)
      );
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.ar.toLowerCase().includes(q) ||
          p.name.en.toLowerCase().includes(q) ||
          p.shortDescription.ar.toLowerCase().includes(q) ||
          p.shortDescription.en.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (params?.isFeatured !== undefined) {
      result = result.filter((p) => p.isFeatured === params.isFeatured);
    }

    if (params?.isBestSeller !== undefined) {
      result = result.filter((p) => p.isBestSeller === params.isBestSeller);
    }

    if (params?.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
        default:
          result.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    return result;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const found = this.products.find((p) => p.slug === slug);
    return found ? { ...found } : null;
  }

  async getProductById(id: string): Promise<Product | null> {
    const found = this.products.find((p) => p.id === id);
    return found ? { ...found } : null;
  }

  async getCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const found = this.categories.find((c) => c.slug === slug);
    return found ? { ...found } : null;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.products.filter((p) => p.isFeatured);
  }

  async getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
    return this.products
      .filter((p) => p.categoryId === categoryId && p.id !== productId)
      .slice(0, 4);
  }

  async createProduct(
    data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">
  ): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: "prod-" + Date.now(),
      createdAt: new Date().toISOString(),
      rating: 5.0,
      reviewCount: 0,
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Product not found");
    this.products[idx] = { ...this.products[idx], ...data };
    return this.products[idx];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const prevLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < prevLen;
  }

  async updateProductStock(
    productId: string,
    delta: number,
    _source: "admin_dashboard" | "telegram_bot" = "admin_dashboard"
  ): Promise<Product> {
    const idx = this.products.findIndex((p) => p.id === productId);
    if (idx === -1) throw new Error("Product not found");
    const updated = {
      ...this.products[idx],
      stock: Math.max(0, this.products[idx].stock + delta),
    };
    this.products[idx] = updated;
    return updated;
  }

  async addReview(
    productId: string,
    review: Omit<ProductReview, "id" | "createdAt">
  ): Promise<ProductReview> {
    const newReview: ProductReview = {
      ...review,
      id: "rev-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    if (!this.reviews[productId]) {
      this.reviews[productId] = [];
    }
    this.reviews[productId].unshift(newReview);

    // Update product rating
    const pIdx = this.products.findIndex((p) => p.id === productId);
    if (pIdx > -1) {
      const allRevs = this.reviews[productId];
      const avg = allRevs.reduce((s, r) => s + r.rating, 0) / allRevs.length;
      this.products[pIdx].rating = Number(avg.toFixed(1));
      this.products[pIdx].reviewCount = allRevs.length;
    }

    return newReview;
  }

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    return this.reviews[productId] || [];
  }
}

export const productService = new MockProductService();
