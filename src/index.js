const express = require('express');
const sequelize = require('./models/models.js');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/healthz', async (req, res) => {

    try {
        console.log(Object.keys(req.query).length);
        console.log(Object.keys(req.query));
        console.log(Object);
        console.log("~~~")

        if(Object.keys(req.query).length>0){
            return res.status(400)
            .set('Cache-Control', 'no-cache, no-store, must-revalidate')
            .set('Pragma','no-cache')
            .json({
                status:'Error',
                message:"The healthcheck API doesn't accept requests with payload."
            })

        }
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
