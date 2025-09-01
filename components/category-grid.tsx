import Link from "next/link"
import { Watch, Tv, Car, Gem, Palette, Shirt, Home, BookOpen } from "lucide-react"

// Mock data for categories with improved styling
const categories = [
  {
    id: "watches",
    name: "Watches & Jewelry",
    icon: Watch,
    count: 328,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    gradient: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Tv,
    count: 452,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    gradient: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900",
  },
  {
    id: "vehicles",
    name: "Vehicles",
    icon: Car,
    count: 167,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    gradient: "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900",
  },
  {
    id: "collectibles",
    name: "Collectibles",
    icon: Gem,
    count: 294,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    gradient: "from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900",
  },
  {
    id: "art",
    name: "Art",
    icon: Palette,
    count: 183,
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
    gradient: "from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900",
  },
  {
    id: "fashion",
    name: "Fashion",
    icon: Shirt,
    count: 376,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    gradient: "from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900",
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: Home,
    count: 215,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    gradient: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900",
  },
  {
    id: "books",
    name: "Books & Media",
    icon: BookOpen,
    count: 241,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    gradient: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900",
  },
]

export default function CategoryGrid() {
  return (
    <>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/auctions/category/${category.id}`}
          className="flex flex-col items-center p-6 bg-gradient-to-br rounded-lg border transition-all hover:shadow-md hover:border-primary/50 group"
          style={{
            backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
          }}
        >
          <div className={`p-3 rounded-full ${category.color} mb-3 transition-transform group-hover:scale-110`}>
            <category.icon className="h-6 w-6" />
          </div>
          <h3 className="font-medium text-lg">{category.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{category.count} items</p>
        </Link>
      ))}
    </>
  )
}
