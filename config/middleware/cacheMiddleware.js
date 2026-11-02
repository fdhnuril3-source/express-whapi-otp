const Redis = require('ioredis');
const redis = new Redis();

const cacheMiddleware = async (req, res, next) => {
    const key = req.originalUrl;

    try {
        // 1. Cek dulu apakah data sudah ada di Redis
        const cachedData = await redis.get(key);

        if (cachedData) {
            console.log(`Data diambil dari cache`);
            return res.status(200).json(JSON.parse(cachedData));
        }

        // 2. Jika belum ada, override res.json untuk menyimpan ke Redis
        const originalJson = res.json;
        res.json = function (data) {
            console.log(`Data untuk ${key} disimpan ke cache`);
            redis.set(key, JSON.stringify(data), 'EX', 30); 
            originalJson.call(this, data);
        };

        next();
    } catch (error) {
        console.error('Error Redis:', error);
        next();
    }
};

module.exports = cacheMiddleware;