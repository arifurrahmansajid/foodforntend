import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FoodHub | Exceptional Culinary Experiences",
  description: "Discover, order, and savor the finest meals from top-rated providers in your city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <body 
        className="flex flex-col relative w-full h-full min-h-screen bg-[#020617] text-[#f8fafc] font-sans"
        suppressHydrationWarning
      >
        <Toaster position="bottom-right" />
        
        {/* Deep ambient backgrounds */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
          <div className="absolute top-[-15%] left-[-5%] w-[40%] h-[40%] bg-orange-600/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-rose-600/10 blur-[130px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`}} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <Navbar />
        <main className="flex-1 pt-24 pb-12 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
