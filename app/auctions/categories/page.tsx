"use client";
import Link from "next/link";
import { Watch, Tv, Car, Gem, Palette, Shirt, Home, BookOpen, Music, Camera, Briefcase, Utensils } from "lucide-react";

const categories = [
  { id: "watches & jewelry", name: "Watches & Jewelry", icon: Watch, color: "from-blue-500 to-blue-700" },
  { id: "electronics", name: "Electronics", icon: Tv, color: "from-purple-500 to-purple-700" },
  { id: "vehicles", name: "Vehicles", icon: Car, color: "from-red-500 to-red-700" },
  { id: "collectibles", name: "Collectibles", icon: Gem, color: "from-amber-500 to-amber-700" },
  { id: "art", name: "Art", icon: Palette, color: "from-pink-500 to-pink-700" },
  { id: "fashion", name: "Fashion", icon: Shirt, color: "from-emerald-500 to-emerald-700" },
  { id: "furniture", name: "Furniture", icon: Home, color: "from-green-500 to-green-700" },
  { id: "books & media", name: "Books & Media", icon: BookOpen, color: "from-orange-500 to-orange-700" },
  { id: "music", name: "Music", icon: Music, color: "from-indigo-500 to-indigo-700" },
  { id: "cameras & photo", name: "Cameras & Photo", icon: Camera, color: "from-gray-500 to-gray-700" },
  { id: "business & industrial", name: "Business & Industrial", icon: Briefcase, color: "from-cyan-500 to-cyan-700" },
  { id: "food & beverages", name: "Food & Beverages", icon: Utensils, color: "from-yellow-500 to-yellow-700" },
];

export default function AuctionsCategoriesPage() {
  return (
    <div className="container py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight">Auction Categories</h1>
      <div className="grid gap-8 w-full max-w-4xl sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/auctions?category=${encodeURIComponent(category.id)}`}
            className={`w-full rounded-3xl bg-gradient-to-br ${category.color} flex items-center gap-6 px-8 py-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 group`}
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/80 group-hover:bg-white/100 shadow-md transition-colors">
              <category.icon className="h-8 w-8 text-gray-900" />
            </div>
            <span className="text-lg font-semibold text-white drop-shadow-lg">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
