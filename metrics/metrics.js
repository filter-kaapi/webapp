const StatsD = require('hot-shots');
const client = new StatsD({
    host: 'localhost',
    port: 8125,
    // globalTags: { env: process.env.NODE_ENV || 'development' }
});

module.exports = client;
