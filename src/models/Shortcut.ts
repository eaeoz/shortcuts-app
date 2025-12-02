import mongoose, { Document, Schema } from 'mongoose';

export interface IShortcut extends Document {
  userId: mongoose.Types.ObjectId;
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
  lastAccessed?: Date;
}

const shortcutSchema = new Schema<IShortcut>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4,
    match: /^[a-zA-Z0-9_-]+$/
  },
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date
  }
});

export default mongoose.model<IShortcut>('Shortcut', shortcutSchema);
