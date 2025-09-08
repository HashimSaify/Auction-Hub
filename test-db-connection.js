const mongoose = require('mongoose');

// Load environment variables if using .env
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://User-1:Hatimali53@cluster0.hz2cypa.mongodb.net/auction-hub?retryWrites=true&w=majority';

// Set mongoose debug mode
mongoose.set('debug', true);

// Handle connection events
mongoose.connection.on('connecting', () => {
  console.log('🔄 Connecting to MongoDB...');});

mongoose.connection.on('connected', () => {
  console.log('✅ Successfully connected to MongoDB!');});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);});

mongoose.connection.on('disconnected', () => {
  console.log('ℹ️  MongoDB connection disconnected');});

async function testConnection() {
  try {
    console.log('🔍 Attempting to connect to MongoDB...');
    console.log(`Using connection string: ${MONGODB_URI.split('@')[1] || MONGODB_URI}`);
    
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log('\n📊 Database connection details:');
    console.log(`- Host: ${connection.connection.host}`);
    console.log(`- Port: ${connection.connection.port}`);
    console.log(`- Database: ${connection.connection.name}`);
    
    // List all collections to verify access
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\n📂 Available collections:');
      if (collections.length > 0) {
        collections.forEach(collection => {
          console.log(`- ${collection.name}`);
        });
      } else {
        console.log('No collections found in the database!');
      }
      
      // Test AuctionItem model
      const AuctionItem = mongoose.model('AuctionItem');
      const count = await AuctionItem.countDocuments();
      console.log(`\n🔢 Found ${count} auction items in the database`);
      
      if (count > 0) {
        const sampleItem = await AuctionItem.findOne();
        console.log('\n📝 Sample auction item:');
        console.log(sampleItem);
      }
    } catch (dbError) {
      console.error('❌ Error accessing database:', dbError);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

testConnection();
