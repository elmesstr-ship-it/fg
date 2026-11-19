"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ArrowLeft,
  Flame,
  Award,
  Crown,
  ChevronRight,
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mockData";
import { SanctuaryProductCard } from "@/components/products/SanctuaryProductCard";
import { useSeasonalVisualStore } from "@/store/seasonalVisualStore";

export function SanctuaryHomePage() {
  const { currentMode } = useSeasonalVisualStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProducts =
    selectedCategory === "all"
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FCFBF7] text-[#1C1917] transition-colors duration-500 overflow-x-clip pb-20 lg:pb-12">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO SANCTUARY SECTION                            */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FCFBF7] to-[#F6F3EB] pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E8E2D2]">
        {/* Subtle Arch Background Geometry */}
        <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c5a059]/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left/Right Text Column depending on RTL */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
              {/* Sacred Sub-heading badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-[#F5A623]/40 text-[#B8760C] shadow-sm">
                <Crown className="w-4 h-4 text-[#F5A623]" />
                <span className="text-xs font-semibold tracking-wide font-display">
                  تأسس منذ 35 عاماً • صياغة الأواني المذبحية بأعلى جودة وأقل سعر
                </span>
              </div>

              {/* Majestic Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-sacred text-[#1E2229] tracking-tight leading-[1.2]">
                أواني مذبحية ومقتنيات كنسية تُخلّد بهاء{" "}
                <span className="text-[#F5A623] relative inline-block">
                  الخدمة الطقسية
                  <span className="absolute -bottom-1 inset-x-0 h-1.5 bg-[#F5A623]/30 rounded-full" />
                </span>
              </h1>

              {/* Editorial Description */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 font-sans leading-relaxed">
                متجر الكنيسة (Church Shop) صرح عريق بخبرة 35 عاماً في صياغة أواني المذبح المقدس (الكؤوس، الصواني، الشواريل، والصلبان)، نضمن أعلى معايير الجودة الليتورجية الدقيقة بأقل سعر ممكن، مع شحن وتوصيل فوري لجميع كنائس وإيبارشيات مصر وكافة دول العالم.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
                <Link
                  href="/catalog"
                  className="px-8 py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98E18] text-[#1E2229] text-sm font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2.5 transition-all group"
                >
                  <span>استكشف كتالوج الأواني والمقتنيات</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>

                <a
                  href="https://wa.me/201556991011?text=%D8%B3%D9%84%D8%A7%D9%85%20%D9%88%D9%86%D8%B9%D9%85%D8%A9%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A3%D9%88%D8%A7%D9%86%D9%8A%20%D9%88%D9%85%D9%82%D8%AA%D9%86%D9%8A%D8%A7%D8%AA%20Church%20Shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-sm font-semibold border border-stone-300 hover:border-[#F5A623] shadow-sm flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#F5A623]" />
                  <span>تواصل واتساب: 01556991011</span>
                </a>
              </div>

              {/* Liturgical Trust Pillars */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-right">
                  <span className="block text-xl font-bold text-[#F5A623] font-serif">35 عاماً</span>
                  <span className="text-xs text-stone-500">خبرة عريقة في صياغة المذبح</span>
                </div>
                <div className="text-right border-r border-stone-200 pr-4">
                  <span className="block text-xl font-bold text-[#F5A623] font-serif">أعلى جودة</span>
                  <span className="text-xs text-stone-500">بأقل سعر متوفر بالأسواق</span>
                </div>
                <div className="text-right border-r border-stone-200 pr-4">
                  <span className="block text-xl font-bold text-[#F5A623] font-serif">توصيل دولي</span>
                  <span className="text-xs text-stone-500">داخل مصر وخارجها بالكامل</span>
                </div>
              </div>
            </div>

            {/* Right Featured Editorial Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C5A059]/40 bg-white">
                <Image
                  src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000"
                  alt="أيقونة ضابط الكل البيزنطية الفاخرة"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Floating Highlight Tag */}
                <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-[#c5a059]/50 text-amber-200 text-xs font-serif flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>تحفة الموسم المختارة</span>
                </div>

                {/* Bottom Overlay Story Card */}
                <div className="absolute inset-x-5 bottom-5 z-10 text-white space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
                    أيقونة ضابط الكل (البانتوقراطير)
                  </span>
                  <h3 className="text-xl font-bold font-sacred text-amber-50">
                    رُسمت في خلوة ديرية مع تذهيب يدوي عيار 24
                  </h3>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-lg font-bold text-amber-200 font-serif">
                      4,850 ج.م
                    </span>
                    <Link
                      href="/product/byzantine-christ-pantocrator-icon-gold"
                      className="px-4 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#dfc285] text-stone-950 text-xs font-bold transition-colors"
                    >
                      معاينة التحفة
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative Byzantine Floating Glow */}
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#c5a059]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 2. SACRED CATEGORY ARCHES                            */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 bg-[#FAF8F5] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-center md:text-right">
            <div>
              <span className="text-xs font-semibold tracking-widest text-[#c5a059] uppercase font-display">
                الخزائن والأقسام المقدسة
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-sacred text-stone-900 mt-1">
                استكشف ذخائر التراث الكنسي العريق
              </h2>
            </div>
            <Link
              href="/categories"
              className="mt-4 md:mt-0 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#781d22] hover:text-[#5a1418] transition-colors"
            >
              <span>جميع الأقسام والأروقة الكنسية</span>
              <ChevronRight className="w-4 h-4 rotate-180" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8E2D2] hover:border-[#c5a059] shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                  <Image
                    src={cat.heroImage}
                    alt={cat.name.ar}
                    fill
                    sizes="(max-width: 640px) 50vw, 20vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="p-4 text-right flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-sacred font-bold text-sm sm:text-base text-stone-900 group-hover:text-[#781d22] transition-colors line-clamp-1">
                      {cat.name.ar}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-1 font-sans">
                      {cat.tagline.ar}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#c5a059] mt-3">
                    {cat.itemCount} مقتنى مكرس
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 3. CURATED MASTERPIECE SHOWCASE                      */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-widest text-[#c5a059] uppercase font-display">
            مقتنيات مختارة بعناية فائقة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-sacred text-stone-900 mt-2">
            خزانة الأيقونات والصلبان والبخور المقدس
          </h2>
          <p className="text-sm text-stone-500 mt-2 font-sans">
            كل قطعة في خزانة سانكتا ماريا تحكي قصة ورع وصنعة فنية تراثية أصيلة
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#781d22] text-white shadow-sm"
                  : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
              }`}
            >
              جميع المقتنيات
            </button>
            {MOCK_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === c.id
                    ? "bg-[#781d22] text-white shadow-sm"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {c.name.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <SanctuaryProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 4. THE LITURGICAL CRAFT STORY BANNER                 */}
      {/* ---------------------------------------------------- */}
      <section className="py-20 bg-[#1C0D0D] text-amber-50 relative overflow-hidden border-y border-[#c5a059]/30">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-right">
              <span className="inline-block text-xs font-bold tracking-widest text-[#c5a059] uppercase font-display">
                سر الصنعة الديرية والتذهيب
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-sacred text-amber-100 leading-tight">
                كيف تصاغ أيقونات ومقتنيات سانكتا ماريا؟
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-sans">
                لا تصنع الأيقونة كلوحة عادية، بل تبدأ بالصوم والصلاة المستمرة في صوامع الرهبان. يُجهّز
                الخشب الطبيعي المعتق، وتُرسم الوجوه المقدسة بصبغات المعادن الطبيعية وصفار البيض (طريقة
                التمبرا الأثرية)، قبل أن تُكلّل الهالات النورانية برقائق الذهب عيار 24 الصافي.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-800">
                <div className="flex items-start gap-3">
                  <Flame className="w-5 h-5 text-[#c5a059] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">صمغ اللبان البري</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      بخور طبيعي معتق دون فحم أو إضافات صناعية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#c5a059] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-200">شهادة أصالة موثقة</h4>
                    <p className="text-xs text-stone-400 mt-0.5">
                      تأكيد عيار الفضة ونقاء الذهب ومصدر القطعة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#c5a059]/40 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000"
                alt="حرفية الصياغة الكنسية"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 text-right">
                <span className="text-xs font-serif text-amber-300">
                  ورشة الصياغة التراثية بالدير
                </span>
                <p className="text-xs text-stone-300">صلبان البركة وأواني المذبح المسبوكة</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 5. COMMITMENT & SACRED REVERENCE PILLARS             */}
      {/* ---------------------------------------------------- */}
      <section className="py-16 bg-[#FAF8F5] border-b border-[#E8E2D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c5a059]/30 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-[#781d22]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 font-sacred">شحن وتغليف ليتورجي آمن</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  تغليف خاص مبطن بأقمشة قطنية وصناديق مقواة تحمي الأيقونات والزجاج والأواني المقدسة طوال
                  رحلة التوصيل لكافة المحافظات المصرية.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c5a059]/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#781d22]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 font-sacred">أصالة وتكريس معتمد</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  جميع الصلبان والأيقونات والملابس محاكة ومصنوعة بمطابقة تامة للتقاليد الطقسية الأرثوذكسية
                  المعتمدة وتحت إشراف كنسي متصل.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-[#c5a059]/30 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6 text-[#781d22]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-stone-900 font-sacred">دعم وعناية بالرعايا</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  فريق مخصص للرد على استفسارات الكنائس والآباء الكهنة وشعب الكنيسة لترتيب الطلبات الخاصة
                  وتجهيز مذابح الكنائس الجديدة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* 6. EDITORIAL FOOTER                                  */}
      {/* ---------------------------------------------------- */}
      <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-right pb-12 border-b border-stone-800">
            {/* Brand Story */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white p-0.5 border border-[#F5A623]/40">
                  <Image src="/logo.png" alt="Church Shop" width={40} height={40} className="object-contain" />
                </div>
                <span className="font-sacred text-2xl font-bold text-amber-300 tracking-wider">
                  CHURCH SHOP
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-sans max-w-sm">
                متجر الكنيسة — تأسس منذ 35 عاماً لصنع الأواني المذبحية بأعلى كواليتي وأقل سعر موجود في السوق. نوفر الشحن والتوصيل لكافة المحافظات المصرية وكافة أنحاء العالم.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/201556991011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-[#F5A623] hover:underline font-mono"
                >
                  <span>واتساب / تليفون: 01556991011 20+</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-amber-100 uppercase tracking-wider mb-4 font-display">
                الأقسام الكنسية
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><Link href="/catalog?category=coptic-byzantine-icons" className="hover:text-amber-200 transition-colors">الأيقونات القبطية والبيزنطية</Link></li>
                <li><Link href="/catalog?category=blessing-hand-crosses" className="hover:text-amber-200 transition-colors">صلبان البركة الفضية</Link></li>
                <li><Link href="/catalog?category=holy-incense-burners" className="hover:text-amber-200 transition-colors">بخور جبل آثوس الملكي</Link></li>
                <li><Link href="/catalog?category=clerical-vestments-silk" className="hover:text-amber-200 transition-colors">الملابس والحلل الكهنوتية</Link></li>
                <li><Link href="/catalog?category=pure-beeswax-candles" className="hover:text-amber-200 transition-colors">شموع شمع العسل النقي</Link></li>
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-xs font-bold text-amber-100 uppercase tracking-wider mb-4 font-display">
                خدمة الرعايا
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li><Link href="/support" className="hover:text-amber-200 transition-colors">التواصل مع الخزانة الكنسية</Link></li>
                <li><Link href="/orders" className="hover:text-amber-200 transition-colors">سجل الفواتير والطلبات</Link></li>
                <li><Link href="/profile" className="hover:text-amber-200 transition-colors">إعدادات الحساب والمحفظة</Link></li>
              </ul>
            </div>

            {/* Liturgical Assurance */}
            <div>
              <h4 className="text-xs font-bold text-amber-100 uppercase tracking-wider mb-4 font-display">
                ضمان التكريس
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                جميع المقتنيات مكرسة لخدمة مجد الله وخاضعة للفحص الدقيق من حيث مطابقة المقاييس الكنسية
                والأبعاد الطقسية.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© {new Date().getFullYear()} متجر الكنيسة (Church Shop). جميع الحقوق محفوظة.</p>
            <p className="text-[11px] text-stone-400">
              أواني مذبحية ومقتنيات كنسية بأعلى جودة وأقل سعر • خبرة 35 عاماً
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
