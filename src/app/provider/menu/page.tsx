"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import {
  Plus, Utensils, Trash2, Edit, Eye, Save, X,
  Image as ImageIcon, LayoutGrid, List, Loader2,
  Store, ChevronDown, Check, SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/use-store";
import { providersApi, mealsApi, categoriesApi } from "@/lib/api";
import { Meal, Category } from "@/types";

// ─── Create Profile Modal ──────────────────────────────────────────────────────
function CreateProfileModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Profile name is required.");
    try {
      setIsSubmitting(true);
      await providersApi.createProfile({ 
        name, 
        description, 
        image,
        phone,
        contactEmail: email,
        website,
        address
      });
      toast.success(`"${name}" restaurant profile created!`);
      onCreated();
      onClose();
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl p-10 bg-slate-950/90 border-white/10 rounded-[40px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3">
            <Store className="w-6 h-6 text-orange-500" /> New Restaurant
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group/field md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">
                Restaurant Name *
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. The Golden Fork"
                className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800"
              />
            </div>

            <div className="space-y-2 group/field md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your restaurant's concept and cuisine..."
                className="w-full h-24 rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-slate-100 font-medium placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
              />
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">
                Phone Number
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1..."
                className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800"
              />
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">
                Contact Email
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@restaurant.com"
                className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800"
              />
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">
                Website
              </label>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.restaurant.com"
                className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800"
              />
            </div>

            <div className="space-y-2 group/field">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">
                Logo / Cover Image URL
              </label>
              <Input
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800"
              />
            </div>

            <div className="space-y-2 group/field md:col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">
                Location Address
              </label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Gastronomy St, Dhaka"
                className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800"
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest shadow-[0_20px_50px_-10px_rgba(234,88,12,0.5)] mt-4"
          >
            <Store className="w-5 h-5 mr-2" /> Launch Restaurant
          </Button>
        </form>
      </Card>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ProviderMenu() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [menu, setMenu] = useState<Meal[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { user } = useAuth();

  // Meal Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.getAll()
      .then((res) => setCategories(res.data.data.categories || []))
      .catch(() => {/* non-critical */});
  }, []);

  const refreshMenu = async (keepProfileId?: string) => {
    try {
      setIsLoading(true);
      const response = await providersApi.getMyProfiles();
      const fetchedProfiles = response.data.data.profiles || [];
      setProfiles(fetchedProfiles);

      if (fetchedProfiles.length > 0) {
        const activeId = keepProfileId || selectedProfileId || fetchedProfiles[0].id;
        setSelectedProfileId(activeId);
        const active = fetchedProfiles.find((p: any) => p.id === activeId) || fetchedProfiles[0];
        setMenu(active.meals || []);
      } else {
        setMenu([]);
      }
    } catch (error) {
      console.error("Menu Fetch Failed:", error);
      toast.error("Failed to load your menu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) refreshMenu();
  }, [user]);

  const handleSwitchProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    const active = profiles.find((p: any) => p.id === profileId);
    setMenu(active?.meals || []);
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfileId) {
      toast.error("Select a restaurant profile first.");
      return;
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Please enter a valid price greater than 0.");
      return;
    }

    try {
      await mealsApi.add({
        name, 
        price: numericPrice, 
        description, 
        image,
        categoryId: categoryId || undefined,
        providerId: selectedProfileId,
      });
      toast.success("New dish published!");
      setIsAddingMeal(false);
      setName(""); setPrice(""); setDescription(""); setImage(""); setCategoryId("");
      refreshMenu(selectedProfileId);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Failed to publish dish.";
      toast.error(msg);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Remove this dish from the menu?")) return;
    try {
      await mealsApi.remove(id);
      toast.success("Dish removed.");
      refreshMenu(selectedProfileId);
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Retrieving Gourmet Menu...</p>
      </div>
    );
  }

  // ── No profiles yet ──
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col space-y-12 animate-in fade-in duration-500 py-6">
        <div className="pb-4 border-b border-white/5">
          <h1 className="text-4xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Gourmet Menu</h1>
        </div>
        <Card className="p-16 bg-slate-950/40 border-white/5 rounded-[40px] shadow-2xl flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-[28px] bg-orange-500/10 flex items-center justify-center mb-6">
            <Store className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase mb-3">
            No Restaurant Yet
          </h2>
          <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
            Create your first restaurant profile to start building your menu and receive orders.
          </p>
          <Button
            onClick={() => setIsCreatingProfile(true)}
            className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_15px_30px_-5px_rgba(234,88,12,0.4)]"
          >
            <Plus className="w-5 h-5" /> Create Restaurant Profile
          </Button>
        </Card>
        {isCreatingProfile && (
          <CreateProfileModal onClose={() => setIsCreatingProfile(false)} onCreated={refreshMenu} />
        )}
      </div>
    );
  }

  // ── Main Menu View ──
  const activeProfile = profiles.find((p) => p.id === selectedProfileId) || profiles[0];

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-500 py-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-6 pb-4 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">
              Gourmet Menu
            </h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mt-1 opacity-70">
              Manage menus across your restaurant profiles
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {/* View Toggle */}
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-orange-600 text-white shadow-xl" : "text-slate-500 hover:text-white"}`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-orange-600 text-white shadow-xl" : "text-slate-500 hover:text-white"}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Add Profile */}
            <Button
              variant="outline"
              onClick={() => setIsCreatingProfile(true)}
              className="h-12 px-5 rounded-2xl font-black uppercase tracking-widest text-[10px] border-white/10 flex items-center gap-2 hover:border-orange-500/50 hover:text-orange-500 transition-all"
            >
              <Store className="w-4 h-4" /> New Profile
            </Button>

            {/* Add Meal */}
            <Button
              onClick={() => setIsAddingMeal(!isAddingMeal)}
              className="h-12 px-6 rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_15px_30px_-5px_rgba(234,88,12,0.4)] transition-all active:scale-95"
            >
              {isAddingMeal ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Dish</>}
            </Button>
          </div>
        </div>

        {/* Profile Switcher Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mr-1">Profile:</span>
          {profiles.map((p: any) => (
            <button
              key={p.id}
              onClick={() => handleSwitchProfile(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                selectedProfileId === p.id
                  ? "bg-orange-600 text-white border-orange-500 shadow-lg"
                  : "bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:border-white/20"
              }`}
            >
              {selectedProfileId === p.id && <Check className="w-3 h-3" />}
              {p.name}
              <span className="opacity-60">({p.meals?.length ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Meal Form */}
      {isAddingMeal && (
        <Card className="p-10 bg-slate-950/40 border-white/5 rounded-[44px] animate-in zoom-in duration-300 relative group overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />
          <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase mb-2 flex items-center gap-3">
            <Utensils className="w-6 h-6 text-orange-500" /> New Dish
          </h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-8">
            Adding to: <span className="text-orange-500">{activeProfile?.name}</span>
          </p>

          <form onSubmit={handleAddMeal} className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start relative z-10">
            {/* Image Preview */}
            <div className="md:col-span-1 space-y-4">
              <div className="w-full aspect-square rounded-[40px] bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center group/img hover:bg-white/[0.04] hover:border-orange-500/30 transition-all cursor-pointer overflow-hidden p-2 relative">
                {image ? (
                  <img src={image} className="w-full h-full object-cover rounded-[36px]" alt="preview" />
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

            {/* Fields */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2 group/field sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Dish Name *</label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Signature Truffle Ribeye" className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800" />
              </div>
              <div className="space-y-2 group/field">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Price ($) *</label>
                <Input 
                  required 
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="e.g. 24.99" 
                  className="h-14 rounded-2xl bg-white/[0.03] border-white/5 font-bold text-slate-100 placeholder:text-slate-800" 
                />
              </div>
              <div className="space-y-2 group/field relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Category</label>
                <div className="relative">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/5 px-4 pr-10 text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-900">— No Category —</option>
                    {[...categories].sort((a,b) => a.name.localeCompare(b.name)).map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/field:text-orange-500 transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="space-y-2 group/field sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-focus-within/field:text-orange-500 transition-colors ml-1">Description *</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-28 rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-slate-100 font-medium placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none" placeholder="Describe the dish..." />
              </div>
              <div className="sm:col-span-2 pt-2">
                <Button type="submit" className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_-10px_rgba(234,88,12,0.5)]">
                  <Save className="w-5 h-5" /> Publish to Menu
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* Menu Grid / List */}
      {menu.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center opacity-50">
          <Utensils className="w-16 h-16 text-slate-800 mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-600">
            This restaurant has no dishes yet. Hit "Add Dish" to get started!
          </p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" : "space-y-4"}>
          {menu.map((item) =>
            viewMode === "grid" ? (
              <Card key={item.id} className="group flex flex-col bg-[#020617] border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden rounded-[32px] shadow-2xl relative">
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400"}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
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
                <div className="p-7">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-white font-[family-name:var(--font-display)] uppercase tracking-tight group-hover:text-orange-500 transition-colors leading-tight">{item.name}</h3>
                    <span className="text-base font-black text-orange-500">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] mb-5">
                    {(item as any).category?.name || "General"}
                  </p>
                  <Link href={`/meals/${item.id}`} className="block">
                    <Button variant="outline" className="w-full h-10 rounded-xl border-white/5 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div key={item.id} className="p-4 rounded-3xl bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] transition-all flex items-center gap-6 group">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shrink-0">
                  <img src={item.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=100"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-white font-[family-name:var(--font-display)] uppercase tracking-tight truncate">{item.name}</h4>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">{(item as any).category?.name || "General"} • ${item.price.toFixed(2)}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/5"><Edit className="w-4 h-4" /></Button>
                  <button
                    onClick={() => handleDeleteMeal(item.id)}
                    className="w-10 h-10 rounded-xl bg-white/5 text-slate-600 hover:bg-rose-600/[0.05] hover:text-rose-500 transition-all flex items-center justify-center border border-white/5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link href={`/meals/${item.id}`}>
                    <Button variant="outline" className="w-10 h-10 p-0 rounded-xl border-white/5 group-hover:bg-orange-600 group-hover:text-white transition-all"><Eye className="w-4 h-4" /></Button>
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* Create Profile Modal */}
      {isCreatingProfile && (
        <CreateProfileModal
          onClose={() => setIsCreatingProfile(false)}
          onCreated={refreshMenu}
        />
      )}
    </div>
  );
}
