const cron = require('node-cron');
const db = require('../models/tokenBlackList');
const { Op } =require('sequelize');

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        await db.TokenBlacklist.destroy({
            where: {
                expiry: { [Op.lt]: now }, // Remove expired tokens
            },
        });
        console.log('Expired tokens cleaned up.');
    } catch (err) {
        console.error('Error during token cleanup:', err);
    }
});
