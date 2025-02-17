import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user'], default: 'user' },
  isActive: { type: Boolean, default: true },
  demoAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'DemoAccount' },
  liveAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveAccount' },
 book:{ type:String, default:'A Book'},
  phone: { type: String },
  emailVerified: { type: Boolean, default: false },
   country: { type: String },state: { type: String },
city: { type: String },
 street: { type: String },
  profileImage: { type: String },
  identityProof: { type: String },
  panCard: { type: String },
  trades: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserTrade' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
