"use client";

import { useAuth } from "@/hooks/use-store";
import { Button, Card, Input } from "@/components/ui";
import { 
  User, Mail, Shield, ShieldCheck, UserCircle, 
  MapPin, Phone, LogOut, ChevronRight, History,
  Camera, Settings, Bell, Lock, Globe
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useState } from "react";
import { authApi } from "@/lib/api";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, token, setAuth, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    phone: "+1 (555) 000-0000",
    address: "123 Gourmet Ave, New York"
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.avatar || ""
      }));
      setNewAvatarUrl(user.avatar || "");
    }
  }, [user]);

  if (!user) return null;

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      const res = await authApi.updateProfile({
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar
      });
      
      setAuth(res.data.data.user, token);
      toast.success("Profile updated brilliantly!", {
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-6xl mx-auto py-12 px-4 relative">
      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl" onClick={() => setShowAvatarModal(false)} />
           <Card className="relative w-full max-w-md p-10 bg-slate-900 border-white/10 rounded-[40px] shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Identity Visual</h3>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update your profile portrait via URL</p>
              </div>

              <div className="space-y-4">
                  <div className="w-24 h-24 rounded-3xl bg-slate-800 mx-auto overflow-hidden border-2 border-orange-500/30">
                     {newAvatarUrl ? (
                         <img src={newAvatarUrl} className="w-full h-full object-cover" alt="Preview" />
                     ) : (
                         <div className="w-full h-full flex items-center justify-center">
                            <UserCircle className="w-12 h-12 text-slate-700" />
                         </div>
                     )}
                  </div>
                  <Input 
                    value={newAvatarUrl}
                    onChange={(e) => setNewAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="h-14 bg-slate-950 border-white/5 rounded-2xl text-sm font-medium"
                  />
              </div>

              <div className="flex gap-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowAvatarModal(false)}
                    className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                        setFormData({...formData, avatar: newAvatarUrl});
                        setShowAvatarModal(false);
                    }}
                    className="flex-1 h-14 rounded-2xl bg-orange-600 text-[10px] font-black uppercase tracking-widest"
                  >
                    Set Image
                  </Button>
              </div>
           </Card>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="relative group overflow-hidden rounded-[50px] p-1 bg-gradient-to-tr from-orange-600/20 via-white/5 to-rose-600/20 shadow-2xl">
        <div className="bg-slate-950/90 backdrop-blur-3xl rounded-[49px] p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="relative group/avatar">
            <div className="absolute inset-0 bg-orange-600 blur-3xl opacity-20 group-hover/avatar:opacity-40 transition-opacity rounded-full" />
            <div className="w-40 h-40 rounded-[44px] bg-gradient-to-tr from-orange-600 to-amber-500 p-1 relative z-10 shadow-2xl transition-transform group-hover/avatar:scale-105 duration-500">
               <div className="w-full h-full rounded-[42px] bg-slate-900 flex items-center justify-center overflow-hidden">
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      className="w-full h-full object-cover" 
                      alt="Profile" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        setFormData({...formData, avatar: ''});
                      }}
                    />
                  ) : (
                    <UserCircle className="w-20 h-20 text-orange-500/50" />
                  )}
               </div>
               <button 
                onClick={() => setShowAvatarModal(true)}
                className="absolute -bottom-2 -right-2 w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-2xl border-4 border-[#020617] hover:scale-110 transition-transform active:scale-90"
               >
                 <Camera className="w-6 h-6" />
               </button>
            </div>
          </div>

          <div className="text-center md:text-left flex-1 space-y-4">
             <div className="space-y-1">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <h1 className="text-5xl font-black font-[family-name:var(--font-display)] text-white tracking-tighter uppercase">{user.name}</h1>
                  <span className="px-4 py-1.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-950/50">{user.role}</span>
                </div>
                <p className="text-slate-500 text-lg font-bold tracking-tight opacity-80">{user.email}</p>
             </div>
             
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
                  <ShieldCheck className="w-4 h-4" /> Trusted Member
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/20">
                  <Globe className="w-4 h-4" /> Global Citizen
                </div>
             </div>
          </div>

          <div className="flex gap-4">
              <Link href="/orders">
                  <Button variant="outline" className="h-16 px-8 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 group">
                      <History className="w-5 h-5 mr-3 group-hover:text-orange-500 transition-colors" /> History
                  </Button>
              </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-10">
            <Card className="p-10 bg-[#020617] border-white/5 rounded-[50px] shadow-2xl space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-3">
                          <Settings className="w-6 h-6 text-orange-500" /> Account Identity
                      </h2>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">Modify your public-facing details</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Security Encrypted</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {[
                      { label: "Display Name", icon: User, key: "name", placeholder: "The Gourmet Explorer" },
                      { label: "Primary Email", icon: Mail, key: "email", placeholder: "explorer@gourmet.com" },
                      { label: "Phone Line", icon: Phone, key: "phone", placeholder: "+1 (555) 123-4567" },
                      { label: "Home Base", icon: MapPin, key: "address", placeholder: "Gourmet Street, Flavor City" }
                    ].map((field) => (
                      <div key={field.key} className="space-y-3 group/field">
                          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-1 group-focus-within/field:text-orange-500 transition-all">{field.label}</label>
                          <div className="relative">
                              <field.icon className="absolute left-5 top-5 w-5 h-5 text-slate-800 group-focus-within/field:text-orange-500 transition-colors" />
                              <Input 
                                value={(formData as any)[field.key]} 
                                onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                placeholder={field.placeholder}
                                className="pl-14 h-16 rounded-3xl bg-slate-950 border-white/5 hover:border-white/10 focus:border-orange-500 transition-all font-bold text-slate-100 placeholder:text-slate-800 text-lg" 
                              />
                          </div>
                      </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 text-center sm:text-left">
                      Sensitive changes require <span className="text-white">Email Verification</span>
                    </p>
                    <Button 
                      disabled={isUpdating}
                      onClick={handleUpdateProfile}
                      className="h-16 px-12 rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-orange-600/20 group overflow-hidden bg-orange-600 hover:bg-orange-500 text-white"
                    >
                        {isUpdating ? "Updating..." : "Push Changes"} <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
            <Card className="p-8 bg-slate-950 border-white/5 rounded-[50px] space-y-8 overflow-hidden relative shadow-2xl">
                <h3 className="text-xl font-black font-[family-name:var(--font-display)] text-white tracking-widest uppercase flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" /> Account Safety
                </h3>
                
                <div className="space-y-4">
                    {[
                      { icon: Lock, label: "Two-Factor Auth" },
                      { icon: Bell, label: "Notification Pulse" },
                      { icon: Shield, label: "Third-Party Keys" }
                    ].map((item) => (
                      <button key={item.label} className="w-full h-16 px-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-4 text-slate-500 group-hover:text-white transition-colors">
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-800 group-hover:text-white transition-all transform group-hover:translate-x-2" />
                      </button>
                    ))}
                </div>

                <div className="pt-8 mt-4 border-t border-white/5">
                    <button 
                        onClick={() => {logout(); toast.success("Signed out successfully")}}
                        className="w-full h-16 rounded-3xl bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Sign Out Session
                    </button>
                </div>
            </Card>

            <div className="bg-orange-600/5 border border-orange-500/10 rounded-[40px] p-8 text-center space-y-2">
               <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Elite Service</h4>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">Your profile is handled with utmost privacy & bank-grade security protocols.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
