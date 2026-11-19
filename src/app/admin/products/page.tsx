"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Product, Category } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/adminApi";
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  RefreshCw,
} from "lucide-react";

export default function AdminProductsPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // New Product Form State
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    sku: "",
    categoryId: "",
    price: 1000,
    originalPrice: 1200,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminFetch<Product[]>("/api/products"),
        adminFetch<Category[]>("/api/categories"),
      ]);

      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
      }
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: catRes.data![0].id }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "all" || p.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleUpdateStock = async (product: Product, delta: number) => {
    setActionLoading(true);
    const res = await adminFetch<Product>(`/api/products/${product.slug}`, {
      method: "PATCH",
      body: JSON.stringify({ stockDelta: delta, source: "admin_dashboard" }),
    });
    setActionLoading(false);

    if (res.success && res.data) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: res.data!.stock } : p))
      );
      showFeedback(
        locale === "ar"
          ? `تم تحديث المخزون (${res.data.stock} قطعة)`
          : `Stock updated to ${res.data.stock} units`
      );
    } else {
      showFeedback(res.error || "Failed to update stock", "error");
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (
      !confirm(
        locale === "ar"
          ? `هل أنت متأكد من حذف الصنف (${product.name.ar}) نهائياً من قاعدة البيانات؟`
          : `Permanently delete (${product.name.en}) from database?`
      )
    ) {
      return;
    }

    setActionLoading(true);
    const res = await adminFetch(`/api/products/${product.slug}`, {
      method: "DELETE",
    });
    setActionLoading(false);

    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      showFeedback(
        locale === "ar" ? "تم حذف الصنف من قاعدة البيانات بنجاح" : "Product deleted from database"
      );
    } else {
      showFeedback(res.error || "Failed to delete product", "error");
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr || !formData.nameEn || !formData.sku) {
      showFeedback(locale === "ar" ? "برجاء استكمال كافة الحقول المطلوبة" : "Please fill all required fields", "error");
      return;
    }

    setActionLoading(true);
    const targetCat = categories.find((c) => c.id === formData.categoryId) || categories[0];

    const payload = {
      name: { ar: formData.nameAr, en: formData.nameEn },
      sku: formData.sku.toUpperCase().trim(),
      categoryId: targetCat ? targetCat.id : "general",
      categoryName: targetCat ? { ar: targetCat.name.ar, en: targetCat.name.en } : { ar: "قسم عام", en: "General" },
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      stock: Number(formData.stock),
      images: [formData.imageUrl],
      shortDescription: { ar: "صنف كنسي مبارك جديد", en: "Newly commissioned church item" },
      fullDescription: { ar: "مقتنى كنسي فاخر تمت إضافته للمخزون", en: "Sacred ecclesiastical offering" },
    };

    const res = await adminFetch<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setActionLoading(false);

    if (res.success && res.data) {
      setProducts([res.data, ...products]);
      setIsModalOpen(false);
      setFormData({
        nameAr: "",
        nameEn: "",
        sku: "",
        categoryId: categories[0]?.id || "",
        price: 1000,
        originalPrice: 1200,
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800",
      });
      showFeedback(
        locale === "ar"
          ? `تمت إضافة الصنف (${res.data.name.ar}) وحفظه في قاعدة البيانات`
          : `Product (${res.data.name.en}) created and persisted in database`
      );
    } else {
      showFeedback(res.error || "Failed to create product", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <Package className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.products}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "إدارة المخزون الكنسي، تعديل الأسعار، ومتابعة الكميات المسجلة في قاعدة البيانات مباشرة"
              : "Live database catalog, inventory adjustments, and real-time stock sync"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            className="rounded-xl"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>{locale === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>

          <Button
            variant="gold"
            size="md"
            className="rounded-xl shadow-sacred"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            <span>{locale === "ar" ? "إضافة صنف كنسي جديد" : "Add New Offering"}</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-theme-surface p-4 rounded-2xl border border-theme-border">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder={locale === "ar" ? "ابحث بالاسم أو رمز SKU..." : "Search by title or SKU..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
          />
          <Search className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-theme-gold" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none"
          >
            <option value="all">{locale === "ar" ? "جميع الأقسام" : "All Categories"}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[locale]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-theme-surface-elevated animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-theme-surface border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لا توجد أصناف في قاعدة البيانات حالياً." : "No products found in database."}
          </p>
        </div>
      ) : (
        <div className="bg-theme-surface rounded-2xl border border-theme-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-theme-surface-elevated/60 text-theme-text-muted border-b border-theme-border">
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الصورة والاسم" : "Product"}</th>
                  <th className="py-3 px-4 text-start font-semibold">SKU</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "القسم" : "Category"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "السعر" : "Price"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "المخزون والكمية" : "Stock Level"}</th>
                  <th className="py-3 px-4 text-end font-semibold">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/40">
                {filteredProducts.map((prod) => {
                  const isLowStock = prod.stock <= 10;
                  return (
                    <tr key={prod.id} className="hover:bg-theme-surface-elevated/40 transition-colors">
                      {/* Image and Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-theme-surface-elevated border border-theme-border flex-shrink-0">
                            <Image
                              src={prod.images && prod.images[0] ? prod.images[0] : "https://placehold.co/100x100"}
                              alt={prod.name[locale]}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-sacred font-bold text-theme-text block line-clamp-1">
                              {prod.name[locale]}
                            </span>
                            <span className="text-[10px] text-theme-text-muted block">
                              {locale === "ar" ? "تقييم:" : "Rating:"} {prod.rating} ★ ({prod.reviewCount})
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono font-bold text-theme-gold">{prod.sku}</td>

                      {/* Category */}
                      <td className="py-3 px-4 text-theme-text-muted">
                        {prod.categoryName ? prod.categoryName[locale] : "—"}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-bold text-theme-text">
                        {prod.price.toLocaleString()} {t.common.priceEGP}
                      </td>

                      {/* Stock Level with Quick Stepper */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              prod.stock === 0
                                ? "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800"
                                : isLowStock
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            }`}
                          >
                            {isLowStock && <AlertTriangle className="w-3 h-3 flex-shrink-0" />}
                            <span>
                              {prod.stock} {locale === "ar" ? "قطع" : "units"}
                            </span>
                          </div>

                          {/* Live Database Stepper */}
                          <div className="flex items-center gap-1">
                            <button
                              disabled={actionLoading || prod.stock <= 0}
                              onClick={() => handleUpdateStock(prod, -1)}
                              title={locale === "ar" ? "إنقاص حبة واحدة" : "Decrease stock by 1"}
                              className="w-6 h-6 rounded-md bg-theme-surface-elevated hover:bg-theme-border text-theme-text flex items-center justify-center font-bold text-xs disabled:opacity-40"
                            >
                              -
                            </button>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleUpdateStock(prod, 1)}
                              title={locale === "ar" ? "زيادة حبة واحدة" : "Increase stock by 1"}
                              className="w-6 h-6 rounded-md bg-theme-surface-elevated hover:bg-theme-border text-theme-text flex items-center justify-center font-bold text-xs disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-end">
                        <button
                          disabled={actionLoading}
                          onClick={() => handleDeleteProduct(prod)}
                          title={locale === "ar" ? "حذف نهائي" : "Delete product"}
                          className="p-1.5 rounded-lg text-theme-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface border border-theme-border rounded-3xl max-w-lg w-full p-6 shadow-sacred animate-scale-in">
            <div className="flex items-center justify-between border-b border-theme-border pb-3 mb-4">
              <h2 className="font-sacred font-bold text-base text-theme-text flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-theme-gold" />
                <span>{locale === "ar" ? "إضافة صنف كنسي مبارك جديد" : "Add Liturgical Item"}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-theme-text-muted hover:text-theme-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "الاسم بالعربية" : "Name (Arabic)"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مجمرة طقسية نحاسية مذهبة"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "الاسم بالإنجليزية" : "Name (English)"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imperial Liturgical Brass Censer"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-theme-text mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ALTR-CENS-03"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text font-mono outline-none focus:ring-2 focus:ring-theme-gold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-theme-text mb-1">
                    {locale === "ar" ? "القسم الكنسي" : "Category"} *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[locale]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-theme-text mb-1">
                    {locale === "ar" ? "السعر (ج.م.)" : "Price (EGP)"} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-theme-text mb-1">
                    {locale === "ar" ? "السعر قبل الخصم" : "Original Price"}
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-theme-text mb-1">
                    {locale === "ar" ? "رصيد المخزون" : "Stock"} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "رابط الصورة" : "Image URL"}
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-theme-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="gold" size="sm" disabled={actionLoading}>
                  {actionLoading
                    ? locale === "ar" ? "جار الحفظ في قاعدة البيانات..." : "Saving..."
                    : locale === "ar" ? "حفظ في قاعدة البيانات" : "Save to Database"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
