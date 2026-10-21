export type ProductCategory = 
  | 'all'
  | 'ai-chat'
  | 'coding'
  | 'design'
  | 'video-audio'
  | 'research-study'
  | 'bundles';

export type DeliveryType = 
  | 'invite'            // دعوة رسمية على إيميلك الشخصي
  | 'private_account'   // حساب خاص بك بالكامل
  | 'shared_account'    // حساب مشترك اقتصادي
  | 'license_key';      // كود ترخيص أو تفعيل فوري

export interface PlanVariant {
  id: string;
  durationLabel: string; // e.g. "شهر واحد", "3 أشهر", "سنة كاملة", "3 سنوات"
  durationMonths: number;
  priceEGP: number;
  originalPriceEGP: number;
  deliveryType: DeliveryType;
  deliveryTypeLabel: string;
  isPopular?: boolean;
  notes?: string;
}

export interface SubscriptionProduct {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  badge?: string;
  isFeatured?: boolean;
  shortDescAr: string;
  fullDescAr: string;
  iconName: string; // lucide icon identifier or visual styling
  colorScheme: {
    accent: string;
    bgGlow: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
  rating: number;
  reviewsCount: number;
  salesCount: number;
  deliveryTime: string;
  plans: PlanVariant[];
  featuresAr: string[];
  activationStepsAr: string[];
  requirementsAr: string;
  faqs: { question: string; answer: string }[];
}

export type CurrencyCode = 'EGP' | 'SAR' | 'USD' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  nameAr: string;
  symbol: string;
  rateToEGP: number; // 1 unit of this currency = how many EGP (e.g. USD = 50.5 EGP, SAR = 13.5 EGP, AED = 13.7 EGP)
}

export interface CartItem {
  id: string; // generated unique cart id
  productId: string;
  product: SubscriptionProduct;
  selectedPlan: PlanVariant;
  quantity: number;
  userEmail?: string;
  userPhone?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'pending_payment'
  | 'verifying_payment'
  | 'activating'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string; // e.g. KS-9281
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    planLabel: string;
    deliveryType: DeliveryType;
    priceEGP: number;
    pricePaid: number;
    currency: CurrencyCode;
    quantity: number;
  }[];
  totalEGP: number;
  totalPaid: number;
  currency: CurrencyCode;
  paymentMethod: 'instapay' | 'vodafone_cash' | 'card' | 'mada' | 'usdt';
  paymentReference?: string;
  status: OrderStatus;
  activationCode?: string;
  activationNotes?: string;
}

export interface Review {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  date: string;
  productName: string;
  comment: string;
  verified: boolean;
}
