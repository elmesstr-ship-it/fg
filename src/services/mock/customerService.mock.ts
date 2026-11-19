import { ICustomerService } from "../interfaces/ICustomerService";
import { Customer, CustomerAddress } from "@/types/customer";
import { MOCK_CUSTOMERS } from "./mockData";

export class MockCustomerService implements ICustomerService {
  private customers: Customer[] = [...MOCK_CUSTOMERS];

  async getCustomers(): Promise<Customer[]> {
    return [...this.customers];
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const found = this.customers.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  async getCurrentCustomer(): Promise<Customer> {
    // Return first customer as default logged in user
    return { ...this.customers[0] };
  }

  async updateProfile(id: string, data: Partial<Customer>): Promise<Customer> {
    const idx = this.customers.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Customer not found");
    this.customers[idx] = { ...this.customers[idx], ...data };
    return { ...this.customers[idx] };
  }

  async addAddress(customerId: string, address: Omit<CustomerAddress, "id">): Promise<CustomerAddress> {
    const customer = this.customers.find((c) => c.id === customerId);
    if (!customer) throw new Error("Customer not found");

    const newAddr: CustomerAddress = {
      ...address,
      id: "addr-" + Date.now(),
    };

    if (newAddr.isDefault) {
      customer.addresses.forEach((a) => (a.isDefault = false));
    }

    customer.addresses.push(newAddr);
    return newAddr;
  }

  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    const customer = this.customers.find((c) => c.id === customerId);
    if (!customer) return false;
    const prevLen = customer.addresses.length;
    customer.addresses = customer.addresses.filter((a) => a.id !== addressId);
    return customer.addresses.length < prevLen;
  }

  async setDefaultAddress(customerId: string, addressId: string): Promise<boolean> {
    const customer = this.customers.find((c) => c.id === customerId);
    if (!customer) return false;
    customer.addresses.forEach((a) => {
      a.isDefault = a.id === addressId;
    });
    return true;
  }
}

export const customerService = new MockCustomerService();
