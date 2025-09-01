"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Filter, Search, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import CountdownTimer from "@/components/countdown-timer"

// Categories for filter (lowercase, space-separated slugs)
const categories = [
  { value: "watches & jewelry", label: "Watches & Jewelry" },
  { value: "electronics", label: "Electronics" },
  { value: "vehicles", label: "Vehicles" },
  { value: "collectibles", label: "Collectibles" },
  { value: "art", label: "Art" },
  { value: "fashion", label: "Fashion" },
  { value: "furniture", label: "Furniture" },
  { value: "books & media", label: "Books & Media" },
  { value: "music", label: "Music" },
  { value: "cameras & photo", label: "Cameras & Photo" },
  { value: "business & industrial", label: "Business & Industrial" },
  { value: "food & beverages", label: "Food & Beverages" },
]

interface Auction {
  _id: string
  title: string
  description: string
  currentBid: number
  startingPrice: number
  minBidIncrement: number
  endTime: string
  category: string
  images: string[]
  seller: {
    _id: string
    name: string
  }
  bids: {
    _id: string
    amount: number
    bidder: string
    createdAt: string
  }[]
  createdAt: string
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("endTime")
  const [priceRange, setPriceRange] = useState([0, 1000000])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // NEW: Get category from URL query param
  const searchParams = useSearchParams();
  const categoryFromURL = searchParams.get("category") || "";

  useEffect(() => {
    if (categoryFromURL && categoryFromURL.toLowerCase() !== selectedCategory.toLowerCase()) {
      setSelectedCategory(categoryFromURL.toLowerCase());
    }
  }, [categoryFromURL]);

  // Fetch auctions with filters
  const fetchAuctions = async (resetPage = false) => {
    try {
      const currentPage = resetPage ? 1 : page
      // Support filter query for featured, ending-soon, new, and category
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
      let filter = urlParams.get("filter")
      let filterSort = sortBy
      if (filter === "featured") filterSort = "featured"
      if (filter === "ending-soon") filterSort = "endingSoon"
      if (filter === "new") filterSort = "newest"
      // CATEGORY FILTER SUPPORT
      let categoryParam = urlParams.get("category")
      if (categoryParam) categoryParam = categoryParam.toLowerCase();
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sort: filterSort,
        ...(categoryParam && categoryParam !== "all" && { category: categoryParam }),
        ...(selectedCategory && selectedCategory !== "all" && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery }),
        ...(priceRange[0] > 0 && { minPrice: priceRange[0].toString() }),
        ...(priceRange[1] < 1000000 && { maxPrice: priceRange[1].toString() }),
      })

      const response = await fetch(`/api/auctions?${queryParams}`)
      if (!response.ok) {
        throw new Error("Failed to fetch auctions")
      }

      const data = await response.json()
      
      if (resetPage) {
        setAuctions(data.auctions)
      } else {
        setAuctions(prev => [...prev, ...data.auctions] as Auction[])
      }
      
      setHasMore(data.pagination.page < data.pagination.pages)
      setPage(currentPage)
      setError(null)
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  // Only filter by category if selectedCategory is not 'all'
  const filteredAuctions =
    selectedCategory && selectedCategory !== "all"
      ? auctions.filter(a => a.category && a.category.toLowerCase() === selectedCategory.toLowerCase())
      : auctions;

  console.log('Loaded auctions:', auctions);
  console.log('Selected category:', selectedCategory);
  console.log('Filtered auctions:', filteredAuctions);

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchAuctions(true)

    // Refresh auctions every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchAuctions(true)
    }, 30000)

    return () => clearInterval(refreshInterval)
  }, [selectedCategory, sortBy, searchQuery])

  // Handle filter changes
  const handleFilterChange = () => {
    fetchAuctions(true)
  }

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value)
  }

  // Load more auctions
  const loadMore = () => {
    setPage(prev => prev + 1)
    fetchAuctions()
  }

  return (
    <div className="container py-8">
      {/* Search and Filter Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search auctions..."
              type="search"
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="endTime">Ending Soon</SelectItem>
              <SelectItem value="priceAsc">Price: Low to High</SelectItem>
              <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="mostBids">Most Bids</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center my-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && auctions.length === 0 && (
        <div className="text-center my-8">
          Loading auctions...
        </div>
      )}

      {/* No Results */}
      {!loading && auctions.length === 0 && (
        <div className="text-center my-8">
          No auctions found. Try adjusting your filters.
        </div>
      )}

      {/* Auctions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAuctions.map((auction) => (
          <Link key={auction._id} href={`/auctions/${auction._id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={auction.images?.[0] || "/placeholder.jpg"}
                    alt={auction.title}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2">{auction.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{auction.title}</h3>
                <div className="text-sm text-muted-foreground mt-1">
                  Current Bid: ₹{auction.currentBid.toLocaleString("en-IN")}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {auction.bids?.length || 0} bids
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="w-full">
                  {new Date(auction.endTime) < new Date() || auction.auctionEnded || auction.status === "ended" ? (
                    <span className="text-red-600 font-bold">Auction Ended</span>
                  ) : (
                    <CountdownTimer endTime={new Date(auction.endTime)} />
                  )}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <Button onClick={loadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
