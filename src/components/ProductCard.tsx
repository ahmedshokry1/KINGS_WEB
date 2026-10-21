import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Bot, 
  Cpu, 
  Terminal, 
  Image as ImageIcon, 
  Search, 
  Mic, 
  Video, 
  Server, 
  Code, 
  Crown, 
  Star, 
  Check, 
  ShieldCheck, 
  Clock, 
  ShoppingCart, 
  ArrowLeft,
  Zap,
  Info
} from 'lucide-react';
import { ProductBrandIcon } from './ProductBrandIcon';
import { SubscriptionProduct, PlanVariant, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: SubscriptionProduct;
  currency: CurrencyCode;
  onAddToCart: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onBuyNow: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onViewDetails: (product: SubscriptionProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onBuyNow,
  onViewDetails,
}) => {
  // Default to popular plan or first plan
  const defaultPlan = product.plans.find((p) => p.isPopular) || product.plans[0];
  const [selectedPlan, setSelectedPlan] = useState<PlanVariant>(defaultPlan);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const discountPercent = Math.round(
    ((selectedPlan.originalPriceEGP - selectedPlan.priceEGP) / selectedPlan.originalPriceEGP) * 100
  );

  const handleAddToCart = () => {
    onAddToCart(product, selectedPlan);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div className="group relative flex flex-col justify-between bg-slate-900/70 hover:bg-slate-900/95 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10">
      
      {/* Top Banner / Badge */}
      <div className="flex items-center justify-between gap-2 mb-4">
        {product.badge ? (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-500/30 ${product.colorScheme.badgeBg} ${product.colorScheme.badgeText}`}>
            {product.badge}
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-medium">{product.brand}</span>
        )}

        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md text-xs text-amber-400 font-bold">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{product.rating}</span>
          <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Header Info */}
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          <div className="shrink-0 transition-transform duration-300 group-hover:scale-105">
            <ProductBrandIcon slug={product.slug} brand={product.brand} size="md" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-amber-300 transition-colors">
              {product.nameAr}
            </h3>
            <span className="text-xs text-slate-400 font-mono font-medium block mt-0.5" dir="ltr">
              {product.name}
            </span>
          </div>
        </div>

        <p className="text-slate-300 text-xs leading-relaxed mb-4 line-clamp-2">
          {product.shortDescAr}
        </p>

        {/* Plan variants selector (Buttons / Pills) */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
            اختر مدة ونوع الباقة:
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {product.plans.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`text-right px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/80 text-white font-bold shadow-sm'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-500'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />}
                    </div>
                    <span>{plan.durationLabel}</span>
                  </div>

                  <span className="font-bold font-mono text-amber-400">
                    {formatPrice(plan.priceEGP, currency)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Plan Details Chip */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5 mb-4 text-[11px]">
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">نوع التسليم:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {selectedPlan.deliveryTypeLabel}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="text-slate-400">سرعة التجهيز:</span>
            <span className="font-medium text-slate-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              {product.deliveryTime}
            </span>
          </div>
        </div>

        {/* Key Feature Preview */}
        <ul className="space-y-1 mb-5 text-[11px] text-slate-300">
          {product.featuresAr.slice(0, 2).map((feat, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pricing & Actions */}
      <div className="pt-3 border-t border-slate-800/90">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">
                {formatPrice(selectedPlan.priceEGP, currency)}
              </span>
              {selectedPlan.originalPriceEGP > selectedPlan.priceEGP && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  {formatPrice(selectedPlan.originalPriceEGP, currency)}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                وفر {discountPercent}%
              </span>
            )}
          </div>

          <button
            onClick={() => onViewDetails(product)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
          >
            <Info className="w-3.5 h-3.5" />
            <span>التفاصيل</span>
          </button>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
              addedAnimation 
                ? 'bg-emerald-600 border-emerald-500 text-white' 
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>تمت الإضافة!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>

          <button
            onClick={() => onBuyNow(product, selectedPlan)}
            className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>شراء فوري</span>
          </button>
        </div>
      </div>

    </div>
  );
};
