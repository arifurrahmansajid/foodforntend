"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { 
  BarChart3, Users, Utensils, ShoppingBag, 
  Settings, DollarSign, Layout, List, Search,
  Plus, Trash2, Edit, CheckCircle, XCircle, ShieldCheck,
  TrendingUp, ArrowRight, Loader2, Package, Layers
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import { User, Meal, Category, Provider } from "@/types";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'providers' | 'meals' | 'categories' | 'cancellations' | 'reviews'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { user, token } = useAuth();
  const router = useRouter();
  
  // Data State
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, usersRes, providersRes, mealsRes, categoriesRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getProviders(),
        adminApi.getMeals(),
        adminApi.getCategories()
      ]);

      setStats(statsRes.data.data.stats || { totalUsers: 0, totalProviders: 0, totalMeals: 0, totalOrders: 0, totalRevenue: 0, totalSellerEarnings: 0, totalAdminCommission: 0, avgRating: 0 });
      setUsers(usersRes.data.data.users || []);
      setMeals(mealsRes.data.data.meals || []);
      setCategories(categoriesRes.data.data.categories || []);
      setProviders(providersRes.data.data.providers || []);
      setCancelledOrders(statsRes.data.data.cancelledOrders || []);
      setReviews(statsRes.data.data.reviews || []);
    } catch (error: any) {
      console.error("Admin Load Error:", error);
      if (error?.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.push('/login');
      } else {
        toast.error("Failed to load admin data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      loadData();
    } else if (token && user?.role !== 'ADMIN') {
      toast.error('Access Denied: Admin privileges required.');
      router.push('/');
    } else if (!token) {
      const timer = setTimeout(() => {
        const currentToken = useAuth.getState().token;
        const currentUser = useAuth.getState().user;
        if (!currentToken) {
          toast.error('Please log in to access the admin dashboard.');
          router.push('/login');
        } else if (currentUser?.role !== 'ADMIN') {
          toast.error('Access Denied: Admin privileges required.');
          router.push('/');
        } else {
          loadData();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [token, user]);

  const handleToggleUser = async (id: string, currentStatus: boolean) => {
    try {
      setIsActionLoading(true);
      await adminApi.updateUserStatus(id, !currentStatus);
      toast.success(`Access updated for protocol: ${id.slice(0,8)}`);
      loadData();
    } catch (error) {
      toast.error("Operation Denied.");
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Decrypting Command Center State...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-500 py-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-4xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Command Center</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1 opacity-70 flex items-center gap-2">
             <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> Platform Overseer Active
          </p>
        </div>
        
        <div className="flex bg-white/[0.02] p-1.5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
            {['overview', 'users', 'providers', 'meals', 'categories', 'cancellations', 'reviews'].map((tab: any) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-orange-600 text-white shadow-[0_10px_25px_-5px_rgba(234,88,12,0.4)]' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Platform Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Verified Partners', value: stats?.totalProviders || 0, icon: ShieldCheck, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: 'Chef Rating', value: stats?.avgRating?.toFixed(1) || '0.0', icon: Utensils, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                    { label: 'Global Volume', value: stats?.totalOrders || 0, icon: Package, color: 'text-green-500', bg: 'bg-green-500/10' },
                ].map((stat, i) => (
                    <Card key={i} className="p-8 bg-white/[0.02] border-white/5 rounded-[32px] overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} blur-[60px] rounded-full pointer-events-none group-hover:blur-[80px] transition-all`} />
                        <div className="relative z-10">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <span className="text-4xl font-black text-white font-[family-name:var(--font-display)] tracking-tighter">{stat.value}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <Card className="lg:col-span-2 p-10 bg-slate-950/40 border-white/5 backdrop-blur-2xl rounded-[40px] shadow-2xl">
                    <h2 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                        <TrendingUp className="w-6 h-6 text-orange-500" /> Revenue Integrity
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="flex items-center justify-center p-6 text-center flex-col bg-white/[0.02] rounded-[32px] border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Total Gross</p>
                            <h3 className="text-3xl font-black text-white font-[family-name:var(--font-display)]">${(stats?.totalRevenue || 0).toFixed(2)}</h3>
                        </div>

                        <div className="flex items-center justify-center p-6 text-center flex-col bg-white/[0.02] rounded-[32px] border border-white/5">
                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Seller Earnings (98%)</p>
                            <h3 className="text-3xl font-black text-white font-[family-name:var(--font-display)]">${(stats?.totalSellerEarnings || 0).toFixed(2)}</h3>
                        </div>

                        <div className="flex items-center justify-center p-6 text-center flex-col bg-orange-600/10 rounded-[32px] border border-orange-500/20">
                            <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Admin Fee (2%)</p>
                            <h3 className="text-3xl font-black text-orange-500 font-[family-name:var(--font-display)]">${(stats?.totalAdminCommission || 0).toFixed(2)}</h3>
                        </div>
                    </div>
                </Card>

                <div className="space-y-8">
                     <Card className="p-8 bg-white/[0.02] border-white/5 rounded-[40px] space-y-8 overflow-hidden relative">
                        <h2 className="text-sm font-black text-white tracking-widest uppercase flex items-center gap-3">
                            <Plus className="w-4 h-4 text-orange-500" /> System Metrics
                        </h2>
                        <div className="space-y-6">
                            {[
                                { label: 'Platform Stability', val: '99.9%', color: 'w-full bg-green-500' },
                                { label: 'Provider Capacity', val: '74%', color: 'w-[74%] bg-blue-500' },
                                { label: 'Active Sessions', val: '412', color: 'w-[45%] bg-orange-500' },
                            ].map((m, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500">{m.label}</span>
                                        <span className="text-white">{m.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={`h-full ${m.color} rounded-full`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                     </Card>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="p-0 bg-slate-950/40 border-white/5 backdrop-blur-2xl rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Platform Manifest</h2>
                    <div className="relative w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-orange-500 transition-colors" />
                        <Input placeholder="Search Citizens..." className="h-11 pl-12 rounded-xl bg-white/5 border-white/5 text-xs" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Permission</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Gateway Access</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center text-xs font-bold text-white">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{user.name}</p>
                                                <p className="text-[10px] font-medium text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${user.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : user.role === 'PROVIDER' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-slate-500/10 text-slate-500 border-white/5'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                                {user.isActive ? 'Clearance Granted' : 'Access Revoked'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            disabled={isActionLoading}
                                            onClick={() => handleToggleUser(user.id, user.isActive)}
                                            className={`p-2.5 rounded-xl border transition-all ${user.isActive ? 'bg-rose-500/5 border-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white' : 'bg-green-500/5 border-green-500/10 text-green-500 hover:bg-green-600 hover:text-white'}`}
                                        >
                                            {user.isActive ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </Card>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end">
                <Button className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all active:scale-95">
                    <Plus className="w-5 h-5" /> Initialize New Sector
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((cat) => (
                    <Card key={cat.id} className="p-8 bg-white/[0.02] border-white/5 rounded-[40px] group transition-all hover:bg-orange-600 hover:shadow-2xl">
                        <div className="flex items-start justify-between mb-8">
                             <div className="w-20 h-20 rounded-[32px] bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center p-2 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
                                {cat.image ? (
                                    <img src={cat.image} className="w-full h-full object-cover rounded-[24px]" />
                               ) : (
                                    <Layers className="w-10 h-10 text-slate-800" />
                                )}
                             </div>
                             <div className="flex gap-2">
                                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                             </div>
                        </div>
                        <h3 className="text-2xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight group-hover:text-white">{cat.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-white/70 mt-1">{(cat as any)._count?.meals || 0} Registered Assets</p>
                    </Card>
                ))}
            </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="p-0 bg-slate-950/40 border-white/5 backdrop-blur-2xl rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Verified Partners</h2>
                    <div className="relative w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-orange-500 transition-colors" />
                        <Input placeholder="Search Partners..." className="h-11 pl-12 rounded-xl bg-white/5 border-white/5 text-xs" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Provider Hub</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Protocol</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Inventory Volume</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Clearance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {providers.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 flex items-center justify-center text-xs font-black text-orange-500">
                                                {p.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase">{p.name}</p>
                                                <p className="text-[10px] font-medium text-slate-500">{p.user?.name || 'Owner Managed'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{p.user?.email || 'OFFLINE'}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Utensils className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">{p._count?.meals || 0} ACTIVE MEALS</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${p.user?.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                                            {p.user?.isActive ? 'OPERATIONAL' : 'SUSPENDED'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </Card>
        </div>
      )}

      {activeTab === 'meals' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="p-0 bg-slate-950/40 border-white/5 backdrop-blur-2xl rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Gourmet Fleet</h2>
                    <div className="relative w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-orange-500 transition-colors" />
                        <Input placeholder="Search Menu Items..." className="h-11 pl-12 rounded-xl bg-white/5 border-white/5 text-xs" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Culinary Asset</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Sector</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Ownership</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {meals.map((m) => (
                                <tr key={m.id} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl border border-white/5 overflow-hidden">
                                                <img src={m.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=100"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase leading-none">{m.name}</p>
                                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">ID: {m.id.slice(0,8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-300">
                                            {m.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(m as any).provider?.name || 'Independent'}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="text-lg font-black text-orange-500 font-[family-name:var(--font-display)]">${m.price.toFixed(2)}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </Card>
        </div>
      )}

      {activeTab === 'cancellations' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="p-0 bg-slate-950/40 border-white/5 backdrop-blur-2xl rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Voided Requests</h2>
                    <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                        {cancelledOrders.length} Total Cancellations
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Order Protocol</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Customer Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Voided Value</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Termination Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {cancelledOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-30">
                                            <Package className="w-12 h-12 mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">No cancellations documented.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                cancelledOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                                                    <XCircle className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-rose-500 transition-colors uppercase">#{order.id.slice(-8).toUpperCase()}</p>
                                                    <p className="text-[10px] font-medium text-slate-500">{order.items.length} items voided</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{order.user?.name}</p>
                                                <p className="text-[9px] text-slate-600">{order.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-lg font-black text-rose-500 font-[family-name:var(--font-display)]">${order.total.toFixed(2)}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {new Date(order.updatedAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-[9px] text-slate-600">
                                                {new Date(order.updatedAt).toLocaleTimeString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
             </Card>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="p-0 bg-slate-950/40 border-white/5 backdrop-blur-2xl rounded-[40px] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Client Feedback</h2>
                    <div className="px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                        {reviews.length} Recent Reviews
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02]">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Service Asset</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Rating</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Message</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-30">
                                            <Utensils className="w-12 h-12 mb-4" />
                                            <p className="text-xs font-black uppercase tracking-widest">No customer feedback yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review: any) => (
                                    <tr key={review.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-xs font-bold text-white overflow-hidden">
                                                    {review.user?.avatar ? (
                                                        <img src={review.user.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        review.user?.name?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase">{review.user?.name}</p>
                                                    <p className="text-[10px] font-medium text-slate-500 italic">Verified Gourmet</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{review.meal?.name || 'Unknown Item'}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`w-2 h-2 rounded-full ${i < review.rating ? 'bg-orange-500 shadow-[0_0_8px_rgba(234,88,12,0.6)]' : 'bg-white/5'}`} />
                                                ))}
                                                <span className="ml-2 text-[10px] font-black text-white">{review.rating.toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 max-w-xs">
                                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">&ldquo;{review.comment || 'No comment provided.'}&rdquo;</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
             </Card>
        </div>
      )}
    </div>
  );
}
