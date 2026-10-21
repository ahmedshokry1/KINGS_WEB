import React from 'react';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  CheckCircle, 
  Flame, 
  Layers,
  Star
} from 'lucide-react';
import { ProductBrandIcon } from './ProductBrandIcon';
import { CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';

interface HeroBannerProps {
  onSelectCategory: (cat: string) => void;
  onOpenAdvisor: () => void;
  currency: CurrencyCode;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenAdvisor,
  currency,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0e1424] via-[#0b0f1a] to-[#070a12] border-b border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16 relative z-10">
        
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>كينجز ستور - الموزع المعتمد لاشتراكات الذكاء الاصطناعي والتصميم</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Main Title & Pitch */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
              امتلك أقوى أدوات{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-400 via-yellow-300 to-amber-200">
                الذكاء الاصطناعي
              </span>{' '}
              بأوفر سعر في مصر والوطن العربي
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              اشتراكات أصلية ورسمية 100% مع تفعيل فوري على إيميلك الشخصي دون الحاجة لكلمة السر. ضمان كامل المدة مع استبدال فوري ودعم فني متاح 24/7 عبر الواتساب.
            </p>

            {/* Quick Guarantees Pill Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">تفعيل فوري خلال دقائق</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">ضمان استبدال كامل المدة</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200 col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-semibold">على إيميلك الشخصي</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href="#catalog-section"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>تصفح كل الاشتراكات والعروض</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenAdvisor}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>مش عارف تختار؟ اسأل المستشار الذكي</span>
              </button>
            </div>
          </div>

          {/* Featured Poster Cards (Inspired directly by the Kings Store FB promo posts) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Promo Card 1: Google AI / Gemini Pro 18 months for 150 EGP */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/40 p-4 shadow-xl shadow-blue-950/40 hover:border-blue-400 transition-all duration-300">
              <div className="absolute top-0 left-0 bg-blue-500 text-white text-[11px] font-black px-3 py-1 rounded-br-xl shadow flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                <span>عرض كينجز ستور الرسمي</span>
              </div>

              <div className="flex items-start gap-3.5 pt-4">
                <div className="shrink-0">
                  <ProductBrandIcon slug="google-gemini-advanced" brand="Google" size="lg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-white text-base">Google AI جيميناي برو</h3>
                    <div className="text-left">
                      <span className="text-2xl font-black text-amber-400">
                        {formatPrice(150, currency)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    اشتراك 18 شهر كاملة + سعة 2TB جوجل درايف على إيميلك الشخصي
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تفعيل رسمي خلال 10 دقائق</span>
                    <span className="text-slate-500">•</span>
                    <span>ضمان 18 شهر</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Card 2: Canva Pro 3 Years for 150 EGP */}
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-500/40 p-4 shadow-xl shadow-cyan-950/40 hover:border-cyan-400 transition-all duration-300">
              <div className="absolute top-0 left-0 bg-cyan-500 text-slate-950 text-[11px] font-black px-3 py-1 rounded-br-xl shadow flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>الأكثر مبيعاً للمصممين</span>
              </div>

              <div className="flex items-start gap-3.5 pt-4">
                <div className="shrink-0">
                  <ProductBrandIcon slug="canva-pro" brand="Canva" size="lg" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-white text-base">Canva Pro كانفا برو</h3>
                    <div className="text-left">
                      <span className="text-2xl font-black text-cyan-400">
                        {formatPrice(150, currency)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    اشتراك 3 سنوات كاملة على إيميلك الخاص مع جميع ميزات الذكاء الاصطناعي
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>تفعيل فوري برابط دعوة</span>
                    <span className="text-slate-500">•</span>
                    <span>ضمان 3 سنوات</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick stats ribbon */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-xs">
              <div>
                <span className="block text-white font-black text-base">+15,000</span>
                <span className="text-slate-400 text-[10px]">عميل في مصر والخليج</span>
              </div>
              <div className="h-6 w-[1px] bg-slate-800"></div>
              <div>
                <span className="block text-emerald-400 font-black text-base">99.8%</span>
                <span className="text-slate-400 text-[10px]">نسبة رضا العملاء</span>
              </div>
              <div className="h-6 w-[1px] bg-slate-800"></div>
              <div>
                <span className="block text-amber-400 font-black text-base">7 دقائق</span>
                <span className="text-slate-400 text-[10px]">متوسط سرعة التفعيل</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
