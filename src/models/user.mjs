import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  firstname: {
    type: String,
    trim: true,
    default: ''
  },
  lastname: {
    type: String,
    trim: true,
    default: ''
  },
  avatar: {
    type: String,
    trim: true,
    default: ''
  },
  age: {
    type: Number,
    min: 0
  },
  city: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  collection: 'users',
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

export default UserSchema;
