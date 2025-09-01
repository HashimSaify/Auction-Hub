import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";
import { getCurrentUser } from "@/lib/auth";

// Add to watchlist
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    const { auctionId } = await request.json();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (!auctionId) {
      return NextResponse.json({ error: "Auction ID required" }, { status: 400 });
    }
    // Ensure auctionId is an ObjectId
    const auctionObjectId = mongoose.Types.ObjectId.isValid(auctionId)
      ? new mongoose.Types.ObjectId(auctionId)
      : auctionId;
    await User.findByIdAndUpdate(
      user.id,
      { $addToSet: { watchlist: auctionObjectId } },
      { new: true }
    );
    // Return populated watchlist
    const foundUser = await User.findById(user.id).lean();
    const auctions = foundUser && foundUser.watchlist && foundUser.watchlist.length > 0
      ? await (await import("@/models/AuctionItem")).default.find({ _id: { $in: foundUser.watchlist } })
          .select("_id title image currentBid category")
          .lean()
      : [];
    return NextResponse.json({ success: true, watchlist: auctions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to watchlist" }, { status: 500 });
  }
}

// Remove from watchlist
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    const { auctionId } = await request.json();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    if (!auctionId) {
      return NextResponse.json({ error: "Auction ID required" }, { status: 400 });
    }
    // Ensure auctionId is an ObjectId
    const auctionObjectId = mongoose.Types.ObjectId.isValid(auctionId)
      ? new mongoose.Types.ObjectId(auctionId)
      : auctionId;
    await User.findByIdAndUpdate(
      user.id,
      { $pull: { watchlist: auctionObjectId } },
      { new: true }
    );
    // Return populated watchlist
    const foundUser = await User.findById(user.id).lean();
    const auctions = foundUser && foundUser.watchlist && foundUser.watchlist.length > 0
      ? await (await import("@/models/AuctionItem")).default.find({ _id: { $in: foundUser.watchlist } })
          .select("_id title image currentBid category")
          .lean()
      : [];
    return NextResponse.json({ success: true, watchlist: auctions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }
}
