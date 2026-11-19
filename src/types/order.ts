export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = 
  | "cash_on_delivery"
  | "credit_card"
  | "vodafone_cash";

export type PaymentStatus = 
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  altPhone?: string;
  governorate: string;
  city: string;
  streetAddress: string;
  buildingDetails?: string;
  postalCode?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: {
    ar: string;
    en: string;
  };
  productImage: string;
  price: number;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  shippingProvider?: string;
  createdAt: string;
  updatedAt: string;
}
