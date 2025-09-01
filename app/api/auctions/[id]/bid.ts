import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import AuctionItem from "@/models/AuctionItem"
import Bid from "@/models/Bid"
import { getCurrentUser } from "@/lib/auth"
import mongoose from "mongoose"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()
    const { id } = params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse bid amount from body
    const { amount } = await request.json()
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 })
    }

    // Find the auction
    const auction = await AuctionItem.findById(id).populate("bids")
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }
    if (auction.status !== "active") {
      return NextResponse.json({ error: "Auction is not active" }, { status: 400 })
    }

    // Check bid validity (ensure float comparison)
    const currentBid = parseFloat(auction.currentBid)
    const minBidIncrement = parseFloat(auction.minBidIncrement || 1)
    const bidAmount = parseFloat(amount)
    console.log('DEBUG BID:', { currentBid, minBidIncrement, bidAmount, minAllowed: currentBid + minBidIncrement });
    if (isNaN(bidAmount) || bidAmount < currentBid + minBidIncrement) {
      return NextResponse.json({ error: `Bid must be at least ${currentBid + minBidIncrement}` }, { status: 400 })
    }

    // Create and save the bid
    const bid = await Bid.create({ amount, bidder: user.id, auction: auction._id })
    auction.bids.push(bid._id)
    auction.currentBid = amount
    auction.updatedAt = new Date()
    await auction.save()

    // Populate bidder info for response
    await bid.populate("bidder", "name avatar")

    return NextResponse.json({
      bid: {
        id: bid._id,
        amount: bid.amount,
        user: bid.bidder,
        time: bid.createdAt,
      },
      currentBid: auction.currentBid,
      bids: auction.bids,
    })
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
  }
}
