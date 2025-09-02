import { jwtVerify, SignJWT, type JWTPayload } from "jose"
import { cookies } from "next/headers"
import type { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// Authentication configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "4f7d9a2c1e6b0f8c3a5d9e2f7b1c4a8d3e6f9a2c5b8d1e4f7a0c3b6d9e2f5a8"
)
const COOKIE_NAME = "auth-token"
const NODE_ENV = process.env.NODE_ENV || "development"

export type UserRole = "user" | "admin"

export interface UserJwtPayload extends JWTPayload {
  id: string
  email: string
  name: string
  role: UserRole
  [key: string]: unknown // Allow other properties
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export async function signToken(payload: UserJwtPayload): Promise<string> {
  const token = await new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  return token
}

export async function verifyToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as UserJwtPayload
  } catch (error) {
    return null
  }
}

export async function setAuthCookie(response: NextResponse, token: string): Promise<NextResponse> {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return response
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function getCurrentUser(token?: string): Promise<UserJwtPayload | null> {
  try {
    const authToken = token || await getAuthToken()
    if (!authToken) return null

    return await verifyToken(authToken)
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export function clearAuthCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })

  return response
}
