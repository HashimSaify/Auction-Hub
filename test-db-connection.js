const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://User-1:Hatimali53@cluster0.hz2cypa.mongodb.net/auction-hub?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List all collections to verify access
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

testConnection();
