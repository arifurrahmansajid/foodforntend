"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import { User, Mail, Lock, UserPlus, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setIsLoading(true);
      const response = await authApi.register({ name, email, password, role });
      // Backend sends: { status, token, data: { user } }
      const token = response.data.token;
      const user = response.data.data?.user;

      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      setAuth(user, token);
      
      toast.success(`Welcome to the club, ${user.name}!`, {
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });

      // Role-based redirection
      if (user.role === 'PROVIDER') {
        router.push('/provider/dashboard');
      } else {
        router.push('/meals');
      }
    } catch (error: any) {
      console.error("Registration Error:", error);
      const message = error.response?.data?.message || "Registration failed. Try a different email.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 animate-in fade-in slide-in-from-bottom-12 duration-700 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-orange-600/5 blur-[150px] -z-10 rounded-full" />

      <Card className="w-full max-w-xl p-8 sm:p-12 relative overflow-visible bg-slate-950/40 backdrop-blur-3xl border-white/5 shadow-2xl">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-3xl shadow-[0_20px_40px_-5px_rgba(234,88,12,0.5)] border-4 border-[#020617]">
          F
        </div>

        <div className="text-center mt-6 mb-12">
          <h1 className="text-3xl font-black font-[family-name:var(--font-display)] mb-2 text-white">Join FoodHub</h1>
          <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase opacity-70">Start your culinary journey today</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10 w-full">
            {[
              { id: 'CUSTOMER', label: 'I am a Customer', desc: 'Order delicious food' },
              { id: 'PROVIDER', label: 'I am a Provider', desc: 'Sell premium meals' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id as any)}
                className={cn(
                  "relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden h-32",
                  role === r.id 
                    ? "bg-orange-600 border-orange-600 shadow-[0_15px_30px_-5px_rgba(234,88,12,0.4)]" 
                    : "bg-white/[0.03] border-white/5 hover:border-white/10"
                )}
              >
                <span className={cn("text-sm font-black uppercase tracking-widest", role === r.id ? "text-white" : "text-slate-200")}>{r.label}</span>
                <span className={cn("text-[10px] mt-2 font-medium opacity-60 uppercase", role === r.id ? "text-white" : "text-slate-500")}>{r.desc}</span>
                {role === r.id && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-white" />}
              </button>
            ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 group-focus-within:text-orange-500 transition-colors">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
              <Input 
                placeholder="John Doe" 
                className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 group-focus-within:text-orange-500 transition-colors">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
              <Input 
                type="email" 
                placeholder="yours@example.com" 
                className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 group-focus-within:text-orange-500 transition-colors">Create Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-[0_15px_30px_-10px_rgba(234,88,12,0.4)] group overflow-hidden mt-4"
          >
            Create My Account <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <p className="text-center mt-10 text-slate-400 font-medium text-sm">
          Already a member? <Link href="/login" className="text-orange-500 font-black hover:text-orange-400 transition-colors ml-1">Log In Here</Link>
        </p>

        <div className="mt-10 flex items-center justify-center gap-2 opacity-50 text-[10px] uppercase font-black tracking-widest text-slate-500">
           <ShieldCheck className="w-3.5 h-3.5" /> Secure Authentication
        </div>
      </Card>
    </div>
  );
}
