// import mongoose from 'mongoose';


// const tradeSchema = new mongoose.Schema({
//     symbol: { type: String, },
//     type: { type: String, enum: ['Buy', 'Sell'] },
//     volume: { type: Number },
//     openPrice: { type: Number },
//     closePrice: { type: Number, required: false },
//     openTime: { type: Date, default: Date.now },
//     closeTime: { type: Date, required: false },
//     pnl: { type: Number, required: false }, 
//     status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
//     accountBalance: { type: Number, }, 
// }, {
//     timestamps: true, 
// });


// const UserTrade = mongoose.model('UserTrade', tradeSchema);

// export default UserTrade;


import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema(
    {
        symbol: { type: String },
        type: { type: String, enum: ['Buy', 'Sell'] },
        volume: { type: Number },
        openPrice: { type: Number },
        closePrice: { type: Number, required: false },
        takeProfit: { type: Number, required: true },
        stopLoss: { type: Number, required: true },  
        openTime: { type: Date, default: Date.now },
        book: { type: String, required: true },  

        closeTime: { type: Date, required: false },
        pnl: { type: Number, required: false },
        status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
        accountBalance: { type: Number },
    },
    {
        timestamps: true,toJSON: { virtuals: true }, toObject: { virtuals: true } 
    }
);

const UserTrade = mongoose.model('UserTrade', tradeSchema);
export default UserTrade;
