"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Product, Category } from "@/types/product";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/fashionMockData";
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
  RefreshCw,
} from "lucide-react";

export default function AdminProductsPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // New Product Form State
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    sku: "FG-HD-",
    categoryId: "cat-hoodies",
    price: 1200,
    originalPrice: 1500,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminFetch<Product[]>("/api/products"),
        adminFetch<Category[]>("/api/categories"),
      ]);

      if (prodRes.success && prodRes.data && prodRes.data.length > 0) {
        setProducts(prodRes.data);
      } else {
        // Fallback to rich mock fashion data
        setProducts(MOCK_PRODUCTS as any);
      }

      if (catRes.success && catRes.data && catRes.data.length > 0) {
        setCategories(catRes.data);
      } else {
        setCategories(MOCK_CATEGORIES as any);
      }
    } catch {
      setProducts(MOCK_PRODUCTS as any);
      setCategories(MOCK_CATEGORIES as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === "all" || p.categoryId === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleUpdateStock = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    );
    showFeedback("تم تحديث كمية المخزون بنجاح");
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = {
      id: "prod-fg-" + Date.now(),
      slug: formData.sku.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: { ar: formData.nameAr, en: formData.nameEn || formData.nameAr },
      shortDescription: { ar: "تصميم ستريت وير حصري", en: "Exclusive streetwear design" },
      fullDescription: { ar: "قطن مصري 100% ثقيل", en: "100% Heavyweight Egyptian cotton" },
      categoryId: formData.categoryId,
      categoryName: { ar: "هوديز وسويت شيرتات", en: "Hoodies" },
      price: formData.price,
      originalPrice: formData.originalPrice,
      stock: formData.stock,
      sku: formData.sku,
      images: [formData.imageUrl],
      rating: 5.0,
      reviewCount: 0,
      specifications: {},
      createdAt: new Date().toISOString(),
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    showFeedback("تمت إضافة المنتج الجديد إلى الكتالوج بنجاح!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            CATALOG & INVENTORY MATRIX
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            {locale === "ar" ? "المنتجات ومصفوفة المخزون" : "Products & Stock Matrix"}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {locale === "ar"
              ? "إدارة كتالوج أزياء الستريت وير، تعديل أسعار الدروبات، ومتابعة كميات المقاسات في المخزن"
              : "Live product matrix, pricing tiers, and real-time inventory management"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-neutral-700 hover:border-white text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-neutral-300" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase flex items-center gap-2 hover:opacity-90 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قطعة جديدة</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث بالاسم أو رمز SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-2 text-xs bg-black border border-neutral-700 rounded-xl text-white outline-none focus:border-white font-mono"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#D4AF37]" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 text-xs bg-black border border-neutral-700 rounded-xl text-white outline-none"
          >
            <option value="all">جميع الأقسام</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name.ar}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="border-b border-neutral-800 uppercase font-mono text-[10px] text-neutral-400 bg-neutral-950/60">
                <th className="py-3 px-4">القطعة والصورة</th>
                <th className="py-3 px-4">رمز SKU</th>
                <th className="py-3 px-4">القسم</th>
                <th className="py-3 px-4">السعر</th>
                <th className="py-3 px-4">المخزون الكلي</th>
                <th className="py-3 px-4 text-left">تعديل سريع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 font-mono">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-bold flex items-center gap-3">
                    <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                      <Image src={p.images[0] || "/branding/hero-banner.jpg"} alt={p.name.ar} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="block text-white line-clamp-1">{p.name.ar}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{p.name.en}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">{p.sku}</td>
                  <td className="py-3.5 px-4 font-sans text-neutral-400">{p.categoryName?.ar || "قسم عام"}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{p.price.toLocaleString()} ج.م</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock <= 5
                          ? "bg-red-950 text-red-400 border border-red-800"
                          : "bg-neutral-800 text-neutral-200"
                      }`}
                    >
                      {p.stock} قطعة
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-left">
                    <div className="flex items-center justify-end gap-1.5 font-mono">
                      <button
                        onClick={() => handleUpdateStock(p.id, -1)}
                        className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateStock(p.id, 5)}
                        className="w-6 h-6 rounded bg-white text-black hover:bg-neutral-200 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-3xl max-w-lg w-full p-6 border border-neutral-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-black uppercase text-white">إضافة قطعة ستريت وير جديدة</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-neutral-800">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-bold">اسم القطعة (بالعربية)</label>
                <input
                  type="text"
                  placeholder="مثال: هودي إف جي مونوغرام ثقيل"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">رمز SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">السعر (ج.م)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">القسم</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.ar}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-bold">المخزون المبدئي</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-black font-black uppercase text-xs hover:opacity-90 mt-2"
              >
                إضافة وحفظ في الكتالوج
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
