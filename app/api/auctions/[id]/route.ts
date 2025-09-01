import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import AuctionItem from "@/models/AuctionItem"
import { getCurrentUser } from "@/lib/auth"
import mongoose from "mongoose"
import { notifyAuctionWon, notifyAuctionEnded, notifySellerAuctionSold } from "@/lib/notifications"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Ensure database connection
    if (!mongoose.connection.readyState) {
      await connectToDatabase()
    }

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid auction ID format" }, { status: 400 })
    }

    // Find auction by ID and increment views
    const auction = await AuctionItem.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .populate("seller", "name email avatar rating sales joined")
      .populate({
        path: "bids",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "bidder",
          select: "name avatar",
        },
      })
      .populate("watchers", "name")
      .lean()

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Get current user (if authenticated)
    let currentUser = null
    try {
      currentUser = await getCurrentUser()
    } catch {}

    // --- Auction End Logic ---
    // If auction is past endTime and not ended, update DB
    if (auction.status === 'active' && auction.endTime && new Date(auction.endTime) < new Date()) {
      const lastBid = auction.bids && auction.bids.length > 0 ? auction.bids[0] : null;
      const winnerId = lastBid?.bidder?._id?.toString() || lastBid?.bidder?.toString() || null;
      const finalBidAmount = lastBid?.amount || auction.currentBid || auction.startingPrice;
      // DO NOT overwrite seller field here; only update status, soldTo, finalBidAmount
      await AuctionItem.findByIdAndUpdate(auction._id, {
        status: 'ended',
        soldTo: winnerId,
        finalBidAmount,
      });
      // Send notifications
      if (winnerId) {
        await notifyAuctionWon(winnerId, auction.title || auction._id.toString(), finalBidAmount, auction.seller?.name || auction.seller?.toString());
        await notifySellerAuctionSold(
          auction.seller?._id?.toString() || auction.seller?.toString(),
          auction.title || auction._id.toString(),
          lastBid?.bidder?.name || lastBid?.bidder?.toString(),
          finalBidAmount
        );
      }
      if (auction.seller?._id || auction.seller) {
        await notifyAuctionEnded(auction.seller._id?.toString() || auction.seller.toString(), auction.title || auction._id.toString(), finalBidAmount, lastBid?.bidder?.name || winnerId);
      }
      auction.status = 'ended';
      auction.soldTo = winnerId;
      auction.finalBidAmount = finalBidAmount;
      // DO NOT overwrite auction.seller here
    }

    // Determine auction status and winner
    const auctionEnded = auction.status === 'ended' || (auction.endTime && new Date(auction.endTime) < new Date())
    const highestBid = auction.bids && auction.bids.length > 0 ? auction.bids[0] : null
    const winnerId = highestBid?.bidder?._id?.toString() || highestBid?.bidder?.toString() || null
    const sellerId = auction.seller?._id?.toString() || auction.seller?.toString() || null

    // Helper to anonymize bidders
    function anonymizeBids(bids, userId) {
      return bids.map((bid, idx) => {
        // If this is the current user, show 'You'
        if (currentUser && ((bid.bidder?._id && bid.bidder._id.toString() === userId) || (bid.bidder?.toString?.() === userId))) {
          return {
            id: bid._id?.toString() || `bid-${idx}`,
            amount: bid.amount,
            user: 'You',
            avatar: bid.bidder?.avatar || '/placeholder-user.jpg',
            time: bid.createdAt?.toISOString() || new Date().toISOString(),
          }
        }
        // Otherwise, anonymize
        return {
          id: bid._id?.toString() || `bid-${idx}`,
          amount: bid.amount,
          user: `Bidder ${bids.length - idx}`,
          avatar: '/placeholder-user.jpg',
          time: bid.createdAt?.toISOString() || new Date().toISOString(),
        }
      })
    }

    // Seller info privacy
    let sellerInfo = {}
    let winnerInfo = null
    let finalBidAmount = null
    if (auctionEnded && highestBid) {
      winnerInfo = {
        id: highestBid.bidder?._id?.toString() || highestBid.bidder?.toString() || null,
        name: highestBid.bidder?.name || null,
        email: highestBid.bidder?.email || null,
        avatar: highestBid.bidder?.avatar || null,
      }
      finalBidAmount = highestBid.amount || auction.currentBid || auction.startingPrice
    }
    if (auctionEnded && currentUser && winnerId && currentUser.id === winnerId) {
      // Winner sees full seller info
      sellerInfo = {
        id: auction.seller._id?.toString(),
        name: auction.seller.name,
        email: auction.seller.email,
        avatar: auction.seller.avatar,
        rating: auction.seller.rating,
        sales: auction.seller.sales,
        joined: auction.seller.joined,
      }
    } else if (auctionEnded && currentUser && sellerId && currentUser.id === sellerId) {
      // Seller sees full winner info
      sellerInfo = {
        id: highestBid?.bidder?._id?.toString(),
        name: highestBid?.bidder?.name,
        email: highestBid?.bidder?.email,
        avatar: highestBid?.bidder?.avatar,
      }
    } // Otherwise, empty

    // Format auction object for response
    const formattedAuction = {
      ...auction,
      id: auction._id.toString(),
      watchers: auction.watchers?.length || 0,
      endTime: auction.endTime?.toISOString(),
      createdAt: auction.createdAt?.toISOString(),
      updatedAt: auction.updatedAt?.toISOString(),
      bids: anonymizeBids(auction.bids || [], currentUser?.id),
      brand: auction.brand || 'Not specified',
      model: auction.model || 'Not specified',
      year: auction.year || 'Not specified',
      location: auction.location || 'Not specified',
      shipping: auction.shipping || 'Standard shipping',
      returns: auction.returns || 'No returns accepted',
      seller: sellerInfo,
      auctionEnded,
      winner: winnerInfo,
      finalBidAmount,
      winnerId,
      sellerId,
    }

    return NextResponse.json({ auction: formattedAuction })
  } catch (error: any) {
    console.error("Error fetching auction:", error)
    
    // Return more specific error messages
    if (error.name === "CastError") {
      return NextResponse.json({ error: "Invalid auction ID format" }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the auction" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const { id } = params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Find the auction
    const auction = await AuctionItem.findById(id)

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Check if user is the seller or an admin
    if (auction.seller.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch (err) {
      return NextResponse.json({ error: "Invalid request body. Expected JSON." }, { status: 400 })
    }

    // If auction is being marked as ended
    const wasActive = auction.status === "active"
    const isNowEnded = body.status === "ended"

    // Update auction
    const updatedAuction = await AuctionItem.findByIdAndUpdate(id, body, { new: true })

    // Notify winner and seller if auction just ended and there is a winner
    if (wasActive && isNowEnded && updatedAuction && updatedAuction.bids && updatedAuction.bids.length > 0) {
      const lastBidId = updatedAuction.bids[updatedAuction.bids.length - 1]
      const lastBid = await import("@/models/Bid").then(m => m.default.findById(lastBidId))
      if (lastBid) {
        await notifyAuctionWon(lastBid.bidder.toString(), updatedAuction.title || updatedAuction._id.toString())
        await notifyAuctionEnded(updatedAuction.seller.toString(), updatedAuction.title || updatedAuction._id.toString())
      }
    }

    return NextResponse.json({ auction: updatedAuction })
  } catch (error) {
    console.error("Error updating auction:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const { id } = params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Find the auction
    const auction = await AuctionItem.findById(id)

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 })
    }

    // Check if user is the seller or an admin
    if (auction.seller.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Delete auction
    await AuctionItem.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting auction:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
