"use client";

import { useEffect, useState } from "react";
import { Button, Input, Card } from "@/components/ui";
import { Search, SlidersHorizontal, Star, ShoppingCart, Info, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-store";
import toast from "react-hot-toast";
import { mealsApi } from "@/lib/api";
import { Meal } from "@/types";

export default function MealsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoading(true);
        const response = await mealsApi.getAll();
        setMeals(response.data.data.meals || []);
      } catch (error) {
        console.error("Failed to fetch meals:", error);
        toast.error("Using featured collections while syncing...");
        
        // Fallback for demo
        setMeals([
          { id: '1', name: "Truffle steak", price: 45.0, provider: { name: "Gourmet Kitchen" } as any, category: { name: "steaks" } as any, image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=400" },
          { id: '2', name: "Classic Burger", price: 18.0, provider: { name: "Smash Shack" } as any, category: { name: "burgers" } as any, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400" },
          { id: '3', name: "Salmon Sushi", price: 24.0, provider: { name: "Zen Sushi" } as any, category: { name: "sushi" } as any, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400" },
        ] as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const filteredMeals = meals.filter(meal => 
    (category === "all" || (meal.category && meal.category.name.toLowerCase() === category.toLowerCase())) &&
    (meal.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddToCart = (meal: any) => {
    addItem({
      id: Math.random().toString(),
      mealId: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: 1,
      image: meal.image
    });
    toast.success(`${meal.name} added to cart!`, {
        style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-[32px] backdrop-blur-xl">
        <div className="flex-1 w-full md:max-w-md relative group">
          <Search className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
          <Input 
            placeholder="Search for cravings..." 
            className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          <SlidersHorizontal className="hidden md:block w-5 h-5 text-slate-500 mr-2" />
          {['all', 'burgers', 'pizza', 'sushi', 'steaks', 'pasta'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                category === cat 
                  ? "bg-orange-600 border-orange-600 text-white shadow-lg" 
                  : "bg-white/[0.03] border-white/5 text-slate-400 hover:border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-8">
            <h1 className="text-3xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight">
                {category === 'all' ? 'All Mouth-Watering Dishes' : `Delicious ${category}`}
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{filteredMeals.length} RESULTS FOUND</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Syncing with Elite Kitchens...</p>
          </div>
        ) : filteredMeals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredMeals.map((meal) => (
              <Card key={meal.id} className="group flex flex-col bg-[#020617] border-white/5 hover:border-orange-500/30 transition-all duration-300 shadow-2xl overflow-hidden rounded-[32px]">
                <div className="relative h-56 overflow-hidden">
                    <img 
                      src={meal.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400"} 
                      alt={meal.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full glass-card border-white/10 text-white font-black text-[10px] flex items-center gap-1 shadow-2xl backdrop-blur-xl">
                      <Star className="w-3 h-3 text-orange-500 fill-current" /> {(meal as any).avgRating > 0 ? (meal as any).avgRating : 'New'}
                    </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight group-hover:text-orange-500 transition-colors uppercase leading-tight">{meal.name}</h3>
                        <span className="text-lg font-black text-orange-500">${meal.price.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-6">{(meal as any).provider?.name || "Verified Chef"}</p>
                    
                    <div className="mt-auto flex items-center gap-4">
                        <Link href={`/meals/${meal.id}`} className="flex-1">
                            <Button variant="outline" className="w-full h-12 rounded-xl group/info border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                                <Info className="w-4 h-4 mr-2 group-hover/info:text-orange-500" /> <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
                            </Button>
                        </Link>
                        <Button 
                            onClick={() => handleAddToCart(meal)}
                            className="w-12 h-12 rounded-xl p-0 flex items-center justify-center bg-orange-600 hover:bg-orange-500 shadow-[0_10px_20px_-5px_rgba(234,88,12,0.3)] transition-all shrink-0"
                        >
                            <ShoppingCart className="w-4 h-4 text-white" />
                        </Button>
                    </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[40px]">
            <XCircle className="w-16 h-16 text-slate-800" />
            <div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No cravings found</h2>
                <p className="text-slate-500 text-sm font-medium">Try adjusting your filters or searching for something else.</p>
            </div>
            <Button onClick={() => {setSearchTerm(""); setCategory("all")}} variant="outline" className="border-white/10 rounded-xl px-8">Clear filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
