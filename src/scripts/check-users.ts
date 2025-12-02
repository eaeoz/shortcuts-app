import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shortcuts';

async function checkUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`); // Hide password
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n📊 Database Information:');
    if (mongoose.connection.db) {
      console.log(`   - Database name: ${mongoose.connection.db.databaseName}`);
      console.log(`   - Collection: users`);

      // Get all collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('\n📁 Available collections:');
      collections.forEach(col => console.log(`   - ${col.name}`));
    }

    // Check users
    const totalUsers = await User.countDocuments();
    console.log(`\n👥 Total users found: ${totalUsers}`);

    if (totalUsers > 0) {
      console.log('\n📋 User List:');
      const users = await User.find().select('username email role isVerified createdAt').limit(10);
      users.forEach((user, index) => {
        console.log(`\n   ${index + 1}. ${user.username}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      Verified: ${user.isVerified !== undefined ? (user.isVerified ? '✓ Yes' : '✗ No') : '⚠️  Field missing'}`);
        console.log(`      Created: ${user.createdAt}`);
      });

      // Check for users without isVerified field
      const usersWithoutVerified = await User.countDocuments({ isVerified: { $exists: false } });
      console.log(`\n⚠️  Users without isVerified field: ${usersWithoutVerified}`);
    } else {
      console.log('\n⚠️  No users found in database');
      console.log('   This could mean:');
      console.log('   1. The database is actually empty');
      console.log('   2. Users are in a different collection');
      console.log('   3. The MONGODB_URI is pointing to the wrong database');
    }

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run check
checkUsers();
