const compression = require('compression');

const compressionMiddleware = compression({
    level: 9,         // Tingkat kompresi maksimal
    threshold: 1024,  // Hanya mengompresi respons di atas 1024 byte (1 KB)
    filter: (req, res) => {
        const contentType = res.getHeader('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return true;
        }
        return false;
    }
});

module.exports = compressionMiddleware;