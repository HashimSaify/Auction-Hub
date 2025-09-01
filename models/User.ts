import mongoose, { Schema, type Document } from "mongoose"
import { hashPassword } from "@/lib/auth"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "user" | "admin"
  avatar?: string
  watchlist?: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password should be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "",
    },
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuctionItem",
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }

  try {
    this.password = await hashPassword(this.password)
    next()
  } catch (error: any) {
    next(error)
  }
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
