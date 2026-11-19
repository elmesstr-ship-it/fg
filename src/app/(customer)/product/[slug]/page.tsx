"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/services";
import { Product, ProductReview } from "@/types/product";
import { MOCK_PRODUCTS, MockProduct } from "@/lib/fashionMockData";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { translations } from "@/config/i18n";
import {
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Ruler,
  X,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { locale } = useAppStore();
  const t = translations[locale];

  const [product, setProduct] = useState<Product | null>(null);
  const [mockFashion, setMockFashion] = useState<MockProduct | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Review Form
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // First check mock fashion data
        const foundMock = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);
        if (foundMock) {
          setMockFashion(foundMock);
          setSelectedSize(foundMock.sizes?.[0] || "M");
          setSelectedColor(foundMock.colors?.[0]?.name?.[locale] || "Black");
        }

        let p = await db.products.getProductBySlug(resolvedParams.slug);

        // Fallback to formatted mock if not in database
        if (!p && foundMock) {
          p = {
            id: foundMock.id,
            slug: foundMock.slug,
            name: foundMock.name,
            shortDescription: foundMock.tagline,
            fullDescription: foundMock.description,
            categoryId: foundMock.category.id,
            categoryName: { ar: foundMock.category.nameAr, en: foundMock.category.nameEn },
            price: foundMock.price,
            originalPrice: foundMock.originalPrice,
            discountPercentage: foundMock.discountPercentage,
            stock: foundMock.stock,
            sku: foundMock.sku,
            images: foundMock.images,
            isFeatured: foundMock.isFeatured,
            isBestSeller: foundMock.isBestSeller,
            rating: foundMock.rating,
            reviewCount: foundMock.reviewCount,
            specifications: {},
            createdAt: new Date().toISOString(),
          };
        }

        setProduct(p);

        if (p) {
          try {
            const [rel, revs] = await Promise.all([
              db.products.getRelatedProducts(p.id, p.categoryId),
              db.products.getProductReviews(p.id),
            ]);
            setRelated(rel);
            setReviews(revs);
          } catch {
            // fallback related
            setRelated(
              MOCK_PRODUCTS.filter((item) => item.id !== p?.id).slice(0, 4) as any
            );
          }
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.slug, locale]);

  const handleAddToCart = () => {
    if (!product) return;
    addItemToCart(product, quantity, undefined, undefined, selectedSize, selectedColor);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: ProductReview = {
      id: "rev-" + Date.now(),
      userId: "usr-demo",
      userName: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
    };

    setReviews([newRev, ...reviews]);
    setReviewerName("");
    setReviewComment("");
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-black text-neutral-900 dark:text-white uppercase">
          {locale === "ar" ? "الإصدار غير متوفر حالياً" : "Product Not Found"}
        </h1>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase"
        >
          {t.navigation.catalog}
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const images = product.images.length > 0 ? product.images : ["/branding/hero-banner.jpg"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Toast Notification when item is added */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-200 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <span>{locale === "ar" ? "تمت إضافة القطعة إلى حقيبة التسوق!" : "Added to your shopping bag!"}</span>
            <span className="block text-[10px] opacity-75 font-mono">
              {selectedSize} • {selectedColor}
            </span>
          </div>
        </div>
      )}

      {/* 1. PRODUCT DETAIL MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Multi-Image Editorial Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={product.name[locale] || product.name.ar}
              fill
              priority
              className="object-cover object-center transition-all duration-500"
            />
            {product.discountPercentage && (
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black bg-[#D4AF37] text-black">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? "border-black dark:border-white scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Actions & Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] font-mono">
                {product.categoryName[locale] || product.categoryName.ar}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white uppercase tracking-tight mt-1">
              {product.name[locale] || product.name.ar}
            </h1>

            {/* Rating Stars & Reviews Count */}
            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-bold">{product.rating}</span>
              <span>({product.reviewCount} {locale === "ar" ? "تقييم مشتري" : "reviews"})</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 py-3 border-y border-neutral-200 dark:border-neutral-800">
            <span className="text-3xl font-black text-neutral-950 dark:text-white">
              {product.price.toLocaleString()}{" "}
              <span className="text-sm font-bold text-neutral-500">{locale === "ar" ? "ج.م" : "EGP"}</span>
            </span>
            {product.originalPrice && (
              <span className="text-base line-through text-neutral-400">
                {product.originalPrice.toLocaleString()} ج.م
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {product.shortDescription[locale] || product.shortDescription.ar}
          </p>

          {/* Color Selection */}
          {mockFashion?.colors && mockFashion.colors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="uppercase text-neutral-500">{t.common.color}:</span>
                <span className="text-neutral-900 dark:text-white font-mono">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {mockFashion.colors.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(c.name[locale] || c.name.ar)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      selectedColor === (c.name[locale] || c.name.ar)
                        ? "border-black dark:border-white scale-110 ring-2 ring-[#D4AF37]"
                        : "border-neutral-300 dark:border-neutral-700"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name[locale] || c.name.ar}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection & Size Guide Modal Trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="uppercase text-neutral-500">{t.common.size}:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 underline underline-offset-4"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{t.common.sizeGuide}</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {(mockFashion?.sizes || ["S", "M", "L", "XL", "XXL"]).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2.5 rounded-xl text-xs font-black uppercase transition-all ${
                    selectedSize === sz
                      ? "bg-black dark:bg-white text-white dark:text-black shadow-md scale-102"
                      : "bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add to Bag */}
          <div className="flex items-center gap-3 pt-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-100 dark:bg-neutral-900 px-3 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-2 font-bold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                -
              </button>
              <span className="px-3 text-sm font-black font-mono">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-2 font-bold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-90 flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.common.addToCart}</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-xl border transition-colors ${
                inWishlist
                  ? "bg-red-500 border-red-500 text-white"
                  : "border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white text-neutral-700 dark:text-neutral-300"
              }`}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Garment Specifications Highlights */}
          <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 font-mono">FABRIC COMPOSITION</span>
              <span className="font-bold text-neutral-900 dark:text-white">100% Egyptian Combed Cotton</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 font-mono">DENSITY</span>
              <span className="font-bold text-[#D4AF37]">380 GSM Heavy French Terry</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 font-mono">FIT SILHOUETTE</span>
              <span className="font-bold text-neutral-900 dark:text-white">Oversized Drop-Shoulder</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 font-mono">MANUFACTURE</span>
              <span className="font-bold text-neutral-900 dark:text-white">Crafted in Cairo, Egypt</span>
            </div>
          </div>

          {/* Shipping & Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>{locale === "ar" ? "توصيل سريع 24-48 ساعة" : "24-48h Delivery"}</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
              <span>{locale === "ar" ? "استبدال مقاس خلال 14 يوم" : "14-Day Free Exchange"}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. PRODUCT FULL DESCRIPTION & REVIEWS */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12 space-y-8">
        <div>
          <h2 className="text-xl font-black uppercase text-neutral-950 dark:text-white mb-4">
            {locale === "ar" ? "تفاصيل القطعة والعناية" : "Product Details & Fabric Care"}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl">
            {product.fullDescription[locale] || product.fullDescription.ar}
          </p>
        </div>

        {/* Customer Reviews Section */}
        <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black uppercase">
              {locale === "ar" ? "تقييمات المشترين" : "Customer Reviews"} ({reviews.length})
            </h3>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{rev.userName}</span>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-400">{rev.comment}</p>
                <span className="block text-[10px] text-neutral-400 font-mono">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <form onSubmit={handleAddReview} className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 max-w-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {locale === "ar" ? "أضف تقييمك للقطعة" : "Leave a Review"}
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={locale === "ar" ? "اسمك..." : "Your Name"}
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                required
              />
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
              </select>
            </div>
            <textarea
              placeholder={locale === "ar" ? "رأيك في الخامة والمقاس..." : "Your feedback on fabric and fit..."}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-bold hover:opacity-90"
            >
              {locale === "ar" ? "إرسال التقييم" : "Submit Review"}
            </button>
            {reviewSubmittedToast && (
              <p className="text-xs text-emerald-500 font-bold">
                {locale === "ar" ? "✓ شكراً لمشاركتك! تم نشر تقييمك." : "✓ Review published successfully!"}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* 3. SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-neutral-950 rounded-3xl max-w-lg w-full p-6 border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-base font-black uppercase">
                  {locale === "ar" ? "دليل مقاسات FG (بالسنتيمتر)" : "FG Size Chart (Centimeters)"}
                </h3>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-500">
              {locale === "ar"
                ? "قصاتنا مصممة بنمط أوفرسايز (Oversized Boxy). إذا كنت تفضل المقاس المعتاد اختر مقاسك الأصلي، أو اختر مقاساً أصغر للمظهر المنتظم."
                : "Our garments are intentionally cut oversized. Stick to your true size for the intended boxy streetwear fit."}
            </div>

            {/* Measurement Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr className="bg-neutral-100 dark:bg-neutral-900 font-mono font-bold text-neutral-700 dark:text-neutral-300">
                    <th className="py-2.5 px-3 border border-neutral-200 dark:border-neutral-800">Size</th>
                    <th className="py-2.5 px-3 border border-neutral-200 dark:border-neutral-800">Chest (عرض الصدر)</th>
                    <th className="py-2.5 px-3 border border-neutral-200 dark:border-neutral-800">Length (الطول)</th>
                    <th className="py-2.5 px-3 border border-neutral-200 dark:border-neutral-800">Shoulder (الكتف)</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800 font-bold">S</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">58 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">70 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">54 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800 font-bold">M</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">61 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">73 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">56 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800 font-bold">L</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">64 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">76 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">58 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800 font-bold">XL</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">67 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">79 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">60 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800 font-bold">XXL</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">70 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">82 cm</td>
                    <td className="py-2 border border-neutral-200 dark:border-neutral-800">62 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase"
            >
              {locale === "ar" ? "فهمت المقاس" : "Got it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
