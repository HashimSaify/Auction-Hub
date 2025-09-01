"use client"

import { Textarea } from "@/components/ui/textarea"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Clock, CreditCard, Gavel, Heart, Package, Settings, ShoppingBag, Star, User } from "lucide-react"
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/contexts/auth-context"; // Import useAuth hook
import { useRouter } from "next/navigation";

// Type definitions for dashboard data
interface Auction {
  id: string;
  item: string;
  image?: string;
  currentBid: number;
  endTime: string;
  status: string;
  bids: number;
  finalBidAmount?: number;
  soldTo?: string;
  seller: string | { _id: string; name?: string }; // Accepts ObjectId or populated object
}

interface Bid {
  id: string;
  item: string;
  image?: string;
  yourBid: number;
  currentBid: number;
  endTime: string;
  status: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

interface Notification {
  _id?: string;
  id?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// --- Normalization helpers ---
function normalizeAuction(a: any): Auction {
  return {
    id: a._id?.toString() ?? a.id,
    item: a.title,
    image: a.images ? a.images[0] : undefined,
    currentBid: a.currentBid,
    endTime: a.endTime,
    status: a.status,
    bids: a.bids ? (Array.isArray(a.bids) ? a.bids.length : a.bids) : 0,
    finalBidAmount: a.finalBidAmount,
    soldTo: a.soldTo,
    seller: a.seller, // Pass through as-is (ObjectId or object)
  }
}
function normalizeBid(b: any): Bid {
  return {
    id: b._id || b.id || "N/A",
    item: b.auction?.title || b.item || "N/A",
    image: b.auction?.images?.[0] || b.image || "/placeholder.svg",
    yourBid: typeof b.amount === "number" ? b.amount : (typeof b.yourBid === "number" ? b.yourBid : "N/A"),
    currentBid: typeof b.auction?.currentBid === "number" ? b.auction.currentBid : (typeof b.currentBid === "number" ? b.currentBid : "N/A"),
    endTime: b.auction?.endTime || b.endTime || "N/A",
    status: b.status || (b.auction?.status ?? "unknown"),
  }
}
function normalizeTransaction(t: any): Transaction {
  return {
    id: t.id,
    date: t.date,
    description: t.description,
    amount: t.amount,
    type: t.type,
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth(); // Get user and refreshUser method from useAuth hook
  const [activeTab, setActiveTab] = useState("dashboard")

  // Dashboard data
  const [activeBids, setActiveBids] = useState<Bid[]>([])
  const [wonItems, setWonItems] = useState<Auction[]>([])
  const [sellingItems, setSellingItems] = useState<Auction[]>([])
  const [soldItems, setSoldItems] = useState<Auction[]>([])
  const [watchlist, setWatchlist] = useState<Auction[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [settingsSuccess, setSettingsSuccess] = useState("")
  const [settingsError, setSettingsError] = useState("")
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const currentPasswordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notifLoading, setNotifLoading] = useState(false)
  const [notifError, setNotifError] = useState("")

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function fetchDashboardData() {
    setLoading(true)
    // 1. Get current user info
    const userId = user?.id
    if (!userId) throw new Error("User ID not found")
    // 2. Fetch dashboard data for user, with safe JSON parsing
    async function safeJson(res: any, fallback: any) {
      if (res.ok) {
        try { return await res.json() } catch { return fallback }
      } else {
        return fallback
      }
    }
    const [bidsRes, sellingRes, wonRes, watchlistRes, transRes] = await Promise.all([
      fetch(`/api/bids?userId=${userId}`),
      fetch(`/api/auctions?seller=${userId}`),
      fetch(`/api/auctions?winner=${userId}`),
      fetch(`/api/users/${userId}/watchlist`),
      fetch(`/api/users/${userId}/transactions`),
    ])
    const [bidsJson, sellingJson, wonJson, watchlistJson, transJson] = await Promise.all([
      safeJson(bidsRes, { bids: [] }),
      safeJson(sellingRes, { auctions: [] }),
      safeJson(wonRes, { auctions: [] }),
      safeJson(watchlistRes, { watchlist: [] }),
      safeJson(transRes, { transactions: [] }),
    ])
    setActiveBids(bidsJson.bids || [])
    setSellingItems((sellingJson.auctions || []).filter(
      (a: Auction) => a.status === "active" && ((typeof a.seller === 'object' ? a.seller._id : a.seller) === userId)
    ))
    setSoldItems((sellingJson.auctions || []).filter(
      (a: Auction) => a.status === "ended" && ((typeof a.seller === 'object' ? a.seller._id : a.seller) === userId)
    ))
    setWonItems((wonJson.auctions || []).filter((a: Auction) => a.soldTo === userId))
    setWatchlist(watchlistJson.watchlist || [])
    setTransactions(transJson.transactions || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (activeTab === "notifications") {
      setNotifLoading(true)
      setNotifError("")
      fetch("/api/notifications")
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch notifications")
          const data = await res.json()
          setNotifications(data.notifications || [])
        })
        .catch(() => setNotifError("Could not load notifications."))
        .finally(() => setNotifLoading(false))
    }
  }, [activeTab])

