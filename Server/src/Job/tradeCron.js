import cron from 'node-cron';
import  {autoCloseTrades}  from '../controllers/UserTradesController.js'; // Import trade closing logic
cron.schedule('* * * * * *', async () => { 
    console.log('Running automatic trade closing...');
    await autoCloseTrades();
});
