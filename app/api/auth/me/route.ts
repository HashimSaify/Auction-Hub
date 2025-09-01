import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader && authHeader.split(' ')[1]

    // If no token in header, try to get from cookies
    const cookieToken = request.cookies.get('auth-token')?.value
    
    // Use the token from header or cookies
    const user = await getCurrentUser(token || cookieToken || undefined)

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        } 
      }
    )
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
