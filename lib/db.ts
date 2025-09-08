import mongoose from "mongoose"
// Import models to ensure they are registered
import "./models"

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://User-1:Hatimali53@cluster0.hz2cypa.mongodb.net/auction-hub?retryWrites=true&w=majority&appName=auction-hub"

// Connection state tracking
let isConnected = false
let connectionAttempts = 0
const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
    lastConnectionAttempt: number | null
  }
}

declare const global: GlobalWithMongoose

// Initialize global connection cache
const globalWithMongoose = global as GlobalWithMongoose

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { 
    conn: null, 
    promise: null, 
    lastConnectionAttempt: null 
  }
}

const { mongoose: globalMongoose } = globalWithMongoose

// Connection event handlers
const setConnectionHandlers = (mongooseInstance: typeof mongoose) => {
  mongooseInstance.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully')
    isConnected = true
    connectionAttempts = 0
  })

  mongooseInstance.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err)
    isConnected = false
  })

  mongooseInstance.connection.on('disconnected', () => {
    console.log('ℹ️  MongoDB disconnected')
    isConnected = false
  })
}

export async function connectToDatabase() {
  // Return existing connection if available and healthy
  if (globalMongoose.conn && isConnected) {
    return globalMongoose.conn
  }

  // Prevent multiple connection attempts in parallel
  if (globalMongoose.promise) {
    return globalMongoose.promise
  }

  // Check if we should retry based on last attempt time
  const now = Date.now()
  if (globalMongoose.lastConnectionAttempt && 
      (now - globalMongoose.lastConnectionAttempt) < RETRY_DELAY) {
    throw new Error('Connection attempt too soon after previous attempt')
  }

  globalMongoose.lastConnectionAttempt = now
  connectionAttempts++

  if (connectionAttempts > MAX_RETRIES) {
    throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts`)
  }

  try {
    console.log(`🔌 Attempting to connect to MongoDB (attempt ${connectionAttempts}/${MAX_RETRIES})...`)
    
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      minPoolSize: 1,  // Minimum number of connections in the connection pool
      maxIdleTimeMS: 10000, // Max idle time for a connection in the pool
      retryWrites: true,
      w: 'majority',
      retryReads: true,
      connectTimeoutMS: 10000,
    }

    // Create a new connection promise
    globalMongoose.promise = mongoose.connect(MONGODB_URI, options)
      .then((mongooseInstance) => {
        setConnectionHandlers(mongooseInstance)
        console.log('🎉 MongoDB connection established successfully')
        return mongooseInstance
      })
      .catch((error) => {
        console.error('❌ Failed to connect to MongoDB:', error)
        // Reset connection state on failure
        globalMongoose.promise = null
        isConnected = false
        throw error
      })

    // Wait for the connection to be established
    globalMongoose.conn = await globalMongoose.promise
    return globalMongoose.conn
  } catch (error) {
    console.error('❌ Error in connectToDatabase:', error)
    // Reset connection state on error
    globalMongoose.promise = null
    globalMongoose.conn = null
    isConnected = false
    
    // If we have retries left, wait and retry
    if (connectionAttempts < MAX_RETRIES) {
      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return connectToDatabase()
    }
    
    throw error
  }
}

// Graceful shutdown handler
process.on('SIGINT', async () => {
  try {
    if (mongoose.connection.readyState === 1) { // 1 = connected
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    }
  } catch (err) {
    console.error('Error closing MongoDB connection:', err)
    process.exit(1)
  }
})
