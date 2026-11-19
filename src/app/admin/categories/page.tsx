"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Category } from "@/types/product";
import { MOCK_CATEGORIES } from "@/lib/fashionMockData";
import { adminFetch } from "@/lib/adminApi";
import { FolderTree, Plus, Trash2, X, RefreshCw, CheckCircle2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [newCat, setNewCat] = useState({
    nameAr: "",
    nameEn: "",
    slug: "",
    descAr: "",
    descEn: "",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await adminFetch<Category[]>("/api/categories");
      if (res.success && res.data && res.data.length > 0) {
        setCategories(res.data);
      } else {
        setCategories(MOCK_CATEGORIES as any);
      }
    } catch {
      setCategories(MOCK_CATEGORIES as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Category = {
      id: "cat-" + Date.now(),
      slug: newCat.slug || newCat.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: { ar: newCat.nameAr, en: newCat.nameEn },
      description: { ar: newCat.descAr || "تصنيف أزياء جديد", en: newCat.descEn || "New Fashion Category" },
      image: newCat.image,
      itemCount: 0,
    };

    setCategories([...categories, created]);
    setIsModalOpen(false);
    showFeedback(`تم إنشاء القسم (${created.name.ar}) بنجاح`);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            COLLECTIONS & DEPARTMENTS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mt-1">
            {t.admin.categories}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {locale === "ar"
              ? "إدارة أقسام متجر FG Collective، الصور التعريفية، وعدد القطع المتاحة"
              : "Manage brand collections, cover banners, and active piece counts"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCategories}
            className="p-2.5 rounded-xl border border-neutral-700 hover:border-white text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-neutral-300" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-black text-xs uppercase flex items-center gap-2 hover:opacity-90 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قسم جديد</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-4 shadow-md"
          >
            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
              <Image src={cat.image || "/branding/hero-banner.jpg"} alt={cat.name.ar} fill className="object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono font-bold uppercase text-[#D4AF37]">
                {cat.itemCount || 0} قطع متوفرة
              </span>
              <h3 className="text-sm font-black text-white truncate">{cat.name.ar}</h3>
              <p className="text-[11px] text-neutral-400 line-clamp-1">{cat.description.ar}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-3xl max-w-md w-full p-6 border border-neutral-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-black uppercase text-white">إضافة تصنيف جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-neutral-800">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-bold">اسم القسم (بالعربية)</label>
                <input
                  type="text"
                  value={newCat.nameAr}
                  onChange={(e) => setNewCat({ ...newCat, nameAr: e.target.value })}
                  placeholder="مثال: تيشرتات أوفرسايز"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">Name (English)</label>
                <input
                  type="text"
                  value={newCat.nameEn}
                  onChange={(e) => setNewCat({ ...newCat, nameEn: e.target.value })}
                  placeholder="e.g. Oversized Tees"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-bold">الوصف المختصر</label>
                <textarea
                  value={newCat.descAr}
                  onChange={(e) => setNewCat({ ...newCat, descAr: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-700 bg-black text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-white text-black font-black uppercase text-xs hover:opacity-90 mt-2"
              >
                حفظ وإضافة القسم
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
