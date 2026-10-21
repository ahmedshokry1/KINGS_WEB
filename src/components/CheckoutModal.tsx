import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Coins, 
  ArrowLeft, 
  Sparkles,
  Phone,
  Mail,
  User,
  Clock,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CurrencyCode, Order } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  totalEGP: number;
  onOrderPlaced: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  totalEGP,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash' | 'card' | 'mada' | 'usdt'>('instapay');
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState('');
  
  // Validation & Loading
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!customerName.trim()) {
      errs.customerName = 'يرجى كتابة اسمك الكريم';
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      errs.customerEmail = 'يرجى إدخال بريد إلكتروني صالح لاستلام التفعيل';
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      errs.customerPhone = 'يرجى إدخال رقم هاتف / واتساب صالح لتسليم تفاصيل الحساب';
    }
    if (!paymentReference.trim()) {
      errs.paymentReference = 'يرجى كتابة اسم المحول أو الرقم المرجعي لعملية التحويل';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#ffffff'],
        });
      } catch (err) {
        // ignore if canvas unavailable
      }

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `KS-${randomNum}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.product.nameAr,
          planLabel: it.selectedPlan.durationLabel,
          deliveryType: it.selectedPlan.deliveryType,
          priceEGP: it.selectedPlan.priceEGP,
          pricePaid: it.selectedPlan.priceEGP * it.quantity,
          currency: 'EGP',
          quantity: it.quantity,
        })),
        totalEGP,
        totalPaid: totalEGP,
        currency,
        paymentMethod,
        paymentReference: paymentReference.trim(),
        status: 'verifying_payment',
        activationNotes: 'تم تسجيل الطلب وجاري التحقق من التحويل وتجهيز التفعيل الفوري',
      };

      onOrderPlaced(newOrder);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>إتمام طلب الاشتراك والتفعيل الفوري</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              خطوة واحدة لاستلام تفعيل حسابك على بريدك الإلكتروني والواتساب
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Order Summary Strip */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex -space-x-2 space-x-reverse shrink-0">
                {items.slice(0, 3).map((it) => (
                  <div key={it.id} className="border-2 border-slate-900 rounded-2xl">
                    <ProductBrandIcon slug={it.product.slug} brand={it.product.brand} size="sm" />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-slate-400 block">الاشتراكات المطلوبة ({items.length}):</span>
                <span className="text-xs font-bold text-white truncate block">
                  {items.map((i) => i.product.nameAr).join(' + ')}
                </span>
              </div>
            </div>
            <div className="text-left shrink-0">
              <span className="text-[11px] text-slate-400 block">المبلغ المطلوب:</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {formatPrice(totalEGP, currency)}
              </span>
            </div>
          </div>

          {/* Section 1: Customer Contact info */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>1. بيانات استلام التفعيل والتواصل</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الاسم بالكامل <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد محمد علي"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                {errors.customerName && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  رقم الواتساب <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 01012345678 أو +966..."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
                {errors.customerPhone && (
                  <p className="text-[11px] text-rose-400 mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                البريد الإلكتروني المراد تفعيل الاشتراك عليه (Gmail يفضل) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                تنبيه: ستصلك دعوة التفعيل الرسمية أو تفاصيل الحساب على هذا البريد فوراً.
              </p>
              {errors.customerEmail && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.customerEmail}</p>
              )}
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>2. اختر وسيلة الدفع المناسبة لك</span>
            </h4>

            {/* Payment method selector pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('instapay')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'instapay'
                    ? 'bg-amber-500/15 border-amber-500 text-white font-bold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-5 h-5 mx-auto mb-1 text-amber-400" />
                <span className="text-xs block">انستاباي InstaPay</span>
                <span className="text-[10px] text-emerald-400 font-normal">تأكيد فوري</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('vodafone_cash')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'vodafone_cash'
                    ? 'bg-rose-500/15 border-rose-500 text-white font-bold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Smartphone className="w-5 h-5 mx-auto mb-1 text-rose-400" />
                <span className="text-xs block">فودافون / كاش</span>
                <span className="text-[10px] text-slate-400 font-normal">محافظ إلكترونية</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-blue-500/15 border-blue-500 text-white font-bold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                <span className="text-xs block">فيزا / ماستركارد</span>
                <span className="text-[10px] text-slate-400 font-normal">بطاقة بنكية</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('usdt')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'usdt'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white font-bold'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Coins className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                <span className="text-xs block">USDT (Crypto)</span>
                <span className="text-[10px] text-slate-400 font-normal">TRC20 عالمي</span>
              </button>
            </div>

            {/* Payment Method Details Box */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-3">
              {paymentMethod === 'instapay' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">عنوان الدفع اللحظي (IPA):</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('kings.store@instapay', 'ipa')}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono font-bold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'ipa' ? 'تم النسخ!' : 'نسخ العنوان'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono font-bold text-amber-400 text-center tracking-wider text-sm select-all">
                    kings.store@instapay
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    افتح تطبيق انستاباي، اختر إرسال نقود إلى (عنوان IPA)، وضع العنوان أعلاه وحوّل مبلغ <strong className="text-white">{formatPrice(totalEGP, currency)}</strong>.
                  </p>
                </div>
              )}

              {paymentMethod === 'vodafone_cash' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">رقم محفظة فودافون كاش:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('01029384756', 'vf')}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono font-bold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'vf' ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono font-bold text-rose-400 text-center tracking-widest text-base select-all">
                    01029384756
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    حوّل المبلغ المطلوب كـ (تحويل أموال كاش) وليس رصيد، واكتب رقمك المحول منه في الحقل أدناه لتأكيد فوري.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>بوابة دفع آمنة ومشفرة 256-bit SSL</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="رقم البطاقة (16 رقم)"
                      className="col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-center"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'usdt' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">عنوان محفظة USDT (TRC-20):</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('TX7vK9L2xQnpw9Yza8M1b5CdRf4gH6jKl8', 'usdt')}
                      className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono font-bold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedField === 'usdt' ? 'تم النسخ!' : 'نسخ المحفظة'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-emerald-400 text-[11px] text-center select-all break-all">
                    TX7vK9L2xQnpw9Yza8M1b5CdRf4gH6jKl8
                  </div>
                  <p className="text-[10px] text-slate-400">شبكة Tron (TRC20) فقط.</p>
                </div>
              )}
            </div>

            {/* Reference Number / Transfer Proof */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم صاحب التحويل أو الرقم المرجعي للعملية <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="مثال: تحويل باسم كريم أحمد / أو رقم عملية انستاباي"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
              />
              {errors.paymentReference && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.paymentReference}</p>
              )}
            </div>

            {/* Customer Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ملاحظات إضافية (اختياري)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي طلب خاص أو استفسار لفريق الدعم الفني..."
                rows={2}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>طلبك محمي بضمان كينجز ستور: استبدال فوري ودعم فني متاح 24 ساعة عبر الواتساب.</span>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5 animate-spin" />
                جاري تسجيل طلبك وتجهيز التفعيل...
              </span>
            ) : (
              <>
                <span>تأكيد الطلب واستلام الاشتراك الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
