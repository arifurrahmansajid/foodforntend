"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { 
  BarChart3, Plus, Search, Utensils, ShoppingBag, 
  Settings, TrendingUp, Users, DollarSign, Package,
  Trash2, Edit, ChevronRight, Star, Clock, AlertCircle,
  Eye, Save, X, Image as ImageIcon, LayoutGrid, List,
  Loader2
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/use-store";
import { providersApi, mealsApi } from "@/lib/api";
import { Meal } from "@/types";

export default function ProviderMenu() {
  const [isAdding, setIsAdding] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState<Meal[]>([]);
  const { user } = useAuth();

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const refreshMenu = async () => {
    try {
      setIsLoading(true);
      const response = await providersApi.getOne(user?.id || '');
      setMenu(response.data.data.provider.meals || []);
    } catch (error) {
      console.error("Menu Fetch Failed:", error);
      toast.error("Failed to load your menu from vault.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) refreshMenu();
  }, [user]);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Backend expects: POST /api/provider/meals
      await mealsApi.add({
        name,
        price: parseFloat(price),
        description,
        image,
        categoryId: categoryId || undefined
      });
      toast.success("New culinary creation published!");
      setIsAdding(false);
      refreshMenu();
      // Reset form
      setName(""); setPrice(""); setDescription(""); setImage("");
    } catch (error) {
      toast.error("Failed to publish dish. Verify all fields.");
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Are you sure you want to remove this creation?")) return;
    try {
      // Backend expects: DELETE /api/provider/meals/:id
      await mealsApi.remove(id);
      toast.success("Dish removed from elite menu.");
      refreshMenu();
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-500 py-6 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-white/5 relative z-10 transition-all">
        <div>
          <h1 className="text-4xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Gourmet Menu</h1>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1 opacity-70 flex items-center gap-2">
             Configure your premium culinary offerings
          </p>
        </div>
        
        <div className="flex gap-4">
             <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5 transition-all">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-orange-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
                >
                    <List className="w-5 h-5" />
                </button>
             </div>
             <Button 
                onClick={() => setIsAdding(!isAdding)}
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_15px_30px_-5px_rgba(234,88,12,0.4)] transition-all active:scale-95 group overflow-hidden"
             >
                {isAdding ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Add New Creation</>}
             </Button>
        </div>
      </div>

      {isAdding && (
          <Card className="p-10 bg-slate-950/40 border-white/5 rounded-[44px] animate-in zoom-in duration-300 relative group overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
            <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase mb-10 flex items-center gap-3">
               <Utensils className="w-6 h-6 text-orange-500" /> New Culinary Creation
            </h2>
            
            <form onSubmit={handleAddMeal} className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start relative z-10">
                <div className="md:col-span-1 space-y-6">
                    <div className="w-full aspect-square rounded-[40px] bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center group/img hover:bg-white/[0.04] hover:border-orange-500/30 transition-all cursor-pointer overflow-hidden p-2 relative">
                        {image ? (
                            <img src={image} className="w-full h-full object-cover rounded-[36px]" />
                        ) : (
                            <div className="flex flex-col items-center">
                                <ImageIcon className="w-12 h-12 text-slate-700 mb-3 group-hover/img:text-orange-500 transition-colors" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Paste Image URL Below</p>
                            </div>
                        )}
                        <Input 
                          placeholder="Image URL" 
                          className="absolute bottom-4 inset-x-4 h-10 bg-black/80 border-white/5 opacity-0 group-hover/img:opacity-100 transition-opacity"
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2 group/field sm:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Dish Name</label>
                        <Input 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Signature Truffle Ribeye" 
                          className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800" 
                        />
                    </div>
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Category ID</label>
                        <Input 
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          placeholder="e.g. category-uuid" 
                          className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800" 
                        />
                    </div>
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Price ($)</label>
                        <Input 
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 45.00" 
                          className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800" 
                        />
                    </div>
                    <div className="space-y-2 group/field sm:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Composition Description</label>
                        <textarea 
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full h-32 rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-slate-100 font-medium placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"></textarea>
                    </div>
                    
                    <div className="sm:col-span-2 pt-6">
                        <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_-10px_rgba(234,88,12,0.5)]">
                           <Save className="w-6 h-6" /> Deploy to Menu
                        </Button>
                    </div>
                </div>
            </form>
          </Card>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Retrieving Gourmet Menu...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-4"}>
          {menu.length > 0 ? menu.map((item) => (
            viewMode === 'grid' ? (
              <Card key={item.id} className="group flex flex-col bg-[#020617] border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden rounded-[32px] shadow-2xl relative">
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full glass-card border-white/10 text-white font-black text-[10px] flex items-center gap-1 shadow-2xl backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  ID: {item.id.slice(0, 8)}
                </div>
                <div className="h-60 relative overflow-hidden group/img">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400"} 
                    alt={item.name} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-500 bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent flex gap-2">
                      <Button variant="outline" className="flex-1 h-10 border-white/10 text-xs font-black uppercase tracking-widest">
                         <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                      </Button>
                      <button 
                        onClick={() => handleDeleteMeal(item.id)}
                        className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-500 border border-rose-500/10 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="text-xl font-bold text-white font-[family-name:var(--font-display)] uppercase tracking-tight group-hover:text-orange-500 transition-colors leading-tight">{item.name}</h3>
                     <span className="text-lg font-black text-orange-500">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-6 flex items-center justify-between">
                      <span>{item.category?.name || "General"}</span>
                      <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] text-slate-400 group-hover:text-green-500 transition-colors"><TrendingUp className="w-3 h-3" /> Live</span>
                  </p>
                  <Link href={`/meals/${item.id}`} className="block">
                      <Button variant="outline" className="w-full h-12 rounded-xl group/eye border-white/5 hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Eye className="w-4 h-4 mr-2 group-hover/eye:text-white transition-colors" /> Public Preview
                      </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div key={item.id} className="p-4 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all flex items-center gap-6 group">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl">
                      <img src={item.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=100"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1">
                      <h4 className="text-lg font-bold text-white font-[family-name:var(--font-display)] uppercase tracking-tight">{item.name}</h4>
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{item.category?.name || "General"} • ${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                      <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/5"><Edit className="w-4 h-4" /></Button>
                      <button 
                        onClick={() => handleDeleteMeal(item.id)}
                        className="w-10 h-10 rounded-xl bg-white/5 text-slate-600 hover:bg-rose-600/[0.05] hover:text-rose-500 transition-all flex items-center justify-center p-0 border border-white/5"
                      >
                          <Trash2 className="w-4 h-4" />
                      </button>
                      <Link href={`/meals/${item.id}`}>
                          <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/5 group-hover:bg-orange-600 group-hover:text-white transition-all"><Eye className="w-4 h-4" /></Button>
                      </Link>
                  </div>
              </div>
            )
          )) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center opacity-50">
               <Utensils className="w-16 h-16 text-slate-800 mb-4" />
               <p className="text-xs font-black uppercase tracking-widest text-slate-600">Your kitchen is quiet. Start creating!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
