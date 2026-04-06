import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 p-10 max-w-4xl text-center items-center">
        <h1 className="text-5xl font-bold text-orange-600">
          FoodHub 🍱
        </h1>
        <p className="text-xl text-gray-700">
          "Discover & Order Delicious Meals"
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link href="/meals" className="p-6 bg-white shadow-xl rounded-2xl hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Browse Meals &rarr;</h2>
            <p className="text-gray-600">Find the best food from top providers.</p>
          </Link>

          <Link href="/providers" className="p-6 bg-white shadow-xl rounded-2xl hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Providers &rarr;</h2>
            <p className="text-gray-600">Explore the list of restaurants.</p>
          </Link>

          <Link href="/login" className="p-6 bg-white shadow-xl rounded-2xl hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Login &rarr;</h2>
            <p className="text-gray-600">Access your account to place orders.</p>
          </Link>

          <Link href="/register" className="p-6 bg-white shadow-xl rounded-2xl hover:scale-105 transition-transform">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Register &rarr;</h2>
            <p className="text-gray-600">Join as a Customer or a Provider!</p>
          </Link>
        </div>
      </main>
      <footer className="mt-auto py-6 text-gray-500">
        FoodHub &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
