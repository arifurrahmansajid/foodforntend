"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart, useAuth } from "@/hooks/use-store";
import { ordersApi } from "@/lib/api";
import { Button, Input, Card } from "@/components/ui";
import { 
  ShoppingBag, MapPin, CreditCard, CheckCircle, 
  ArrowLeft, Loader2, ShieldCheck, Truck, Clock
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  
  const [address, setAddress] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to complete your order.");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!address.trim()) {
      toast.error("Please provide a delivery address.");
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        items: items.map(item => ({ mealId: item.mealId, quantity: item.quantity })),
        address
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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in zoom-in duration-500 text-center px-6">
        <div className="w-24 h-24 rounded-full bg-orange-500/20 flex items-center justify-center shadow-2xl shadow-orange-900/20">
          <CheckCircle className="w-12 h-12 text-orange-500 animate-bounce" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tighter">Order Confirmed!</h1>
          <p className="text-slate-400 max-w-md mx-auto font-medium">Your culinary journey has begun. Our chefs are preparing your masterpiece right now.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/orders">
            <Button className="h-14 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-slate-200">Track Order</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/10 text-white font-black uppercase tracking-widest">Back Home</Button>
          </Link>
        </div>
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
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Delivery Details */}
            <section className="space-y-6 animate-in slide-in-from-left duration-700 delay-100">
              <div className="flex items-center gap-4 text-white">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest">Delivery Destination</h2>
              </div>
              <div className="space-y-4">
                <textarea 
                  required
                  placeholder="Street Address, Apartment, City, Postal Code"
                  className="w-full h-32 rounded-3xl bg-white/[0.02] border border-white/5 p-6 text-white font-medium placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none shadow-inner"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-500">
                    <Truck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Courier</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Scheduled ASAP</span>
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
                <div className="p-6 rounded-[32px] border-2 border-orange-500 bg-orange-500/5 flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-widest">Cash on Delivery</p>
                      <p className="text-[10px] text-orange-200/60 font-medium">Verify upon receipt</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-orange-500 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                  </div>
                </div>
                
                <div className="p-6 rounded-[32px] border border-white/5 bg-white/[0.02] flex items-center justify-between opacity-50 cursor-not-allowed">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Credit Card</p>
                      <p className="text-[10px] text-slate-600 font-medium italic">Available soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6 animate-in slide-in-from-bottom duration-700 delay-300">
               <Button 
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
          </form>
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
