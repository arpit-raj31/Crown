import mongoose from 'mongoose';
import UserTrade from '../models/UserTrades.Modal.js';
import User from '../models/User.js';
import LiveAccount from '../models/User.LiveAccount.model.js';
import axios from 'axios';



export const openTrade = async (userId, tradeData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { symbol, volume, takeProfit, stopLoss, openPrice, type } = tradeData;

        if (!symbol || !volume || !openPrice || takeProfit === undefined || stopLoss === undefined) {
            throw new Error('Symbol, volume, open price, take profit, and stop loss are required.');
        }

        // Find the user
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error('User not found.');
        }

        // Fetch `book` value from user model
        const userBook = user.book;  // This ensures we get the book field

        // Create a new trade entry
        const newTrade = new UserTrade({
            type,
            symbol,
            userId,
            book: userBook,  
            volume: Number(volume),
            openPrice: Number(openPrice),
            takeProfit: Number(takeProfit),
            stopLoss: Number(stopLoss),
            openTime: new Date(),
            status: 'Active',
        });

        // Save the trade in the `UserTrade` collection
        const savedTrade = await newTrade.save({ session });
        console.log(' Trade saved in UserTrade collection:', savedTrade);

        // If `book` is "B Book", stop here (don't execute trade)
        if (userBook === "B Book") {
            user.trades.push(savedTrade._id);
            await user.save({ session });

            await session.commitTransaction();
            session.endSession();
            return { message: 'Trade saved Succesfully', trade: savedTrade };
        }

        // If `book` is "A Book", proceed with execution
        if (userBook === "A Book") {
            const liveAccount = await LiveAccount.findOne({ user: userId }).session(session);
            if (!liveAccount) {
                throw new Error('Live account not found.');
            }

            const leverageValue = parseInt(liveAccount.leverage.split(":")[1]) || 1;
            const tradeCost = Number(openPrice) * Number(volume);
            const balanceDeduction = tradeCost / leverageValue;

            if (liveAccount.balance < balanceDeduction) {
                throw new Error('Insufficient balance in live account.');
            }
            if (liveAccount.leverageBalance < tradeCost) {
                throw new Error('Insufficient leverage balance in live account.');
            }

            liveAccount.balance -= balanceDeduction;
            liveAccount.leverageBalance -= tradeCost;

            await liveAccount.save({ session });

            //  Save trade reference inside user's live account transactions
            liveAccount.transactions.push(savedTrade._id);
            await liveAccount.save({ session });

            //  Link trade to user
            user.trades.push(savedTrade._id);
            await user.save({ session });

            //  Commit the transaction
            await session.commitTransaction();
            session.endSession();

            console.log('Trade executed and saved:', savedTrade);
            return savedTrade;
        }

        throw new Error('Invalid book value');

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(' Error opening trade:', error);
        throw error;
    }
};


// // Function to close an active trade (position)
export const closeTrade = async (userId, tradeId, closePrice) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        //  Find the user
        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error('User not found.');
        }

        //  Find the trade and ensure it belongs to the user
        const trade = await UserTrade.findById(tradeId).session(session);
        if (!trade || trade.status === 'Closed' || !user.trades.includes(tradeId)) {
            throw new Error('Trade not found or unauthorized to close.');
        }

        //  Find the user's LiveAccount
        const liveAccount = await LiveAccount.findOne({ user: userId }).session(session);
        if (!liveAccount) {
            throw new Error('Live account not found.');
        }

        // Extract numerical leverage value
        const leverageValue = parseInt(liveAccount.leverage.split(":")[1]) || 1;

        // Calculate PnL
        const pnl = (closePrice - trade.openPrice) * trade.volume;

        // Update live account balances
        liveAccount.leverageBalance += trade.openPrice * trade.volume; // Restore leverage balance
        liveAccount.balance += pnl / leverageValue; // Apply profit/loss adjusted for leverage

        //Update trade details
        trade.closePrice = closePrice;
        trade.closeTime = new Date();
        trade.pnl = pnl;
        trade.status = 'Closed';
        await trade.save({ session });

        //  Save updated balances
        await liveAccount.save({ session });

        //  Commit the transaction
        await session.commitTransaction();
        session.endSession();

        console.log('Trade closed successfully:', trade);
        return trade;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error closing trade:', error.message);
        throw error;
    }
};
// Function to get the trade history for a specific user
export const getTradeHistory = async (userId) => {
    try {
        // Find the user and populate their trades
        const user = await User.findById(userId).populate('trades');
        if (!user || !user.trades || user.trades.length === 0) {
            throw new Error('No trades found for this user.');
        }

        // console.log('Trade history:', user.trades);
        return user.trades;
    } catch (error) {
        console.error('Error fetching trade history:', error.message);
        throw error;
    }
};


const getLivePrice = async (symbol) => {
    if (!symbol || typeof symbol !== 'string') {
        console.error(`Invalid symbol provided: ${symbol}`);
        return null;
    }

    try {
        const normalizedSymbol = symbol.endsWith("m") ? symbol : `${symbol}m`;
        console.log(`Fetching live price for: ${normalizedSymbol}`);
        
        const response = await axios.get(`https://mt5-heag.onrender.com/market-data`);
        if (response.data[normalizedSymbol]?.length > 0) {
            return response.data[normalizedSymbol][0].bid;
        }

        console.warn(`Live price not available for ${normalizedSymbol}`);
        return null;
    } catch (error) {
        console.error(`Error fetching live price for ${symbol}:`, error.message);
        return null;
    }
};




export const autoCloseTrades = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Get all active trades
        const activeTrades = await UserTrade.find({ status: 'Active' }).session(session);
        if (activeTrades.length === 0) {
            console.log('No active trades found.');
            session.endSession();
            return;
        }

       
        const userIds = [...new Set(activeTrades.map(trade => trade.userId))];

        
        const liveAccounts = await LiveAccount.find({ user: { $in: userIds } }).session(session);
        const liveAccountMap = new Map(liveAccounts.map(account => [account.user.toString(), account]));


        const tradesToUpdate = [];
        const accountsToUpdate = new Set();

        for (let trade of activeTrades) {
            const { userId, symbol, volume, takeProfit, stopLoss, openPrice } = trade;

            const livePrice = await getLivePrice(symbol);
            if (!livePrice) continue; 

         
            const profit = (livePrice - openPrice) * volume;
            const loss = (openPrice - livePrice) * volume;

       
            if (profit >= takeProfit * volume * livePrice || loss >= stopLoss * volume * livePrice) {
                console.log(`Closing trade ${trade._id} for user ${userId}`);

      
                const liveAccount = liveAccountMap.get(userId.toString());
                if (!liveAccount) continue;

              
                const leverageValue = parseInt(liveAccount.leverage.split(":")[1]) || 1;

          
                liveAccount.leverageBalance += openPrice * volume;
                liveAccount.balance += profit / leverageValue;

                trade.closePrice = livePrice;
                trade.closeTime = new Date();
                trade.pnl = profit;
                trade.status = 'Closed';

            
                tradesToUpdate.push(trade);
                accountsToUpdate.add(liveAccount);
            }
        }
        if (tradesToUpdate.length > 0) {
            await Promise.all([
                ...tradesToUpdate.map(trade => trade.save({ session })),
                ...Array.from(accountsToUpdate).map(account => account.save({ session }))
            ]);
        }

        // Commit transaction
        await session.commitTransaction();
        console.log(`Auto-close trades process completed. Closed ${tradesToUpdate.length} trades.`);
    } catch (error) {
        await session.abortTransaction();
        console.error('Error auto-closing trades:', error.message);
    } finally {
        session.endSession();
    }
};


