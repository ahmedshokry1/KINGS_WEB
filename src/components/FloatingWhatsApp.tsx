import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickMessages = [
    'مرحباً، أود الاستفسار عن عرض كانفا برو 3 سنوات بـ 150 ج',
    'أريد معرفة تفاصيل تفعيل Google AI جيميناي 18 شهر',
    'أرغب في شراء اشتراك ChatGPT Plus أو Cursor Pro',
    'لدي استفسار بخصوص طريقة الدفع عبر انستاباي',
  ];

  const handleSend = (text: string) => {
    const url = `https://wa.me/201029384756?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-5 left-5 z-40">
      {isOpen && (
        <div className="mb-3 w-80 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">خدمة عملاء كينجز ستور</h4>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  متواجدون للرد الفوري الآن
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-black/10 rounded-lg text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick choices */}
          <div className="p-4 space-y-2 bg-slate-900 text-xs">
            <p className="text-slate-400 text-[11px] mb-2">اختر موضوع استفسارك أو اكتب لنا مباشرة:</p>
            {quickMessages.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(msg)}
                className="w-full text-right p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 transition-all flex items-center justify-between group"
              >
                <span className="text-[11px] line-clamp-1">{msg}</span>
                <Send className="w-3 h-3 text-emerald-400 group-hover:translate-x-[-2px] transition-transform shrink-0" />
              </button>
            ))}
          </div>

          {/* Open Chat button */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <button
              onClick={() => handleSend('مرحباً كينجز ستور، أود الاستفسار عن اشتراكات الذكاء الاصطناعي')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>محادثة مباشرة على واتساب</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill / Circle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-600"></span>
        </div>
        <span className="hidden sm:inline">دعم واتساب 24/7</span>
      </button>
    </div>
  );
};
