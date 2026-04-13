"use client";

import { useEffect, useState, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import { 
  Search, 
  Filter, 
  Star, 
  ShoppingCart, 
  Loader2, 
  XCircle, 
  Clock, 
  Flame, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-store";
import toast from "react-hot-toast";
import { mealsApi, categoriesApi } from "@/lib/api";
import { Meal, Category } from "@/types";

const DIETARY_DEFAULTS = ["Healthy", "Vegetarian", "Vegan", "Gluten-Free", "High Protein"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snack", "Beverage"];
const SPICE_LEVELS = ["All", "Low", "Medium", "High"];
const SORT_BY = ["Newest First", "Price", "Name", "Calories"];
const SORT_ORDER = ["Descending", "Ascending"];

export default function MealsPage() {
  // --- States ---
  const [meals, setMeals] = useState<Meal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();

  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedMealType, setSelectedMealType] = useState("All");
  const [selectedSpiceLevel, setSelectedSpiceLevel] = useState("All");
  const [priceRange, setPriceRange] = useState(1000);
  const [sortBy, setSortBy] = useState("Newest First");
  const [sortOrder, setSortOrder] = useState("Descending");
  
  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [mealsRes, catsRes] = await Promise.all([
            mealsApi.getAll(),
            categoriesApi.getAll()
        ]);

        const baseMeals = mealsRes.data.data.meals || [];
        const baseCats = catsRes.data.data.categories || [];
        
        setCategories(baseCats);
        
        // Enhance meals with data from backend categories and some smart defaults
        const enhancedMeals = baseMeals.map((meal: any) => ({
          ...meal,
          cuisine: meal.category?.name || "International",
          dietary: meal.dietary || (meal.category?.name === "Healthy" ? ["Healthy"] : []),
          mealType: meal.mealType || (meal.price > 10 ? "Dinner" : "Lunch"),
          spiceLevel: meal.spiceLevel || "Medium",
          calories: meal.calories || Math.floor(Math.random() * 400) + 100,
          prepTime: meal.prepTime || 25,
          badge: meal.category?.name ? meal.category.name[0].toUpperCase() : "M"
        }));
        
        setMeals(enhancedMeals);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
        toast.error("Connecting to kitchen...");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const cuisines = useMemo(() => ["All", ...categories.map(c => c.name)], [categories]);

  // --- Filtering Logic ---
  const filteredMeals = useMemo(() => {
    let result = [...meals];

    // Search
    if (searchTerm) {
      result = result.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (m.description && m.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Cuisine
    if (selectedCuisine !== "All") {
      result = result.filter(m => m.cuisine === selectedCuisine);
    }

    // Dietary (OR logic - if any selected dietary matches)
    if (selectedDietary.length > 0) {
      result = result.filter(m => 
        m.dietary && m.dietary.some(d => selectedDietary.includes(d))
      );
    }

    // Meal Type
    if (selectedMealType !== "All") {
      result = result.filter(m => m.mealType === selectedMealType);
    }

    // Spice Level
    if (selectedSpiceLevel !== "All") {
      result = result.filter(m => m.spiceLevel === selectedSpiceLevel);
    }

    // Price Range
    result = result.filter(m => m.price <= priceRange);

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "Price") {
        comparison = a.price - b.price;
      } else if (sortBy === "Name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "Calories") {
        comparison = (a.calories || 0) - (b.calories || 0);
      } else {
        // Newest First (mocked by id for now)
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === "Ascending" ? comparison : -comparison;
    });

    return result;
  }, [meals, searchTerm, selectedCuisine, selectedDietary, selectedMealType, selectedSpiceLevel, priceRange, sortBy, sortOrder]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredMeals.length / itemsPerPage);
  const currentMeals = filteredMeals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

  const toggleDietary = (diet: string) => {
    setSelectedDietary(prev => 
      prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet]
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 pb-20">
      {/* Header Section */}
      <div className="pt-16 pb-12 text-center">
        <h1 className="text-5xl font-black text-orange-500 mb-4 tracking-tight drop-shadow-lg">
          Explore Our Delicious Meals
        </h1>
        <p className="text-slate-500 text-lg">
          Discover a wide variety of delicious meals from our trusted providers
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row gap-8">
        {/* --- Sidebar Sidebar --- */}
        <div className="w-full lg:w-[320px] shrink-0">
          <div className="bg-[#0f172a]/50 border border-white/5 rounded-[32px] p-8 sticky top-24">
            <div className="flex items-center gap-3 mb-8 text-orange-500">
              <Filter className="w-5 h-5 fill-current" />
              <h2 className="text-xl font-bold uppercase tracking-wider">Filters</h2>
            </div>

            {/* Cuisine */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4 flex items-center justify-between">Cuisine</h3>
              <div className="space-y-3">
                {cuisines.map(cuisine => (
                  <label key={cuisine} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      onClick={() => setSelectedCuisine(cuisine)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedCuisine === cuisine ? 'border-orange-500' : 'border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {selectedCuisine === cuisine && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-in zoom-in-50 duration-200" />}
                    </div>
                    <span className={`text-sm transition-colors ${selectedCuisine === cuisine ? 'text-white font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {cuisine}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4">Dietary</h3>
              <div className="space-y-3">
                {DIETARY_DEFAULTS.map(diet => (
                  <label key={diet} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      onClick={() => toggleDietary(diet)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        selectedDietary.includes(diet) ? 'border-orange-500 bg-orange-500/20' : 'border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {selectedDietary.includes(diet) && <div className="w-2 h-2 bg-orange-500 rounded-sm" />}
                    </div>
                    <span className={`text-sm transition-colors ${selectedDietary.includes(diet) ? 'text-white font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {diet}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Meal Type */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4">Meal Type</h3>
              <div className="space-y-3">
                {MEAL_TYPES.map(type => (
                  <label key={type} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      onClick={() => setSelectedMealType(type)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedMealType === type ? 'border-orange-500' : 'border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {selectedMealType === type && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-in zoom-in-50 duration-200" />}
                    </div>
                    <span className={`text-sm transition-colors ${selectedMealType === type ? 'text-white font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Spice Level */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4">Spice Level</h3>
              <div className="space-y-3">
                {SPICE_LEVELS.map(level => (
                  <label key={level} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      onClick={() => setSelectedSpiceLevel(level)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedSpiceLevel === level ? 'border-orange-500' : 'border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {selectedSpiceLevel === level && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-in zoom-in-50 duration-200" />}
                    </div>
                    <span className={`text-sm transition-colors ${selectedSpiceLevel === level ? 'text-white font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {level}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4">Price Range</h3>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange} 
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 mb-2"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>$0</span>
                <span>${priceRange}</span>
                <span>$1000</span>
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-8">
              <h3 className="text-white font-bold mb-4">Sort By</h3>
              <div className="space-y-3">
                {SORT_BY.map(s => (
                  <label key={s} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      onClick={() => setSortBy(s)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        sortBy === s ? 'border-orange-500' : 'border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {sortBy === s && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-in zoom-in-50 duration-200" />}
                    </div>
                    <span className={`text-sm transition-colors ${sortBy === s ? 'text-white font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="mb-4">
              <h3 className="text-white font-bold mb-4">Sort Order</h3>
              <div className="space-y-3">
                {SORT_ORDER.map(o => (
                  <label key={o} className="flex items-center gap-3 group cursor-pointer">
                    <div 
                      onClick={() => setSortOrder(o)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        sortOrder === o ? 'border-orange-500' : 'border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {sortOrder === o && <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-in zoom-in-50 duration-200" />}
                    </div>
                    <span className={`text-sm transition-colors ${sortOrder === o ? 'text-white font-medium' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {o}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Main Content --- */}
        <div className="flex-1 space-y-8">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
            <Input 
              placeholder="Search meals by name or description..." 
              className="pl-16 h-16 bg-[#0f172a]/50 border-white/5 rounded-2xl text-lg backdrop-blur-xl focus:bg-[#0f172a]/80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Results Info */}
          <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-2 uppercase tracking-widest">
            <p>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMeals.length)} of {filteredMeals.length} results</p>
          </div>

          {/* Meals Grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Curating the best dishes...</p>
            </div>
          ) : currentMeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentMeals.map((meal: any) => (
                <div key={meal.id} className="group relative flex flex-col bg-[#0f172a]/40 border border-white/5 rounded-[40px] overflow-hidden hover:border-orange-500/30 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(234,88,12,0.15)]">
                  {/* Image Area */}
                  <div className="relative h-72 overflow-hidden bg-slate-900 flex items-center justify-center">
                    {meal.image ? (
                        <img 
                            src={meal.image} 
                            alt={meal.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="text-slate-800 scale-[3] opacity-20 group-hover:scale-[3.5] transition-transform duration-700">
                             <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor"><path d="M15,10 V25 M25,10 V25 M20,10 V35"/></svg>
                        </div>
                    )}
                    
                    {/* Badge Letter */}
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 text-xs font-black backdrop-blur-md">
                        {meal.badge || meal.name[0]}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-1">{meal.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-1 font-medium italic">{meal.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {meal.dietary && meal.dietary.slice(0, 2).map((d: string) => (
                            <span key={d} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                {d}
                            </span>
                        ))}
                    </div>

                    {/* Meta Row */}
                    <div className="flex items-center gap-4 mb-8 text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-1.5 grayscale opacity-60">
                            <Clock className="w-3.5 h-3.5" /> <span>{meal.prepTime} cal</span>
                        </div>
                        <div className="flex items-center gap-1.5 grayscale opacity-60">
                            <Flame className="w-3.5 h-3.5" /> <span>{meal.calories} cal</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-white">{meal.spiceLevel}</span>
                            <Zap className={`w-3.5 h-3.5 ${meal.spiceLevel === 'High' ? 'text-orange-500 fill-orange-500' : 'text-slate-600'}`} />
                        </div>
                    </div>

                    {/* Price & Cart */}
                    <div className="mt-auto flex items-center justify-between gap-4 pb-6">
                        <div className="shrink-0 flex flex-col">
                            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-1 leading-none">Price</span>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-orange-500 font-black text-lg leading-none">$</span>
                                <span className="text-white font-black text-2xl leading-none">{meal.price}</span>
                            </div>
                        </div>
                        <Button 
                            onClick={() => handleAddToCart(meal)}
                            className="bg-orange-600 hover:bg-orange-500 text-white h-11 px-4 rounded-xl shadow-lg shadow-orange-600/10 transition-all active:scale-95 group/cart"
                        >
                            <div className="flex items-center gap-2">
                                <ShoppingCart className="w-4 h-4 fill-current" />
                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Add to Cart</span>
                            </div>
                        </Button>
                    </div>

                    {/* View Details */}
                    <Link href={`/meals/${meal.id}`} className="w-full">
                        <Button variant="outline" className="w-full border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-500 h-9 rounded-xl group/details">
                            <div className="flex items-center gap-2 transition-all opacity-40 group-hover:opacity-100">
                                <Search className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-widest">View Details</span>
                            </div>
                        </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-white/[0.01] border border-dashed border-white/10 rounded-[40px]">
              <XCircle className="w-16 h-16 text-slate-800" />
              <div>
                  <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">No meals matched your filters</h2>
                  <p className="text-slate-500 text-sm font-medium">Try resetting some filters or search for something else.</p>
              </div>
              <Button 
                onClick={() => {
                    setSearchTerm("");
                    setSelectedCuisine("All");
                    setSelectedDietary([]);
                    setSelectedMealType("All");
                    setSelectedSpiceLevel("All");
                    setPriceRange(1000);
                }} 
                variant="outline" 
                className="border-white/10 rounded-xl px-8"
              >
                  Clear all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12 pb-10">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-10 h-10 p-0 border-white/5 bg-white/5 rounded-lg disabled:opacity-20"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                >
                    <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-10 h-10 p-0 border-white/5 bg-white/5 rounded-lg disabled:opacity-20"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="bg-white/5 border border-white/5 px-4 h-10 rounded-lg flex items-center gap-2">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Page</span>
                    <span className="text-xs font-black text-orange-500">{currentPage}</span>
                    <span className="text-xs font-black text-white uppercase tracking-widest">of</span>
                    <span className="text-xs font-black text-white">{totalPages}</span>
                </div>

                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-10 h-10 p-0 border-white/5 bg-white/5 rounded-lg disabled:opacity-20"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-10 h-10 p-0 border-white/5 bg-white/5 rounded-lg disabled:opacity-20"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    <ChevronsRight className="w-4 h-4" />
                </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
