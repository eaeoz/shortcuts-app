import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shortcuts';

async function migrateUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔄 Starting user migration...');
    
    // Update all users that don't have isVerified field
    const result = await User.updateMany(
      { isVerified: { $exists: false } },
      { $set: { isVerified: true } }
    );

    console.log(`✅ Migration complete!`);
    console.log(`   - Users updated: ${result.modifiedCount}`);
    console.log(`   - Users matched: ${result.matchedCount}`);

    // Get verification statistics
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });

    console.log('\n📊 Verification Status:');
    console.log(`   - Total users: ${totalUsers}`);
    console.log(`   - Verified: ${verifiedUsers} ✓`);
    console.log(`   - Unverified: ${unverifiedUsers} ✗`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrateUsers();
