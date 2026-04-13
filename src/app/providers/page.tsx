"use client";

import { useEffect, useState } from "react";
import { Button, Card, Input } from "@/components/ui";
import { Search, Star, MapPin, ChefHat, Clock, ArrowRight, ShieldCheck, UtensilsCrossed, Loader2 } from "lucide-react";
import Link from "next/link";
import { providersApi } from "@/lib/api";
import { Provider } from "@/types";
import toast from "react-hot-toast";

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const response = await providersApi.getAll();
        // Assuming your backend returns { status: 'success', data: { providers: [...] } }
        setProviders(response.data.data.providers || []);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
        toast.error("Could not load providers. Showing featured selections instead.");
        
        // Fallback to MOCK if backend fails or is empty during dev
        setProviders([
          { 
            id: '1', 
            name: "Gourmet Grill", 
            description: "Premium cuts and seasonal vegetables prepared by master chefs.", 
            rating: 4.9, 
            image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
          },
          { 
            id: '2', 
            name: "Sushi Master", 
            description: "Authentic Edo-style sushi with fish flown in daily from Tokyo.", 
            rating: 4.8, 
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
          },
          { 
            id: '3', 
            name: "Burger Smith", 
            description: "Custom wagyu blends and artisanal buns. Pure burger excellence.", 
            rating: 4.7, 
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400",
          }
        ] as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(provider => {
    const isExcluded = ["SYSTEM ADMIN", "SELLER"].includes(provider.name.toUpperCase());
    if (isExcluded) return false;

    return provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (provider.description && provider.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-8 bg-white/[0.02] border border-white/5 rounded-[44px] backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="flex-1 space-y-2 text-center md:text-left relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase">Elite Providers</h1>
          <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] opacity-80">Discover certified top-tier culinary experts</p>
        </div>

        <div className="flex-1 w-full md:max-w-md relative group z-10">
          <Search className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
          <Input 
            placeholder="Search by name or description..." 
            className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl focus:border-orange-500 transition-all font-semibold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Syncing with Elite Kitchens...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <Card key={provider.id} className="group relative bg-[#020617] border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden rounded-[44px] shadow-2xl hover:shadow-orange-900/10">
                  <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-4 h-full">
                      <div className="w-full sm:w-56 h-56 rounded-[36px] overflow-hidden relative shadow-2xl">
                          <img 
                              src={provider.image || "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400"} 
                              alt={provider.name} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full glass-card border-white/10 text-white font-black text-[10px] flex items-center gap-1 shadow-2xl backdrop-blur-xl">
                              <Star className="w-3.5 h-3.5 text-orange-500 fill-current" /> {provider.rating || 'New'}
                          </div>
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-2 pr-4">
                          <div>
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-0.5 rounded-lg bg-orange-600/10 text-orange-500 text-[10px] font-black uppercase tracking-widest border border-orange-500/20">Certified</span>
                                  <span className="px-2 py-0.5 rounded-lg bg-white/[0.02] text-slate-500 text-[10px] font-black uppercase tracking-widest border border-white/5">Provider</span>
                              </div>
                              <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight mb-3 uppercase group-hover:text-orange-500 transition-colors">{provider.name}</h2>
                              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 group-hover:text-slate-300 transition-colors line-clamp-2">{provider.description || "Premium dining experience"}</p>
                              
                              <div className="flex flex-wrap gap-4 mb-4">
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                                      <MapPin className="w-4 h-4 text-orange-600" /> Downtown District
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                                      <Clock className="w-4 h-4 text-orange-600" /> 25-35 min
                                  </div>
                              </div>
                          </div>

                          <Link href={`/providers/${provider.id}`} className="block">
                              <Button className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 group/btn relative overflow-hidden transition-all shadow-[0_15px_30px_-10px_rgba(234,88,12,0.4)]">
                                  <span className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                      <UtensilsCrossed className="w-4 h-4" /> View Full Menu
                                  </span>
                                  <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                              </Button>
                          </Link>
                      </div>
                  </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[60px]">
              <ChefHat className="w-20 h-20 text-slate-800 mb-8" />
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-widest font-[family-name:var(--font-display)]">No Providers Found</h2>
              <p className="text-slate-500 font-medium max-w-[350px]">We couldn't find any culinary experts matching your criteria. Try adjusting your search.</p>
              <Button onClick={() => setSearchTerm("")} variant="outline" className="mt-10 rounded-2xl border-white/10 px-10">Clear Filter</Button>
            </div>
          )}
        </div>
      )}

      {/* Trust Banner */}
      <Card className="p-10 bg-orange-600 border border-orange-500 rounded-[50px] shadow-[0_30px_70px_-20px_rgba(234,88,12,0.6)] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-3 text-center md:text-left">
              <h3 className="text-3xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight leading-tight">Partner With Elite Experts</h3>
              <p className="text-white/80 font-bold uppercase text-xs tracking-widest">Every provider on FoodHub is strictly vetted for quality and safety.</p>
          </div>
          <div className="flex items-center gap-2 px-8 py-4 bg-white/[0.15] backdrop-blur-xl rounded-3xl text-white font-black uppercase text-xs tracking-widest shadow-2xl">
             <ShieldCheck className="w-6 h-6" /> 100% Verified Providers
          </div>
      </Card>
    </div>
  );
}
