"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CountdownTimer from "@/components/countdown-timer"
import { useAuth } from "@/contexts/auth-context"

interface BidFormProps {
  auctionId: string
  currentBid: number
  minBidIncrement: number
  endTime: Date
  onBidPlaced?: (amount: number) => void
}

export default function BidForm({ auctionId, currentBid, minBidIncrement, endTime, onBidPlaced }: BidFormProps) {
  const [bidAmount, setBidAmount] = useState(currentBid + minBidIncrement)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isEnded, setIsEnded] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  // Reset bid amount when current bid changes
  useEffect(() => {
    setBidAmount(currentBid + minBidIncrement)
  }, [currentBid, minBidIncrement])

  const handleBidIncrement = () => {
    setBidAmount(bidAmount + minBidIncrement)
    setError(null)
  }

  const handleBidDecrement = () => {
    if (bidAmount > currentBid + minBidIncrement) {
      setBidAmount(bidAmount - minBidIncrement)
      setError(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setBidAmount(value)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login page with return URL
      router.push(`/auth/signin?redirect=/auctions/${auctionId}`)
      return
    }

    // Validate bid amount
    if (bidAmount <= currentBid) {
      setError("Bid must be higher than the current bid")
      return
    }

    if (bidAmount < currentBid + minBidIncrement) {
      setError(`Minimum bid increment is ${minBidIncrement}`)
      return
    }

    if (isEnded) {
      setError("This auction has ended")
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Call backend API to place the bid
      const response = await fetch(`/api/auctions/${auctionId}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: bidAmount }),
      })
      let data
      try {
        data = await response.json()
      } catch (parseErr) {
        // If response is not JSON, show a generic error
        setError("Unexpected server response. Please contact support if this persists.")
        setIsSubmitting(false)
        return
      }
      if (!response.ok) {
        throw new Error(data.error || "Failed to place bid")
      }
      setSuccess(`Your bid of $${bidAmount.toLocaleString()} has been placed!`)
      onBidPlaced && onBidPlaced(bidAmount)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to place bid. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAuctionEnd = () => {
    setIsEnded(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Bid</p>
          <p className="text-2xl font-bold">${currentBid.toLocaleString()}</p>
        </div>
        <CountdownTimer endTime={endTime} onEnd={handleAuctionEnd} className="text-base" />
      </div>

      {!isEnded ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="bid-amount" className="text-sm font-medium">
              Your Bid (Minimum: ${(currentBid + minBidIncrement).toLocaleString()})
            </label>
            <div className="flex mt-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-r-none"
                onClick={handleBidDecrement}
                disabled={bidAmount <= currentBid + minBidIncrement}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Input
                id="bid-amount"
                type="number"
                value={bidAmount}
                onChange={handleInputChange}
                min={currentBid + minBidIncrement}
                step={minBidIncrement}
                className="rounded-none text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-l-none"
                onClick={handleBidIncrement}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert variant="default" className="py-2 bg-success/20 text-success border-success">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting || bidAmount <= currentBid}>
            {isSubmitting ? "Placing Bid..." : isAuthenticated ? "Place Bid" : "Sign In to Bid"}
          </Button>
        </form>
      ) : (
        <Alert className="bg-muted">
          <AlertDescription>This auction has ended</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
