"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart, useAuth } from "@/hooks/use-store";
import { ordersApi } from "@/lib/api";
import { Button, Card, Input } from "@/components/ui";
import {
  ShoppingBag, MapPin, CreditCard, CheckCircle,
  ArrowLeft, Loader2, ShieldCheck, Truck, Clock, 
  User, Phone, Mail, FileText, Package, Hash
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phoneNumber: "",
    email: user?.email || "",
    streetAddress: "",
    city: "",
    zipCode: "",
    notes: ""
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Redirect if cart is empty and not in success state
  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      const timer = setTimeout(() => {
        router.push("/meals");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [items, isSuccess, router]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + deliveryFee;

  const handleOrderSuccess = async () => {
    try {
      setIsSubmitting(true);
      const addressString = `
        Name: ${formData.fullName}
        Phone: ${formData.phoneNumber}
        Email: ${formData.email}
        Address: ${formData.streetAddress}, ${formData.city}, ${formData.zipCode}
        Notes: ${formData.notes}
      `.trim();

      const orderData = {
        items: items.map(item => ({ mealId: item.mealId, quantity: item.quantity })),
        address: addressString,
        paymentMethod
      };

      await ordersApi.create(orderData);

      setIsSuccess(true);
      clearCart();
      toast.success("Order placed successfully!", {
        duration: 5000,
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user) {
      toast.error("Please login to complete your order.");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.streetAddress.trim() || !formData.city.trim()) {
      toast.error("Please fill in all required delivery fields.");
      return;
    }

    if (paymentMethod !== "cod") {
      toast.error("Only Cash on Delivery is currently supported.");
      return;
    }

    await handleOrderSuccess();
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-6 animate-in fade-in zoom-in duration-700">
        <Card className="max-w-xl w-full p-10 md:p-12 bg-[#020617] border-white/5 rounded-[48px] shadow-2xl relative overflow-hidden group">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-green-500 blur-2xl opacity-50" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[80px]" />
          
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.3)]">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-display)] text-green-500 uppercase tracking-tight">Order Placed Successfully!</h1>
              <div className="text-4xl animate-bounce pt-2">🎉</div>
              <p className="text-slate-400 font-medium">Thank you for your order!</p>
            </div>

            {/* What's Next Box */}
            <div className="w-full bg-white/[0.02] border border-white/5 rounded-[32px] p-8 text-left space-y-6">
              <div className="flex items-center gap-3 text-white">
                <Package className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-black uppercase tracking-widest">What's Next?</h3>
              </div>
              
              <ul className="space-y-4">
                {[
                  "Your order has been received and is being prepared by the provider",
                  "You can track your order status in real-time from your dashboard",
                  "The provider will accept and start preparing your meal shortly",
                  "You'll receive updates as your order moves through each stage"
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 items-start animate-in slide-in-from-left duration-500" style={{ delay: `${i * 100}ms` }}>
                    <div className="mt-1 shrink-0 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              <Link href="/orders" className="w-full">
                <Button className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/20">
                  <Package className="w-4 h-4" /> Track My Order
                </Button>
              </Link>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 text-slate-300 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white/5">
                  <ArrowLeft className="w-4 h-4" /> Back to Home
                </Button>
              </Link>
            </div>

            <div className="pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                Need help? <Link href="/support" className="text-orange-500 hover:text-orange-400 transition-colors">Contact Support</Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <ShoppingBag className="w-16 h-16 text-slate-800" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Your Bag is Empty</h2>
        <p className="text-slate-500 max-w-xs">It seems you haven't added any delicacies to your bag yet.</p>
        <Link href="/meals">
          <Button className="h-12 px-8 rounded-xl bg-orange-600 text-[10px] font-black uppercase tracking-widest">Start Exploring</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-white transition-colors gap-2 mb-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Go Back</span>
          </button>
          <h1 className="text-4xl md:text-6xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tighter">Finalize Order</h1>
        </div>
        <div className="hidden md:flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Encryption Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Form */}
        <div className="lg:col-span-7 space-y-10">
          <div className="space-y-10">
            {/* Delivery Information */}
            <section className="space-y-8 animate-in slide-in-from-left duration-700 delay-100 bg-white/[0.01] border border-white/5 p-8 md:p-10 rounded-[44px]">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-widest font-[family-name:var(--font-display)]">Delivery Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                    Full Name <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                    <Input 
                      placeholder="Zelda Lawson"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="pl-12 h-14 bg-[#020617] border-white/5 rounded-2xl text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                    Phone Number <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                    <Input 
                      placeholder="+1 234 567 8900"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className="pl-12 h-14 bg-[#020617] border-white/5 rounded-2xl text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/field md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                    <Input 
                      placeholder="xobozaqu@mailinator.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-12 h-14 bg-[#020617] border-white/5 rounded-2xl text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/field md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                    Street Address <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                    <Input 
                      placeholder="123 Main Street, Apartment 4B"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({...formData, streetAddress: e.target.value})}
                      className="pl-12 h-14 bg-[#020617] border-white/5 rounded-2xl text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1 flex items-center gap-2">
                    City <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                    <Input 
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="pl-12 h-14 bg-[#020617] border-white/5 rounded-2xl text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/field">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">ZIP Code</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-4 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                    <Input 
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      className="pl-12 h-14 bg-[#020617] border-white/5 rounded-2xl text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2 group/field md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Delivery Notes (Optional)</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                    <textarea 
                      placeholder="Add any special instructions for delivery..."
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full h-24 pl-12 pt-4 bg-[#020617] border-white/5 border rounded-2xl text-white font-medium placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="space-y-6 animate-in slide-in-from-left duration-700 delay-200">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between group ${paymentMethod === "cod" ? "border-orange-500 bg-orange-500/5" : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${paymentMethod === "cod" ? "bg-orange-500 text-white" : "bg-white/5 text-slate-500"
                      }`}>
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className={`text-xs font-black uppercase tracking-widest ${paymentMethod === "cod" ? "text-white" : "text-slate-400"}`}>Cash on Delivery</p>
                      <p className="text-[10px] text-slate-600 font-medium">Verify upon receipt</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-orange-500" : "border-white/10"
                    }`}>
                    {paymentMethod === "cod" && <div className="w-3 h-3 rounded-full bg-orange-500" />}
                  </div>
                </div>

                <div
                  className="p-6 rounded-[32px] border-2 border-white/5 bg-white/[0.01] flex items-center justify-between group cursor-not-allowed opacity-60 grayscale"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 text-slate-500">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Credit Card</p>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-[8px] font-black uppercase">Not Supported</span>
                      </div>
                      <p className="text-[10px] text-slate-700 font-medium whitespace-nowrap">Payment Gateway Under Maintenance</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white/5 flex items-center justify-center opacity-30">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6 animate-in slide-in-from-bottom duration-700 delay-300">
              <Button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="w-full h-16 rounded-[28px] bg-orange-600 hover:bg-orange-500 text-white text-base font-black uppercase tracking-[0.2em] shadow-[0_20px_50px_-10px_rgba(234,88,12,0.6)] group relative overflow-hidden"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-4">
                    Confirm Order <ArrowLeft className="w-5 h-5 rotate-180" />
                  </span>
                )}
              </Button>
              <p className="text-[9px] text-center text-slate-600 uppercase font-bold tracking-widest mt-4">By placing your order, you agree to our terms of elite service.</p>
            </div>
          </div>
        </div>

        {/* Right: Summary Panel */}
        <div className="lg:col-span-5 relative">
          <Card className="p-8 md:p-10 bg-[#020617] border-white/5 rounded-[48px] sticky top-32 space-y-8 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 blur-[80px]" />

            <h3 className="text-2xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight">Order Receipt</h3>

            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center group/item">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/5 shrink-0">
                      <img src={item.image} className="w-full h-full object-cover grayscale opacity-60 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{item.quantity} units x ${item.price}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-orange-500 font-[family-name:var(--font-display)]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                <span className="font-bold font-[family-name:var(--font-display)]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest">Elite Delivery Fee</span>
                <span className="font-bold font-[family-name:var(--font-display)]">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10 text-white">
                <span className="text-lg font-black uppercase tracking-widest">Total Valuation</span>
                <span className="text-3xl font-black font-[family-name:var(--font-display)] text-orange-500 tracking-tighter">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 text-center space-y-2">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Guaranteed Freshness</h4>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed">Your order will be prepared under strict quality guidelines and delivered in temperature-controlled sustainable packaging.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
