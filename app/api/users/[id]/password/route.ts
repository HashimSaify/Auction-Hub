import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (currentUser.id !== id && currentUser.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body. Expected JSON." }, { status: 400 });
    }
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
    }
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    user.password = newPassword;
    try {
      await user.save();
    } catch (err: any) {
      // Return validation error message if present
      if (err && err.errors && err.errors.password && err.errors.password.message) {
        return NextResponse.json({ error: err.errors.password.message }, { status: 400 });
      }
      return NextResponse.json({ error: err.message || "Failed to save new password." }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
  }
}
