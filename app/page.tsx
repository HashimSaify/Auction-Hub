"use client"

import React from "react"
import Link from "next/link"
import { Gavel, Gem, Users, HelpCircle, ShoppingBag } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-[#f5f7fa] to-[#c3cfe2] dark:from-muted/60 dark:to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 items-center">
            {/* Expanded Welcome Section - Centered on all screens */}
            <div className="flex flex-col justify-center items-center text-center w-full mx-auto space-y-6 max-w-3xl">
              <div className="space-y-4 w-full">
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-[#8e44ad] bg-clip-text text-transparent">
                  Welcome to AuctionHub
                </h1>
                <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
                  Discover, bid, and win exclusive items on the world’s premium auction platform.
                </p>
                <p className="text-lg md:text-xl text-muted-foreground">
                  Experience luxury, excitement, and opportunity—all in one place. Join a vibrant community of buyers and sellers, and unlock access to rare collectibles, art, jewelry, electronics, and more.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center mt-4">
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-12 text-lg font-semibold text-primary-foreground shadow-xl transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="/auctions">
                  <Gavel className="mr-3 h-6 w-6" /> Browse Auctions
                </Link>
                <Link
                  className="inline-flex h-14 items-center justify-center rounded-full border border-primary bg-white px-12 text-lg font-semibold text-primary shadow-xl transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  href="/auth/signup">
                  <Users className="mr-3 h-6 w-6" /> Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auction Section - Improved Layout */}
      <section className="container py-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Auction Card */}
          <div className="flex flex-col items-center bg-gradient-to-br from-[#ede7f6] to-[#f3e5f5] dark:from-muted dark:to-muted rounded-2xl p-8 shadow-xl border border-primary/10 transition-transform hover:scale-105">
            <Gavel className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-primary">Auction</h2>
            <p className="text-center text-muted-foreground mb-4">Bid on rare collectibles, art, jewelry, electronics, and more. Auctions updated daily!</p>
            <Link href="/auctions" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-white font-semibold shadow hover:bg-primary/90 transition">
              Browse Auctions
            </Link>
          </div>
          {/* Selling Card */}
          <div className="flex flex-col items-center bg-gradient-to-br from-[#f3e5f5] to-[#ede7f6] dark:from-muted dark:to-muted rounded-2xl p-8 shadow-xl border border-primary/10 transition-transform hover:scale-105">
            <Gem className="h-12 w-12 text-[#8e44ad] mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-[#8e44ad]">Selling</h2>
            <p className="text-center text-muted-foreground mb-4">List your item in minutes and reach thousands of bidders worldwide.</p>
            <div className="flex flex-col gap-2 w-full">
              <Link href="/sell" className="inline-flex items-center gap-2 rounded-full bg-[#8e44ad] px-6 py-2 text-white font-semibold shadow-lg hover:bg-[#7d3c98] transition w-full justify-center">
                Start Selling
              </Link>
              <Link href="/seller-guidelines" className="inline-flex items-center gap-2 rounded-full border border-[#8e44ad] px-6 py-2 text-[#8e44ad] font-semibold shadow hover:bg-[#8e44ad] hover:text-white transition w-full justify-center">
                Seller Guidelines
              </Link>
              <Link href="/fees" className="inline-flex items-center gap-2 rounded-full border border-[#8e44ad] px-6 py-2 text-[#8e44ad] font-semibold shadow hover:bg-[#8e44ad] hover:text-white transition w-full justify-center">
                Fees & Charges
              </Link>
              <Link href="/shipping" className="inline-flex items-center gap-2 rounded-full border border-[#8e44ad] px-6 py-2 text-[#8e44ad] font-semibold shadow hover:bg-[#8e44ad] hover:text-white transition w-full justify-center">
                Shipping Options
              </Link>
            </div>
          </div>
          {/* Categories Card */}
          <div className="flex flex-col items-center bg-gradient-to-br from-[#ede7f6] to-[#f3e5f5] dark:from-muted dark:to-muted rounded-2xl p-8 shadow-xl border border-primary/10 transition-transform hover:scale-105">
            <HelpCircle className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-primary">Categories</h2>
            <p className="text-center text-muted-foreground mb-4">Browse auctions by category and discover unique items tailored to your interests.</p>
            <Link href="/auctions/categories" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2 text-primary font-semibold hover:bg-primary hover:text-white transition w-full justify-center">
              Browse Categories
            </Link>
          </div>
          {/* Help & Support Card */}
          <div className="flex flex-col items-center bg-gradient-to-br from-[#f3e5f5] to-[#ede7f6] dark:from-muted dark:to-muted rounded-2xl p-8 shadow-xl border border-primary/10 transition-transform hover:scale-105">
            <HelpCircle className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-primary">Help & Support</h2>
            <p className="text-center text-muted-foreground mb-4">Questions? Visit our FAQ or contact our support team for quick assistance.</p>
            <div className="flex flex-col gap-2 w-full">
              <Link href="/faq" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2 text-primary font-semibold hover:bg-primary hover:text-white transition w-full justify-center">
                FAQ
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-primary px-6 py-2 text-primary font-semibold hover:bg-primary hover:text-white transition w-full justify-center">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How AuctionHub Works Section - Universal Theme */}
      <section className="container py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-primary drop-shadow-lg">How AuctionHub Works</h2>
          <div className="grid md:grid-cols-4 gap-10 mt-12">
            {/* Discover */}
            <div className="flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-white via-blue-100 to-blue-200 dark:from-blue-900 dark:via-blue-950 dark:to-blue-900 shadow-xl border border-blue-100 dark:border-blue-800 hover:scale-105 transition-transform">
              <Gavel className="h-14 w-14 text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-300">Discover</h3>
              <p className="text-muted-foreground text-base">Browse a wide range of unique items and collectibles from trusted sellers.</p>
            </div>
            {/* Bid */}
            <div className="flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-white via-purple-100 to-purple-200 dark:from-purple-900 dark:via-purple-950 dark:to-purple-900 shadow-xl border border-purple-100 dark:border-purple-800 hover:scale-105 transition-transform">
              <Gem className="h-14 w-14 text-purple-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-purple-600 dark:text-purple-300">Bid</h3>
              <p className="text-muted-foreground text-base">Place bids in real-time and compete for your favorite items with confidence.</p>
            </div>
            {/* Win */}
            <div className="flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-white via-green-100 to-green-200 dark:from-green-900 dark:via-green-950 dark:to-green-900 shadow-xl border border-green-100 dark:border-green-800 hover:scale-105 transition-transform">
              <ShoppingBag className="h-14 w-14 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-300">Win</h3>
              <p className="text-muted-foreground text-base">Secure your win and enjoy seamless payment and shipping options.</p>
            </div>
            {/* Sell */}
            <div className="flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-white via-yellow-100 to-yellow-200 dark:from-yellow-900 dark:via-yellow-950 dark:to-yellow-900 shadow-xl border border-yellow-100 dark:border-yellow-800 hover:scale-105 transition-transform">
              <Users className="h-14 w-14 text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-yellow-600 dark:text-yellow-300">Sell</h3>
              <p className="text-muted-foreground text-base">List your own items for auction and reach a global audience of eager buyers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AuctionHub Section - Ultra Enhanced */}
      <section className="container py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-primary drop-shadow-lg">Why Choose AuctionHub?</h2>
          <div className="grid md:grid-cols-3 gap-10 mt-12">
            {/* Trusted Platform */}
            <div className="flex flex-col items-center p-10 rounded-3xl bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-blue-900 dark:via-blue-950 dark:to-blue-900 shadow-2xl border border-blue-200 dark:border-blue-800 hover:scale-105 hover:shadow-blue-400/30 transition-transform relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-200/30 rounded-full blur-2xl animate-pulse" />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 drop-shadow-lg"><polygon points="12 2 15 8.5 22 9.3 17 14.1 18.3 21 12 17.8 5.7 21 7 14.1 2 9.3 9 8.5 12 2"/></svg>
              <h3 className="text-2xl font-extrabold mb-2 text-blue-700 dark:text-yellow-200 tracking-tight">Trusted Platform</h3>
              <p className="text-muted-foreground text-base">Buy and sell with confidence on a secure, reputable marketplace.</p>
            </div>
            {/* Fast Shipping */}
            <div className="flex flex-col items-center p-10 rounded-3xl bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-blue-900 dark:via-blue-950 dark:to-blue-900 shadow-2xl border border-blue-200 dark:border-blue-800 hover:scale-105 hover:shadow-blue-400/30 transition-transform relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl animate-pulse" />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 drop-shadow-lg"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h3a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <h3 className="text-2xl font-extrabold mb-2 text-blue-700 dark:text-blue-300 tracking-tight">Fast Shipping</h3>
              <p className="text-muted-foreground text-base">Enjoy quick and reliable shipping options for every purchase.</p>
            </div>
            {/* 24/7 Support */}
            <div className="flex flex-col items-center p-10 rounded-3xl bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-blue-900 dark:via-blue-950 dark:to-blue-900 shadow-2xl border border-blue-200 dark:border-blue-800 hover:scale-105 hover:shadow-blue-400/30 transition-transform relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl animate-pulse" />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4 drop-shadow-lg"><ellipse cx="12" cy="12" rx="10" ry="10"/><path d="M8 15h8M8 11h8M8 7h8"/></svg>
              <h3 className="text-2xl font-extrabold mb-2 text-blue-700 dark:text-purple-200 tracking-tight">24/7 Support</h3>
              <p className="text-muted-foreground text-base">Our dedicated support team is here to help you anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-10 bg-gradient-to-r from-primary/90 to-[#8e44ad]">
        <div className="container flex flex-col items-center justify-center gap-4">
          <h3 className="text-3xl font-bold text-white mb-2 text-center">Ready to join the AuctionHub experience?</h3>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-primary font-bold shadow-lg hover:bg-primary hover:text-white transition text-lg">
            <ShoppingBag className="h-6 w-6" /> Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}
