import { Customer, CustomerAddress } from "@/types/customer";

export interface ICustomerService {
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
  getCurrentCustomer(): Promise<Customer>;
  updateProfile(id: string, data: Partial<Customer>): Promise<Customer>;
  addAddress(customerId: string, address: Omit<CustomerAddress, "id">): Promise<CustomerAddress>;
  deleteAddress(customerId: string, addressId: string): Promise<boolean>;
  setDefaultAddress(customerId: string, addressId: string): Promise<boolean>;
}
