import mongoose, { Schema, type Document } from "mongoose"

export interface IAuctionItem extends Document {
  title: string
  description: string
  images: string[]
  category: string
  condition: string
  startingPrice: number
  currentBid: number
  minBidIncrement: number
  seller: mongoose.Types.ObjectId
  endTime: Date
  status: "pending" | "active" | "ended" | "sold"
  bids: mongoose.Types.ObjectId[]
  watchers: mongoose.Types.ObjectId[]
  views: number
  shipping: string
  returns: string
  location: string
  soldTo: mongoose.Types.ObjectId | null
  finalBidAmount: number | null
  createdAt: Date
  updatedAt: Date
}

const AuctionItemSchema = new Schema<IAuctionItem>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    images: {
      type: [String],
      required: [true, "Please provide at least one image"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      set: (v: string) => v?.toLowerCase(),
    },
    condition: {
      type: String,
      required: [true, "Please provide the condition"],
    },
    startingPrice: {
      type: Number,
      required: [true, "Please provide a starting price"],
      min: [0, "Starting price cannot be negative"],
    },
    currentBid: {
      type: Number,
      default: function (this: IAuctionItem) {
        return this.startingPrice
      },
    },
    minBidIncrement: {
      type: Number,
      default: 10,
      min: [1, "Minimum bid increment must be at least 1"],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a seller"],
    },
    endTime: {
      type: Date,
      required: [true, "Please provide an end time"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "ended", "sold"],
      default: "active",
    },
    bids: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bid",
      },
    ],
    watchers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    shipping: {
      type: String,
      default: "Standard Shipping",
    },
    returns: {
      type: String,
      default: "No Returns",
    },
    location: {
      type: String,
      default: "Not Specified",
    },
    soldTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    finalBidAmount: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure category is always lowercase before saving
AuctionItemSchema.pre('save', function(next) {
  if (this.category) {
    this.category = this.category.toLowerCase();
  }
  next();
});

// Create indexes for better query performance
AuctionItemSchema.index({ category: 1 })
AuctionItemSchema.index({ status: 1 })
AuctionItemSchema.index({ endTime: 1 })
AuctionItemSchema.index({ currentBid: 1 })

export default mongoose.models.AuctionItem || mongoose.model<IAuctionItem>("AuctionItem", AuctionItemSchema)
