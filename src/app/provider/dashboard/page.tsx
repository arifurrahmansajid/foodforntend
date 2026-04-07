"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { 
  BarChart3, Plus, Search, Utensils, ShoppingBag, 
  Settings, TrendingUp, Users, DollarSign, Package,
  Trash2, Edit, ChevronRight, Star, Clock, AlertCircle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/use-store";
import { providersApi, mealsApi } from "@/lib/api";
import { Provider, Meal, Order } from "@/types";
import { Loader2 } from "lucide-react";

// Types for internal dashboard use
interface DashboardStats {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
  change: string;
}

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [providerData, setProviderData] = useState<Provider | null>(null);
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        // Get provider profile with meals and potential orders
        const response = await providersApi.getOne(user?.id || '');
        const provider: Provider = response.data.data.provider;
        setProviderData(provider);

        // Derive stats from real data
        const activeOrders = 3; // Mocking for now as we don't have direct provider-order link table yet, but it's backend-aware
        const mealCount = provider.meals?.length || 0;
        
        setStats([
          { label: 'Annual Revenue', value: '$0.00', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10', change: '+0%' },
          { label: 'Live Orders', value: activeOrders.toString(), icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10', change: '+3' },
          { label: 'Chef Rating', value: (provider.rating || 0).toFixed(1), icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', change: 'NEW' },
          { label: 'Active Menu', value: mealCount.toString(), icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10', change: 'Items' },
        ]);
      } catch (error) {
        console.error("Dashboard Sync Failed:", error);
        toast.error("Failed to sync live data. Using cached view.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) loadDashboard();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Synchronizing Hub State...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-500 py-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Provider Hub</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1 opacity-70 flex items-center gap-2">
             <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> System is operating at peak performance
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link href="/provider/menu">
            <Button className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_15px_30px_-5px_rgba(234,88,12,0.4)] transition-all active:scale-95">
                <Plus className="w-5 h-5" /> Add New Meal
            </Button>
          </Link>
          <Button variant="outline" className="w-14 h-14 p-0 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-white" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-8 bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all relative group overflow-hidden rounded-[32px] shadow-2xl">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[60px] rounded-full pointer-events-none group-hover:blur-[80px] transition-all`} />
            <div className="flex flex-col justify-between h-full relative z-10 pointer-events-none">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-end gap-3">
                    <span className="text-3xl font-black text-white font-[family-name:var(--font-display)] tracking-tighter leading-none">{stat.value}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500 pb-0.5 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.change}
                    </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 p-10 bg-slate-950/40 border-white/5 backdrop-blur-2xl rounded-[40px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
            <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-orange-500" /> Recent Activity
            </h2>
            <div className="flex gap-2">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >Overview</button>
                <button 
                  onClick={() => setActiveTab('meals')}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'meals' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >My Meals</button>
            </div>
          </div>

          <div className="space-y-4">
            {activeTab === 'overview' ? (
              // Shared Recent Activity Placeholder
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-800">
                      <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                      <p className="text-xs font-black uppercase tracking-widest text-white">No Recent Orders</p>
                      <p className="text-[10px] font-medium text-slate-600">Your latest platform interactions will appear here.</p>
                  </div>
              </div>
            ) : (
              providerData?.meals?.slice(0, 4).map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-6 rounded-[32px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-600/0 to-orange-600/0 group-hover:from-orange-600/[0.02] group-hover:to-orange-600/[0.02] transition-colors" />
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden shadow-2xl transition-transform group-hover:scale-103">
                      <img src={meal.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=100&q=10"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)] uppercase tracking-wide group-hover:text-orange-500 transition-colors">{meal.name}</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-green-500" /> ${meal.price.toFixed(2)}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-blue-500" /> ACTIVE</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                       <span className="px-3 py-1 rounded-full bg-green-600/10 text-green-500 border border-green-500/20 text-[10px] font-black uppercase tracking-widest shadow-2xl">Published</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-orange-500 transition-all transform group-hover:translate-x-2" />
                  </div>
                </div>
              ))
            )}
            {activeTab === 'meals' && (!providerData?.meals || providerData.meals.length === 0) && (
                 <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <Utensils className="w-10 h-10 text-slate-800" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-600">Your Menu is Empty</p>
                    <Link href="/provider/menu">
                        <Button variant="outline" className="h-10 rounded-xl px-6 border-white/5 text-[10px] uppercase font-black tracking-widest">Create First Meal</Button>
                    </Link>
                 </div>
            )}
          </div>
          
          <Link href="/provider/orders" className="block w-full mt-10">
            <Button variant="outline" className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest border-white/5 bg-white/5 hover:bg-orange-600 hover:text-white transition-all shadow-2xl">View Detailed Logs & Order Management</Button>
          </Link>
        </Card>

        <div className="space-y-8">
            <Card className="p-8 bg-slate-950/40 border-white/5 rounded-[40px] space-y-8 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/0 via-orange-600/0 to-orange-600/0 group-hover:from-orange-600/[0.03] transition-colors" />
                <h2 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3 relative z-10">
                  <Utensils className="w-5 h-5 text-orange-500" /> Top Performing
                </h2>
                <div className="space-y-4 relative z-10">
                    {providerData?.meals && providerData.meals.length > 0 ? (
                        providerData.meals.slice(0, 3).map(meal => (
                            <div key={meal.id} className="flex items-center gap-4 group/item">
                                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover/item:scale-110">
                                    <Star className="w-5 h-5 text-amber-500 fill-current opacity-70 group-hover/item:opacity-100" />
                                </div>
                                <div className="flex-1 border-b border-white/5 pb-2">
                                    <h4 className="text-sm font-bold text-slate-200 group-hover/item:text-orange-500 transition-colors uppercase tracking-tight">{meal.name}</h4>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Active Creation</p>
                                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">${meal.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-700 py-10 text-center">No meal performance data available yet.</p>
                    )}
                </div>
                <div className="p-6 rounded-[32px] bg-orange-600 text-white relative z-10 shadow-[0_20px_50px_-5px_rgba(234,88,12,0.4)] border border-orange-500">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-70">Weekly Forecast</h4>
                    <p className="text-2xl font-black font-[family-name:var(--font-display)] leading-tight tracking-tight">Demand is increasing! Prepare for +15% more orders in Italian category.</p>
                </div>
            </Card>

            <Card className="p-8 bg-rose-600/5 border-rose-500/10 rounded-[40px] space-y-6 overflow-hidden relative group">
                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-rose-600/10 flex items-center justify-center text-rose-500">
                        <Settings className="w-5 h-5 animate-spin-slow" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 opacity-80">Quick Admin Ops</h3>
                </div>
                <div className="space-y-4 relative z-10">
                    <button className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-lg active:scale-95">Set Holiday Mode</button>
                    <button className="w-full h-12 flex items-center justify-center gap-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95">Clear Cache</button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
