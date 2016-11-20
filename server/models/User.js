import mongoose from 'mongoose';

let userSchema = mongoose.Schema({
  username: String,
  password: String,
  facebook_id: String,
  twitter_id: String,
  google_id: String
})

export default mongoose.model('User', userSchema)
