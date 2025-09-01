import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import Notification from "@/models/Notification"
import { getCurrentUser } from "@/lib/auth"

// GET /api/notifications - Get notifications for the logged-in user
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    const notifications = await Notification.find({ user: user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase()
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    const body = await request.json().catch(() => ({}));
    if (body.id) {
      // Mark a single notification as read
      await Notification.updateOne({ user: user.id, _id: body.id }, { $set: { read: true } })
    } else {
      // Mark all notifications as read
      await Notification.updateMany({ user: user.id, read: false }, { $set: { read: true } })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
