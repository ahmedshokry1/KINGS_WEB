import React from 'react';
import { Zap, ShieldCheck, BadgePercent, Headphones, Lock, CheckCircle2 } from 'lucide-react';

export const TrustFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      title: 'تفعيل رسمي وفوري',
      desc: 'تفعيل مباشر على إيميلك الشخصي برابط رسمي خلال 5 إلى 15 دقيقة بدون الحاجة لمشاركة كلمة السر الخاصة بك.',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      title: 'ضمان كامل المدة 100%',
      desc: 'جميع اشتراكاتنا مشمولة بضمان استبدال فوري ومتابعة دورية طوال فترة اشتراكك لضمان استمرارية عملك.',
    },
    {
      icon: BadgePercent,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      title: 'أوفر أسعار في السوق',
      desc: 'وفر أكثر من 70% مقارنة بالاشتراك المباشر بالدولار، وتخلص من مشاكل بطاقات الدفع الدولية ورسوم العملة.',
    },
    {
      icon: Headphones,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
      title: 'دعم فني متواصل 24/7',
      desc: 'فريق متخصص من خبراء الذكاء الاصطناعي جاهز للرد على استفساراتك وحل أي مشكلة تواجهك فوراً عبر الواتساب.',
    },
  ];

  return (
    <section className="py-12 border-b border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
            لماذا يختار المحترفون كينجز ستور؟
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            تجربة اشتراك مضمونة وسلسة بدون أي تعقيد
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.bg}`}>
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
