export interface CustomerAddress {
  id: string;
  isDefault: boolean;
  title: string;
  fullName: string;
  phone: string;
  governorate: string;
  city: string;
  streetAddress: string;
  notes?: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  parishName?: string; // Brand club tier or membership status
  role: "USER" | "ADMIN";
  createdAt: string;
  totalOrdersCount: number;
  totalSpent: number;
  addresses: CustomerAddress[];
  isVerified: boolean;
}
