export type ShipmentStatus =
  | "created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "cancelled";

export interface ShipmentCheckpoint {
  status: ShipmentStatus;
  timestamp: string;
  location: string;
  notes: string;
}

export interface CreateShipmentRequest {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: {
    governorate: string;
    city: string;
    streetAddress: string;
    notes?: string;
  };
  packageDetails: {
    itemsCount: number;
    description: string;
    weightKg?: number;
  };
  codAmount: number;
  providerKey?: string; // "bosta" | "manual" | "aramex"
  manualTrackingNumber?: string;
}

export interface CreateShipmentResult {
  success: boolean;
  shipmentId: string;
  trackingNumber: string;
  providerKey: string;
  providerName: string;
  status: ShipmentStatus;
  shippingFee: number;
  estimatedDelivery?: string;
  trackingUrl?: string;
}

export interface TrackingInfo {
  shipmentId: string;
  orderId: string;
  orderNumber: string;
  trackingNumber: string;
  providerKey: string;
  providerName: string;
  status: ShipmentStatus;
  shippingFee: number;
  codAmount: number;
  recipient: {
    name: string;
    phone: string;
    governorate: string;
    city: string;
    streetAddress: string;
  };
  checkpoints: ShipmentCheckpoint[];
  estimatedDelivery?: string;
  courierNotes?: string;
  createdAt: string;
  updatedAt: string;
}
