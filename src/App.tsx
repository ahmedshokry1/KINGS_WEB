import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Crown, 
  Code, 
  Palette, 
  Bot, 
  Video, 
  BookOpen, 
  Layers, 
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { TrustFeaturesSection } from './components/TrustFeaturesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { RecentSalesToast } from './components/RecentSalesToast';

import { 
  SubscriptionProduct, 
  PlanVariant, 
  CartItem, 
  CurrencyCode, 
  Order, 
  ProductCategory 
} from './types/store';
import { INITIAL_PRODUCTS, MOCK_REVIEWS, INITIAL_ORDERS } from './data/mockProducts';

export default function App() {
  // Store data state
  const [products, setProducts] = useState<SubscriptionProduct[]>(() => {
    const saved = localStorage.getItem('kings_store_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kings_store_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>('EGP');

  // Admin security auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('kings_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to local storage whenever products or orders change
  useEffect(() => {
    localStorage.setItem('kings_store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kings_store_orders', JSON.stringify(orders));
  }, [orders]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountFixedEGP: number;
  } | null>(null);

  // Modals state
  const [detailProduct, setDetailProduct] = useState<SubscriptionProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [trackingInitialNumber, setTrackingInitialNumber] = useState('');

  // Cart operations
  const handleAddToCart = (product: SubscriptionProduct, plan: PlanVariant) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.selectedPlan.id === plan.id
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        product,
        selectedPlan: plan,
        quantity: 1,
      };
      return [...prev, newItem];
    });
  };

  const handleBuyNow = (product: SubscriptionProduct, plan: PlanVariant) => {
    handleAddToCart(product, plan);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Coupons
  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'KINGS2025' || clean === 'KINGS15') {
      setAppliedCoupon({ code: clean, discountPercent: 15, discountFixedEGP: 0 });
      return true;
    }
    if (clean === 'AI50') {
      setAppliedCoupon({ code: clean, discountPercent: 0, discountFixedEGP: 50 });
      return true;
    }
    if (clean === 'WELCOME' || clean === 'WELCOME10') {
      setAppliedCoupon({ code: clean, discountPercent: 10, discountFixedEGP: 0 });
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Cart calculations
  const cartSubtotalEGP = cart.reduce(
    (sum, item) => sum + item.selectedPlan.priceEGP * item.quantity,
    0
  );

  let cartDiscountEGP = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      cartDiscountEGP = (cartSubtotalEGP * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixedEGP > 0) {
      cartDiscountEGP = Math.min(cartSubtotalEGP, appliedCoupon.discountFixedEGP);
    }
  }

  const cartTotalEGP = Math.max(0, cartSubtotalEGP - cartDiscountEGP);

  // Order placed handler
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setCompletedOrder(newOrder);
  };

  // Admin order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status'], notes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, activationNotes: notes || o.activationNotes }
          : o
      )
    );
  };

  // Admin product operations (CREATE, UPDATE, DELETE)
  const handleAddNewProduct = (newProduct: SubscriptionProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: SubscriptionProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    // Also update any item in the cart if it matches this product
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === updatedProduct.id) {
          const updatedPlan = updatedProduct.plans.find((pl) => pl.id === item.selectedPlan.id) || updatedProduct.plans[0];
          return {
            ...item,
            product: updatedProduct,
            selectedPlan: updatedPlan,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Admin Security Handlers
  const handleOpenAdminTrigger = () => {
    if (isAdminLoggedIn) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminOpen(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('kings_admin_auth');
    setIsAdminLoggedIn(false);
  };

  // Categories list
  const categories: { id: ProductCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'الكل', icon: Layers },
    { id: 'ai-chat', label: 'شات وتوليد نصوص', icon: Bot },
    { id: 'design', label: 'تصميم وجرافيك', icon: Palette },
    { id: 'coding', label: 'برمجة وحوسبة', icon: Code },
    { id: 'video-audio', label: 'فيديو وصوتيات', icon: Video },
    { id: 'research-study', label: 'أبحاث ودراسة', icon: BookOpen },
    { id: 'bundles', label: 'باقات التوفير الكبرى 🔥', icon: Crown },
  ];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Delivery type filter
        if (selectedDeliveryFilter === 'invite') {
          const hasInvite = p.plans.some((pl) => pl.deliveryType === 'invite');
          if (!hasInvite) return false;
        } else if (selectedDeliveryFilter === 'private') {
          const hasPrivate = p.plans.some((pl) => pl.deliveryType === 'private_account');
          if (!hasPrivate) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q) || p.nameAr.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.shortDescAr.toLowerCase().includes(q) || p.fullDescAr.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aMinPrice = Math.min(...a.plans.map((pl) => pl.priceEGP));
        const bMinPrice = Math.min(...b.plans.map((pl) => pl.priceEGP));

        if (sortBy === 'price-asc') return aMinPrice - bMinPrice;
        if (sortBy === 'price-desc') return bMinPrice - aMinPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.salesCount - a.salesCount;
      });
  }, [products, selectedCategory, selectedDeliveryFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      
      {/* Navigation */}
      <Navbar
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        cartTotalEGP={cartTotalEGP}
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onOpenTracking={() => {
          setTrackingInitialNumber('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={handleOpenAdminTrigger}
        isAdminLoggedIn={isAdminLoggedIn}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* Hero Section */}
      <HeroBanner
        onSelectCategory={setSelectedCategory}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        currency={currency}
      />

      {/* Main Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10" id="catalog-section">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filters and Sorters Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 mb-8">
          
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>تصفية سريعة:</span>
            </span>

            <button
              onClick={() => setSelectedDeliveryFilter('all')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedDeliveryFilter === 'all'
                  ? 'bg-amber-500/20 border-amber-500/80 text-amber-300 font-bold'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              الكل ({products.length})
            </button>

            <button
              onClick={() => setSelectedDeliveryFilter('invite')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedDeliveryFilter === 'invite'
                  ? 'bg-cyan-500/20 border-cyan-500/80 text-cyan-300 font-bold'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              تفعيل على إيميلك الخاص ✉️
            </button>

            <button
              onClick={() => setSelectedDeliveryFilter('private')}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                selectedDeliveryFilter === 'private'
                  ? 'bg-purple-500/20 border-purple-500/80 text-purple-300 font-bold'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              حساب خاص بك بالكامل 🔑
            </button>
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">ترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="popular">الأكثر مبيعاً وطلباً</option>
              <option value="price-asc">الأقل سعراً أولاً</option>
              <option value="price-desc">الأعلى سعراً أولاً</option>
              <option value="rating">الأعلى تقييماً ⭐</option>
            </select>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
            <Search className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">لم نجد اشتراكات تطابق بحثك</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً من شريط الأقسام في الأعلى.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDeliveryFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              عرض كافة الاشتراكات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onViewDetails={setDetailProduct}
              />
            ))}
          </div>
        )}

      </main>

      {/* Trust & Guarantee Section */}
      <TrustFeaturesSection />

      {/* Customer Reviews Section */}
      <TestimonialsSection reviews={MOCK_REVIEWS} />

      {/* FAQ Section */}
      <FaqSection />

      {/* Footer */}
      <Footer
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onSelectCategory={setSelectedCategory}
      />

      {/* Floating Elements */}
      <FloatingWhatsApp />
      <RecentSalesToast />

      {/* MODALS */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        currency={currency}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        totalEGP={cartTotalEGP}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={completedOrder}
        currency={currency}
        onClose={() => setCompletedOrder(null)}
        onViewTracking={(orderNumber) => {
          setTrackingInitialNumber(orderNumber);
          setIsTrackingOpen(true);
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialOrderNumber={trackingInitialNumber}
        currency={currency}
      />

      {/* AI Subscription Advisor Quiz Modal */}
      <AiAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        products={products}
        currency={currency}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Protected Admin Access Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        products={products}
        currency={currency}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddProduct={handleAddNewProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onLogout={handleAdminLogout}
      />

    </div>
  );
}