  async function handleSaveProfile() {
    setSettingsSuccess(""); setSettingsError("")
    try {
      const res = await fetch(`/api/users/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameRef.current ? nameRef.current.value : user?.name || "",
          email: emailRef.current ? emailRef.current.value : user?.email || "",
        })
      })
      if (res.ok) {
        setSettingsSuccess("Profile updated successfully.");
        await refreshUser();
        router.refresh();
      } else {
        const err = await res.json()
        setSettingsError(err.error || "Failed to update profile.")
      }
    } catch (e) {
      setSettingsError("Failed to update profile.")
    }
  }

  async function handleUpdatePassword() {
    setPasswordSuccess(""); setPasswordError("")
    if ((newPasswordRef.current?.value ?? "") !== (confirmPasswordRef.current?.value ?? "")) {
      setPasswordError("New passwords do not match."); return
    }
    try {
      const res = await fetch(`/api/users/${user?.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPasswordRef.current?.value ?? "",
          newPassword: newPasswordRef.current?.value ?? "",
        })
      })
      if (res.ok) {
        setPasswordSuccess("Password updated successfully.")
      } else {
        const err = await res.json()
        setPasswordError(err.error || "Failed to update password.")
      }
    } catch (e) {
      setPasswordError("Failed to update password.")
    }
  }

  async function refetchUserData() {
    setLoading(true)
    const userRes = await fetch("/api/auth/me")
    const userJson = await userRes.json()
    if (userJson.user) {
      setLoading(false)
    }
  }

  async function handleEndAuction(auctionId: string) {
    try {
      const res = await fetch(`/api/auctions/${auctionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ended" })
      });
      if (res.ok) {
        // Refresh selling items after ending auction
        await fetchDashboardData();
      } else {
        let errMsg = "Failed to end auction.";
        try {
          const err = await res.json();
          errMsg = err.error || errMsg;
          console.error("Backend error:", err);
        } catch (errParse) {
          console.error("Error parsing backend response:", errParse);
        }
        alert(errMsg);
      }
    } catch (e) {
      console.error("End auction error:", e);
      alert("An error occurred while ending the auction.");
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-xl">Loading dashboard...</div>
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
          <p className="text-muted-foreground">Manage your account settings, bids, and listings</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
          {/* Sidebar Navigation */}
          <div className="hidden md:block">
            <nav className="flex flex-col space-y-1">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === "bids" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("bids")}
              >
                <Gavel className="mr-2 h-4 w-4" />
                My Bids
              </Button>
              <Button
                variant={activeTab === "won" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("won")}
              >
                <Star className="mr-2 h-4 w-4" />
                Won Items
              </Button>
              <Button
                variant={activeTab === "selling" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("selling")}
              >
                <Package className="mr-2 h-4 w-4" />
                Selling
              </Button>
              <Button
                variant={activeTab === "watchlist" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("watchlist")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Watchlist
              </Button>
              <Button
                variant={activeTab === "transactions" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("transactions")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Transactions
              </Button>
              <Button
                variant={activeTab === "notifications" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("notifications")}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            <Tabs defaultValue="dashboard" onValueChange={setActiveTab} value={activeTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="dashboard">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="sr-only">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="bids">
                  <Gavel className="h-4 w-4" />
                  <span className="sr-only">Bids</span>
                </TabsTrigger>
                <TabsTrigger value="selling">
                  <Package className="h-4 w-4" />
                  <span className="sr-only">Selling</span>
                </TabsTrigger>
                <TabsTrigger value="more">
                  <span>More</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ₹{typeof user?.balance === "number" ? user.balance.toFixed(2) : "0.00"}
                      </div>
                      <p className="text-xs text-muted-foreground">Available for bidding and purchases</p>
                    </CardContent>
                  </Card>
                  <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Bids</CardTitle>
                      <Gavel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{activeBids.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {activeBids.filter((bid: Bid) => bid.status === "winning").length} winning
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="flex-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Selling</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{sellingItems.length}</div>
                      <p className="text-xs text-muted-foreground">
                        {sellingItems.filter((item: Auction) => item.status === "active").length} active listings
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Overview</CardTitle>
                    <CardDescription>Your account information and statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6 sm:flex-row">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <User className="h-8 w-8" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{user?.name}</h3>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Member since</span>
                            <span>{user?.joined}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rating</span>
                            <span className="flex items-center">
                              {user?.rating}
                              <Star className="ml-1 h-3 w-3 fill-amber-500 text-amber-500" />
                              <span className="ml-1 text-muted-foreground">({user?.reviews} reviews)</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <Separator orientation="vertical" className="hidden sm:block" />
                      <div className="flex-1 space-y-4">
                        <h3 className="font-semibold">Recent Activity</h3>
                        <div className="space-y-2">
                          {activeBids.slice(0, 2).map((bid: Bid, idx: number) => (
                            <div key={bid.id || idx} className="flex items-center gap-2 text-sm">
                              <Gavel className="h-4 w-4 text-muted-foreground" />
                              <span>
                                You bid ₹{bid.yourBid} on{" "}
                                <Link href={`/auctions/${bid.id}`} className="font-medium hover:underline">
                                  {bid.item}
                                </Link>
                              </span>
                            </div>
                          ))}
                          {transactions.slice(0, 2).map((transaction: Transaction, idx: number) => (
                            <div key={transaction.id || idx} className="flex items-center gap-2 text-sm">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {transaction.type === "purchase"
                                  ? "You purchased"
                                  : transaction.type === "sale"
                                    ? "You sold"
                                    : "You added funds"}
                                {transaction.type !== "deposit" &&
                                  ` ${transaction.description.split(" for ")[1] || ""}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Active Bids</CardTitle>
                      <CardDescription>Your current bidding activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activeBids.length > 0 ? (
                          activeBids.map(normalizeBid).map((bid: Bid, idx: number) => (
                            <div key={bid.id || idx} className="flex items-center gap-4">
                              <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={bid.image || "/placeholder.svg"}
                                  alt={bid.item}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <Link href={`/auctions/${bid.id}`} className="font-medium hover:underline">
                                    {bid.item}
                                  </Link>
                                  <Badge variant={bid.status === "winning" ? "default" : "destructive"}>
                                    {bid.status === "winning" ? "Winning" : "Outbid"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Your bid: ₹{bid.yourBid}</span>
                                  <span className="flex items-center text-amber-600">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {bid.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">Current bid: ₹{bid.currentBid}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">You have no active bids</div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("bids")}>
                          View All Bids
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Watchlist</CardTitle>
                      <CardDescription>Items you're watching</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {watchlist.length > 0 ? (
                          watchlist.map(normalizeAuction).map((item: Auction, idx: number) => (
                            <div key={item.id || idx} className="flex items-center gap-4">
                              <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.item}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <Link href={`/auctions/${item.id}`} className="font-medium hover:underline">
                                  {item.item}
                                </Link>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Current bid: ₹{item.currentBid}</span>
                                  <span className="flex items-center text-amber-600">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {item.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">{item.bids} bids</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            You have no items in your watchlist
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("watchlist")}>
                          View Watchlist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Bids Tab */}
            {activeTab === "bids" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Bids</CardTitle>
                  <CardDescription>Track all your current and past bids</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active">
                    <TabsList className="mb-4">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="won">Won</TabsTrigger>
                      <TabsTrigger value="lost">Lost</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                      <div className="space-y-4">
                        {activeBids.length > 0 ? (
                          activeBids.map(normalizeBid).map((bid: Bid, idx: number) => (
                            <div key={bid.id || idx} className="flex items-center gap-4 border-b pb-4 last:border-0">
                              <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={bid.image || "/placeholder.svg"}
                                  alt={bid.item}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <Link href={`/auctions/${bid.id}`} className="font-medium hover:underline">
                                    {bid.item}
                                  </Link>
                                  <Badge variant={bid.status === "winning" ? "default" : "destructive"}>
                                    {bid.status === "winning" ? "Winning" : "Outbid"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Your bid: ₹{bid.yourBid}</span>
                                  <span className="flex items-center text-amber-600">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {bid.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">Current bid: ₹{bid.currentBid}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Bid Again
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4" />
                                  <span className="sr-only">Add to watchlist</span>
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">You have no active bids</div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="won">
                      <div className="space-y-4">
                        {wonItems.length > 0 ? (
                          wonItems.map(normalizeAuction).map((item: Auction, idx: number) => (
                            <div key={item.id || idx} className="flex items-center gap-4 border-b pb-4 last:border-0">
                              <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.item}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <Link href={`/auctions/${item.id}`} className="font-medium hover:underline">
                                    {item.item}
                                  </Link>
                                  <Badge variant={item.status === "paid" ? "outline" : "default"}>
                                    {item.status === "paid" ? "Paid" : "Shipped"}
                                  </Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Final price: ₹{item.finalBidAmount}</span>
                                  <span className="text-muted-foreground">Won on {item.endTime}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  {item.status === "paid" ? "Track Package" : "Leave Feedback"}
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">You haven't won any items yet</div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="lost">
                      <div className="text-center py-8 text-muted-foreground">No lost bids to display</div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Won Items Tab */}
            {activeTab === "won" && (
              <Card>
                <CardHeader>
                  <CardTitle>Won Items</CardTitle>
                  <CardDescription>Items you've successfully won in auctions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wonItems.length > 0 ? (
                      wonItems.map(normalizeAuction).map((item: Auction, idx: number) => (
                        <div key={item.id || idx} className="flex items-center gap-4 border-b pb-4 last:border-0">
                          <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.item}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <Link href={`/auctions/${item.id}`} className="font-medium hover:underline">
                                {item.item}
                              </Link>
                              <Badge variant={item.status === "paid" ? "outline" : "default"}>
                                {item.status === "paid" ? "Paid" : "Won"}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Final price: ₹{item.finalBidAmount}</span>
                              <span className="text-muted-foreground">Won on {item.endTime}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              {item.status === "paid" ? "Track Package" : "Leave Feedback"}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">You haven't won any items yet</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selling Tab */}
            {activeTab === "selling" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Selling</CardTitle>
                    <CardDescription>Manage your auction listings</CardDescription>
                  </div>
                  <Button size="sm">
                    <Link href="/sell">Create New Listing</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="active">
                    <TabsList className="mb-4">
                      <TabsTrigger value="active">Active</TabsTrigger>
                      <TabsTrigger value="sold">Sold</TabsTrigger>
                      <TabsTrigger value="drafts">Drafts</TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                      <div className="space-y-4">
                        {sellingItems.length > 0 ? (
                          sellingItems.map(normalizeAuction).map((item: Auction, idx: number) => (
                            <div key={item.id || idx} className="flex items-center gap-4 border-b pb-4 last:border-0">
                              <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.item}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <Link href={`/auctions/${item.id}`} className="font-medium hover:underline">
                                    {item.item}
                                  </Link>
                                  <Badge>Active</Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Current bid: ₹{item.currentBid}</span>
                                  <span className="flex items-center text-amber-600">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {item.endTime}
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">{item.bids} bids</div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEndAuction(item.id)}>
                                  End
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">No active listings</div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="sold">
                      <div className="space-y-4">
                        {soldItems.length > 0 ? (
                          soldItems.map(normalizeAuction).map((item: Auction, idx: number) => (
                            <div key={item.id || idx} className="flex items-center gap-4 border-b pb-4 last:border-0">
                              <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.item}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <Link href={`/auctions/${item.id}`} className="font-medium hover:underline">
                                    {item.item}
                                  </Link>
                                  <Badge>Sold</Badge>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Final price: ₹{item.finalBidAmount ?? "-"}</span>
                                  <span className="text-muted-foreground">Sold to: {item.soldTo ?? "-"}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">No sold items to display</div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="drafts">
                      <div className="space-y-4">
                        {sellingItems.length > 0 ? (
                          sellingItems.map(normalizeAuction).map((item: Auction, idx: number) => (
                            <div key={item.id || idx} className="flex items-center gap-4 border-b pb-4 last:border-0">
                              <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.item}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">{item.item}</span>
                                  <Badge variant="outline">Draft</Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">Not yet published</div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="default" size="sm">
                                  Publish
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">No draft listings</div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Watchlist Tab */}
            {activeTab === "watchlist" && (
              <Card>
                <CardHeader>
                  <CardTitle>Watchlist</CardTitle>
                  <CardDescription>Items you're watching</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {watchlist.length > 0 ? (
                      watchlist.map(normalizeAuction).map((item: Auction, idx: number) => (
                        <div key={item.id || idx} className="flex items-center gap-4 border-b pb-4 last:border-0">
                          <div className="h-20 w-20 overflow-hidden rounded-md bg-muted">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.item}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <Link href={`/auctions/${item.id}`} className="font-medium hover:underline">
                              {item.item}
                            </Link>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Current bid: ₹{item.currentBid}</span>
                              <span className="flex items-center text-amber-600">
                                <Clock className="mr-1 h-3 w-3" />
                                {item.endTime}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground">{item.bids} bids</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Bid Now
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4 fill-current" />
                              <span className="sr-only">Remove from watchlist</span>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">You have no items in your watchlist</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transactions Tab */}
            {activeTab === "transactions" && (
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your payment and transaction history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map(normalizeTransaction).map((transaction: Transaction, idx: number) => (
                          <TableRow key={transaction.id || idx}>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.description}</TableCell>
                            <TableCell className={`text-right ${transaction.amount > 0 ? "text-green-600" : ""}`}>
                              {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-xl font-bold">
                        ₹{typeof user?.balance === "number" ? user.balance.toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <Button>Add Funds</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Your latest notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifLoading ? (
                    <div className="py-8 text-center text-muted-foreground">Loading...</div>
                  ) : notifError ? (
                    <div className="py-8 text-center text-red-600">{notifError}</div>
                  ) : notifications.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground">No notifications yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((n: Notification, idx: number) => (
                        <div key={n._id || n.id || idx} className={`rounded-md border px-4 py-3 flex items-center gap-4 ${n.read ? 'bg-muted' : 'bg-muted/50'}`}> 
                          <div className="flex-1">
                            <div className="font-medium">{n.message}</div>
                            <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                          </div>
                          {!n.read && <span className="text-xs text-amber-600 font-bold">New</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account settings and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="profile">
                    <TabsList className="mb-4">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                      <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user?.name || ""} ref={nameRef} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={user?.email || ""} ref={emailRef} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="Add a phone number" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="address">Shipping Address</Label>
                          <Textarea id="address" placeholder="Add a shipping address" />
                        </div>
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                        {settingsSuccess && <p className="text-green-600">{settingsSuccess}</p>}
                        {settingsError && <p className="text-red-600">{settingsError}</p>}
                      </div>
                    </TabsContent>
                    <TabsContent value="security">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input id="current-password" type={showCurrentPassword ? "text" : "password"} ref={currentPasswordRef} />
                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCurrentPassword(v => !v)} tabIndex={-1}>
                              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input id="new-password" type={showNewPassword ? "text" : "password"} ref={newPasswordRef} />
                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNewPassword(v => !v)} tabIndex={-1}>
                              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} ref={confirmPasswordRef} />
                            <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowConfirmPassword(v => !v)} tabIndex={-1}>
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <Button onClick={handleUpdatePassword}>Update Password</Button>
                        {passwordSuccess && <p className="text-green-600">{passwordSuccess}</p>}
                        {passwordError && <p className="text-red-600">{passwordError}</p>}
                      </div>
                    </TabsContent>
                    <TabsContent value="payment">
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-5 w-5" />
                              <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/25</p>
                              </div>
                            </div>
                            <Badge>Default</Badge>
                          </div>
                        </div>
                        <Button variant="outline">Add Payment Method</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
