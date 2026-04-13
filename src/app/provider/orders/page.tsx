"use client";

import { useState, useEffect } from "react";
import { providersApi } from "@/lib/api";
import { Card, Button } from "@/components/ui";
import { Package, Utensils, Loader2, CheckCircle, Clock, MapPin, User, Loader } from "lucide-react";
import toast from "react-hot-toast";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  meal: { image: string, providerId: string };
};

type Order = {
  id: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  total: number;
  address: string;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await providersApi.getOrders();
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error("Failed to fetch provider orders:", error);
      toast.error("Could not load your orders.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // In a real app we might poll or use websockets here
    const interval = setInterval(fetchOrders, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await providersApi.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "PLACED": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "PREPARING": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "READY": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DELIVERED": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader className="w-8 h-8 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Incoming Orders</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pt-8 max-w-6xl mx-auto px-6">
      <div className="flex items-end justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tighter">Kitchen Dashboard</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium">Manage incoming orders and update their preparation status.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 border border-orange-500/20 rounded-xl bg-orange-600/5 text-orange-500">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">Live Updates Active</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl bg-white/[0.02] border border-white/5">
          <Package className="w-12 h-12 text-slate-700 mb-4" />
          <h2 className="text-xl font-black text-white uppercase tracking-widest">No Active Orders</h2>
          <p className="text-slate-500">You currently have no incoming orders to prepare.</p>
          <Button onClick={fetchOrders} variant="outline" className="mt-6">Refresh</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="p-6 md:p-8 bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors uppercase">
              <div className="flex flex-col lg:flex-row gap-8 justify-between">
                
                {/* Order Meta */}
                <div className="space-y-6 lg:w-1/3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-3 py-1 rounded-full border text-[10px] font-black tracking-widest ${getStatusColor(order.status)}`}>
                         {order.status}
                       </span>
                       <span className="text-slate-400 text-xs font-bold font-mono">#{order.id.slice(0,8)}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-start gap-3 text-slate-300">
                      <User className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-black tracking-widest">{order.user.name}</p>
                        <p className="text-[10px] text-slate-500">{order.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-slate-300 relative group cursor-default">
                      <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <p className="text-xs font-bold leading-relaxed line-clamp-2">{order.address}</p>
                      {/* Tooltip for long address */}
                      <div className="absolute left-0 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black p-3 rounded-lg border border-white/10 w-64 z-10 pointer-events-none">
                        <p className="text-[10px] text-white leading-normal normal-case">{order.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="lg:w-1/3 space-y-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                  <h3 className="text-[10px] font-black text-slate-500 tracking-widest">Ordered Items</h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-white/5">
                          {item.meal?.image ? (
                             <img src={item.meal.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                          ) : (
                             <Utensils className="w-5 h-5 m-auto text-slate-600 mt-3" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-white tracking-widest line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{item.quantity}x @ ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:w-1/3 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8 flex flex-col justify-center gap-4">
                  <h3 className="text-[10px] font-black text-slate-500 tracking-widest text-center lg:text-left mb-2">Update Status</h3>
                  
                  {order.status === "PLACED" && (
                    <Button 
                      onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                      disabled={updatingId === order.id}
                      className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black tracking-widest"
                    >
                      {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept & Prepare"}
                    </Button>
                  )}

                  {order.status === "PREPARING" && (
                    <Button 
                      onClick={() => handleUpdateStatus(order.id, "READY")}
                      disabled={updatingId === order.id}
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-black tracking-widest"
                    >
                      {updatingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Mark as Ready"}
                    </Button>
                  )}

                  {(order.status === "READY" || order.status === "PLACED" || order.status === "PREPARING") && (
                     <Button 
                      onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                      disabled={updatingId === order.id}
                      variant="outline"
                      className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 font-black tracking-widest"
                    >
                      Cancel Order
                    </Button>
                  )}

                  {order.status === "READY" && (
                    <p className="text-[10px] text-center text-slate-500 font-bold tracking-widest">Awaiting delivery partner pickup</p>
                  )}

                  {order.status === "DELIVERED" && (
                     <div className="flex items-center justify-center gap-2 text-green-500 border border-green-500/10 bg-green-500/5 p-4 rounded-xl">
                       <CheckCircle className="w-5 h-5" />
                       <span className="text-xs font-black tracking-widest">Completed</span>
                     </div>
                  )}
                  {order.status === "CANCELLED" && (
                     <div className="flex items-center justify-center text-red-500 border border-red-500/10 bg-red-500/5 p-4 rounded-xl">
                       <span className="text-xs font-black tracking-widest">Order Voided</span>
                     </div>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
