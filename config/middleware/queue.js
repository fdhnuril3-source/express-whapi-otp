const Queue = require('bull');
const kategoriQueue = new Queue('kategoriQueue', {
    redis: { host: '127.0.0.1', port: 6379 }
});

module.exports = kategoriQueue;