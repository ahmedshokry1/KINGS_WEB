import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'كيف يتم التفعيل على إيميلي الشخصي؟ وهل تحتاجون كلمة السر؟',
      a: 'نهائياً، لا نطلب كلمة السر الخاصة بك على الإطلاق! في خدمات مثل Google Gemini و Canva Pro، يتم التفعيل عن طريق إرسال دعوة رسمية (Official Invite) إلى بريدك الإلكتروني، وتضغط "قبول الدعوة" فقط لتتحول خطتك فوراً إلى النسخة المدفوعة مع الحفاظ على خصوصية كامل ملفاتك.',
    },
    {
      q: 'هل الأدوات والاشتراكات أصلية ورسمية؟',
      a: 'نعم 100%، جميع الاشتراكات مقدمة من السيرفرات الرسمية لشركات OpenAI و Anthropic و Google و Canva وغيرها، وتستمتع بجميع التحديثات ونماذج الذكاء الاصطناعي الجديدة بمجرد صدورها.',
    },
    {
      q: 'ماذا يعني "ضمان كامل المدة" من كينجز ستور؟',
      a: 'يعني أنه إذا اخترت اشتراكاً لمدة شهر أو سنة أو 3 سنوات، فنحن ملتزمون بخدمتك طوال هذه المدة. وفي حال حدوث أي انقطاع أو مشكلة فنية، يقوم فريق الدعم الفني بإصلاحها أو استبدال الحساب فوراً ومجاناً.',
    },
    {
      q: 'ما هي طرق الدفع المتاحة داخل وخارج مصر؟',
      a: 'نوفر جميع الطرق المحلية والإقليمية الأكثر سهولة: داخل مصر عبر تطبيق انستاباي (InstaPay) ومحافظ فودافون كاش وأورانج واتصالات كاش، ومن كافة الدول العربية والخليج عبر البطاقات البنكية المباشرة، مدى، وعملة USDT الرقمية (TRC20).',
    },
    {
      q: 'هل أحتاج إلى VPN لتشغيل هذه الأدوات؟',
      a: 'لا، جميع الاشتراكات والحسابات التي نوفرها جاهزة للعمل مباشرة في مصر والسعودية والإمارات وكافة الدول العربية بدون الحاجة لتشغيل أي برامج VPN.',
    },
    {
      q: 'كم يستغرق استلام الاشتراك بعد إتمام عملية التحويل؟',
      a: 'متوسط وقت التجهيز الفعلي لدينا يتراوح بين 5 إلى 15 دقيقة فقط! بمجرد إتمام الطلب وإرسال التحويل، يقوم النظام وفريق الدعم بتجهيز الرابط أو بيانات الحساب وإرسالها إلى إيميلك ورقم الواتساب الخاص بك.',
    },
  ];

  return (
    <section className="py-14 border-b border-slate-800/80 bg-slate-950/60" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الأسئلة الشائعة والإجابات</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            كل ما تود معرفته قبل الاشتراك
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-right p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-amber-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
