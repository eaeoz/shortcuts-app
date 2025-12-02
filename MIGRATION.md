# Database Migration Guide

## User Verification Field Migration

### What Changed?
We added an `isVerified` boolean field to the User model to track email verification status.

### For Existing Users

If you have existing users in your database that were created before this update, you need to run the migration script to add the `isVerified` field to all existing users.

### How to Migrate

Run the following command from the project root:

```bash
npm run migrate:users
```

This will:
- ✅ Connect to your MongoDB database
- ✅ Add `isVerified: true` to all existing users (they're considered verified since they already have accounts)
- ✅ Display migration statistics
- ✅ Show verification status of all users

### Expected Output

```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

🔄 Starting user migration...
✅ Migration complete!
   - Users updated: X
   - Users matched: X

📊 Verification Status:
   - Total users: X
   - Verified: X ✓
   - Unverified: X ✗

✅ Database connection closed
```

### What Happens to New Users?

New users will automatically have the `isVerified` field set based on their registration method:

1. **Email Verification Registration** (recommended):
   - User receives a 6-digit code via email
   - Upon successful verification, `isVerified` is set to `true`

2. **Direct Registration** (backward compatibility):
   - `isVerified` is automatically set to `true`

### Admin Features

Administrators can now:
- 👁️ **View verification status** in the Users table
- 🔄 **Toggle verification** by clicking the status badge
- 📋 **See verification status** in user shortcuts modal

### Verification Status Indicators

- 🟢 **Verified** - Green badge with checkmark
- 🟡 **Unverified** - Yellow badge with X icon

### Troubleshooting

**Q: I see "0 users updated" when running the migration**
- This is normal if:
  - Your database is empty
  - All users already have the `isVerified` field
  - This is the first time running the app

**Q: My existing users still show as unverified**
- Make sure you ran the migration: `npm run migrate:users`
- Check that your `.env` file has the correct `MONGODB_URI`
- Restart your server after migration

**Q: Can I run the migration multiple times?**
- Yes! The migration is safe to run multiple times
- It only updates users that don't have the `isVerified` field

### Manual Migration (Alternative)

If you prefer to update users manually via MongoDB shell:

```javascript
// Connect to your database
use shortcuts

// Update all users without isVerified field
db.users.updateMany(
  { isVerified: { $exists: false } },
  { $set: { isVerified: true } }
)

// Check the results
db.users.find({}, { username: 1, email: 1, isVerified: 1 })
```

### Technical Details

**Model Changes:**
```typescript
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isVerified: boolean;  // ← New field
  createdAt: Date;
  lastLogin?: Date;
}
```

**Default Value:**
```typescript
isVerified: {
  type: Boolean,
  default: false
}
```

### Support

If you encounter any issues with the migration, please:
1. Check your MongoDB connection in `.env`
2. Ensure your server has proper database permissions
3. Review the migration logs for specific error messages
4. Check the GitHub issues for similar problems

---

**Note:** This migration is backward compatible and won't affect existing functionality. All users will continue to work normally.
