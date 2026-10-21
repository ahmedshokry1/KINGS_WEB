import React, { useState } from 'react';
import { 
  Crown, 
  ShoppingCart, 
  Search, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  X,
  Lock,
  ShieldCheck,
  Sliders
} from 'lucide-react';
import { CurrencyCode } from '../types/store';
import { CURRENCIES, formatPrice } from '../utils/currency';

interface NavbarProps {
  cartCount: number;
  cartTotalEGP: number;
  currentCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onOpenCart: () => void;
  onOpenAdvisor: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotalEGP,
  currentCurrency,
  onCurrencyChange,
  onOpenCart,
  onOpenAdvisor,
  onOpenTracking,
  onOpenAdmin,
  isAdminLoggedIn,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  selectedCategory,
}) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-xl border-b border-amber-500/20 shadow-lg shadow-black/50">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
        <span>عرض كينجز ستور الحصري: اشتراك كانفا برو 3 سنوات بـ 150 ج.م فقط | تفعيل على إيميلك الشخصي وضمان كامل المدة!</span>
        <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded text-[10px] tracking-wider font-mono">KINGS2025</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 p-[2px] shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300">
                <div className="w-full h-full bg-[#090d16] rounded-2xl flex items-center justify-center">
                  <Crown className="w-7 h-7 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#090d16] flex items-center justify-center" title="تفعيل فوري متاح">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
                  KINGS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">STORE</span>
                </span>
              </div>
              <p className="text-[11px] text-amber-400/80 font-medium">متجر اشتراكات الذكاء الاصطناعي والتصميم</p>
            </div>
          </div>

          {/* Search bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أداة (ChatGPT, Canva, Gemini, Cursor...)"
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Actions & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* AI Advisor Assistant Quiz button */}
            <button
              onClick={onOpenAdvisor}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-amber-500/10 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 transition-all text-xs font-semibold shadow-sm hover:shadow-purple-500/20"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>مستشار الاشتراكات</span>
            </button>

            {/* Order Tracking button */}
            <button
              onClick={onOpenTracking}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>تتبع طلبي</span>
            </button>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-xs font-medium text-slate-200 transition-all"
              >
                <span className="font-bold text-amber-400">{CURRENCIES[currentCurrency].symbol}</span>
                <span className="hidden xs:inline">{CURRENCIES[currentCurrency].code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showCurrencyDropdown && (
                <div 
                  className="absolute left-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 overflow-hidden"
                  onMouseLeave={() => setShowCurrencyDropdown(false)}
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => (
                    <button
                      key={cCode}
                      onClick={() => {
                        onCurrencyChange(cCode);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        currentCurrency === cCode ? 'text-amber-400 bg-amber-500/10 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>{CURRENCIES[cCode].nameAr}</span>
                      <span className="font-mono text-[10px] text-slate-400">{CURRENCIES[cCode].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Protected Admin Access Button */}
            <button
              onClick={onOpenAdmin}
              title={isAdminLoggedIn ? "لوحة الإدارة (مسجل الدخول)" : "لوحة تحكم الأدمن (محمية بكلمة سر)"}
              className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                isAdminLoggedIn
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-400 hover:text-amber-400'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="hidden xl:inline text-[11px] text-amber-300">لوحة الإدارة</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="hidden xl:inline text-[11px]">لوحة الإدارة</span>
                </>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center bg-slate-950 text-amber-400 rounded-full w-5 h-5 text-xs font-black shadow">
                  {cartCount}
                </span>
              )}
              {cartTotalEGP > 0 && (
                <span className="hidden md:inline border-r border-amber-900/30 pr-2 mr-0.5 text-xs font-black">
                  {formatPrice(cartTotalEGP, currentCurrency)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أداة (ChatGPT, Canva, Gemini...)"
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-4 pr-10 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-2.5 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
