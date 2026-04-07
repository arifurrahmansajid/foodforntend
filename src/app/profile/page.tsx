"use client";

import { useAuth } from "@/hooks/use-store";
import { Button, Card, Input } from "@/components/ui";
import { User, Mail, Shield, ShieldCheck, UserCircle, MapPin, Phone, LogOut, ChevronRight, History } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto py-12">
      <div className="flex flex-col sm:flex-row items-center gap-8 py-8 px-8 bg-white/[0.02] border border-white/5 rounded-[44px] backdrop-blur-2xl">
        <div className="relative group">
            <div className="absolute inset-0 bg-orange-600/20 blur-[40px] rounded-full group-hover:bg-orange-600/30 transition-all" />
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-orange-600 to-amber-500 p-1 shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                <div className="w-full h-full rounded-[38px] bg-slate-900 flex items-center justify-center overflow-hidden">
                    <UserCircle className="w-16 h-16 text-orange-500" />
                </div>
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-white text-[#020617] flex items-center justify-center shadow-2xl border-4 border-[#020617] group-hover:scale-110 transition-transform z-20">
                <Shield className="w-5 h-5 fill-current" />
            </button>
        </div>
        
        <div className="text-center sm:text-left flex-1 space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <h1 className="text-4xl font-black font-[family-name:var(--font-display)] text-white tracking-tight">{user.name}</h1>
            <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">{user.role}</span>
          </div>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] opacity-80">{user.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 text-[10px] font-black uppercase tracking-widest text-green-500 transition-all hover:opacity-100 opacity-70 cursor-default">
             <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
          </div>
        </div>

        <div className="flex gap-4">
            <Link href="/orders">
                <Button variant="outline" className="h-14 px-6 rounded-2xl border-white/10 group">
                    <History className="w-5 h-5 mr-2 group-hover:text-orange-500 transition-colors" /> History
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-24 items-start">
        <div className="md:col-span-2 space-y-8">
            <Card className="p-10 bg-slate-950/40 border-white/5 rounded-[44px] shadow-2xl space-y-10 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-4">
                    <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3">
                        <User className="w-6 h-6 text-orange-500" /> Member Information
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 opacity-60">Update Profile Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1 group-focus-within/field:text-orange-500 transition-colors">Full Display Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within/field:text-orange-500 transition-colors" />
                            <Input defaultValue={user.name} className="pl-12 h-14 rounded-2xl bg-white/[0.02] border-white/5 hover:border-white/10 transition-all font-semibold text-slate-100" />
                        </div>
                    </div>
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1 group-focus-within/field:text-orange-500 transition-colors">Registered Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within/field:text-orange-500 transition-colors" />
                            <Input disabled defaultValue={user.email} className="pl-12 h-14 rounded-2xl bg-white/[0.01] border-white/5 font-semibold text-slate-400 opacity-50 cursor-not-allowed" />
                        </div>
                    </div>
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1 group-focus-within/field:text-orange-500 transition-colors">Primary Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within/field:text-orange-500 transition-colors" />
                            <Input defaultValue="+1 (555) 000-0000" className="pl-12 h-14 rounded-2xl bg-white/[0.02] border-white/5 hover:border-white/10 transition-all font-semibold text-slate-100" />
                        </div>
                    </div>
                    <div className="space-y-2 group/field">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1 group-focus-within/field:text-orange-500 transition-colors">Preferred Address</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within/field:text-orange-500 transition-colors" />
                            <Input defaultValue="123 Gourmet Ave, New York" className="pl-12 h-14 rounded-2xl bg-white/[0.02] border-white/5 hover:border-white/10 transition-all font-semibold text-slate-100" />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-4 text-center sm:text-left">
                    <Button className="h-16 px-12 rounded-2xl text-lg font-black uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(234,88,12,0.4)] group overflow-hidden">
                        Save Changes <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="p-8 bg-slate-950/40 border-white/5 rounded-[44px] space-y-8 overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-rose-600/5 blur-[40px] rounded-full pointer-events-none" />
                <h3 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-2">
                    Account Safety
                </h3>
                
                <div className="space-y-3">
                    <button className="w-full h-14 px-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                        <span className="text-sm font-bold text-slate-300">Change Security Key</span>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                    </button>
                    <button className="w-full h-14 px-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                        <span className="text-sm font-bold text-slate-300">Privacy Preferences</span>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                    </button>
                    <button className="w-full h-14 px-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                        <span className="text-sm font-bold text-slate-300">Notification Settings</span>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                    </button>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                    <button 
                        onClick={() => {logout(); toast.success("Signed out successfully")}}
                        className="w-full h-16 rounded-2xl bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm shadow-2xl active:scale-95"
                    >
                        <LogOut className="w-5 h-5" /> End Current Session
                    </button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
