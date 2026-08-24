import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Check, 
  Tag, 
  ChevronRight, 
  Wallet, 
  AlertCircle,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import RatingStars from '../components/common/RatingStars';
import { useToast } from '../components/common/Toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'wallet'
  const [couponCode, setCouponCode] = useState('WELCOME10');
  const [appliedCoupon, setAppliedCoupon] = useState({ code: 'WELCOME10', discount: 10.00 });
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const originalPrice = 99.99;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0.00;
  const totalPrice = Math.max(0, originalPrice - discountAmount);

  const [formData, setFormData] = useState({
    cardName: 'Alex Chen',
    cardNumber: '4242 8849 2014 4242',
    expDate: '12/28',
    cvv: '884',
    saveCard: true,
    country: 'United States',
    zipCode: '94107'
  });

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 10.00 });
      setCouponError('');
      addToast('Coupon WELCOME10 applied: $10.00 off!', 'success');
    } else if (cleanCode === 'NEXUS20') {
      setAppliedCoupon({ code: 'NEXUS20', discount: 20.00 });
      setCouponError('');
      addToast('Special Coupon NEXUS20 applied: $20.00 off!', 'success');
    } else if (cleanCode === 'DEV100') {
      setAppliedCoupon({ code: 'DEV100', discount: 99.99 });
      setCouponError('');
      addToast('VIP Access Coupon Applied: Free Enrollment!', 'success');
    } else {
      setAppliedCoupon(null);
      setCouponError('Invalid promo code. Try "WELCOME10" or "NEXUS20"');
      addToast('Invalid promo code entered', 'error');
    }
  };

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    addToast('Processing payment through 256-bit secure gateway...', 'info');

    setTimeout(() => {
      navigate('/payment-success', {
        state: {
          courseTitle: "Advanced Enterprise Architecture & Payment Systems",
          amount: `$${totalPrice.toFixed(2)}`,
          transactionId: `#NX-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }
      });
    }, 1200);
  };

  return (
    <PageLayout>
      <div className="max-w-max-width mx-auto px-margin-desktop py-8">
        
        {/* Breadcrumb Nav */}
        <nav className="flex items-center gap-2 text-xs text-outline mb-6 font-medium">
          <Link to="/explore" className="hover:text-primary transition-colors">Browse Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/course-details" className="hover:text-primary transition-colors">Course Details</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-primary font-semibold">Secure Checkout</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-headline-lg font-bold text-on-surface tracking-tight">
              Review & Place Order
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Encrypted with TLS 1.3. Your payment details are tokenized and never stored in plain text.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Order Summary & Interactive Card Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Realistic Interactive Bank Card Widget */}
            {paymentMethod === 'card' && (
              <div className="w-full aspect-[1.586/1] rounded-3xl p-6 bg-gradient-to-tr from-slate-900 via-primary to-[#0056D2] text-white shadow-elevation-3 relative overflow-hidden flex flex-col justify-between select-none">
                <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-extrabold text-sm">
                      N
                    </div>
                    <span className="font-bold text-xs tracking-wider uppercase text-white/90">NexusPay Visa</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/15 text-[10px] font-mono tracking-widest backdrop-blur-md">
                    DEBIT / GOLD
                  </span>
                </div>

                <div className="relative z-10 my-2">
                  <div className="text-[10px] uppercase text-white/60 tracking-widest font-semibold mb-1">Card Number</div>
                  <div className="font-mono text-lg tracking-widest font-bold drop-shadow">
                    {formData.cardNumber || '•••• •••• •••• ••••'}
                  </div>
                </div>

                <div className="flex justify-between items-end relative z-10 pt-2 border-t border-white/15">
                  <div>
                    <span className="text-[9px] uppercase text-white/60 block font-semibold">Cardholder Name</span>
                    <span className="text-xs font-bold tracking-wide uppercase">{formData.cardName || 'YOUR NAME'}</span>
                  </div>

                  <div>
                    <span className="text-[9px] uppercase text-white/60 block font-semibold text-right">Expires</span>
                    <span className="text-xs font-mono font-bold">{formData.expDate || 'MM/YY'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary Box */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-elevation-1 space-y-6">
              <h2 className="text-base font-bold text-on-surface pb-3 border-b border-outline-variant">
                Order Summary (1 Item)
              </h2>

              {/* Course Item */}
              <div className="flex gap-4">
                <div className="w-24 h-20 rounded-2xl overflow-hidden bg-surface-container flex-shrink-0 shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&auto=format&fit=crop&q=80"
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    Stanford Online / NexusTech
                  </span>
                  <h3 className="text-xs font-bold text-on-surface line-clamp-2 mt-0.5 leading-snug">
                    Advanced Machine Learning Algorithms Masterclass
                  </h3>
                  <p className="text-[11px] text-outline mt-0.5">Dr. Eleanor Rigby</p>
                  <div className="mt-1">
                    <RatingStars rating={4.9} reviewsCount={1245} size="sm" />
                  </div>
                </div>
              </div>

              {/* Coupon input */}
              <div className="pt-4 border-t border-outline-variant/60">
                <label className="text-xs font-bold text-on-surface block mb-2">
                  Have a Promo / Referral Code?
                </label>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. WELCOME10, NEXUS20"
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase font-semibold bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-xs font-bold text-on-surface rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <p className="text-xs text-secondary font-semibold flex items-center gap-1 mt-2">
                    <Check className="w-3.5 h-3.5" /> Coupon <strong>{appliedCoupon.code}</strong> applied (-${appliedCoupon.discount.toFixed(2)})
                  </p>
                )}
                {couponError && (
                  <p className="text-xs text-error font-medium flex items-center gap-1 mt-2">
                    <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-outline-variant/60 space-y-2.5 text-xs text-on-surface">
                <div className="flex justify-between">
                  <span className="text-outline">Standard Course Price</span>
                  <span className="font-medium">${originalPrice.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-secondary font-bold">
                    <span>Discount Applied ({appliedCoupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-outline">Taxes & Gateway Surcharge</span>
                  <span className="font-semibold text-emerald-700">$0.00 (Waived)</span>
                </div>
                <div className="pt-3 border-t border-outline-variant flex justify-between items-baseline text-base font-bold text-on-surface">
                  <span>Total Amount Due</span>
                  <span className="text-2xl text-primary font-black">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Money Back Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-on-secondary-fixed-variant leading-relaxed">
                  <strong className="font-bold">30-Day 100% Satisfaction Guarantee.</strong> Try the full course risk-free. Instant refund guarantee if it doesn't meet your expectations.
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Payment Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 md:p-8 shadow-elevation-1">
              
              <h2 className="text-base font-bold text-on-surface mb-6">
                Choose Payment Method
              </h2>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/40'
                      : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/40'
                      : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <span className="font-bold italic text-base">P</span>
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                    paymentMethod === 'wallet'
                      ? 'border-primary bg-primary/5 text-primary shadow-sm ring-2 ring-primary/40'
                      : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-secondary" />
                  <span>NexusPay Balance</span>
                </button>
              </div>

              {/* Card Form */}
              <form onSubmit={handleCompleteOrder} className="space-y-4">
                
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    className="w-full px-4 py-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary font-medium text-on-surface"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary font-mono text-on-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.expDate}
                      onChange={(e) => setFormData({ ...formData, expDate: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary font-mono text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">
                      Security Code (CVV)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      placeholder="123"
                      className="w-full px-4 py-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary font-mono text-on-surface"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">
                      Billing Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Germany</option>
                      <option>India</option>
                      <option>Singapore</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-surface-container-low border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-on-surface font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={formData.saveCard}
                    onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="saveCard" className="text-xs text-on-surface cursor-pointer select-none font-medium">
                    Save this card securely in vault for future 1-click enrollments
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-elevation-2 flex items-center justify-center gap-2 transition-all disabled:opacity-75 hover:scale-[1.01]"
                  >
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-2.5">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Authorizing Transaction...</span>
                      </span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Authorize & Pay ${totalPrice.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-[11px] text-outline pt-2 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-secondary" />
                  <span>Verified by Visa & Mastercard Identity Check. PCI-DSS Level 1.</span>
                </p>

              </form>

            </div>

          </div>

        </div>

      </div>
    </PageLayout>
  );
}
