import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define Post Schema
const postSchema = new Schema({
    title:  String,
    artist: String,
    metadata:  String,
    date: { type: Date, default: Date.now },
  });

export default mongoose.model('PostEntry', postSchema)
