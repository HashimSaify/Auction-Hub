"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Eye, Heart, Share2, ShieldCheck, Truck, AlertCircle, Star, User, BadgeIndianRupee } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CountdownTimer from "@/components/countdown-timer"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

// Similar items (will be replaced with API data in a real implementation)
const similarItems = [
  {
    id: "similar1",
    title: "Rolex Datejust 41",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=300&auto=format&fit=crop",
    currentBid: 3800,
    endTime: new Date(Date.now() + 86400000 * 3.5), // 3.5 days from now
  },
  {
    id: "similar2",
    title: "Omega Seamaster Professional",
    image: "https://images.unsplash.com/photo-1548169874-53e85f753f1e?q=80&w=300&auto=format&fit=crop",
    currentBid: 2200,
    endTime: new Date(Date.now() + 86400000 * 1.2), // 1.2 days from now
  },
  {
    id: "similar3",
    title: "TAG Heuer Monaco",
    image: "https://images.unsplash.com/photo-1548222606-6c4f581fd09d?q=80&w=300&auto=format&fit=crop",
    currentBid: 1950,
    endTime: new Date(Date.now() + 86400000 * 4), // 4 days from now
  },
  {
    id: "similar4",
    title: "Breitling Navitimer",
    image: "https://images.unsplash.com/photo-1548171915-e5c6d55f0d9b?q=80&w=300&auto=format&fit=crop",
    currentBid: 3100,
    endTime: new Date(Date.now() + 86400000 * 2), // 2 days from now
  },
]

