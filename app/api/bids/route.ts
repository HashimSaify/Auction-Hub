import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Bid from "@/models/Bid"
import AuctionItem from "@/models/AuctionItem"
import { getCurrentUser } from "@/lib/auth"
import { notifyOutbid } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { auctionId, amount } = body

    if (!auctionId || !amount) {
      return NextResponse.json({ error: "Auction ID and bid amount are required" }, { status: 400 })
    }

    // Find the auction
    const auction = await AuctionItem.findById(auctionId)

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Check if auction is active
    if (auction.status !== "active") {
      return NextResponse.json({ error: "This auction is not active" }, { status: 400 })
    }

    // Check if auction has ended
    if (new Date(auction.endTime) < new Date()) {
      // Update auction status to ended
      auction.status = "ended"
      await auction.save()
      return NextResponse.json({ error: "This auction has ended" }, { status: 400 })
    }

    // Check if bid amount is higher than current bid
    if (amount <= auction.currentBid) {
      return NextResponse.json({ error: "Bid amount must be higher than current bid" }, { status: 400 })
    }

    // Check if bid amount meets minimum increment
    if (amount < auction.currentBid + auction.minBidIncrement) {
      return NextResponse.json({ error: `Minimum bid increment is ${auction.minBidIncrement}` }, { status: 400 })
    }

    // Check if user is not the seller
    if (auction.seller.toString() === user.id) {
      return NextResponse.json({ error: "You cannot bid on your own auction" }, { status: 400 })
    }

    // Get previous highest bidder (if any)
    let previousHighestBidder = null
    if (auction.bids && auction.bids.length > 0) {
      const lastBid = await Bid.findById(auction.bids[auction.bids.length - 1])
      if (lastBid && lastBid.bidder.toString() !== user.id) {
        previousHighestBidder = lastBid.bidder.toString()
      }
    }

    // Create bid
    const bid = await Bid.create({
      amount,
      bidder: user.id,
      auction: auctionId,
    })

    // Update auction with new bid and current bid amount
    auction.bids.push(bid._id)
    auction.currentBid = amount
    await auction.save()

    // Notify previous highest bidder if outbid
    if (previousHighestBidder) {
      await notifyOutbid(previousHighestBidder, auction.title || auction._id.toString())
    }

    return NextResponse.json({ bid, currentBid: amount }, { status: 201 })
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const auctionId = searchParams.get("auctionId")
    const userId = searchParams.get("userId")

    if (!auctionId && !userId) {
      return NextResponse.json({ error: "Either auctionId or userId is required" }, { status: 400 })
    }

    const query: any = {}

    if (auctionId) {
      query.auction = auctionId
    }

    if (userId) {
      query.bidder = userId
    }

    // Get bids
    const bids = await Bid.find(query).sort({ createdAt: -1 }).populate("bidder", "name").populate("auction", "title")

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
