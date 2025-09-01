import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"
import { getCurrentUser, signToken, setAuthCookie } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const { id } = params
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Only allow users to view their own profile or admins to view any profile
    if (currentUser.id !== id && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const user = await User.findById(id).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const { id } = params
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Only allow users to update their own profile or admins to update any profile
    if (currentUser.id !== id && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const body = await request.json()

    // Don't allow role changes unless admin
    if (body.role && currentUser.role !== "admin") {
      delete body.role
    }

    // Don't allow password updates through this endpoint
    if (body.password) {
      delete body.password
    }

    let updatedUser;
    try {
      updatedUser = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true }).select("-password");
    } catch (err) {
      // Type guard for error
      const errorObj = err as any;
      if (errorObj.code === 11000 && errorObj.keyPattern?.email) {
        return NextResponse.json({ error: "Email already in use." }, { status: 400 });
      }
      return NextResponse.json({ error: errorObj.message || "Failed to update user." }, { status: 400 });
    }

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Issue new JWT and set cookie with updated user info
    const token = await signToken({
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    let response = NextResponse.json({ user: updatedUser });
    response = await setAuthCookie(response, token);
    return response;
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
