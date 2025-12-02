import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteTitle: string;
  siteIcon: string;
  siteLogo: string;
  seoDescription: string;
  seoKeywords: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>({
  siteTitle: {
    type: String,
    default: 'Shortcuts'
  },
  siteIcon: {
    type: String,
    default: '/favicon.ico'
  },
  siteLogo: {
    type: String,
    default: '/logo.png'
  },
  seoDescription: {
    type: String,
    default: 'Create and manage your URL shortcuts easily'
  },
  seoKeywords: {
    type: String,
    default: 'url shortener, link shortener, custom urls'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ISettings>('Settings', settingsSchema);
