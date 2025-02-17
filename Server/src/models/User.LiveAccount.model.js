import mongoose from 'mongoose';
import ShortUniqueId from 'short-uuid';

const liveAccountSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    accountType: {
      type: String,
      enum: ['Standard', 'Pro', 'Raw Spread', 'Zero', 'Standard Cent'],
      default: 'Standard',
      required: true,
    },
    balance: { 
      type: Number, 
      default: 0 
    },
    walletPin: { 
      type: String, 
      required: true, 
      minlength: 4, 
      maxlength: 4 
    },
    leverage: {
      type: String,
      validate: {
        validator: function (value) {
          return this.customLeverage || !!value; // Leverage is required only if customLeverage is not provided
        },
        message: 'Either leverage or custom leverage must be provided.',
      },
    },
    customLeverage: {
      type: String,
      validate: {
        validator: function (value) {
          return !value || /^1:\d+$/.test(value); // CustomLeverage must be in the format "1:number"
        },
        message: 'Custom leverage must be in the format "1:number".',
      },
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP'],
      required: true,
    },
    accountNickname: {
      type: String,
      required: true,
    },
    transactions: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LiveTransaction' 
      }
    ],
    liveAccountUniqueId: {
      type: String,
      unique: true,
      required: true,
      default: () => `BG${ShortUniqueId().generate()}`, // Automatically generate a unique ID prefixed with "BG"
    },
    leverageBalance: {  
      type: Number,  
      default: 0,  // Default leverage balance is 0  
    }
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);



const LiveAccount = mongoose.model('LiveAccount', liveAccountSchema);
export default LiveAccount;
