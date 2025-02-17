
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const EventEmitter = require('events');
const axios = require('axios');

const token = process.env.META_API_TOKEN;
const accountId = process.env.META_API_ACCOUNT_ID;
let io = null; // Socket instance

// Market data storage
const marketData = {
    BTCUSDm: { bidAskUpdates: [] },
    EURUSDm: { bidAskUpdates: [] },
    GBPUSDm: { bidAskUpdates: [] },
    USDJPYm: { bidAskUpdates: [] },
    AUDUSDm: { bidAskUpdates: [] },
    USDCADm: { bidAskUpdates: [] },
    NZDUSDm: { bidAskUpdates: [] },
    EURGBPm: { bidAskUpdates: [] },
    USDCHFm: { bidAskUpdates: [] },
    XAUUSDm: { bidAskUpdates: [] },
};
const updateEmitter = new EventEmitter(); // Event emitter for updates

// Function to fetch the current price for a symbol
const fetchCurrentPrice = async (authToken, symbol) => {
    const url = `https://mt-client-api-v1.london.agiliumtrade.ai/users/current/accounts/${accountId}/symbols/${symbol}/current-price`;

    try {
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/json',
                'auth-token': authToken,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            console.error(`Rate limit exceeded for ${symbol}. Retrying...`);
        } else {
            console.error(`Error fetching price for ${symbol}:`, error.message);
        }
        return null;
    }
};

// Function to update live market data for a single symbol
const updateMarketData = async (symbol) => {
    const data = await fetchCurrentPrice(token, symbol);

    if (data) {
        const bidAsk = {
            bid: data.bid || 0,
            ask: data.ask || 0,
            timestamp: Date.now(),
        };

        // Maintain a maximum of 5 updates
        const updates = marketData[symbol].bidAskUpdates;
        updates.push(bidAsk);
        if (updates.length > 5) updates.shift();

        // Emit update to all listeners
        updateEmitter.emit('update', { symbol, bidAsk });
        console.log(`Updated ${symbol}:`, bidAsk);

        // Send update via socket.io
        if (io) {
            io.emit('market-data', {
                symbol,
                bidAsk,
                message: `Updated ${symbol}: ${bidAsk.bid} / ${bidAsk.ask}`,
            });
        }
    } else {
        console.log(`Failed to fetch data for ${symbol}`);
        if (io) {
            io.emit('market-data', { message: `Failed to fetch data for ${symbol}` });
        }
    }
};

// Function to fetch and update all symbols concurrently
const fetchAndUpdateAllSymbols = async () => {
    const symbols = Object.keys(marketData);
    const promises = symbols.map((symbol) => updateMarketData(symbol));
    await Promise.all(promises);
};

// Function to continuously fetch and update market data
export const getLiveMarketDataUpdatePrices = async () => {
    while (true) {
        await fetchAndUpdateAllSymbols();
        await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 200ms between batches
    }
};

// Function to start the live market feed
export const startLiveMarketFeed = (socket) => {
    setSocketInstance(socket);

    // Emit market data updates every 2 seconds
    setInterval(async () => {
        await fetchAndUpdateAllSymbols(); // Fetch and emit live data every 2 seconds
    }, 2000);
};

// Set the socket instance for the backend
export const setSocketInstance = (socket) => {
    io = socket;
};