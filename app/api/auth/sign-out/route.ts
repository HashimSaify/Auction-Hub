import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true }, { status: 200 })

    return clearAuthCookie(response)
  } catch (error) {
    console.error("Sign out error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
