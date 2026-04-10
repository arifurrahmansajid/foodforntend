"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button, Card } from "@/components/ui";
import { useAuth, useCart } from "@/hooks/use-store";
import { mealsApi, reviewsApi } from "@/lib/api";
import {
  ShoppingCart, Star, Clock, MapPin, ChevronLeft,
  Plus, Minus, Utensils, Store, TrendingUp, Shield,
  Heart, Share2, Loader2, Tag, Users,
} from "lucide-react";

interface MealDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isActive: boolean;
  categoryId: string | null;
  category?: { id: string; name: string };
  providerId: string;
  provider?: {
    id: string;
    name: string;
    description: string;
    image: string;
    rating: number;
  };
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
    createdAt: string;
  }[];
  createdAt: string;
}

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, items } = useCart();

  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setIsLoading(true);
        const res = await mealsApi.getOne(id);
        setMeal(res.data.data.meal);
      } catch (err) {
        toast.error("Meal not found.");
        router.push("/meals");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchMeal();
  }, [id]);

  const handleAddToCart = () => {
    if (!meal) return;
    if (!user) {
      toast.error("Please log in to add items to cart.");
      router.push("/login");
      return;
    }
    setIsAdding(true);
    addItem({
      id: meal.id,
      mealId: meal.id,
      name: meal.name,
      price: meal.price,
      quantity,
      image: meal.image,
    });
    toast.success(`${quantity}× ${meal.name} added to cart!`, {
      style: { background: "#0f172a", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
      icon: "🛒",
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  const handlePostReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please login to post a review.");
    if (user.role !== 'CUSTOMER') return toast.error("Only customers can post reviews.");

    try {
      setIsReviewing(true);
      await reviewsApi.create(id, { rating, comment });
      toast.success("Review posted successfully!");
      setComment("");
      setRating(5);
      // Refresh meal data to show new review
      const res = await mealsApi.getOne(id);
      setMeal(res.data.data.meal);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post review.");
    } finally {
      setIsReviewing(false);
    }
  };

  const avgRating =
    meal?.reviews && meal.reviews.length > 0
      ? (meal.reviews.reduce((s, r) => s + r.rating, 0) / meal.reviews.length).toFixed(1)
      : null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <Loader2 className="w-14 h-14 text-orange-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-500">Loading dish details...</p>
      </div>
    );
  }

  if (!meal) return null;

  const cartItem = items.find((i) => i.mealId === meal.id);
  const totalInCart = cartItem?.quantity || 0;

  return (
    <div className="animate-in fade-in duration-500 space-y-16 pb-16">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm font-bold"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Menu
      </button>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-[48px] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.7)] relative group">
            <img
              src={meal.image || "https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=800"}
              alt={meal.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Badges over image */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {meal.isActive && (
                <span className="px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-xl">
                  Available Now
                </span>
              )}
              {meal.category && (
                <span className="px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[10px] font-black uppercase tracking-widest backdrop-blur-xl flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> {meal.category.name}
                </span>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : "text-white"}`}
              />
            </button>

            {/* Rating on image */}
            {avgRating && (
              <div className="absolute bottom-6 left-6 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-black text-white text-sm">{avgRating}</span>
                <span className="text-slate-400 text-xs">({meal.reviews?.length} reviews)</span>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8 lg:pt-4">
          {/* Provider chip */}
          {meal.provider && (
            <Link href={`/providers/${meal.provider.id}`} className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                {meal.provider.image ? (
                  <img src={meal.provider.image} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="w-4 h-4 text-orange-500" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">By</p>
                <p className="text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors">{meal.provider.name}</p>
              </div>
            </Link>
          )}

          {/* Title & Price */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-black font-[family-name:var(--font-display)] text-white tracking-tight uppercase leading-none mb-4">
              {meal.name}
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-4xl font-black text-orange-500">${meal.price.toFixed(2)}</span>
              {avgRating && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-amber-400 font-black text-sm">{avgRating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {meal.description && (
            <p className="text-slate-300 leading-relaxed text-base font-medium">
              {meal.description}
            </p>
          )}

          {/* Info Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/5 text-slate-400 text-xs font-bold">
              <Clock className="w-4 h-4 text-orange-500" /> 20–35 min delivery
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/5 text-slate-400 text-xs font-bold">
              <Shield className="w-4 h-4 text-green-500" /> Fresh & Hygienic
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/5 text-slate-400 text-xs font-bold">
              <TrendingUp className="w-4 h-4 text-blue-500" /> Trending
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/5" />

          {/* Quantity + Add to Cart */}
          <div className="space-y-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/5 rounded-2xl p-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-90"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-black text-white text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-500 flex items-center justify-center text-white transition-all active:scale-90 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  Subtotal: <span className="text-white font-black">${(meal.price * quantity).toFixed(2)}</span>
                </div>
              </div>
              {totalInCart > 0 && (
                <p className="text-xs text-orange-400 font-bold mt-2 flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  {totalInCart} already in cart
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                isLoading={isAdding}
                className="flex-1 h-16 rounded-2xl text-base font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_60px_-10px_rgba(234,88,12,0.5)] hover:shadow-[0_25px_60px_-5px_rgba(234,88,12,0.6)] transition-all"
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </Button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied!");
                }}
                className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] transition-all flex items-center justify-center text-slate-400 hover:text-white"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <Link href="/cart">
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl font-black uppercase tracking-widest border-white/5 bg-white/[0.02] hover:bg-orange-600 hover:text-white hover:border-orange-500 transition-all"
              >
                View Cart & Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Provider Card */}
      {meal.provider && (
        <div className="space-y-6">
          <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3">
            <Store className="w-6 h-6 text-orange-500" /> About The Restaurant
          </h2>
          <Card className="p-8 bg-slate-950/40 border-white/5 rounded-[40px] flex flex-col sm:flex-row items-start gap-8 group hover:border-white/10 transition-all">
            <div className="w-24 h-24 rounded-[28px] overflow-hidden bg-slate-900 border border-white/10 shrink-0 shadow-2xl">
              {meal.provider.image ? (
                <img src={meal.provider.image} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Utensils className="w-10 h-10 text-orange-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h3 className="text-2xl font-black font-[family-name:var(--font-display)] text-white uppercase tracking-tight">
                    {meal.provider.name}
                  </h3>
                  {meal.provider.rating > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(meal.provider!.rating) ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                      ))}
                      <span className="text-slate-400 text-xs font-bold ml-1">{meal.provider.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <Link href={`/providers/${meal.provider.id}`}>
                  <Button variant="outline" className="h-10 px-5 rounded-xl border-white/10 text-xs font-black uppercase tracking-widest hover:border-orange-500/50 hover:text-orange-500 transition-all">
                    View Full Menu
                  </Button>
                </Link>
              </div>
              {meal.provider.description && (
                <p className="text-slate-400 leading-relaxed text-sm font-medium">{meal.provider.description}</p>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Reviews */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Customer Reviews
          </h2>
          {meal.reviews && meal.reviews.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-black text-white">{avgRating}</span>
              <span className="text-slate-400 text-xs">/ 5 ({meal.reviews.length})</span>
            </div>
          )}
        </div>

        {/* Post Review Form */}
        {user?.role === 'CUSTOMER' && (
          <Card className="p-8 bg-slate-950/40 border-white/5 rounded-[40px] mb-8">
            <h3 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase mb-6 flex items-center gap-3">
              <Plus className="w-5 h-5 text-orange-500" /> Write a Review
            </h3>
            <form onSubmit={handlePostReview} className="space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl w-fit">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Rating</span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Comment</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this dish..."
                  className="w-full h-32 rounded-2xl bg-white/[0.03] border border-white/5 p-4 text-slate-100 font-medium placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
                />
              </div>
              <Button
                type="submit"
                isLoading={isReviewing}
                className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]"
              >
                Submit Review
              </Button>
            </form>
          </Card>
        )}

        {meal.reviews && meal.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {meal.reviews.map((review) => (
              <Card key={review.id} className="p-6 bg-white/[0.02] border-white/5 rounded-[28px] hover:border-white/10 transition-all hover:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600/30 to-amber-500/30 border border-orange-500/20 flex items-center justify-center">
                      <span className="text-orange-400 font-black text-sm">{review.user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{review.user.name}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-slate-300 text-sm leading-relaxed font-medium">"{review.comment}"</p>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-white/[0.01] border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center">
            <Users className="w-12 h-12 text-slate-800 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest text-slate-600">No reviews yet</p>
            <p className="text-slate-700 text-sm mt-1">Be the first to try and review this dish!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
