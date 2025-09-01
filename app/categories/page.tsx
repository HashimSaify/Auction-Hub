import Link from "next/link"
import { Watch, Tv, Car, Gem, Palette, Shirt, Home, BookOpen, Music, Camera, Briefcase, Utensils } from "lucide-react"

// Categories with lowercase slug as id and label
const categories = [
  {
    id: "watches & jewelry",
    name: "Watches & Jewelry",
    icon: Watch,
    count: 328,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Tv,
    count: 452,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: Car,
    count: 167,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    gradient: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "collectibles",
    name: "Collectibles",
    icon: Gem,
    count: 294,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    gradient: "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
    image: "https://images.unsplash.com/photo-1621559179574-60a8f3510351?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "art",
    name: "Art",
    icon: Palette,
    count: 183,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    gradient: "from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    count: 376,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: Home,
    count: 215,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    gradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
    image: "https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "books & media",
    name: "Books & Media",
    icon: BookOpen,
    count: 241,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    gradient: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    count: 178,
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    gradient: "from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900",
    image: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "cameras & photo",
    name: "Cameras & Photo",
    icon: Camera,
    count: 132,
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    gradient: "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "business & industrial",
    name: "Business & Industrial",
    icon: Briefcase,
    count: 95,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    gradient: "from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "food & beverages",
    name: "Food & Beverages",
    icon: Utensils,
    count: 87,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    gradient: "from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop",
  },
]

export default function CategoriesPage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-col space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Browse Categories</h1>
          <p className="max-w-3xl text-xl text-muted-foreground">
            Explore our wide range of auction categories to find exactly what you're looking for.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/auctions?category=${category.id}`}
              className="group relative overflow-hidden rounded-lg border transition-all hover:shadow-md"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-black/0" />
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="h-48 w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-2 ${category.color}`}>
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.count} items</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold tracking-tight">Featured Categories</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="group relative overflow-hidden rounded-lg border transition-all hover:shadow-md">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-black/0" />
              <img
                src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop"
                alt="Luxury Watches"
                className="h-64 w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <h3 className="text-2xl font-bold text-white">Luxury Watches</h3>
                <p className="mt-2 text-white/80">
                  Discover premium timepieces from renowned brands like Rolex, Omega, and Patek Philippe.
                </p>
                <Link
                  href="/auctions?category=watches & jewelry"
                  className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Explore Collection
                </Link>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-lg border transition-all hover:shadow-md">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-black/0" />
              <img
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop"
                alt="Fine Art"
                className="h-64 w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                <h3 className="text-2xl font-bold text-white">Fine Art</h3>
                <p className="mt-2 text-white/80">
                  Browse paintings, sculptures, and prints from emerging and established artists.
                </p>
                <Link
                  href="/auctions?category=art"
                  className="mt-4 inline-flex items-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold tracking-tight">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/auctions?category=${category.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors ${category.color} hover:opacity-90`}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Searches */}
        <div className="space-y-6 mt-8">
          <h2 className="text-2xl font-bold tracking-tight">Popular Searches</h2>
          <div className="flex flex-wrap gap-2">
            {[
              "Vintage Watches",
              "Gaming Consoles",
              "Designer Handbags",
              "Rare Coins",
              "Vinyl Records",
              "Antique Furniture",
              "Sports Memorabilia",
              "Comic Books",
              "Luxury Cars",
              "Fine Jewelry",
              "Vintage Cameras",
              "Limited Edition Sneakers",
            ].map((term, index) => (
              <Link
                key={index}
                href={`/auctions?search=${encodeURIComponent(term)}`}
                className="inline-flex rounded-md bg-muted px-3 py-1 text-sm font-medium transition-colors hover:bg-muted/80"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
