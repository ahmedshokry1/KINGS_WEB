import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, CheckCircle } from 'lucide-react';

interface SaleEvent {
  buyer: string;
  city: string;
  product: string;
  timeAgo: string;
}

const RECENT_SALES: SaleEvent[] = [
  { buyer: 'م. أحمد', city: 'القاهرة', product: 'Google AI جيميناي برو (18 شهر)', timeAgo: 'منذ دقيقتين' },
  { buyer: 'سارة م.', city: 'الإسكندرية', product: 'Canva Pro (3 سنوات)', timeAgo: 'منذ 5 دقائق' },
  { buyer: 'كريم ع.', city: 'الجيزة', product: 'باقة المطورين (Cursor + Claude + GPT)', timeAgo: 'منذ 8 دقائق' },
  { buyer: 'عبدالرحمن', city: 'الرياض', product: 'ChatGPT Plus (حساب خاص)', timeAgo: 'منذ 11 دقيقة' },
  { buyer: 'نور الدين', city: 'المنصورة', product: 'CapCut Pro (سنة كاملة)', timeAgo: 'منذ 14 دقيقة' },
  { buyer: 'يوسف خ.', city: 'طنطا', product: 'Midjourney v6.1', timeAgo: 'منذ 18 دقيقة' },
];

export const RecentSalesToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show after 3 seconds initial delay
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Cycle every 10 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length);
        setIsVisible(true);
      }, 600);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = RECENT_SALES[currentIndex];

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-xs animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-3 rounded-2xl bg-slate-900/95 border border-amber-500/30 shadow-2xl backdrop-blur-md flex items-start gap-3 text-right">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
          <ShoppingBag className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold mb-0.5">
            <CheckCircle className="w-3 h-3" />
            <span>طلب تفعيل جديد</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 font-normal">{current.timeAgo}</span>
          </div>

          <p className="text-xs font-bold text-white truncate">
            {current.product}
          </p>

          <span className="text-[10px] text-slate-400 block mt-0.5">
            المشتري: {current.buyer} من {current.city}
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-500 hover:text-white p-0.5"
          title="إغلاق"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
