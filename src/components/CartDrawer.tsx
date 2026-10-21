import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  Check
} from 'lucide-react';
import { ProductBrandIcon } from './ProductBrandIcon';
import { CartItem, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: { code: string; discountPercent: number; discountFixedEGP: number } | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Subtotal in EGP
  const subtotalEGP = items.reduce(
    (sum, item) => sum + item.selectedPlan.priceEGP * item.quantity,
    0
  );

  // Calculate discount in EGP
  let discountEGP = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountEGP = (subtotalEGP * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixedEGP > 0) {
      discountEGP = Math.min(subtotalEGP, appliedCoupon.discountFixedEGP);
    }
  }

  const finalTotalEGP = Math.max(0, subtotalEGP - discountEGP);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim());
    if (success) {
      setCouponSuccess(true);
      setCouponError('');
      setTimeout(() => setCouponSuccess(false), 2000);
    } else {
      setCouponError('كود الخصم غير صحيح أو منتهي الصلاحية (جرب KINGS2025)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">سلة الاشتراكات</h3>
                <span className="text-xs text-slate-400">
                  {items.length === 0 ? 'السلة فارغة' : `${items.length} منتجات في السلة`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-center text-slate-500">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">سلتك لا تزال فارغة!</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    اختر أدوات الذكاء الاصطناعي التي تريدها واستمتع بتفعيل فوري على إيميلك الخاص.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="shrink-0 mt-0.5">
                        <ProductBrandIcon slug={item.product.slug} brand={item.product.brand} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-xs sm:text-sm truncate">
                          {item.product.nameAr}
                        </h4>
                        <span className="text-[11px] text-amber-400 font-medium block">
                          {item.selectedPlan.durationLabel}
                        </span>
                        <span className="text-[10px] text-emerald-400 block truncate">
                          ✓ {item.selectedPlan.deliveryTypeLabel}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors shrink-0"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-amber-400 text-slate-400"
                        title="إنقاص"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-amber-400 text-slate-400"
                        title="زيادة"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-left font-mono">
                      <span className="text-sm font-black text-white">
                        {formatPrice(item.selectedPlan.priceEGP * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout Section (Only if items exist) */}
          {items.length > 0 && (
            <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4">
              
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>كوبون مفعّل: {appliedCoupon.code}</span>
                      <span>({appliedCoupon.discountPercent > 0 ? `${appliedCoupon.discountPercent}%` : `${appliedCoupon.discountFixedEGP} ج`})</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="كود الخصم (جرب KINGS2025)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 uppercase tracking-wider focus:outline-none focus:border-amber-400"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all"
                    >
                      تطبيق
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> تم تطبيق الخصم بنجاح!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono text-slate-200">
                    {formatPrice(subtotalEGP, currency)}
                  </span>
                </div>

                {discountEGP > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>قيمة الخصم:</span>
                    <span className="font-mono">
                      -{formatPrice(discountEGP, currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>المبلغ الإجمالي للدفع:</span>
                  <span className="font-mono text-amber-400 text-lg">
                    {formatPrice(finalTotalEGP, currency)}
                  </span>
                </div>
              </div>

              {/* Trust badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 justify-center">
                <ShieldCheck className="w-4 h-4" />
                <span>ضمان كامل المدة وتفعيل رسمي فوري 100%</span>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.01]"
              >
                <span>متابعة لإتمام الطلب والدفع</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
