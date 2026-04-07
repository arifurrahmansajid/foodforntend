"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import { Mail, Lock, LogIn, Github, Chrome, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      setIsLoading(true);
      const response = await authApi.login({ email, password });
      // Backend sends: { status, token, data: { user } }
      const token = response.data.token;
      const user = response.data.data?.user;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      setAuth(user, token);
      
      toast.success(`Welcome back, ${user.name}!`, {
        style: { background: '#0f172a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });

      // Role-based redirection
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else if (user.role === 'PROVIDER') {
        router.push('/provider/dashboard');
      } else {
        router.push('/meals');
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 animate-in fade-in zoom-in duration-500 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[500px] bg-orange-600/5 blur-[120px] -z-10 rounded-full" />
      
      <Card className="w-full max-w-md p-8 sm:p-12 relative overflow-visible bg-slate-950/50 backdrop-blur-2xl border-white/5 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-3xl shadow-[0_20px_40px_-5px_rgba(234,88,12,0.5)] border-4 border-[#020617]">
          F
        </div>

        <div className="text-center mt-6 mb-10">
          <h1 className="text-3xl font-black font-[family-name:var(--font-display)] mb-2 text-white tracking-tight">Customer Login</h1>
          <p className="text-slate-400 text-sm font-semibold tracking-wide uppercase opacity-70">Access your gourmet dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2 group">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1 group-focus-within:text-orange-500 transition-colors">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
              <Input 
                type="email" 
                placeholder="yours@example.com" 
                className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl hover:border-white/10 transition-all font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 group-focus-within:text-orange-500 transition-colors">Password</label>
              <a href="#" className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">Forgot Pwd?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-orange-500 transition-colors" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-12 h-14 bg-white/[0.03] border-white/5 rounded-2xl hover:border-white/10 transition-all font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-[0_15px_30px_-10px_rgba(234,88,12,0.4)] group overflow-hidden"
          >
            Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
{/* 
        <div className="mt-8 relative pt-4 text-center">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/5" />
          <span className="relative -top-2 px-6 bg-slate-950 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">or continue with</span>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
             <button className="h-14 flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold text-white">
                <Chrome className="w-5 h-5" /> Google
             </button>
             <button className="h-14 flex items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-bold text-white">
                <Github className="w-5 h-5" /> GitHub
             </button>
          </div>
        </div> */}

        <p className="text-center mt-10 text-slate-400 font-medium text-sm">
          New to the club? <Link href="/register" className="text-orange-500 font-black hover:text-orange-400 transition-colors ml-1">Create Account</Link>
        </p>

        <div className="mt-10 flex items-center justify-center gap-2 opacity-50 text-[10px] uppercase font-black tracking-widest text-slate-500">
           <ShieldCheck className="w-3.5 h-3.5" /> Secure SSL Encryption
        </div>
      </Card>
    </div>
  );
}
