"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface Auction {
  _id: string;
  title: string;
  image?: string;
  currentBid?: number;
  category?: string;
}

export default function WatchlistPage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    setLoading(true);
    const res = await fetch("/api/user/watchlist");
    if (res.ok) {
      const data = await res.json();
      setWatchlist(data.watchlist || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchWatchlist();
    else setLoading(false);
  }, [user]);

  const handleRemoveFromWatchlist = async (id: string) => {
    await fetch(`/api/user/watchlist`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auctionId: id }),
    });
    fetchWatchlist();
    window.dispatchEvent(new Event("watchlist-updated"));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Sign in to view your Watchlist</h2>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-12">Loading your watchlist...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-primary">
        <Heart className="text-red-500" /> Watchlist
      </h1>
      {watchlist.length === 0 ? (
        <div className="text-center text-muted-foreground mt-12">
          Your watchlist is empty.
        </div>
      ) : (
        <div className="grid gap-6">
          {watchlist.map((auction) => (
            <div
              key={auction._id}
              className="flex items-center gap-4 bg-muted border border-border rounded-lg shadow-sm hover:shadow-lg p-4 transition relative"
            >
              <Link
                href={`/auctions/${auction._id}`}
                className="flex-1 flex items-center gap-4 min-w-0 group"
                style={{ textDecoration: 'none' }}
              >
                {auction.image && (
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-20 h-20 object-cover rounded bg-background border border-border"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate text-foreground group-hover:text-primary">
                    {auction.title}
                  </div>
                  {auction.category && (
                    <div className="text-xs text-muted-foreground">{auction.category}</div>
                  )}
                  {auction.currentBid !== undefined && (
                    <div className="text-sm font-medium text-primary">
                      Current Bid: ₹{auction.currentBid}
                    </div>
                  )}
                </div>
              </Link>
              <button
                className="ml-2 p-2 rounded-full hover:bg-red-200 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                aria-label="Remove from watchlist"
                onClick={() => handleRemoveFromWatchlist(auction._id)}
              >
                <Heart className="text-red-500" fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
