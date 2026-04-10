"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { 
  Star, MapPin, Clock, ChefHat, ArrowLeft, 
  ShoppingCart, Utensils, Info, ShieldCheck,
  Phone, Mail, Globe, Loader2
} from "lucide-react";
import Link from "next/link";
import { providersApi } from "@/lib/api";
import { Provider, Meal } from "@/types";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/use-store";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  
  const [provider, setProvider] = useState<Provider | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setIsLoading(true);
        const response = await providersApi.getOne(id);
        const data = response.data.data.provider;
        setProvider(data);
        setMeals(data.meals || []);
      } catch (error) {
        console.error("Error fetching provider:", error);
        toast.error("Restaurant details could not be retrieved.");
        router.push("/providers");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProviderData();
  }, [id, router]);

  const handleAddToCart = (meal: Meal) => {
    addItem({
      id: Math.random().toString(),
      mealId: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      image: meal.image
    });
    toast.success(`${meal.name} added to cart!`, {
      style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Preparing Culinary Experience...</p>
      </div>
    );
  }

  if (!provider) return null;

  return (
    <div className="flex flex-col space-y-16 animate-in fade-in duration-700 pb-24">
      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group w-fit"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-wider">Back to Providers</span>
      </button>

      {/* Hero Header */}
      <section className="relative w-full rounded-[60px] overflow-hidden bg-[#020617] border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
        <img 
          src={provider.image || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200"} 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-40"
          alt={provider.name}
        />
        
        <div className="relative z-20 p-10 md:p-20 flex flex-col md:flex-row items-center gap-12">
            <div className="w-48 h-48 rounded-[40px] overflow-hidden border-4 border-orange-500 shadow-2xl relative shrink-0">
                <img src={provider.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 rounded-full bg-orange-600/20 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/30">Certified Elite</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-white/10">Active Menu</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black font-[family-name:var(--font-display)] text-white tracking-tight uppercase leading-none">{provider.name}</h1>
                
                <p className="text-xl text-slate-400 max-w-2xl font-medium italic underline decoration-orange-500/30 underline-offset-8">
                  "{provider.description || "Crafting exceptional culinary moments with passion and precision."}"
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-lg">
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500">Rating</p>
                            <p className="text-lg font-bold text-white leading-none">{provider.rating || 'New'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500">Delivery</p>
                            <p className="text-lg font-bold text-white leading-none">25-35 min</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-500">Service</p>
                            <p className="text-lg font-bold text-white leading-none">Verified</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-8">
              <Card className="p-8 bg-white/[0.02] border-white/5 rounded-[40px] space-y-8">
                  <h3 className="text-lg font-black font-[family-name:var(--font-display)] text-white uppercase tracking-widest border-b border-white/5 pb-4">Restaurant Info</h3>
                  
                  <div className="space-y-6">
                      <div className="flex gap-4 group">
                          <MapPin className="w-5 h-5 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                              <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Location</p>
                              <p className="text-sm font-bold text-slate-300">{provider.address || "Downtown Gastronomy District, Dhaka"}</p>
                          </div>
                      </div>
                      
                      <div className="flex gap-4 group">
                          <Phone className="w-5 h-5 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                              <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Phone</p>
                              <p className="text-sm font-bold text-slate-300">{provider.phone || "+880 17..."}</p>
                          </div>
                      </div>

                      <div className="flex gap-4 group">
                          <Mail className="w-5 h-5 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                              <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Email</p>
                              <p className="text-sm font-bold text-slate-300">{provider.contactEmail || "chef@dine.foodhub.com"}</p>
                          </div>
                      </div>

                      <div className="flex gap-4 group">
                          <Globe className="w-5 h-5 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                              <p className="text-[10px] font-black uppercase text-slate-600 mb-1">Website</p>
                              <p className="text-sm font-bold text-slate-300 underline decoration-orange-500/20">{provider.website || "www.elitechef.com"}</p>
                          </div>
                      </div>
                  </div>

                  <div className="pt-4">
                      <div className="bg-orange-600/10 border border-orange-500/20 rounded-2xl p-4 flex items-center gap-3">
                          <Info className="w-5 h-5 text-orange-500" />
                          <p className="text-[10px] font-bold text-orange-200">Pre-order available for dinner service starting from 6:00 PM.</p>
                      </div>
                  </div>
              </Card>

              <Card className="p-8 bg-[#020617] border-white/5 rounded-[40px] text-center space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                  <ChefHat className="w-12 h-12 text-orange-500 mx-auto group-hover:rotate-12 transition-transform" />
                  <h3 className="text-xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight">Master Chef Note</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">"Our kitchen focuses on the purest ingredients and traditional techniques refined over decades."</p>
              </Card>
          </div>

          {/* Menu Section */}
          <div className="lg:col-span-3 space-y-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-orange-500">
                          <Utensils className="w-6 h-6" />
                      </div>
                      <h2 className="text-3xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight">Full Experience Menu</h2>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-4 py-2 rounded-full border border-white/10">{meals.length} DISHES TOTAL</span>
              </div>

              {meals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {meals.map((meal) => (
                        <Card key={meal.id} className="group flex bg-[#020617] border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden rounded-[36px] shadow-xl p-4 gap-6">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 relative group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                                <img src={meal.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400"} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20" />
                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg glass-card border-white/10 text-white font-black text-[8px] flex items-center gap-1 shadow-2xl backdrop-blur-xl">
                                  <Star className="w-2 h-2 text-orange-500 fill-current" /> {(meal as any).avgRating > 0 ? (meal as any).avgRating : 'New'}
                                </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors line-clamp-1">{meal.name}</h4>
                                        <span className="text-sm font-black text-orange-500 font-[family-name:var(--font-display)]">${meal.price.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4 group-hover:text-slate-300 transition-colors">
                                      {meal.description || "A signature creation prepared by our culinary team."}
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Button 
                                      onClick={() => handleAddToCart(meal)}
                                      size="sm" 
                                      className="flex-1 h-10 rounded-xl bg-orange-600 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" /> Add To Order
                                    </Button>
                                    <Link href={`/meals/${meal.id}`} className="shrink-0">
                                        <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl border-white/10 text-slate-500 hover:text-white transition-all">
                                            <ArrowLeft className="w-4 h-4 rotate-180" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[60px] opacity-60">
                    <Utensils className="w-16 h-16 text-slate-800 mb-6" />
                    <h3 className="text-xl font-bold text-slate-500 uppercase tracking-widest">No Dishes Listed Yet</h3>
                    <p className="text-sm text-slate-600 mt-2">This culinary artist is currently updating their seasonal menu.</p>
                </div>
              )}
          </div>
      </div>
    </div>
  );
}
