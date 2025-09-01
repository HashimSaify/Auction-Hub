import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    // Check if user is admin
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search")
    const role = searchParams.get("role")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    if (role) {
      query.role = role
    }

    // Execute query with pagination
    const skip = (page - 1) * limit
    const users = await User.find(query).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 })

    // Get total count for pagination
    const total = await User.countDocuments(query)

    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
