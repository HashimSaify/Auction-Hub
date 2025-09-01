import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/AuctionItem";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    // Get the user's watchlist (array of auction IDs)
    const foundUser = await User.findById(user.id).lean();
    if (!foundUser || !foundUser.watchlist || foundUser.watchlist.length === 0) {
      return NextResponse.json({ watchlist: [] });
    }
    // Populate auction details
    const auctions = await Auction.find({ _id: { $in: foundUser.watchlist } })
      .select("_id title image currentBid category")
      .lean();
    return NextResponse.json({ watchlist: auctions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch watchlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const { auctionId } = await request.json();
    if (!auctionId) {
      return NextResponse.json({ error: "Auction ID is required" }, { status: 400 });
    }
    // Remove auctionId from user's watchlist
    await User.findByIdAndUpdate(
      user.id,
      { $pull: { watchlist: auctionId } },
      { new: true }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove from watchlist" }, { status: 500 });
  }
}
