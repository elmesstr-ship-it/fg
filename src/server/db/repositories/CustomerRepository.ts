import { ICustomerService } from "@/services/interfaces/ICustomerService";
import { Customer, CustomerAddress } from "@/types/customer";
import prisma from "../prisma";

export class PrismaCustomerRepository implements ICustomerService {
  private formatCustomer(u: any): Customer {
    const totalSpent = (u.orders || []).reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const addresses: CustomerAddress[] = (u.addresses || []).map((a: any) => ({
      id: a.id,
      title: a.title,
      fullName: a.fullName,
      phone: a.phone,
      governorate: a.governorate,
      city: a.city,
      streetAddress: a.streetAddress,
      notes: a.notes || undefined,
      isDefault: a.isDefault,
    }));

    return {
      id: u.id,
      fullName: u.profile?.fullName || u.email.split("@")[0],
      email: u.email,
      phone: u.phone,
      avatarUrl: u.profile?.avatarUrl || undefined,
      parishName: u.profile?.parishName || undefined,
      role: (u.role as "USER" | "ADMIN") || "USER",
      createdAt: u.createdAt.toISOString(),
      totalOrdersCount: u.orders ? u.orders.length : 0,
      totalSpent,
      addresses,
      isVerified: u.isEmailVerified || u.isPhoneVerified,
    };
  }

  async getCustomers(): Promise<Customer[]> {
    const raw = await prisma.user.findMany({
      include: {
        profile: true,
        addresses: true,
        orders: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return raw.map((u) => this.formatCustomer(u));
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const u = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        addresses: true,
        orders: true,
      },
    });
    return u ? this.formatCustomer(u) : null;
  }

  async getCurrentCustomer(): Promise<Customer> {
    // Return primary customer user
    const u = await prisma.user.findFirst({
      where: { role: "USER" },
      include: {
        profile: true,
        addresses: true,
        orders: true,
      },
    });

    if (!u) {
      // Return any user or fallback
      const anyUser = await prisma.user.findFirst({
        include: { profile: true, addresses: true, orders: true },
      });
      if (anyUser) return this.formatCustomer(anyUser);
      throw new Error("No customer found in database");
    }

    return this.formatCustomer(u);
  }

  async updateProfile(id: string, data: Partial<Customer>): Promise<Customer> {
    // Update user profile
    await prisma.profile.upsert({
      where: { userId: id },
      update: {
        fullName: data.fullName,
        avatarUrl: data.avatarUrl,
        parishName: data.parishName,
      },
      create: {
        userId: id,
        fullName: data.fullName || "User",
        avatarUrl: data.avatarUrl,
        parishName: data.parishName,
      },
    });

    if (data.phone) {
      await prisma.user.update({
        where: { id },
        data: { phone: data.phone },
      });
    }

    const updated = await this.getCustomerById(id);
    if (!updated) throw new Error("Failed to retrieve updated profile");
    return updated;
  }

  async addAddress(customerId: string, address: Omit<CustomerAddress, "id">): Promise<CustomerAddress> {
    if (address.isDefault) {
      await prisma.address.updateMany({
        where: { userId: customerId },
        data: { isDefault: false },
      });
    }

    const created = await prisma.address.create({
      data: {
        userId: customerId,
        title: address.title,
        fullName: address.fullName,
        phone: address.phone,
        governorate: address.governorate,
        city: address.city,
        streetAddress: address.streetAddress,
        notes: address.notes,
        isDefault: address.isDefault,
      },
    });

    return {
      id: created.id,
      title: created.title,
      fullName: created.fullName,
      phone: created.phone,
      governorate: created.governorate,
      city: created.city,
      streetAddress: created.streetAddress,
      notes: created.notes || undefined,
      isDefault: created.isDefault,
    };
  }

  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    await prisma.address.delete({
      where: { id: addressId },
    });
    return true;
  }

  async setDefaultAddress(customerId: string, addressId: string): Promise<boolean> {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: customerId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      }),
    ]);
    return true;
  }
}

export const customerPrismaRepository = new PrismaCustomerRepository();
