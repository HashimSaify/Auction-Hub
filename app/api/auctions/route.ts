import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { AuctionItem } from "@/lib/models"
import { getCurrentUser } from "@/lib/auth"
import mongoose from "mongoose"

// Ensure indexes are created
async function ensureIndexes() {
  try {
    await AuctionItem.ensureIndexes()
  } catch (error) {
    console.error("Error ensuring indexes:", error)
  }
}

// Run once when the server starts
let indexesEnsured = false

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    // Ensure indexes are created (only once)
    if (!indexesEnsured) {
      await ensureIndexes()
      indexesEnsured = true
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const sort = searchParams.get("sort") || "endTime"
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const minPrice = parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity")

    // Build query
    const query: any = {}
    if (minPrice > 0 || maxPrice < Infinity) {
      query.currentBid = { $gte: minPrice, $lte: maxPrice }
    }

    if (category) {
      query.category = category
    }

    if (search) {
      // Use text search if available, otherwise fall back to regex
      if (search.length > 2) { // Only use text search for longer queries
        query.$text = { $search: search }
      } else {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ]
      }
    }

    // Build sort
    const sortQuery: any = {}
    switch (sort) {
      case "endTime":
        sortQuery.endTime = 1
        break
      case "priceAsc":
        sortQuery.currentBid = 1
        break
      case "priceDesc":
        sortQuery.currentBid = -1
        break
      case "newest":
        sortQuery.createdAt = -1
        break
      case "mostBids":
        sortQuery.bids = -1
        break
      default:
        sortQuery.endTime = 1
    }

    // Execute optimized query with pagination
    const skip = (page - 1) * limit
    
    // Only fetch necessary fields
    const projection = {
      title: 1,
      description: 1,
      currentBid: 1,
      endTime: 1,
      imageUrl: 1,
      seller: 1,
      bids: { $size: "$bids" }, // Just get the count, not the full array
      createdAt: 1,
      category: 1
    }
    
    // Use estimatedDocumentCount for faster count when possible
    const countPromise = search || category || minPrice > 0 || maxPrice < Infinity
      ? AuctionItem.countDocuments(query)
      : AuctionItem.estimatedDocumentCount()
    
    const [auctions, total] = await Promise.all([
      AuctionItem.find(query, projection)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate("seller", "name")
        .lean()
        .maxTimeMS(5000), // Add timeout to prevent hanging
      countPromise,
    ])

    return NextResponse.json({
      auctions,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total,
      },
    })
  } catch (error: any) {
    console.error("Error fetching auctions:", error)
    return NextResponse.json(
      { error: "Failed to fetch auctions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    // Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse multipart form data
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const condition = formData.get('condition') as string
    const startingPrice = formData.get('startingPrice') as string
    const duration = formData.get('duration') as string
    const imageFiles = formData.getAll('images') as File[]

    // Validate required fields
    const requiredFields = { title, description, category, condition, startingPrice, duration }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)
    
    if (missingFields.length > 0 || imageFiles.length === 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${[...missingFields, imageFiles.length === 0 ? 'images' : ''].filter(Boolean).join(', ')}` },
        { status: 400 }
      )
    }

    // Validate numeric fields
    if (isNaN(parseFloat(startingPrice)) || parseFloat(startingPrice) <= 0) {
      return NextResponse.json(
        { error: "Starting price must be a positive number" },
        { status: 400 }
      )
    }

    // Validate duration field (must be a positive number, allow decimals for testing)
    if (isNaN(parseFloat(duration)) || parseFloat(duration) <= 0) {
      return NextResponse.json(
        { error: "Duration must be a positive number (in days or fractions of a day)" },
        { status: 400 }
      )
    }

    // Process image files and convert to base64
    try {
      const imagePromises = imageFiles.map(async (file) => {
        // Validate file type and size
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}. Only JPG, PNG, and WebP are allowed.`)
        }
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 5MB.`)
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        return `data:${file.type};base64,${buffer.toString('base64')}`
      })

      const images = await Promise.all(imagePromises)

      // Create auction with validated data
      const auctionData = {
        title: title.trim(),
        description: description.trim(),
        category,
        condition,
        startingPrice: parseFloat(startingPrice),
        currentBid: parseFloat(startingPrice),
        minBidIncrement: Math.max(1, Math.floor(parseFloat(startingPrice) * 0.05)), // 5% of starting price or minimum 1
        images,
        // Allow fractional days for duration (e.g., 0.02 = ~30 mins)
        endTime: new Date(Date.now() + parseFloat(duration) * 24 * 60 * 60 * 1000),
        seller: user.id,
        status: "active",
        bids: [],
        watchers: [],
        views: 0,
        shipping: "Standard Shipping",
        returns: "No Returns",
        location: "Not specified",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const auction = await AuctionItem.create(auctionData)

      if (!auction) {
        throw new Error("Failed to create auction in database")
      }

      // Populate seller information
      await auction.populate("seller", "name email avatar")

      return NextResponse.json({ 
        auction: {
          ...auction.toObject(),
          endTime: auction.endTime.toISOString(),
          createdAt: auction.createdAt.toISOString(),
          updatedAt: auction.updatedAt.toISOString()
        }
      }, { status: 201 })
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: "An error occurred while processing images" },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error("Error creating auction:", error)
    
    // Handle MongoDB validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: `Validation failed: ${validationErrors.join(", ")}` },
        { status: 400 }
      )
    }

    // Handle MongoDB cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while creating the auction" },
      { status: 500 }
    )
  }
}
