import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  secretKey: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});


adminSchema.index({ username: 1 }, { unique: true });

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