export default function AuctionDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [auctionData, setAuctionData] = useState<any>(null)
  const [isWatching, setIsWatching] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [showLoginAlert, setShowLoginAlert] = useState(false)
  const [bidError, setBidError] = useState("")

  // --- BEGIN: Make fetchAuctionData accessible for handleBidPlaced ---
  const fetchAuctionData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      if (!id) {
        throw new Error("Auction ID is required")
      }
      const response = await fetch(`/api/auctions/${id}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to load auction data")
      }
      const data = await response.json()
      if (!data.auction) {
        throw new Error("Auction not found")
      }
      setAuctionData(data.auction)
    } catch (err) {
      console.error("Error fetching auction:", err)
      setError(err instanceof Error ? err.message : "Failed to load auction data")
      if (err instanceof Error && err.message === "Auction not found") {
        router.push("/404")
      }
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    if (id) {
      fetchAuctionData()
    }
  }, [id, router])
  // --- END: Make fetchAuctionData accessible for handleBidPlaced ---

  const handlePlaceBid = async (amount: number) => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    try {
      const response = await fetch(`/api/auctions/${id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to place bid');
        return;
      }
      await fetchAuctionData();
    } catch (err) {
      alert('Error placing bid.');
      console.error('Error placing bid:', err);
    }
  };

  async function handleToggleWatchlist() {
    console.log("[Watchlist] Heart clicked", { user, isWatching, auctionData });
    const auctionIdToSend = auctionData._id || auctionData.id;
    console.log("[Watchlist] Sending auctionId:", auctionIdToSend);
    if (!user) {
      setShowLoginAlert(true);
      return;
    }
    try {
      const res = await fetch(`/api/watchlist`, {
        method: isWatching ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId: auctionIdToSend }),
      });
      const data = await res.json();
      console.log("[Watchlist] API response status:", res.status, data);
      if (!res.ok) throw new Error('Failed to update watchlist');
      setIsWatching(!isWatching);
      if (!isWatching) {
        router.push('/watchlist');
      }
    } catch (err) {
      console.error("[Watchlist] Error:", err);
    }
  }

  // Image zoom functionality
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isImageZoomed) return

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  // Handle login alert dismissal
  const handleLoginAlertDismiss = () => {
    setShowLoginAlert(false)
  }

  const handleLoginRedirect = () => {
    router.push(`/auth/signin?redirect=/auctions/${id}`)
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="flex space-x-2 overflow-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-20 rounded-md" />
              ))}
            </div>
          </div>

          {/* Auction Details Skeleton */}
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 rounded-lg" />
              <div className="mt-2 flex items-center gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            <Skeleton className="h-[200px] w-full rounded-lg" />

            <Skeleton className="h-[100px] w-full rounded-lg" />

            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-[80px] w-full rounded-lg" />
              <Skeleton className="h-[80px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <Alert variant="destructive" className="mx-auto max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/auctions">Auctions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/auctions/category/${auctionData.category.toLowerCase()}`}>
              {auctionData.category}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{auctionData.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {showLoginAlert && (
        <Alert variant="default" className="mb-6 bg-primary/10 border-primary">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="flex-1">
            You need to be logged in to {isWatching ? "remove from watchlist" : "add to watchlist"} or place bids.
          </AlertDescription>
          <Button size="sm" variant="default" onClick={handleLoginRedirect}>
            Sign In
          </Button>
          <Button size="sm" variant="ghost" onClick={handleLoginAlertDismiss}>
            Dismiss
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div
            className="relative aspect-square overflow-hidden rounded-lg border bg-muted cursor-zoom-in"
            onClick={() => setIsImageZoomed(!isImageZoomed)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsImageZoomed(false)}
          >
            <img
              src={auctionData.images[selectedImage] || "/placeholder.svg"}
              alt={`${auctionData.title} - Image ${selectedImage + 1}`}
              className={`object-cover w-full h-full transition-transform duration-200 ${
                isImageZoomed ? "scale-150" : ""
              }`}
              style={
                isImageZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
            />
          </div>
          <div className="flex space-x-2 overflow-auto pb-2">
            {auctionData.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`relative aspect-square w-20 overflow-hidden rounded-md border transition-all ${
                  selectedImage === index ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              <span>{auctionData.views} views</span>
            </div>
            <div className="flex items-center">
              <Heart className="mr-1 h-4 w-4" />
              <span>{auctionData.watchers} watching</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this auction</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Auction Details */}
        <div className="space-y-6">
          <div>
            <div className="relative flex items-center justify-between">
              <h1 className="text-2xl font-bold sm:text-3xl">{auctionData.title}</h1>
              <Button
                variant="ghost"
                size="icon"
                aria-label={isWatching ? "Remove from Watchlist" : "Add to Watchlist"}
                className="absolute top-4 right-4 z-10"
                onClick={handleToggleWatchlist}
              >
                <Heart className={isWatching ? "fill-red-500 text-red-500" : "text-gray-400"} />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10">
                {auctionData.category}
              </Badge>
              <Badge variant="outline" className="bg-secondary/10">
                {auctionData.condition}
              </Badge>
            </div>
            {(() => {
              const sellerId = auctionData.seller?._id || auctionData.sellerId;
              const userId = user?.id || user?._id;
              const winnerId = auctionData.winner?._id || auctionData.winnerId;
              const isSeller = userId && sellerId && sellerId.toString() === userId.toString();
              const isWinner = userId && winnerId && winnerId.toString() === userId.toString();
              if (
                isSeller &&
                auctionData.auctionEnded &&
                auctionData.winner && (auctionData.winner.name || auctionData.winner.email || auctionData.winner.id)
              ) {
                return (
                  <div className="relative mt-8 mb-16 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                    {/* Accent bar and icon */}
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-2 h-16 rounded-full bg-gradient-to-b from-green-400 to-green-600 dark:from-green-600 dark:to-green-400"></div>
                      <Star className="h-8 w-8 text-green-500 mt-2 drop-shadow" />
                    </div>
                    {/* Text Content */}
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                        Auction Ended!
                      </div>
                      <div className="text-lg text-gray-700 dark:text-gray-200 mb-1">Your item has been sold</div>
                      <div className="flex flex-wrap gap-3 text-base">
                        <span className="flex items-center gap-1 text-green-700 dark:text-green-300">
                          <User className="inline h-5 w-5" />
                          Winner: <span className="font-semibold">{auctionData.winner.name || auctionData.winner.email || auctionData.winner.id}</span>
                        </span>
                        <span className="flex items-center gap-1 text-green-700 dark:text-green-300">
                          <BadgeIndianRupee className="inline h-5 w-5" />
                          Final Price: <span className="font-semibold">₹{(auctionData.finalBidAmount ?? auctionData.currentBid)?.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              if (
                isWinner &&
                auctionData.auctionEnded &&
                auctionData.seller && (auctionData.seller.name || auctionData.seller.email || auctionData.seller.id)
              ) {
                return (
                  <div className="relative mt-8 mb-16 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                    {/* Accent bar and icon */}
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-2 h-16 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-400"></div>
                      <Star className="h-8 w-8 text-blue-500 mt-2 drop-shadow" />
                    </div>
                    {/* Text Content */}
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                        Congratulations!
                      </div>
                      <div className="text-lg text-gray-700 dark:text-gray-200 mb-1">You won the auction</div>
                      <div className="flex flex-wrap gap-3 text-base">
                        <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
                          <User className="inline h-5 w-5" />
                          Seller: <span className="font-semibold">{auctionData.seller.name || auctionData.seller.email || auctionData.seller.id}</span>
                        </span>
                        <span className="flex items-center gap-1 text-green-700 dark:text-green-300">
                          <BadgeIndianRupee className="inline h-5 w-5" />
                          Final Price: <span className="font-semibold">₹{(auctionData.finalBidAmount ?? auctionData.currentBid)?.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              if (
                isSeller &&
                auctionData.auctionEnded &&
                !auctionData.winner
              ) {
                return (
                  <div className="relative mt-8 mb-16 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                    {/* Accent bar and icon */}
                    <div className="flex flex-col items-center mr-4">
                      <div className="w-2 h-16 rounded-full bg-gradient-to-b from-red-400 to-red-600 dark:from-red-600 dark:to-red-400"></div>
                      <AlertCircle className="h-8 w-8 text-red-500 mt-2 drop-shadow" />
                    </div>
                    {/* Text Content */}
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                        Auction Ended!
                      </div>
                      <div className="text-lg text-gray-700 dark:text-gray-200 mb-1">Your item did not sell</div>
                      <div className="flex flex-wrap gap-3 text-base">
                        <span className="flex items-center gap-1 text-red-700 dark:text-red-300">
                          <BadgeIndianRupee className="inline h-5 w-5" />
                          Highest Bid: <span className="font-semibold">₹{(auctionData.currentBid)?.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}
          </div>

          {/* --- Enhanced Auction Stats & Timer Layout --- */}
          <div className="w-full flex flex-col items-center mb-6">
            <div className="grid grid-cols-3 gap-4 w-full mb-3">
              <div className="flex flex-col items-center bg-blue-100 dark:bg-blue-900 rounded-xl py-3 shadow">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1 tracking-wide">Min Allowed Bid</span>
                <span className="text-xl font-extrabold text-blue-700 dark:text-blue-300">₹{(auctionData.currentBid || auctionData.startingPrice || 0) + (auctionData.minBidIncrement || 1)}</span>
              </div>
              <div className="flex flex-col items-center bg-green-100 dark:bg-green-900 rounded-xl py-3 shadow">
                <span className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1 tracking-wide">Current Highest Bid</span>
                <span className="text-xl font-extrabold text-green-700 dark:text-green-300">₹{auctionData.currentBid?.toLocaleString() || auctionData.startingPrice?.toLocaleString() || 0}</span>
              </div>
              <div className="flex flex-col items-center bg-yellow-100 dark:bg-yellow-900 rounded-xl py-3 shadow">
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300 mb-1 tracking-wide">Min Increment</span>
                <span className="text-xl font-extrabold text-yellow-700 dark:text-yellow-300">₹{auctionData.minBidIncrement || 1}</span>
              </div>
            </div>
            <div className="flex justify-center w-full mt-2">
              {auctionData.auctionEnded || auctionData.status === "ended" ? (
                <span className="text-2xl font-bold text-red-600">Auction Ended</span>
              ) : (
                <CountdownTimer endTime={auctionData.endTime} className="text-2xl font-bold text-red-600" />
              )}
            </div>
          </div>

          {/* Bidding Section */}
          {!auctionData.auctionEnded && (
            <div className="mb-8 flex justify-center">
              <div className="bg-card border border-primary/20 rounded-2xl shadow-lg px-8 py-6 w-full max-w-md flex flex-col items-center">
                <form
                  className="flex flex-col sm:flex-row gap-3 items-center w-full"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('bidAmount') as HTMLInputElement;
                    const bidValue = parseFloat(input.value);
                    const minBid = (auctionData.currentBid || auctionData.startingPrice || 0) + (auctionData.minBidIncrement || 1);
                    if (isNaN(bidValue) || bidValue < minBid) {
                      setBidError(`Please enter a valid bid (minimum: ₹${minBid})`);
                      return;
                    }
                    setBidError("");
                    await handlePlaceBid(bidValue);
                    input.value = '';
                  }}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="bidAmount" className="font-medium mb-1">Enter your bid</label>
                    <div className="relative w-full">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <input
                        type="number"
                        name="bidAmount"
                        id="bidAmount"
                        min={(auctionData.currentBid || auctionData.startingPrice || 0) + (auctionData.minBidIncrement || 1)}
                        step="any"
                        placeholder={`e.g. ₹${(auctionData.currentBid || auctionData.startingPrice || 0) + (auctionData.minBidIncrement || 1)}`}
                        className="border border-primary/30 bg-muted pl-8 pr-4 py-3 rounded-lg text-lg w-full focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                        required
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-2">
                      Current Highest Bid: <b>₹{auctionData.currentBid?.toLocaleString() || auctionData.startingPrice?.toLocaleString() || 0}</b> &nbsp;|&nbsp; Min Increment: ₹{auctionData.minBidIncrement || 1}
                    </span>
                  </div>
                  <Button type="submit" className="mt-4 sm:mt-0 w-full sm:w-auto text-base px-8 py-3 rounded-lg font-semibold shadow hover:shadow-md transition bg-primary">
                    Place Bid
                  </Button>
                </form>
                {bidError && (
                  <div className="mt-4 w-full">
                    <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{bidError}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {auctionData.auctionEnded && (
            <Alert className="bg-muted">
              <AlertDescription>This auction has ended.</AlertDescription>
            </Alert>
          )}
          {/* Seller Information Section - Enhanced Classic Layout */}
          <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
          {(() => {
            const sellerId = auctionData.seller?._id || auctionData.sellerId;
            const userId = user?.id || user?._id;
            const isSeller = userId && sellerId && sellerId.toString() === userId.toString();
            const winnerId = auctionData.winner?._id || auctionData.winnerId;
            const isWinner = userId && winnerId && winnerId.toString() === userId.toString();
            // Seller's own view
            if (isSeller) {
              return (
                <div className="relative mt-8 mb-16 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                  {/* Accent bar and icon */}
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-2 h-16 rounded-full bg-gradient-to-b from-green-400 to-green-600 dark:from-green-600 dark:to-green-400"></div>
                    <Star className="h-8 w-8 text-green-500 mt-2 drop-shadow" />
                  </div>
                  {/* Text Content */}
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                      You are the owner of this auction
                    </div>
                    <div className="text-lg text-gray-700 dark:text-gray-200 mb-1">This is your auction listing. Other users will see your profile here.</div>
                  </div>
                </div>
              );
            }
            // Show seller info if available
            if (auctionData.seller && (auctionData.seller.name || auctionData.seller.email || auctionData.seller.id)) {
              return (
                <div className="relative mt-8 mb-16 p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
                  {/* Accent bar and icon */}
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-2 h-16 rounded-full bg-gradient-to-b from-green-400 to-green-600 dark:from-green-600 dark:to-green-400"></div>
                    <Star className="h-8 w-8 text-green-500 mt-2 drop-shadow" />
                  </div>
                  {/* Text Content */}
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                      Seller: {auctionData.seller.name || auctionData.seller.email || auctionData.seller.id}
                    </div>
                    <div className="text-lg text-gray-700 dark:text-gray-200 mb-1">{auctionData.seller.email && <span>Email: {auctionData.seller.email}</span>}</div>
                  </div>
                </div>
              );
            }
            // Anonymous fallback
            return (
              <div className="flex flex-col gap-2 p-6 rounded-xl border-2 border-gray-600 bg-muted/60 mb-8">
                <span className="font-bold text-lg text-gray-200">Seller: Anonymous</span>
                <span className="text-sm text-gray-400">Seller identity is hidden for privacy.</span>
              </div>
            );
          })()}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-lg border p-4 bg-background/80">
              <ShieldCheck className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-semibold">Buyer Protection</p>
                <p className="text-xs text-muted-foreground">Full refund if item not as described</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4 bg-background/80">
              <Truck className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-semibold">Shipping</p>
                <p className="text-xs text-muted-foreground">{auctionData.shipping || "Standard Shipping"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Details Section (Restored) */}
      <div className="mt-10">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="bids">Bid History</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-muted-foreground">{auctionData.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div>
                  <h4 className="text-sm font-medium">Brand</h4>
                  <p className="text-muted-foreground">{auctionData.brand}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Model</h4>
                  <p className="text-muted-foreground">{auctionData.model}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Year</h4>
                  <p className="text-muted-foreground">{auctionData.year}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Condition</h4>
                  <p className="text-muted-foreground">{auctionData.condition}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Location</h4>
                  <p className="text-muted-foreground">{auctionData.location}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="bids" className="mt-6">
            <div className="rounded-lg border">
              <div className="grid grid-cols-3 border-b p-3 text-sm font-medium">
                <div>Bidder</div>
                <div>Amount</div>
                <div>Time</div>
              </div>
              {auctionData.bids.map((bid: any, idx: number) => (
                <div key={bid.id} className="grid grid-cols-3 border-b p-3 text-sm last:border-0 bid-history-item">
                  <div className="font-medium">
                    {bid.user === "You" ? (
                      <span className="text-primary">You (Your Bid)</span>
                    ) : (
                      <span>Bidder {idx + 1}</span>
                    )}
                  </div>
                  <div>₹{bid.amount.toLocaleString()}</div>
                  <div className="text-muted-foreground">{new Date(bid.time).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Shipping</h3>
                <p className="mt-2 text-muted-foreground">
                  This item includes {auctionData.shipping}. The seller will ship the item within 2 business days of
                  receiving payment. International buyers are responsible for any customs duties and taxes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium">Returns</h3>
                <p className="text-muted-foreground">
                  {auctionData.returns}. Please carefully review all photos and description before bidding.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
