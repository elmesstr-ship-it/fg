import {
  CreateShipmentRequest,
  CreateShipmentResult,
  ShipmentStatus,
  TrackingInfo,
} from "../types";

export interface IShippingProvider {
  readonly key: string;
  readonly name: string;

  /**
   * Confirms whether third-party carrier API credentials (e.g. Bosta API Key) are verified.
   * If credentials are unavailable, falls back gracefully to manual shipping workflow.
   */
  isApiConfigured(): Promise<boolean> | boolean;

  /**
   * Calculate shipping rate according to destination Egyptian governorate.
   */
  calculateShippingFee(governorate: string, orderSubtotal: number): Promise<number>;

  /**
   * Register a new delivery shipment with the third-party courier.
   */
  createShipment(req: CreateShipmentRequest): Promise<CreateShipmentResult>;

  /**
   * Fetch latest tracking updates and checkpoints from courier API or system.
   */
  getTracking(trackingNumber: string): Promise<TrackingInfo | null>;

  /**
   * Update shipment status manually (for manual dispatch or courier override).
   */
  updateStatus(
    trackingNumber: string,
    newStatus: ShipmentStatus,
    location?: string,
    notes?: string
  ): Promise<TrackingInfo>;

  /**
   * Optional webhook parser for carrier real-time push events.
   */
  handleWebhook?(payload: any, signature?: string): Promise<{
    trackingNumber: string;
    newStatus: ShipmentStatus;
    location?: string;
    notes?: string;
  }>;
}
