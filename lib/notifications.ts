import Notification from "@/models/Notification"

// Call this to create a notification for a user
type NotifyArgs = {
  userId: string
  type: string
  message: string
}
export async function createNotification({ userId, type, message }: NotifyArgs) {
  return await Notification.create({ user: userId, type, message })
}

// Example helpers for common notification types
export async function notifyOutbid(userId: string, auctionTitle: string) {
  return createNotification({
    userId,
    type: "outbid",
    message: `You have been outbid on auction: ${auctionTitle}`,
  })
}

// Notify auction winner
export async function notifyAuctionWon(userId: string, auctionTitle: string, amount?: number, sellerName?: string) {
  return createNotification({
    userId,
    type: "won",
    message: `Congratulations! You won the auction: ${auctionTitle}${amount ? ` for ₹${amount}` : ""}${sellerName ? ` from ${sellerName}` : ""}`,
  })
}

// Notify seller when their item is sold
export async function notifySellerAuctionSold(sellerId: string, auctionTitle: string, winnerName?: string, amount?: number) {
  return createNotification({
    userId: sellerId,
    type: "sold",
    message: `Auction ended: Your item '${auctionTitle}' was sold${winnerName ? ` to ${winnerName}` : ""}${amount ? ` for ₹${amount}` : ""}`,
  })
}

// Notify auction end (generic)
export async function notifyAuctionEnded(userId: string, auctionTitle: string) {
  return createNotification({
    userId,
    type: "ended",
    message: `Auction ended: ${auctionTitle}`,
  })
}
