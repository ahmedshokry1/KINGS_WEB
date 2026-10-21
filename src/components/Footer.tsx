import React from 'react';
import { Crown, MessageCircle, ShieldCheck, Mail, Phone, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTracking: () => void;
  onOpenAdvisor: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracking,
  onOpenAdvisor,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#060810] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[2px]">
                <div className="w-full h-full bg-[#060810] rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <span className="text-xl font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                KINGS <span className="text-amber-400">STORE</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              المتجر العربي المعتمد لبيع اشتراكات وحسابات أدوات الذكاء الاصطناعي والتصميم الأصلية بأفضل الأسعار وتفعيل فوري على إيميلك الشخصي وضمان استبدال كامل المدة.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/201029384756"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>واتساب المبيعات والدعم</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              أقسام الاشتراكات
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button 
                  onClick={() => onSelectCategory('all')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  جميع الاشتراكات
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('ai-chat')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  شات جي بي تي وكلاود
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('design')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  كانفا برو وميدجورني
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('coding')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  كورسور وكولاب برو
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('bundles')} 
                  className="hover:text-amber-400 transition-colors"
                >
                  باقات التوفير الكبرى
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              خدمة العملاء
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={onOpenTracking} className="hover:text-amber-400 transition-colors">
                  تتبع حالة طلبك
                </button>
              </li>
              <li>
                <button onClick={onOpenAdvisor} className="hover:text-amber-400 transition-colors">
                  مستشار الذكاء الاصطناعي
                </button>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-amber-400 transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
              <li>
                <span className="text-emerald-400 font-semibold block">
                  ضمان استبدال فوري 100%
                </span>
              </li>
            </ul>
          </div>

          {/* Contact and Payment */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              طرق الدفع المدعومة
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                انستاباي InstaPay
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                فودافون كاش
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                فيزا / ماستركارد
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                مدى Mada
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                USDT (Crypto)
              </span>
            </div>
            <p className="text-[10px] text-slate-500 pt-2">
              جميع المعاملات تتم بأقصى درجات الأمان والسرية التامة.
            </p>
          </div>

        </div>

        {/* Bottom copy */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} كينجز ستور (Kings Store). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>صُنع خصيصاً لخدمة المطورين، المصممين وصناع المحتوى العرب</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
