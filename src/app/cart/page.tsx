"use client";

import { useCart } from "@/hooks/use-store";
import { Button, Card } from "@/components/ui";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCart();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = items.length > 0 ? 5.00 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center gap-4 py-8">
        <Link href="/meals">
          <Button variant="outline" className="p-3 rounded-xl border-white/5 bg-white/5 hover:bg-orange-600 hover:text-white transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-black font-[family-name:var(--font-display)] text-white tracking-tight">Your Gourmet Basket</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1 opacity-70">Review and proceed with your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pb-24">
        <div className="lg:col-span-2 space-y-8">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.mealId} className="p-6 bg-[#020617] border-white/5 hover:border-white/10 transition-all flex flex-col sm:flex-row items-center gap-6 group overflow-hidden rounded-[40px]">
                  <div className="w-full sm:w-40 aspect-square rounded-3xl overflow-hidden relative shadow-2xl">
                    <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-white mb-2 uppercase tracking-wide group-hover:text-orange-500 transition-colors">{item.name}</h3>
                    <p className="text-xl font-black text-orange-500 mb-4">{formatPrice(item.price)}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
                        <button 
                          onClick={() => updateQuantity(item.mealId, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-orange-600 hover:text-white transition-all text-slate-300 active:scale-90"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-black text-white text-lg">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.mealId, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-orange-600 hover:text-white transition-all text-slate-300 active:scale-90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.mealId)}
                        className="p-3.5 rounded-2xl bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all active:scale-90"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block text-right pr-6">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Item Price</p>
                    <p className="text-2xl font-black text-white font-[family-name:var(--font-display)] tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 bg-white/[0.01] border border-dashed border-white/10 rounded-[60px]">
              <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-slate-800">
                <ShoppingBag className="w-16 h-16" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white mb-2 font-[family-name:var(--font-display)]">Your basket is empty</h2>
                <p className="text-slate-500 font-medium max-w-[300px]">Looks like you haven't added any gourmet dishes to your order yet.</p>
              </div>
              <Link href="/meals">
                <Button size="lg" className="rounded-2xl px-12 h-16 text-lg font-bold shadow-[0_15px_30px_-5px_rgba(234,88,12,0.4)]">Go Find Delicious Meals</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-slate-950/40 border-white/5 rounded-[40px] relative overflow-hidden backdrop-blur-3xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[60px] rounded-full pointer-events-none" />
            <h2 className="text-2xl font-black uppercase font-[family-name:var(--font-display)] text-white tracking-widest mb-8 border-b border-white/10 pb-6">Order Summary</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center group font-medium px-1">
                <span className="text-slate-500 uppercase text-xs tracking-widest">Selected Items</span>
                <span className="text-slate-200">{items.length} dishes</span>
              </div>
              
              <div className="flex justify-between items-center group font-medium px-1">
                <span className="text-slate-500 uppercase text-xs tracking-widest">Subtotal</span>
                <span className="text-white text-lg font-bold font-[family-name:var(--font-display)]">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between items-center group font-medium px-1">
                <span className="text-slate-500 uppercase text-xs tracking-widest">Delivery Fee</span>
                <span className="text-green-500 text-lg font-bold font-[family-name:var(--font-display)]">{items.length > 0 ? formatPrice(deliveryFee) : '$0.00'}</span>
              </div>
              
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 mt-8 space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-4 mb-4">
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Grand Total</span>
                    <span className="text-3xl font-black text-orange-500 font-[family-name:var(--font-display)] tracking-tighter leading-none">{formatPrice(total)}</span>
                </div>
                <div className="text-[10px] uppercase font-black tracking-widest text-slate-500 text-center flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> Guaranteed Premium Quality
                </div>
              </div>

              <Link href="/checkout" className="block w-full pt-4">
                <Button 
                  disabled={items.length === 0}
                  className="w-full h-16 rounded-2xl text-lg font-black uppercase flex items-center justify-center gap-3 shadow-[0_15px_40px_-10px_rgba(234,88,12,0.6)] group overflow-hidden active:scale-95 transition-all"
                >
                  Checkout Now <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
