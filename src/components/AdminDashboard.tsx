import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Search, 
  Plus, 
  Edit3, 
  MessageCircle, 
  Mail, 
  Phone, 
  Trash2, 
  Save, 
  LogOut, 
  Sparkles, 
  Copy,
  Sliders,
  Check,
  AlertTriangle,
  UserCheck,
  Calendar,
  RefreshCw,
  Power,
  Key,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { 
  Order, 
  SubscriptionProduct, 
  PlanVariant, 
  CurrencyCode, 
  ProductCategory, 
  DeliveryType,
  CustomerSubscription,
  SubscriptionStatus 
} from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: SubscriptionProduct[];
  subscriptions: CustomerSubscription[];
  currency: CurrencyCode;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status'], notes?: string) => void;
  onUpdateSubscriptionStatus: (subId: string, newStatus: SubscriptionStatus) => void;
  onToggleCustomerAutoRenew: (subId: string, enabled: boolean) => void;
  onExtendSubscription: (subId: string, days: number) => void;
  onAddProduct: (product: SubscriptionProduct) => void;
  onUpdateProduct: (product: SubscriptionProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  subscriptions,
  currency,
  onUpdateOrderStatus,
  onUpdateSubscriptionStatus,
  onToggleCustomerAutoRenew,
  onExtendSubscription,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onLogout,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'subscriptions'>('products');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [subSearch, setSubSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<SubscriptionProduct | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // New product form modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Kings AI');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('ai-chat');
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdDuration, setNewProdDuration] = useState('سنة كاملة');

  const totalRevenueEGP = orders.reduce((sum, o) => sum + o.totalEGP, 0);
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const pendingOrders = orders.filter((o) => o.status !== 'completed').length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.nameAr.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Edit modal for a product
  const handleStartEdit = (product: SubscriptionProduct) => {
    // deep clone so edits don't mutate until explicitly saved
    setEditingProduct(JSON.parse(JSON.stringify(product)));
  };

  // Save changes to editing product
  const handleSaveProductChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    onUpdateProduct(editingProduct);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setEditingProduct(null);
    }, 1000);
  };

  // Add plan to editing product
  const handleAddPlanToEditingProduct = () => {
    if (!editingProduct) return;
    const newPlan: PlanVariant = {
      id: `plan-${Date.now()}`,
      durationLabel: 'باقة جديدة',
      durationMonths: 1,
      priceEGP: 150,
      originalPriceEGP: 300,
      deliveryType: 'invite',
      deliveryTypeLabel: 'تفعيل على إيميلك الخاص',
      isPopular: false,
    };
    setEditingProduct({
      ...editingProduct,
      plans: [...editingProduct.plans, newPlan],
    });
  };

  // Remove plan from editing product
  const handleRemovePlanFromEditingProduct = (planId: string) => {
    if (!editingProduct) return;
    if (editingProduct.plans.length <= 1) {
      alert('يجب أن يحتوي المنتج على باقة واحدة على الأقل');
      return;
    }
    setEditingProduct({
      ...editingProduct,
      plans: editingProduct.plans.filter((p) => p.id !== planId),
    });
  };

  // Update specific plan field
  const handleUpdatePlanField = (
    planId: string,
    field: keyof PlanVariant,
    value: any
  ) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      plans: editingProduct.plans.map((p) =>
        p.id === planId ? { ...p, [field]: value } : p
      ),
    });
  };

  // Add new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr.trim()) return;

    const newProduct: SubscriptionProduct = {
      id: `prod-${Date.now()}`,
      name: newProdNameEn || newProdNameAr,
      nameAr: newProdNameAr,
      slug: newProdNameEn.toLowerCase().replace(/\s+/g, '-') || `prod-${Date.now()}`,
      brand: newProdBrand || 'Kings AI',
      category: newProdCategory,
      badge: 'جديد ⚡',
      shortDescAr: 'اشتراك رسمي موثوق مع تفعيل فوري وضمان كامل المدة من كينجز ستور.',
      fullDescAr: 'اشتراك رسمي موثوق مع كامل الصلاحيات والدعم الفني طوال فترة الاشتراك.',
      iconName: 'Sparkles',
      colorScheme: {
        accent: '#F59E0B',
        bgGlow: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.3)',
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-400',
      },
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      deliveryTime: 'خلال 10 دقائق',
      plans: [
        {
          id: `plan-${Date.now()}`,
          durationLabel: newProdDuration,
          durationMonths: 12,
          priceEGP: Number(newProdPrice),
          originalPriceEGP: Number(newProdPrice) * 1.5,
          deliveryType: 'invite',
          deliveryTypeLabel: 'تفعيل رسمي على إيميلك الخاص',
          isPopular: true,
        },
      ],
      featuresAr: [
        'تفعيل رسمي وسريع بدون الحاجة لكلمة السر',
        'ضمان كامل المدة مع استبدال فوري',
        'دعم فني متواصل عبر الواتساب',
      ],
      activationStepsAr: [
        'أدخل بريدك وسيتم إرسال دعوة التفعيل الرسمية',
      ],
      requirementsAr: 'إيميل شخصي نشط فقط',
      faqs: [
        {
          question: 'هل الاشتراك أصلي ومضمون؟',
          answer: 'نعم بضمان كينجز ستور الكامل طوال فترة اشتراكك.',
        },
      ],
    };

    onAddProduct(newProduct);
    setIsAddingProduct(false);
    setNewProdNameAr('');
    setNewProdNameEn('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-5xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  لوحة تحكم كينجز ستور (إدارة الأسعار والمنتجات والطلبات)
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  مدير مسجل
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                يمكنك تعديل أسعار وباقات الاشتراكات وتحديث حالات الطلبات لحظياً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              title="تسجيل خروج الأدمن"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 border-b border-slate-800 bg-slate-900/40">
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>إجمالي المبيعات</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-white font-mono">
              {formatPrice(totalRevenueEGP, currency)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>طلبات قيد التفعيل</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
              {pendingOrders} طلبات
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>طلبات مكتملة</span>
              <CheckCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
              {completedOrders} طلب
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>الاشتراكات المتاحة</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-purple-400 font-mono">
              {products.length} أداة ذكاء
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'products'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>إدارة الاشتراكات وتعديل الأسعار ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>طلبات المشتركين والتفعيل ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'subscriptions'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>إدارة الاشتراكات والتجديد التلقائي ({subscriptions.length})</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={() => setIsAddingProduct(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة منتج جديد</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 1: Products & Price Manager */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* Product search & count bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="ابحث عن اشتراك لتعديل سعره..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  اضغط على زر <strong className="text-amber-400">"تعديل المنتج والأسعار"</strong> لتغيير أي سعر أو إضافة باقات جديدة.
                </span>
              </div>

              {/* Products Cards Grid with Direct Edit & Price controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p) => {
                  const defaultPlan = p.plans.find((pl) => pl.isPopular) || p.plans[0];
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start gap-3 mb-2">
                          <div className="shrink-0 mt-0.5">
                            <ProductBrandIcon slug={p.slug} brand={p.brand} size="md" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-slate-400">{p.brand}</span>
                              {p.badge && (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  {p.badge}
                                </span>
                              )}
                            </div>

                            <h4 className="font-extrabold text-white text-sm leading-snug">
                              {p.nameAr}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-mono block mt-0.5" dir="ltr">
                              {p.name}
                            </span>
                          </div>
                        </div>

                        {/* List of current active plans & prices */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            الباقات والأسعار الحالية ({p.plans.length}):
                          </span>
                          {p.plans.map((pl) => (
                            <div
                              key={pl.id}
                              className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {pl.isPopular && <span className="text-amber-400 text-[10px]">★</span>}
                                <span className="text-slate-200 truncate">{pl.durationLabel}</span>
                              </div>
                              <span className="font-mono font-black text-amber-400 text-xs shrink-0">
                                {formatPrice(pl.priceEGP, currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل المنتج والأسعار</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف اشتراك "${p.nameAr}" من المتجر؟`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: Orders Manager */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">تصفية حسب الحالة:</span>
                  {(['all', 'verifying_payment', 'activating', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg border transition-all ${
                        orderFilter === st
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {st === 'all' && 'الكل'}
                      {st === 'verifying_payment' && 'قيد التأكيد'}
                      {st === 'activating' && 'جاري التفعيل'}
                      {st === 'completed' && 'مكتمل'}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث برقم الطلب، الإيميل، الاسم..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    لا توجد طلبات تطابق الفلتر المحدد.
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const whatsappMsg = encodeURIComponent(
                      `مرحباً ${ord.customerName}، معك الدعم الفني من كينجز ستور بخصوص طلبك رقم ${ord.orderNumber}. تم تفعيل اشتراكك بنجاح!`
                    );
                    const whatsappLink = `https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${whatsappMsg}`;

                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-amber-400 text-sm">
                              {ord.orderNumber}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {ord.customerName}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({new Date(ord.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              ord.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'activating'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {ord.status === 'completed' && '✓ مكتمل وتم التسليم'}
                              {ord.status === 'activating' && '⚡ جاري التفعيل'}
                              {ord.status === 'verifying_payment' && '⏳ قيد التأكيد'}
                              {ord.status === 'pending_payment' && 'بانتظار الدفع'}
                            </span>

                            <span className="font-mono font-black text-sm text-white">
                              {formatPrice(ord.totalEGP, currency)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items & Customer details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          {/* Subscriptions */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-semibold">الاشتراك المطلوب:</span>
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="text-slate-200">
                                • {it.productName} ({it.planLabel})
                              </div>
                            ))}
                          </div>

                          {/* Customer Email & Phone */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-semibold">بيانات التسليم:</span>
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-mono">{ord.customerEmail}</span>
                              <button
                                onClick={() => handleCopy(ord.customerEmail, `mail-${ord.id}`)}
                                className="text-amber-400 hover:text-amber-300 ml-1"
                                title="نسخ البريد لإرسال الدعوة"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              {copiedId === `mail-${ord.id}` && (
                                <span className="text-[10px] text-emerald-400">تم!</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-mono" dir="ltr">{ord.customerPhone}</span>
                            </div>
                          </div>

                          {/* Payment method & Reference */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-semibold">طريقة الدفع والمرجع:</span>
                            <div className="text-slate-200">
                              طريقة: <strong className="text-amber-400">{ord.paymentMethod}</strong>
                            </div>
                            <div className="text-slate-300">
                              مرجع التحويل: <span className="font-mono">{ord.paymentReference}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions strip for Seller */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">تحديث الحالة:</span>
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'activating', 'تم تأكيد استلام المبلغ وجاري إرسال الدعوة')}
                              className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold"
                            >
                              بدء التفعيل
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'completed', 'تم تفعيل الحساب وإرسال الدعوة بنجاح')}
                              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold"
                            >
                              إكمال الطلب
                            </button>
                          </div>

                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>مراسلة العميل واتساب</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Customer Subscriptions Management & Auto-Renewals */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              
              {/* Stats overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-400 block font-semibold">اشتراكات نشطة</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.status === 'active').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[11px] text-purple-400 block font-semibold">تجديد تلقائي مفعل</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.autoRenew).length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[11px] text-amber-400 block font-semibold">قيد التجديد</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.status === 'pending_renewal').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-[11px] text-rose-400 block font-semibold">منتهية أو ملغاة</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.status === 'expired' || s.status === 'cancelled').length}
                  </span>
                </div>
              </div>

              {/* Subscriptions Filter and Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'active', label: 'نشط' },
                    { id: 'pending_renewal', label: 'قيد التجديد' },
                    { id: 'expired', label: 'منتهي' },
                    { id: 'cancelled', label: 'ملغى' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSubFilter(tab.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                        subFilter === tab.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    placeholder="بحث بإيميل العميل أو اسم الأداة..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Subscriptions Cards List */}
              <div className="space-y-3">
                {subscriptions
                  .filter((sub) => {
                    if (subFilter !== 'all' && sub.status !== subFilter) return false;
                    if (subSearch.trim()) {
                      const q = subSearch.toLowerCase().trim();
                      return (
                        sub.customerName.toLowerCase().includes(q) ||
                        sub.customerEmail.toLowerCase().includes(q) ||
                        sub.customerPhone.includes(q) ||
                        sub.productName.toLowerCase().includes(q) ||
                        sub.planLabel.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((sub) => {
                    const endStr = sub.expiryDate || sub.endDate || new Date().toISOString();
                    const daysRemaining = Math.max(
                      0,
                      Math.ceil((new Date(endStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    );

                    const reminderMsg = encodeURIComponent(
                      `مرحباً ${sub.customerName}، معك الدعم الفني من كينجز ستور بخصوص اشتراكك في ${sub.productName}. باقي على انتهاء اشتراكك ${daysRemaining} يوم. هل ترغب في التجديد والحفاظ على استمرارية الخدمة بنفس السعر المخفض (${sub.renewalPriceEGP} ج.م)؟`
                    );
                    const whatsappLink = `https://wa.me/${sub.customerPhone.replace(/[^0-9]/g, '')}?text=${reminderMsg}`;

                    return (
                      <div
                        key={sub.id}
                        className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <ProductBrandIcon slug={sub.productSlug} brand={sub.productName} size="sm" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{sub.productName}</span>
                                <span className="text-xs text-amber-400/90 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  {sub.planLabel}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                العميل: <strong className="text-slate-200">{sub.customerName}</strong> ({sub.customerEmail})
                              </span>
                            </div>
                          </div>

                          {/* Status changer */}
                          <div className="flex items-center gap-2">
                            <select
                              value={sub.status}
                              onChange={(e) => onUpdateSubscriptionStatus(sub.id, e.target.value as SubscriptionStatus)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                sub.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : sub.status === 'pending_renewal'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                  : sub.status === 'expired'
                                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                  : 'bg-slate-700 text-slate-300 border-slate-600'
                              }`}
                            >
                              <option value="active">نشط (Active)</option>
                              <option value="pending_renewal">قيد التجديد (Pending Renewal)</option>
                              <option value="expired">منتهي الصلاحية (Expired)</option>
                              <option value="cancelled">ملغى (Cancelled)</option>
                            </select>

                            <button
                              onClick={() => onToggleCustomerAutoRenew(sub.id, !sub.autoRenew)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                                sub.autoRenew
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                              title="تبديل حالة التجديد التلقائي"
                            >
                              <RefreshCw className={`w-3 h-3 ${sub.autoRenew ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                              <span>{sub.autoRenew ? 'تجديد مجدول' : 'تجديد يدوي'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Dates & Remaining days bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                          <div>
                            <span className="text-slate-400 block mb-0.5">فترة الاشتراك:</span>
                            <span className="text-slate-200 font-mono text-[11px]">
                              {sub.startDate} إلى {endStr}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <span>الأيام المتبقية:</span>
                              <span className="font-bold text-amber-400 font-mono">{daysRemaining} يوم</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  daysRemaining > 30 ? 'bg-emerald-500' : daysRemaining > 7 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, (daysRemaining / 365) * 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">قيمة التجديد القادم:</span>
                            <span className="text-emerald-400 font-bold font-mono">
                              {formatPrice(sub.renewalPriceEGP, currency)}
                            </span>
                            {sub.autoRenew && sub.autoRenewDate && (
                              <span className="text-[10px] text-purple-300 block">
                                مجدول في: {sub.autoRenewDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Credentials viewer & quick extension actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                          {/* Credentials summary */}
                          <div className="flex items-center gap-2">
                            {sub.credentials?.email && (
                              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono text-[11px] border border-slate-800">
                                <span>{sub.credentials.email}</span>
                                <button
                                  onClick={() => handleCopy(sub.credentials!.email!, `sub-mail-${sub.id}`)}
                                  className="text-slate-400 hover:text-white"
                                  title="نسخ الإيميل"
                                >
                                  {copiedId === `sub-mail-${sub.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            )}
                            {sub.credentials?.password && (
                              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono text-[11px] border border-slate-800">
                                <span>••••••</span>
                                <button
                                  onClick={() => handleCopy(sub.credentials!.password!, `sub-pass-${sub.id}`)}
                                  className="text-slate-400 hover:text-white"
                                  title="نسخ كلمة السر"
                                >
                                  {copiedId === `sub-pass-${sub.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Key className="w-3 h-3" />}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Quick Admin Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onExtendSubscription(sub.id, 30)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                            >
                              + تمديد 30 يوم
                            </button>

                            <button
                              onClick={() => onExtendSubscription(sub.id, 365)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-colors border border-amber-500/30"
                            >
                              + تمديد سنة كاملة
                            </button>

                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>تذكير تجديد واتساب</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: Edit Product and its Pricing/Plans (تعديل المنتج والأسعار) */}
        {/* ========================================================================= */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <ProductBrandIcon slug={editingProduct.slug} brand={editingProduct.brand} size="md" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      تعديل اشتراك: {editingProduct.nameAr}
                    </h4>
                    <p className="text-xs text-slate-400">
                      قم بتعديل الأسعار، مدد الباقات، أو تفاصيل المنتج وسيتم تحديثها فوراً في المتجر
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProductChanges} className="flex-1 overflow-y-auto p-5 space-y-5">
                
                {/* Basic Details */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    1. المعلومات الأساسية للأداة
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الاسم بالعربية:</label>
                      <input
                        type="text"
                        value={editingProduct.nameAr}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الاسم بالإنجليزية:</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الشركة / الماركة:</label>
                      <input
                        type="text"
                        value={editingProduct.brand}
                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الشارة الترويجية (Badge):</label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        placeholder="مثال: الأكثر مبيعاً 🔥 أو عرض خاص ⭐"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">الوصف المختصر:</label>
                    <textarea
                      value={editingProduct.shortDescAr}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescAr: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>

                {/* Pricing & Plans Manager (EDITING PRICES) */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        2. باقات وأسعار الاشتراك (Plans & Prices)
                      </h5>
                      <span className="text-[11px] text-slate-400">
                        يمكنك تغيير السعر، تعديل مدة الباقة، أو إضافة خيارات جديدة
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddPlanToEditingProduct}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة باقة جديدة</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingProduct.plans.map((plan, index) => (
                      <div
                        key={plan.id}
                        className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-400">
                            باقة #{index + 1}
                          </span>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={plan.isPopular || false}
                                onChange={(e) => handleUpdatePlanField(plan.id, 'isPopular', e.target.checked)}
                                className="rounded text-amber-500 focus:ring-0"
                              />
                              <span>عرض كـ (الأكثر طلباً)</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemovePlanFromEditingProduct(plan.id)}
                              className="text-slate-400 hover:text-rose-400 p-1"
                              title="حذف الباقة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          {/* Duration label */}
                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">اسم ومدة الباقة:</label>
                            <input
                              type="text"
                              value={plan.durationLabel}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'durationLabel', e.target.value)}
                              placeholder="مثال: 18 شهر (عرض مميز)"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                              required
                            />
                          </div>

                          {/* Price in EGP */}
                          <div>
                            <label className="block text-emerald-400 text-[11px] font-bold mb-1">
                              السعر الحالي للبيع (ج.م):
                            </label>
                            <input
                              type="number"
                              value={plan.priceEGP}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'priceEGP', Number(e.target.value))}
                              className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold"
                              required
                              min={1}
                            />
                          </div>

                          {/* Original crossed-out price */}
                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">السعر الأصلي المشطوب (ج.م):</label>
                            <input
                              type="number"
                              value={plan.originalPriceEGP}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'originalPriceEGP', Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                              min={1}
                            />
                          </div>
                        </div>

                        {/* Delivery type label */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">نوع التسليم:</label>
                            <select
                              value={plan.deliveryType}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'deliveryType', e.target.value as DeliveryType)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                            >
                              <option value="invite">دعوة رسمية على الإيميل (invite)</option>
                              <option value="private_account">حساب خاص كامل (private_account)</option>
                              <option value="shared_account">حساب مشترك اقتصادي (shared_account)</option>
                              <option value="license_key">كود ترخيص (license_key)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">توضيح التسليم للعميل:</label>
                            <input
                              type="text"
                              value={plan.deliveryTypeLabel}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'deliveryTypeLabel', e.target.value)}
                              placeholder="تفعيل رسمي على إيميلك الخاص"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Save Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {saveSuccessNotice && (
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 animate-pulse">
                        <Check className="w-4 h-4" />
                        تم حفظ التعديلات بنجاح!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      إلغاء
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ الأسعار والتعديلات فوراً</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: Add New Product Modal */}
        {/* ========================================================================= */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base">إضافة أداة ذكاء اصطناعي جديدة</h4>
                <button onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">اسم الأداة بالعربية:</label>
                  <input
                    type="text"
                    value={newProdNameAr}
                    onChange={(e) => setNewProdNameAr(e.target.value)}
                    placeholder="مثال: اشتراك DeepSeek Pro"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">الاسم بالإنجليزي:</label>
                  <input
                    type="text"
                    value={newProdNameEn}
                    onChange={(e) => setNewProdNameEn(e.target.value)}
                    placeholder="DeepSeek Pro Subscription"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">القسم:</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                    >
                      <option value="ai-chat">شات ونصوص</option>
                      <option value="coding">برمجة</option>
                      <option value="design">تصميم</option>
                      <option value="video-audio">فيديو وصوت</option>
                      <option value="research-study">أبحاث</option>
                      <option value="bundles">باقات توفير</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">الشركة:</label>
                    <input
                      type="text"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      placeholder="OpenAI / Google..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">السعر للبيع (ج.م):</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">المدة:</label>
                    <input
                      type="text"
                      value={newProdDuration}
                      onChange={(e) => setNewProdDuration(e.target.value)}
                      placeholder="سنة كاملة"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                  >
                    حفظ ونشر في المتجر
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
