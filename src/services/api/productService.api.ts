import { IProductService } from "../interfaces/IProductService";
import { Category, Product, ProductReview } from "@/types/product";
import { api } from "@/lib/apiClient";

export class ApiProductService implements IProductService {
  async getProducts(params?: {
    category?: string;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "newest" | "price_asc" | "price_desc" | "rating";
  }): Promise<Product[]> {
    return api.get<Product[]>("/api/products", params);
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      return await api.get<Product>(`/api/products/${slug}`);
    } catch (err) {
      return null;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.getProductBySlug(id);
  }

  async getCategories(): Promise<Category[]> {
    return api.get<Category[]>("/api/categories");
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cats = await this.getCategories();
    return cats.find((c) => c.slug === slug) || null;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return api.get<Product[]>("/api/products", { isFeatured: true });
  }

  async getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
    const prods = await this.getProducts({ category: categoryId });
    return prods.filter((p) => p.id !== productId).slice(0, 4);
  }

  async createProduct(data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">): Promise<Product> {
    return api.post<Product>("/api/products", data);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return api.patch<Product>(`/api/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<boolean> {
    const res = await api.delete<{ deleted: boolean }>(`/api/products/${id}`);
    return res.deleted;
  }

  async updateProductStock(
    productId: string,
    delta: number,
    source: "admin_dashboard" | "telegram_bot" = "admin_dashboard"
  ): Promise<Product> {
    return api.patch<Product>(`/api/products/${productId}`, { stockDelta: delta, source });
  }

  async addReview(productId: string, review: Omit<ProductReview, "id" | "createdAt">): Promise<ProductReview> {
    return api.post<ProductReview>(`/api/products/${productId}/reviews`, review);
  }

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    return api.get<ProductReview[]>(`/api/products/${productId}/reviews`);
  }
}

export const productApiService = new ApiProductService();
