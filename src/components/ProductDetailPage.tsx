import React, { useState } from 'react';
import { 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ShoppingCart, 
  DollarSign, 
  Check, 
  ChevronDown, 
  Sparkles, 
  HelpCircle, 
  Share2, 
  MessageCircle, 
  Lock, 
  Crown,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { SubscriptionProduct, PlanVariant, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface ProductDetailPageProps {
  product: SubscriptionProduct;
  currency: CurrencyCode;
  onBack: () => void;
  onAddToCart: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onBuyNow: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onSelectOtherProduct: (productSlug: string) => void;
  allProducts: SubscriptionProduct[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectOtherProduct,
  allProducts,
}) => {
  // Plan selection
  const defaultPlan = product.plans.find((p) => p.isPopular) || product.plans[0];
  const [selectedPlan, setSelectedPlan] = useState<PlanVariant>(defaultPlan);
  const [addedToast, setAddedToast] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const discountPercent = Math.round(
    ((selectedPlan.originalPriceEGP - selectedPlan.priceEGP) / selectedPlan.originalPriceEGP) * 100
  );

  const handleAdd = () => {
    onAddToCart(product, selectedPlan);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.category === 'bundles'))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 py-8 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={onBack}
              className="hover:text-amber-400 font-bold transition-colors flex items-center gap-1"
            >
              <span>المتجر الرئيسي</span>
            </button>
            <span>/</span>
            <span>اشتراكات الذكاء الاصطناعي</span>
            <span>/</span>
            <span className="text-amber-400 font-semibold">{product.nameAr}</span>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لكافة المنتجات</span>
          </button>
        </div>

        {/* HERO SECTION: Product Showcase & Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Details (8 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-2">
              {product.badge && (
                <span className={`px-3 py-1 rounded-xl text-xs font-extrabold border border-amber-500/30 ${product.colorScheme.badgeBg} ${product.colorScheme.badgeText}`}>
                  {product.badge}
                </span>
              )}
              <span className="px-3 py-1 rounded-xl bg-slate-800/80 text-slate-300 text-xs font-semibold border border-slate-700/60">
                العلامة: {product.brand}
              </span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>اشتراك أصلي رسمي 100%</span>
              </span>
            </div>

            {/* Title & Brand Logo */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 mt-1">
                <ProductBrandIcon slug={product.slug} brand={product.brand} size="xl" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  {product.nameAr}
                </h1>
                <p className="text-sm sm:text-base text-slate-400 font-mono font-medium" dir="ltr">
                  {product.name}
                </p>
              </div>
            </div>

            {/* Ratings & Sales stats */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} تقييم معتمد)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
                <span>تم بيع أكثر من</span>
                <strong className="text-white font-mono">{product.salesCount}+</strong>
                <span>اشتراك في مصر والخليج</span>
              </div>
              <div className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-xl">
                <Clock className="w-3.5 h-3.5" />
                <span>سرعة التجهيز: {product.deliveryTime}</span>
              </div>
            </div>

            {/* Comprehensive Description */}
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3 leading-relaxed">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>نبذة شاملة عن أداة {product.brand}:</span>
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                {product.fullDescAr}
              </p>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {product.shortDescAr}
              </p>
            </div>

            {/* Highlights Grid */}
            {product.previewHighlights && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.previewHighlights.map((hl, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
                    <span className="text-[11px] text-slate-400 block">{hl.label}</span>
                    <span className="text-xs sm:text-sm font-black text-white block">{hl.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 1: Real-World Benefits (الفوائد التي تقدمها الأداة) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>ما هي الفوائد والقيمة التي ستحصل عليها؟</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(product.benefitsAr || [
                  'توفير مئات الدولارات شهرياً مقارنة بأسعار الاشتراكات الرسمية بالدولار.',
                  'زيادة سرعة وكفاءة إنجاز العمل ومضاعفة الإنتاجية لأكثر من 3 أضعاف.',
                  'ضمان استبدال فوري ودعم فني متواصل 24/7 عبر الواتساب.',
                  'تفعيل آمن ورسمي بدون أي برامج VPN أو مشاركة كلمات السر الخاصة بك.',
                ]).map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-start gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: Use Cases (مجالات وحالات الاستخدام) */}
            {product.useCasesAr && product.useCasesAr.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>لمن يصلح هذا الاشتراك وكيف يفيدك في مجالك؟</span>
                </h3>

                <div className="space-y-2.5">
                  {product.useCasesAr.map((uc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-amber-300">
                        • {uc.role}:
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 pr-3 leading-relaxed">
                        {uc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: Key Features (الميزات الرئيسية والتقنية) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>الميزات التقنية والمزايا المشمولة في الباقة:</span>
              </h3>

              <div className="space-y-2">
                {product.featuresAr.map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Pricing & Immediate Order Sticky Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Main Order Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 shadow-2xl shadow-black/80 space-y-5">
              
              <div>
                <span className="text-xs text-amber-400 font-bold block mb-1">
                  اختر الباقة المناسبة لك:
                </span>
                <h3 className="text-xl font-black text-white">
                  خطط الاشتراك والأسعار المتاحة
                </h3>
              </div>

              {/* Plans selector list */}
              <div className="space-y-2">
                {product.plans.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;
                  const planDiscount = Math.round(
                    ((plan.originalPriceEGP - plan.priceEGP) / plan.originalPriceEGP) * 100
                  );

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-500'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                          </div>
                          <span className="font-bold text-sm text-white">{plan.durationLabel}</span>
                          {plan.isPopular && (
                            <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded">
                              الأكثر طلباً ★
                            </span>
                          )}
                        </div>

                        <div className="text-left font-mono">
                          <span className="font-black text-base text-amber-400">
                            {formatPrice(plan.priceEGP, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pr-6">
                        <span className="text-emerald-400 font-medium">✓ {plan.deliveryTypeLabel}</span>
                        {plan.originalPriceEGP > plan.priceEGP && (
                          <span className="line-through text-slate-500">
                            {formatPrice(plan.originalPriceEGP, currency)}
                          </span>
                        )}
                      </div>

                      {plan.notes && (
                        <p className="text-[10px] text-amber-300 mt-1.5 pr-6 font-medium">
                          ★ {plan.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Price summary strip */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">الإجمالي النهائي:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                      {formatPrice(selectedPlan.priceEGP, currency)}
                    </span>
                    {selectedPlan.originalPriceEGP > selectedPlan.priceEGP && (
                      <span className="text-xs text-slate-500 line-through font-mono">
                        {formatPrice(selectedPlan.originalPriceEGP, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                    <span>نسبة التوفير مقارنة بالسعر الأصلي:</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                      وفر {discountPercent}%
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => onBuyNow(product, selectedPlan)}
                  className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01]"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  <span>شراء فوري واستلام التفعيل الآن</span>
                </button>

                <button
                  onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm border border-slate-700 transition-all"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addedToast ? '✓ تمت الإضافة بنجاح!' : 'إضافة إلى سلة المشتريات'}</span>
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>ضمان كامل المدة مع استبدال فوري بدون رسوم</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>سرعة التسليم: تفعيل فوري خلال {product.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>خصوصية 100% (لا نطلب كلمة مرور حسابك الشخصي)</span>
                </div>
              </div>

              {/* Direct WhatsApp Contact CTA */}
              <a
                href={`https://wa.me/201029384756?text=${encodeURIComponent(
                  `مرحباً كينجز ستور، أود الاستفسار عن اشتراك ${product.nameAr} باقة (${selectedPlan.durationLabel})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>لديك استفسار قبل الشراء؟ تواصل معنا واتساب</span>
              </a>

            </div>

            {/* Official vs Kings Store Price Comparison Box */}
            {product.officialVsKings && (
              <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <DollarSign className="w-4 h-4" />
                  <span>مقارنة التوفير (السعر الرسمي مقابل كينجز ستور):</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>السعر الرسمي بالدولار:</span>
                    <span className="font-mono text-rose-400 line-through">
                      {product.officialVsKings.officialPriceUSD}
                    </span>
                  </div>

                  <div className="flex justify-between text-white font-bold">
                    <span>سعر كينجز ستور كاش:</span>
                    <span className="font-mono text-emerald-400 text-sm">
                      {product.officialVsKings.kingsPriceEGP}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-bold text-[11px]">
                    ✓ {product.officialVsKings.savingsText}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* SECTION: Activation Steps & Requirements */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-xl font-black text-white mb-1">
              كيف يتم التفعيل بعد إتمام الطلب؟
            </h3>
            <p className="text-xs text-slate-400">
              خطوات سهلة وسريعة تضمن استلام اشتراكك في دقائق معدودة دون أي تعقيد تقني.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.activationStepsAr.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center text-sm border border-amber-500/30">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-white text-xs sm:text-sm">الخطوة {idx + 1}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 flex items-center gap-3">
            <Lock className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <strong className="block text-white mb-0.5">المتطلبات اللازمة:</strong>
              <span>{product.requirementsAr}</span>
            </div>
          </div>
        </div>

        {/* SECTION: Product Specific FAQs */}
        <div className="space-y-4">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>الأسئلة الشائعة حول اشتراك {product.nameAr}:</span>
          </h3>

          <div className="space-y-2.5">
            {product.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-right p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: Related Alternative AI Tools */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-800/80">
            <h3 className="text-lg font-black text-white">
              اشتراكات وأدوات ذكاء اصطناعي أخرى قد تهمك:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => {
                const relMinPrice = Math.min(...rel.plans.map((pl) => pl.priceEGP));
                return (
                  <div
                    key={rel.id}
                    onClick={() => onSelectOtherProduct(rel.slug)}
                    className="cursor-pointer p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="shrink-0">
                        <ProductBrandIcon slug={rel.slug} brand={rel.brand} size="md" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors">
                          {rel.nameAr}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono block" dir="ltr">{rel.name}</span>
                      </div>
                    </div>

                    <div className="text-left font-mono shrink-0">
                      <span className="text-xs text-slate-400 block text-[10px]">يبدأ من:</span>
                      <span className="text-xs font-bold text-amber-400">
                        {formatPrice(relMinPrice, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
