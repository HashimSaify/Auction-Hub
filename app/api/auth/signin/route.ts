import { type NextRequest, NextResponse } from "next/server"
import { comparePasswords, signToken, setAuthCookie, hashPassword } from "@/lib/auth"
import { z } from "zod"
import { connectToDatabase } from "@/lib/db"
import User from "@/models/User"

// Validation schema
const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase()

    // Parse request body
    const body = await request.json()

    // Validate input
    const result = signinSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { email, password } = result.data

    // Handle admin login
    if (email.toLowerCase() === 'admin@gmail.com') {
      // For admin, check the specific password
      if (password !== '@Admin786') {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // Find or create admin user
      let admin = await User.findOne({ email: 'admin@gmail.com' })
      
      if (!admin) {
        // Create admin user if it doesn't exist
        const hashedPassword = await hashPassword('@Admin786')
        admin = await User.create({
          name: 'Admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          role: 'admin'
        })
      } else if (admin.role !== 'admin') {
        // Update existing user to admin if needed
        admin.role = 'admin'
        await admin.save()
      }
      
      // Generate JWT token for admin
      const token = await signToken({
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      })

      // Create response
      const response = NextResponse.json(
        {
          success: true,
          user: {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
        { status: 200 },
      )

      // Set auth cookie and return
      return setAuthCookie(response, token)
    }

    // Regular user login
    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const passwordValid = await comparePasswords(password, user.password)

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 },
    )

    // Set auth cookie
    return setAuthCookie(response, token)
  } catch (error) {
    console.error("Signin error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
