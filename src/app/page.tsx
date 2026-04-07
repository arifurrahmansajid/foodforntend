"use client";

import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { ShoppingCart, Star, Clock, ArrowRight, Utensils, CheckCircle, Truck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { mealsApi } from "@/lib/api";
import { Meal } from "@/types";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/use-store";

export default function Home() {
  const [featuredMeals, setFeaturedMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  const categories = [
    { name: "Italian", icon: "🍝", count: 124 },
    { name: "Japanese", icon: "🍣", count: 86 },
    { name: "Burgers", icon: "🍔", count: 210 },
    { name: "Desserts", icon: "🍰", count: 64 },
    { name: "Healthy", icon: "🥗", count: 156 },
    { name: "Mexican", icon: "🌮", count: 92 },
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const response = await mealsApi.getAll();
        // Take the top 3 as "featured"
        setFeaturedMeals(response.data.data.meals.slice(0, 3) || []);
      } catch (error) {
        console.error("Home Feed Error:", error);
        // Fallback for visual stability
        setFeaturedMeals([
          { id: '1', name: "Truffle Ribeye Steak", price: 42.50, description: "Gourmet Grill", rating: 4.9, image: "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=800&auto=format&fit=crop&q=60" },
          { id: '2', name: "Dragon Special Roll", price: 28.00, description: "Sushi Master", rating: 4.8, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=60" },
          { id: '3', name: "Smoked Wagyu Burger", price: 22.90, description: "Burger Smith", rating: 4.7, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=60" },
        ] as any);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, []);

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
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Premium Food Delivery
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-[family-name:var(--font-display)] leading-[1.05] tracking-tight text-white">
            Deliciousness <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-600 to-amber-500">Delivered Fast</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Order from the best local restaurants and chefs in your area. Savor the flavors of premium meals at your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <Link href="/meals">
              <Button size="lg" className="h-16 px-10 text-lg group rounded-2xl shadow-[0_15px_40px_-10px_rgba(234,88,12,0.4)]">
                Browse Menu 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-white/10 hover:bg-white/5 transition-all">
                Become a Partner
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 justify-center lg:justify-start pt-8 pb-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User avatar" />
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-200">
              <span className="text-orange-500">15k+</span> Happy Customers
            </p>
          </div>
        </div>

        <div className="flex-1 relative w-full aspect-square max-w-[600px] group">
          <div className="absolute inset-0 bg-orange-600/20 blur-[150px] rounded-full group-hover:bg-orange-600/30 transition-colors" />
          <div className="relative z-10 w-full h-full overflow-hidden rounded-[80px] sm:rounded-[120px] border border-white/5 p-4 bg-white/5 backdrop-blur-3xl shadow-2xl transition-transform hover:scale-[1.02] duration-500">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/10 to-transparent" />
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover rounded-[70px] sm:rounded-[110px]"
              alt="Delicious Pizza" 
            />
            
            {/* Float Cards */}
            <div className="absolute top-10 right-[-20px] glass-card p-4 rounded-2xl shadow-2xl animate-bounce duration-[3000ms] border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-400">Est. Delivery</p>
                  <p className="text-sm font-bold text-white leading-tight">25 - 35 min</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-[-20px] glass-card p-4 rounded-2xl shadow-2xl animate-pulse duration-[4000ms] border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-100">User Rating</p>
                  <p className="text-sm font-bold text-white leading-tight">4.9 / 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="w-full py-16 sm:py-24 relative overflow-hidden">
        <h2 className="text-3xl sm:text-5xl font-black font-[family-name:var(--font-display)] mb-2 text-center text-white">Explore Categories</h2>
        <p className="text-slate-400 text-center mb-16 max-w-sm mx-auto font-medium">Find your favorite cravings in a click</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 w-full group">
          {categories.map((cat, i) => (
            <Link key={i} href={`/meals?category=${cat.name.toLowerCase()}`} className="group/item">
              <Card className="p-8 text-center bg-white/[0.03] transition-all duration-300 hover:bg-orange-600 hover:-translate-y-4 hover:shadow-[0_20px_50px_-10px_rgba(234,88,12,0.5)] border-white/5 rounded-[40px] group-hover:opacity-50 group-hover:scale-95 group-hover/item:opacity-100 group-hover/item:scale-105">
                <span className="text-5xl block mb-6 drop-shadow-lg group-hover/item:scale-125 transition-transform">{cat.icon}</span>
                <h3 className="text-lg font-bold text-slate-200 group-hover/item:text-white transition-colors">{cat.name}</h3>
                <p className="text-xs text-slate-500 font-black uppercase mt-1 group-hover/item:text-white/70">{cat.count} Meals</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Meals */}
      <section className="w-full py-24 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-5xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight">Most Popular Dishes</h2>
            <p className="text-slate-400 font-medium mt-2">Curated selection for your sophisticated palate</p>
          </div>
          <Link href="/meals">
            <Button variant="outline" className="px-8 border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px]">View All Dishes</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 animate-pulse">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Curating the day's delicacies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full mb-12">
            {featuredMeals.map((meal) => (
              <Card key={meal.id} className="group relative bg-[#020617] border-white/5 hover:border-orange-500/30 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-orange-900/10 rounded-[32px]">
                <div className="h-64 relative overflow-hidden">
                  <img 
                    src={meal.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=800"} 
                    alt={meal.name} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass-card border-white/10 text-white font-black text-[10px] flex items-center gap-1 shadow-2xl backdrop-blur-xl">
                    <Star className="w-3 h-3 text-orange-500 fill-current" /> 4.9
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60" />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-display)] tracking-tight mb-1 uppercase leading-tight group-hover:text-orange-500 transition-colors">{meal.name}</h3>
                      <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest opacity-80">{(meal as any).provider?.name || "Premium Kitchen"}</p>
                    </div>
                    <span className="text-2xl font-black text-orange-500">${meal.price.toFixed(2)}</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(meal)}
                    className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 group/btn relative overflow-hidden transition-all shadow-[0_10px_30px_-10px_rgba(234,88,12,0.4)]"
                  >
                     <ShoppingCart className="w-5 h-5 relative z-10" />
                     <span className="relative z-10 font-black uppercase tracking-widest text-[10px]">Add to Order</span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="w-full py-24 mb-12 bg-white/[0.01] rounded-[60px] border border-white/5">
        <h2 className="text-3xl sm:text-5xl font-black font-[family-name:var(--font-display)] mb-4 text-center text-white">How It Works</h2>
        <p className="text-slate-400 text-center mb-20 font-medium">As easy as one, two, three</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 px-12 lg:px-24">
          {[
            { icon: Utensils, title: "Pick Your Dish", desc: "Select from hundreds of premium options listed by local experts." },
            { icon: CheckCircle, title: "Place Your Order", desc: "Confirm your selection and pay securely with any major provider." },
            { icon: Truck, title: "Track & Savor", desc: "Watch your meal arrive in real-time and enjoy fresh quality food." }
          ].map((step, i) => (
            <div key={i} className="text-center group flex flex-col items-center">
              <div className="w-24 h-24 rounded-[40px] bg-white/5 border border-white/5 flex items-center justify-center mb-8 relative transition-all group-hover:bg-orange-600 group-hover:scale-110 shadow-lg group-hover:shadow-orange-600/30">
                <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-orange-500 font-black text-lg">0{i+1}</span>
                <step.icon className="w-10 h-10 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-display)] uppercase tracking-tight">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[250px] font-medium opacity-70">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
