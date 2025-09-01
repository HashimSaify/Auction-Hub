import mongoose, { Schema, type Document } from "mongoose"

export interface IBid extends Document {
  amount: number
  bidder: mongoose.Types.ObjectId
  auction: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const BidSchema = new Schema<IBid>(
  {
    amount: {
      type: Number,
      required: [true, "Please provide a bid amount"],
      min: [0, "Bid amount cannot be negative"],
    },
    bidder: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a bidder"],
    },
    auction: {
      type: Schema.Types.ObjectId,
      ref: "AuctionItem",
      required: [true, "Please provide an auction"],
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes for better query performance
BidSchema.index({ auction: 1 })
BidSchema.index({ bidder: 1 })
BidSchema.index({ createdAt: -1 })

export default mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema)
