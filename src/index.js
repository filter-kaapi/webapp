const express = require('express');
const sequelize = require('./models/models.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/healthz', async (req, res) => {
    try {
        await sequelize.authenticate();  
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(200).send();  
    } catch (error) {
        console.error('Health check failed:', error);  
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.status(503).send();  
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
