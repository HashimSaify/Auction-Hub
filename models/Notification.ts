import mongoose, { Schema, Document, Types } from "mongoose"

export interface INotification extends Document {
  user: Types.ObjectId
  type: string
  message: string
  read: boolean
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)
