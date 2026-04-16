import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#020617] border-t border-white/5 pt-16 pb-8 text-slate-400 relative z-10 transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-all">
              F
            </div>
            <span className="text-xl font-black font-[family-name:var(--font-display)] tracking-tighter text-white">FoodHub</span>
          </Link>
          <p className="text-sm leading-relaxed mb-6 opacity-70">
            Connecting gourmets with top-rated local providers. Experience premium food delivery with style and speed.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-orange-600 hover:text-white transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><Link href="/meals" className="hover:text-orange-500 transition-colors">Explore Meals</Link></li>
            <li><Link href="/providers" className="hover:text-orange-500 transition-colors">Our Providers</Link></li>
            <li><Link href="/orders" className="hover:text-orange-500 transition-colors">Track Order</Link></li>
            <li><Link href="/login" className="hover:text-orange-500 transition-colors">Customer Login</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Support</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">Partner With Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Contact Us</h3>
          <ul className="space-y-4 text-sm font-medium">
            <li className="flex gap-3"><Mail className="w-4 h-4 text-orange-600" /> support@foodhub.com</li>
            <li className="flex gap-3"><Phone className="w-4 h-4 text-orange-600" /> +1 (555) 000-0000</li>
            <li className="flex gap-3"><MapPin className="w-4 h-4 text-orange-600" /> 123 Flavor Street, NY</li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/5 text-center sm:flex justify-between items-center text-xs font-semibold uppercase tracking-widest opacity-40">
        <p>FoodHub &copy; {new Date().getFullYear()} All Rights Reserved</p>
        <p className="mt-2 sm:mt-0">Designed for Food Lovers</p>
      </div>
    </footer>
  );
}
