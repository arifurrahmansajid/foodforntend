"use client";

import { useEffect, useState } from "react";
import { ordersApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-store";
import { Button, Card } from "@/components/ui";
import { 
  Package, Clock, CheckCircle, Truck, 
  ArrowRight, ShoppingBag, Loader2, XCircle
} from "lucide-react";
import Link from "next/link";
import { Order } from "@/types";
import toast from "react-hot-toast";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await ordersApi.getUserOrders();
        setOrders(response.data.data.orders || []);
      } catch (error) {
        console.error("Fetch orders failed:", error);
        toast.error("Could not retrieve your orders.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchOrders();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Your Culinary History...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <XCircle className="w-16 h-16 text-slate-800" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Access Restricted</h2>
        <p className="text-slate-500 max-w-xs">Please login to view your personal order history.</p>
        <Link href="/login">
          <Button className="h-12 px-8 rounded-xl bg-orange-600 text-[10px] font-black uppercase tracking-widest">Login Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/30">History</span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{orders.length} TOTAL DELIVERIES</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tighter leading-none">Your Orders</h1>
        </div>
        <Link href="/meals">
            <Button variant="outline" className="h-12 border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                Order Something New <ArrowRight className="w-4 h-4" />
            </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[60px]">
          <ShoppingBag className="w-16 h-16 text-slate-800" />
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">No Active Orders</h3>
            <p className="text-slate-500 text-sm mt-2">Hungry? Your next great meal is just a few clicks away.</p>
          </div>
          <Link href="/meals">
            <Button className="h-12 px-8 rounded-xl bg-orange-600 text-[10px] font-black uppercase tracking-widest">Explore Menu</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="group p-6 md:p-8 bg-[#020617] border-white/5 hover:border-orange-500/30 transition-all duration-500 rounded-[40px] flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-[80px] group-hover:bg-orange-500/10 transition-colors" />
                
                {/* Status Icon */}
                <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center shrink-0 shadow-2xl ${
                  order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                  'bg-orange-600/10 text-orange-500 border border-orange-500/20'
                }`}>
                  {order.status === 'DELIVERED' ? <CheckCircle className="w-10 h-10" /> :
                   order.status === 'READY' ? <Truck className="w-10 h-10" /> :
                   order.status === 'PREPARING' ? <Clock className="w-10 h-10" /> :
                   <Package className="w-10 h-10" />}
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order ID: {order.id.slice(-8).toUpperCase()}</p>
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight leading-none group-hover:text-orange-500 transition-colors">
                    {order.items.length} {order.items.length === 1 ? 'Delicacy' : 'Delicacies'}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>

                {/* Price & Status Badge */}
                <div className="flex flex-col items-center md:items-end gap-3">
                  <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    order.status === 'DELIVERED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-orange-600/10 text-orange-500 border-orange-500/20'
                  }`}>
                    {order.status === 'PLACED' ? 'PENDING' : order.status}
                  </span>
                  <p className="text-3xl font-black font-[family-name:var(--font-display)] text-white tracking-tighter">${order.total.toFixed(2)}</p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/5 text-slate-600 group-hover:text-white group-hover:bg-orange-600 transition-all">
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
