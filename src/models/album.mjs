import mongoose from 'mongoose';

const { Schema } = mongoose;

const AlbumSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  photos: [{
    type: Schema.Types.ObjectId,
    ref: 'Photo'
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'albums',
  minimize: false,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  }
});

export default AlbumSchema;
