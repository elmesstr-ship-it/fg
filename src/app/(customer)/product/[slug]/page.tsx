"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/services";
import { Product, ProductReview } from "@/types/product";
import { useAppStore } from "@/store/useAppStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { translations } from "@/config/i18n";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Send,
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
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  // Recently Viewed Products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Product Availability Alert Form State
  const [alertEmail, setAlertEmail] = useState("");
  const [alertPhone, setAlertPhone] = useState("");
  const [submittingAlert, setSubmittingAlert] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // New Review Form State
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const addItemToCart = useCartStore((state) => state.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await db.products.getProductBySlug(resolvedParams.slug);
        setProduct(p);
        if (p) {
          const [rel, revs] = await Promise.all([
            db.products.getRelatedProducts(p.id, p.categoryId),
            db.products.getProductReviews(p.id),
          ]);
          setRelated(rel);
          setReviews(revs);

          // Update Recently Viewed Products in localStorage
          try {
            const rawStored = localStorage.getItem("sm_recently_viewed");
            let list: Product[] = rawStored ? JSON.parse(rawStored) : [];
            list = [p, ...list.filter((item) => item.id !== p.id)].slice(0, 5);
            localStorage.setItem("sm_recently_viewed", JSON.stringify(list));
            setRecentlyViewed(list.filter((item) => item.id !== p.id));
          } catch {}
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [resolvedParams.slug]);

  const selectedVariant = product?.variants?.find((v) => v.id === selectedVariantId) || null;
  const displayPrice = selectedVariant ? selectedVariant.price : (product?.price || 0);
  const displayStock = selectedVariant ? selectedVariant.stock : (product?.stock || 0);

  const handleAddToCart = () => {
    if (!product) return;
    addItemToCart(
      product,
      quantity,
      selectedVariant ? selectedVariant.id : undefined,
      selectedVariant ? (selectedVariant.name[locale] || selectedVariant.name.ar) : undefined
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !reviewerName || !reviewComment) return;

    setSubmittingReview(true);
    try {
      const newRev = await db.products.addReview(product.id, {
        userId: "cust-" + Date.now(),
        userName: reviewerName,
        rating: reviewRating,
        comment: reviewComment,
      });

      setReviews([newRev, ...reviews]);
      setReviewSuccess(true);
      setReviewerName("");
      setReviewComment("");
      setTimeout(() => setReviewSuccess(false), 3000);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-theme-surface-elevated rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-theme-surface-elevated rounded w-3/4" />
            <div className="h-4 bg-theme-surface-elevated rounded w-1/2" />
            <div className="h-32 bg-theme-surface-elevated rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="font-sacred text-2xl font-bold text-theme-text">
          {locale === "ar" ? "المنتج غير موجود" : "Product Not Found"}
        </h1>
        <Link href="/catalog">
          <Button variant="gold">{t.navigation.catalog}</Button>
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Toast Notification when item is added */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 bg-theme-primary text-theme-primary-contrast px-4 py-3 rounded-2xl shadow-sacred-lg flex items-center gap-2 border border-theme-gold/40 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-theme-gold" />
          <span>{locale === "ar" ? "تمت إضافة المقتنى إلى سلة الشراء بنجاح!" : "Item added to cart!"}</span>
        </div>
      )}

      {/* Product View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Main Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-theme-border bg-theme-surface shadow-sacred">
            <Image
              src={product.images[0]}
              alt={product.name[locale]}
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-theme-gold uppercase tracking-wider">
              {product.categoryName[locale]}
            </span>
            <h1 className="font-sacred text-2xl sm:text-3xl font-extrabold text-theme-text mt-1">
              {product.name[locale]}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-xs text-theme-text-muted">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-theme-text">{product.rating}</span>
              <span>({reviews.length} {locale === "ar" ? "تقييم مؤكد" : "verified reviews"})</span>
              <span className="text-theme-border">•</span>
              <span className="text-theme-gold font-mono font-bold">{product.sku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-theme-surface-elevated/70 border border-theme-border flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-theme-primary">
              {displayPrice.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
            </span>
            <span className="text-sm font-semibold text-theme-text-muted">{t.common.priceEGP}</span>
            {product.originalPrice && !selectedVariant && (
              <span className="text-sm line-through text-theme-text-muted">
                {product.originalPrice.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
              </span>
            )}
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              displayStock === 0
                ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                : displayStock <= 5
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            }`}>
              {displayStock === 0
                ? (locale === "ar" ? "نفد من المخزون" : "Out of Stock")
                : `${t.common.inStock} (${displayStock} ${locale === "ar" ? "قطع متوفرة" : "left"})`}
            </span>
          </div>

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-theme-text block">
                {locale === "ar" ? "المقاسات والطرازات الطقسية المتاحة:" : "Available Variants & Sizes:"}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedVariantId(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedVariantId === null
                      ? "border-theme-gold bg-theme-gold/15 text-theme-gold ring-1 ring-theme-gold"
                      : "border-theme-border bg-theme-surface text-theme-text hover:border-theme-gold/40"
                  }`}
                >
                  {locale === "ar" ? "القياسي (الأساسي)" : "Standard Base"} ({product.price.toLocaleString()} {t.common.priceEGP})
                </button>
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariantId === v.id
                        ? "border-theme-gold bg-theme-gold/15 text-theme-gold ring-1 ring-theme-gold"
                        : "border-theme-border bg-theme-surface text-theme-text hover:border-theme-gold/40"
                    }`}
                  >
                    {v.name[locale] || v.name.ar} ({v.price.toLocaleString()} {t.common.priceEGP})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Short description */}
          <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
            {product.shortDescription[locale]}
          </p>

          {/* Quantity Controls & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <div className="flex items-center border border-theme-border rounded-xl bg-theme-surface w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2.5 hover:bg-theme-surface-elevated text-theme-text font-bold transition-colors"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-theme-text">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(displayStock, quantity + 1))}
                disabled={displayStock === 0}
                className="px-3.5 py-2.5 hover:bg-theme-surface-elevated text-theme-text font-bold transition-colors disabled:opacity-40"
              >
                +
              </button>
            </div>

            <Button
              variant="gold"
              size="lg"
              disabled={displayStock === 0}
              className="flex-1 rounded-xl shadow-sacred disabled:opacity-50"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              <span>{displayStock === 0 ? (locale === "ar" ? "نفد من المخزون" : "Out of Stock") : t.common.addToCart}</span>
            </Button>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-xl border border-theme-border transition-colors ${
                inWishlist ? "bg-red-50 text-red-500 border-red-200" : "hover:bg-theme-surface-elevated text-theme-text"
              }`}
              title={t.common.wishlist}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Product Availability Alert if Out of Stock */}
          {displayStock === 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>{locale === "ar" ? "تنبيه عند توفر المنتج بالمخزون" : "Notify Me When Available"}</span>
              </div>
              <p className="text-[11px] text-theme-text-muted">
                {locale === "ar"
                  ? "أدخل بريدك أو هاتفك وسنقوم بإشعارك فور إعادة تصنيع وتوفير هذا المقتنى الطقسي."
                  : "Enter your contact details to receive an alert when restocked."}
              </p>

              {alertSuccess ? (
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                  {alertSuccess}
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!alertEmail) return;
                    setSubmittingAlert(true);
                    const res = await fetch("/api/products/alerts", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        productId: product.id,
                        email: alertEmail,
                        phone: alertPhone,
                      }),
                    }).then((r) => r.json());
                    setSubmittingAlert(false);
                    if (res.success) {
                      setAlertSuccess(
                        locale === "ar" ? "تم تسجيل طلب التنبيه بنجاح!" : "Availability alert registered!"
                      );
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-2 pt-1"
                >
                  <input
                    type="email"
                    required
                    placeholder={locale === "ar" ? "بريدك الإلكتروني" : "Your email"}
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-xs outline-none focus:ring-1 focus:ring-theme-gold flex-1"
                  />
                  <input
                    type="tel"
                    placeholder={locale === "ar" ? "رقم الهاتف (اختياري)" : "Phone (optional)"}
                    value={alertPhone}
                    onChange={(e) => setAlertPhone(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text font-mono text-xs outline-none focus:ring-1 focus:ring-theme-gold sm:w-36"
                  />
                  <Button variant="gold" size="sm" type="submit" disabled={submittingAlert} className="rounded-xl text-xs">
                    {submittingAlert ? (locale === "ar" ? "جاري التسجيل..." : "Saving...") : (locale === "ar" ? "أخطرني" : "Notify Me")}
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* Liturgical Assurances */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-theme-border">
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <ShieldCheck className="w-4 h-4 text-theme-gold flex-shrink-0" />
              <span>{locale === "ar" ? "أصالة طقسية ونقاء كنسي معتمد" : "Liturgical Sanctity Guarantee"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-theme-text-muted">
              <Truck className="w-4 h-4 text-theme-gold flex-shrink-0" />
              <span>{locale === "ar" ? "تغليف وقائي مصفح فاخر للشحن" : "Reinforced Protective Packaging"}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs for Description, Specifications, and Reviews */}
      <div className="space-y-6 pt-6">
        <div className="flex border-b border-theme-border gap-6 text-sm font-sacred">
          <button
            onClick={() => setActiveTab("desc")}
            className={`pb-3 border-b-2 font-bold transition-colors ${
              activeTab === "desc" ? "border-theme-gold text-theme-primary" : "border-transparent text-theme-text-muted hover:text-theme-text"
            }`}
          >
            {locale === "ar" ? "الوصف والرمزية الطقسية" : "Description & Spiritual Value"}
          </button>
          <button
            onClick={() => setActiveTab("specs")}
            className={`pb-3 border-b-2 font-bold transition-colors ${
              activeTab === "specs" ? "border-theme-gold text-theme-primary" : "border-transparent text-theme-text-muted hover:text-theme-text"
            }`}
          >
            {locale === "ar" ? "المواصفات الفنية والمصنعية" : "Technical Specifications"}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 border-b-2 font-bold transition-colors ${
              activeTab === "reviews" ? "border-theme-gold text-theme-primary" : "border-transparent text-theme-text-muted hover:text-theme-text"
            }`}
          >
            {locale === "ar" ? `تقييمات ومباركات المشترين (${reviews.length})` : `Reviews (${reviews.length})`}
          </button>
        </div>

        {/* Tab 1: Full Description */}
        {activeTab === "desc" && (
          <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border leading-relaxed text-xs sm:text-sm text-theme-text space-y-4">
            <p>{product.fullDescription[locale]}</p>
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === "specs" && (
          <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border space-y-3">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-2 border-b border-theme-border/40 last:border-none text-xs">
                <span className="text-theme-text-muted font-medium capitalize">{key}</span>
                <span className="font-bold text-theme-text">{val[locale]}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Interactive Reviews System */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            
            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="p-8 text-center bg-theme-surface rounded-2xl border border-theme-border text-xs text-theme-text-muted">
                  {locale === "ar" ? "كن أول من يكتب تقييماً أو كلمة مباركة عن هذا المقتنى." : "Be the first to review this sacred item."}
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-theme-surface border border-theme-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-theme-text">{rev.userName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-theme-text-muted font-mono">
                        {new Date(rev.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                      </span>
                    </div>
                    <p className="text-xs text-theme-text-muted leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Submit a Review Form */}
            <form onSubmit={handleSubmitReview} className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-theme-border pb-3">
                <h3 className="font-sacred text-sm font-bold text-theme-text flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-theme-gold" />
                  <span>{locale === "ar" ? "أضف كلمتك أو تقييمك للمقتنى" : "Write a Sacred Review"}</span>
                </h3>
                {reviewSuccess && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {locale === "ar" ? "تم نشر تقييمكم المبارك بنجاح!" : "Review published!"}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">الاسم الكامل *</label>
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="مثال: د. ماجد بشارة"
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                  />
                </div>

                <div>
                  <label className="block text-theme-text-muted mb-1 font-medium">التقييم النجمي</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none"
                  >
                    <option value={5}>★★★★★ (5 نجوم - امتياز طقسي)</option>
                    <option value={4}>★★★★☆ (4 نجوم - جودة عالية)</option>
                    <option value={3}>★★★☆☆ (3 نجوم - جيد)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-theme-text-muted mb-1 font-medium">نص التقييم والملاحظات *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={locale === "ar" ? "اكتب رأيك الصادق في جودة المقتنى، التذهيب، أو التغليف..." : "Share your honest impressions..."}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="gold" size="sm" isLoading={submittingReview} className="rounded-xl">
                  <Send className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                  <span>{locale === "ar" ? "إرسال التقييم" : "Submit Review"}</span>
                </Button>
              </div>
            </form>

          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-theme-border">
          <h2 className="font-sacred text-xl font-bold text-theme-text">
            {locale === "ar" ? "مقتنيات مقدسة ذات صلة" : "Related Sacred Offerings"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-6 pt-8 border-t border-theme-border">
          <h2 className="font-sacred text-lg font-bold text-theme-gold">
            {locale === "ar" ? "منتجات شاهدتها مؤخراً" : "Recently Viewed Items"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map((viewedProd) => (
              <ProductCard key={viewedProd.id} product={viewedProd} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
