"use client";

import Link from "next/link";
import { useAuth, useCart } from "@/hooks/use-store";
import { ShoppingBag, User, LogOut, ChevronDown, LayoutGrid, Utensils } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-3 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform duration-300">
            F
          </div>
          <span className="text-2xl font-black font-[family-name:var(--font-display)] tracking-tighter text-white">FoodHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide text-slate-300">
          <Link href="/meals" className="hover:text-orange-400 transition-colors uppercase">Meals</Link>
          <Link href="/providers" className="hover:text-orange-400 transition-colors uppercase">Providers</Link>
          {user?.role === 'PROVIDER' && (
            <>
              <Link href="/provider/dashboard" className="hover:text-orange-400 transition-colors uppercase">Dashboard</Link>
              <Link href="/provider/menu" className="hover:text-orange-400 transition-colors uppercase">My Menu</Link>
            </>
          )}
          {user?.role === 'ADMIN' && <Link href="/admin" className="hover:text-orange-400 transition-colors uppercase">Admin</Link>}
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/cart" className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
            <ShoppingBag className="w-6 h-6 text-slate-300 group-hover:text-orange-500 transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-[#020617] shadow-lg animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="px-6">Register</Button>
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 max-sm:p-1 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 max-sm:w-7 max-sm:h-7 rounded-xl bg-orange-600/20 flex items-center justify-center border border-orange-500/20 overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  ) : (
                    <User className="w-5 h-5 max-sm:w-4 max-sm:h-4 text-orange-400" />
                  )}
                </div>
                <span className="hidden sm:inline font-bold text-sm text-slate-200">{user.name.split(' ')[0]}</span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isProfileOpen ? "rotate-180" : "")} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden py-2 animate-in slide-in-from-top-4 duration-200 z-[70]">
                  <div className="px-4 py-3 border-b border-white/5 mb-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase">Signed in as</p>
                    <p className="text-sm font-bold text-slate-200 truncate">{user.email}</p>
                  </div>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium text-slate-300">
                    <User className="w-4 h-4 text-slate-500" /> My Profile
                  </Link>
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium text-slate-300">
                    <ShoppingBag className="w-4 h-4 text-slate-500" /> My Orders
                  </Link>
                  {user?.role === 'PROVIDER' && (
                    <>
                      <div className="px-4 py-2 mt-1 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Provider</p>
                      </div>
                      <Link href="/provider/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium text-orange-400">
                        <LayoutGrid className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/provider/menu" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-sm font-medium text-orange-400">
                        <Utensils className="w-4 h-4" /> Manage Menu
                      </Link>
                    </>
                  )}
                  <div className="px-2 mt-2 pt-2 border-t border-white/5">
                    <button 
                      onClick={() => { logout(); setIsProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-rose-600/10 transition-all text-sm font-bold text-rose-500"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
