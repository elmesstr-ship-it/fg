"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Category } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/adminApi";
import { FolderTree, Plus, Trash2, X, Sparkles, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AdminCategoriesPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [newCat, setNewCat] = useState({
    nameAr: "",
    nameEn: "",
    slug: "",
    descAr: "",
    descEn: "",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800",
  });

  const loadCategories = async () => {
    setLoading(true);
    const res = await adminFetch<Category[]>("/api/categories");
    if (res.success && res.data) {
      setCategories(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !confirm(
        locale === "ar"
          ? `هل أنت متأكد من حذف القسم (${name}) نهائياً من قاعدة البيانات؟`
          : `Permanently delete category (${name}) from database?`
      )
    ) {
      return;
    }

    setActionLoading(true);
    const res = await adminFetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    setActionLoading(false);

    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showFeedback(locale === "ar" ? "تم حذف القسم بنجاح" : "Category deleted from database");
    } else {
      showFeedback(res.error || "Failed to delete category", "error");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.nameAr || !newCat.nameEn) {
      showFeedback(locale === "ar" ? "يرجى كتابة اسم القسم" : "Please enter category name", "error");
      return;
    }

    setActionLoading(true);
    const payload = {
      slug: newCat.slug || newCat.nameEn.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: { ar: newCat.nameAr, en: newCat.nameEn },
      description: { ar: newCat.descAr || "قسم كنسي جديد", en: newCat.descEn || "New Church Department" },
      image: newCat.image,
    };

    const res = await adminFetch<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    setActionLoading(false);

    if (res.success && res.data) {
      setCategories([...categories, res.data]);
      setIsModalOpen(false);
      setNewCat({
        nameAr: "",
        nameEn: "",
        slug: "",
        descAr: "",
        descEn: "",
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800",
      });
      showFeedback(
        locale === "ar"
          ? `تم إنشاء القسم (${res.data.name.ar}) وحفظه في قاعدة البيانات`
          : `Category (${res.data.name.en}) created in database`
      );
    } else {
      showFeedback(res.error || "Failed to create category", "error");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.categories}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "إدارة أقسام المتجر الكنسي المحفوظة بقاعدة البيانات، الصور البانورامية، وعدد الأصناف المعروضة"
              : "Manage store departments, banners, and classifications persisted in database"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadCategories} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>{locale === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>

          <Button variant="gold" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
            <span>{locale === "ar" ? "إضافة قسم جديد" : "Add Department"}</span>
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

      {/* Categories Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-theme-surface animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-theme-surface border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لا توجد أقسام مسجلة." : "No categories found."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-theme-surface border border-theme-border shadow-sm flex flex-col justify-between space-y-4 hover:border-theme-gold/60 transition-all"
            >
              <div className="flex gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-theme-surface-elevated border border-theme-border flex-shrink-0">
                  <Image src={cat.image} alt={cat.name[locale]} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sacred font-bold text-sm text-theme-text">{cat.name[locale]}</h3>
                    <span className="text-[10px] font-bold text-theme-gold bg-theme-gold/10 px-2 py-0.5 rounded-full">
                      {cat.itemCount} {locale === "ar" ? "أصناف" : "items"}
                    </span>
                  </div>
                  <p className="text-xs text-theme-text-muted mt-1 line-clamp-2 leading-relaxed">
                    {cat.description[locale]}
                  </p>
                  <span className="text-[10px] font-mono text-theme-text-muted mt-1 block">/{cat.slug}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-theme-border/50 pt-3">
                <button
                  disabled={actionLoading}
                  onClick={() => handleDelete(cat.id, cat.name[locale])}
                  className="flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{locale === "ar" ? "حذف نهائي" : "Delete"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface border border-theme-border rounded-3xl max-w-md w-full p-6 shadow-sacred animate-scale-in">
            <div className="flex items-center justify-between border-b border-theme-border pb-3 mb-4">
              <h2 className="font-sacred font-bold text-base text-theme-text flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-theme-gold" />
                <span>{locale === "ar" ? "إضافة قسم كنسي جديد" : "Add Department"}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-theme-text-muted hover:text-theme-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "اسم القسم بالعربية" : "Name (Arabic)"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الصلبان والميداليات الكنسية"
                  value={newCat.nameAr}
                  onChange={(e) => setNewCat({ ...newCat, nameAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "اسم القسم بالإنجليزية" : "Name (English)"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Holy Crosses & Medallions"
                  value={newCat.nameEn}
                  onChange={(e) => setNewCat({ ...newCat, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "الوصف بالعربية" : "Description (Arabic)"}
                </label>
                <textarea
                  rows={2}
                  value={newCat.descAr}
                  onChange={(e) => setNewCat({ ...newCat, descAr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "رابط الصورة البانورامية" : "Banner Image URL"}
                </label>
                <input
                  type="url"
                  required
                  value={newCat.image}
                  onChange={(e) => setNewCat({ ...newCat, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-theme-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="gold" size="sm" disabled={actionLoading}>
                  {actionLoading
                    ? locale === "ar" ? "جار الحفظ..." : "Saving..."
                    : locale === "ar" ? "حفظ القسم بقاعدة البيانات" : "Save Department"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
