import mongoose from 'mongoose';

const demoAccountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountType: {
        type: String,
        enum: ['Standard', 'Pro', 'Raw Spread', 'Zero', 'Standard Cent'],
        default: 'Standard',
        required: true,
    },
    balance: { type: Number, default: 10000 },
    leverage: {
        type: String,
        validate: {
            validator: function (value) {
                // Leverage is required only if customLeverage is not provided
                return this.customLeverage || value;
            },
            message: 'Either leverage or custom leverage must be provided.',
        },
    },
    customLeverage: {
        type: String,
        validate: {
            validator: function (value) {
                // CustomLeverage is required only if leverage is not provided
                return this.leverage || (!value || /^1:\\d+$/.test(value));
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
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DemoTransaction' }],


}, { timestamps: true });

const DemoAccount = mongoose.model('DemoAccount', demoAccountSchema);


export default DemoAccount;
