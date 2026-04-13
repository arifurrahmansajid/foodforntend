"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ordersApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-store";
import { Order } from "@/types";
import { Button, Card } from "@/components/ui";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ChefHat,
  MapPin,
  ArrowLeft,
  Loader2,
  XCircle,
  RefreshCw,
  ShoppingBag,
  Calendar,
  Hash,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const STATUS_STEPS = [
  {
    key: "PLACED",
    label: "Order Received",
    desc: "Your order has been placed and is awaiting confirmation",
    icon: Package,
  },
  {
    key: "PREPARING",
    label: "Preparing",
    desc: "Our chef is crafting your meal with care",
    icon: ChefHat,
  },
  {
    key: "READY",
    label: "On the Way",
    desc: "Your order is out for delivery",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    desc: "Your order has been delivered. Enjoy!",
    icon: CheckCircle,
  },
];

function getStepIndex(status: string) {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;
    
    setIsCancelling(true);
    try {
      await ordersApi.cancel(orderId);
      toast.success("Order cancelled successfully");
      fetchOrder(); // Refresh the order state
    } catch (error: any) {
      console.error("Cancellation failed:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const fetchOrder = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);
      try {
        const res = await ordersApi.getOne(orderId);
        setOrder(res.data.data.order);
        setLastUpdated(new Date());
      } catch (error: any) {
        console.error("Failed to fetch order:", error);
        if (!silent) toast.error("Could not load order details.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [orderId]
  );

  useEffect(() => {
    if (user) {
      fetchOrder();
    } else {
      setIsLoading(false);
    }
  }, [user, fetchOrder]);

  // Auto-refresh every 30 seconds for active orders
  useEffect(() => {
    if (!order || order.status === "DELIVERED" || order.status === "CANCELLED")
      return;
    const interval = setInterval(() => fetchOrder(true), 30000);
    return () => clearInterval(interval);
  }, [order, fetchOrder]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <XCircle className="w-16 h-16 text-slate-800" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">
          Access Restricted
        </h2>
        <p className="text-slate-500 max-w-xs">
          Please login to track your order.
        </p>
        <Link href="/login">
          <Button className="h-12 px-8 rounded-xl bg-orange-600 text-[10px] font-black uppercase tracking-widest">
            Login Now
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
          Locating Your Order...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <Package className="w-16 h-16 text-slate-800" />
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">
          Order Not Found
        </h2>
        <p className="text-slate-500 max-w-xs">
          We couldn't find this order. It may have been removed or the ID is
          incorrect.
        </p>
        <Link href="/orders">
          <Button className="h-12 px-8 rounded-xl bg-orange-600 text-[10px] font-black uppercase tracking-widest">
            My Orders
          </Button>
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "CANCELLED";
  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="space-y-1">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-500 hover:text-white transition-colors gap-2 mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back to Orders
            </span>
          </button>
          <h1 className="text-4xl md:text-6xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tighter">
            Track Order
          </h1>
        </div>
        <button
          onClick={() => fetchOrder(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-400 hover:text-white hover:border-orange-500/30 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin text-orange-500" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Order Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Hash,
            label: "Order ID",
            value: `#${order.id.slice(-8).toUpperCase()}`,
          },
          {
            icon: Calendar,
            label: "Placed On",
            value: new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          },
          {
            icon: ShoppingBag,
            label: "Items",
            value: `${order.items.length} ${order.items.length === 1 ? "item" : "items"}`,
          },
          {
            icon: Clock,
            label: "Last Updated",
            value: lastUpdated.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ].map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2"
          >
            <div className="flex items-center gap-2 text-slate-600">
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {label}
              </span>
            </div>
            <p className="text-white font-black text-sm">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Status Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-8 bg-[#020617] border-white/5 rounded-[44px] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[80px]" />

            <h2 className="text-lg font-black text-white uppercase tracking-widest mb-8">
              {isCancelled ? "Order Cancelled" : "Order Status"}
            </h2>

            {isCancelled ? (
              <div className="flex flex-col items-center py-10 space-y-4 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <p className="text-red-400 font-black text-lg uppercase tracking-wide">
                  This order was cancelled
                </p>
                <p className="text-slate-500 text-sm max-w-xs">
                  If you believe this is a mistake, please contact support.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx < currentStep;
                  const isActive = idx === currentStep;
                  const isPending = idx > currentStep;
                  const Icon = step.icon;
                  const isLast = idx === STATUS_STEPS.length - 1;

                  return (
                    <div key={step.key} className="flex gap-5">
                      {/* Timeline column */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all duration-500 ${
                            isCompleted
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : isActive
                                ? "bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_24px_rgba(234,88,12,0.4)]"
                                : "bg-white/[0.02] border-white/10 text-slate-700"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        {!isLast && (
                          <div
                            className={`w-0.5 h-10 mt-2 mb-2 transition-all duration-700 ${
                              isCompleted ? "bg-green-500/50" : "bg-white/5"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content column */}
                      <div
                        className={`flex-1 pb-${isLast ? "0" : "8"} ${isActive ? "mt-1" : "mt-2"}`}
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <h3
                            className={`font-black text-sm uppercase tracking-wider ${
                              isCompleted
                                ? "text-green-400"
                                : isActive
                                  ? "text-white"
                                  : "text-slate-600"
                            }`}
                          >
                            {step.label}
                          </h3>
                          {isActive && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[9px] font-black uppercase tracking-widest">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
                              </span>
                              Live
                            </span>
                          )}
                          {isCompleted && (
                            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          )}
                        </div>
                        <p
                          className={`text-xs leading-relaxed ${isActive ? "text-slate-300" : "text-slate-600"}`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Delivery Address */}
          {order.address && (
            <Card className="p-6 bg-[#020617] border-white/5 rounded-[36px] flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">
                  Delivery Address
                </p>
                <p className="text-sm text-white font-medium leading-relaxed">
                  {order.address}
                </p>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Order Items & Summary */}
        <div className="lg:col-span-5">
          <Card className="p-8 bg-[#020617] border-white/5 rounded-[44px] sticky top-32 space-y-6 overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 blur-[80px]" />

            <h2 className="text-lg font-black text-white uppercase tracking-widest">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 scrollbar-hide">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 group/item"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 overflow-hidden shrink-0">
                    {(item as any).meal?.image ? (
                      <img
                        src={(item as any).meal.image}
                        alt={item.name}
                        className="w-full h-full object-cover opacity-70 group-hover/item:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-700">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-black text-orange-400 font-[family-name:var(--font-display)] shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="font-bold font-[family-name:var(--font-display)]">
                  ${(order.total - 5.99).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Delivery Fee
                </span>
                <span className="font-bold font-[family-name:var(--font-display)]">
                  $5.99
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <span className="text-base font-black text-white uppercase tracking-widest">
                  Total
                </span>
                <span className="text-3xl font-black text-orange-500 font-[family-name:var(--font-display)] tracking-tighter">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {order.status === 'PLACED' && (
                <Button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  variant="danger"
                  className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  {isCancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Order"}
                </Button>
              )}
              <Link href="/meals" className="block">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:border-orange-600 transition-all"
                >
                  Order Again
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
