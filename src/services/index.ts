/**
 * Centralized Data Access Layer (DAL) & API Services Registry
 * 
 * Provides decoupled access to all platform entities through strict TypeScript interfaces.
 * Frontend components communicate with the backend via REST API Clients (`apiDb` or `db`).
 * In SSR / Server execution, requests bind directly to the production Prisma database repository layer.
 */

// Prisma Database Repositories (Server / Database Layer)
import { productPrismaRepository } from "@/server/db/repositories/ProductRepository";
import { orderPrismaRepository } from "@/server/db/repositories/OrderRepository";
import { customerPrismaRepository } from "@/server/db/repositories/CustomerRepository";
import { inventoryPrismaRepository } from "@/server/db/repositories/InventoryRepository";
import { couponPrismaRepository } from "@/server/db/repositories/CouponRepository";
import { notificationPrismaRepository } from "@/server/db/repositories/NotificationRepository";
import { analyticsPrismaRepository } from "@/server/db/repositories/AnalyticsRepository";

// API Clients Layer (Client-side communicates through REST endpoints)
import { productApiService } from "./api/productService.api";
import { orderApiService } from "./api/orderService.api";
import { couponApiService } from "./api/couponService.api";
import { notificationApiService } from "./api/notificationService.api";
import { analyticsApiService } from "./api/analyticsService.api";

// Re-export both for explicit usage
export {
  // Prisma Server Repositories
  productPrismaRepository as productService,
  orderPrismaRepository as orderService,
  customerPrismaRepository as customerService,
  inventoryPrismaRepository as inventoryService,
  couponPrismaRepository as couponService,
  notificationPrismaRepository as notificationService,
  analyticsPrismaRepository as analyticsService,

  // REST API Client Services
  productApiService,
  orderApiService,
  couponApiService,
  notificationApiService,
  analyticsApiService,
};

// Default Database Facade for UI Components & Server Handlers
// (Hybrid: Uses REST API on client, real Prisma repository on server)
export const db = {
  products: typeof window !== "undefined" ? productApiService : productPrismaRepository,
  orders: typeof window !== "undefined" ? orderApiService : orderPrismaRepository,
  customers: customerPrismaRepository,
  inventory: inventoryPrismaRepository,
  coupons: typeof window !== "undefined" ? couponApiService : couponPrismaRepository,
  notifications: typeof window !== "undefined" ? notificationApiService : notificationPrismaRepository,
  analytics: typeof window !== "undefined" ? analyticsApiService : analyticsPrismaRepository,
};

export default db;
