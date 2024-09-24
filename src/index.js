const express = require('express');
const sequelize = require('./models/models.js');
const e = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/healthz', async (req, res) => {

    try {
        // console.log(Object.keys(req.query).length);
        // console.log(Object.keys(req.query));
        // console.log(Object);
        // console.log("~~~")
        const startTime = Date.now();

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

        const timeduration = Date.now() - startTime


        res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma','no-cache')
        .status(200)
        .json({
            status:'Success',
            message:"The Application is healthy",
            responseTime: `${timeduration} ms`
        })
        // res.status(200).send();  
    } catch (error) {
        console.log("---- HEALTH CHECK ERROR STARTS----")
        console.error('Health check failed:', error.message);  
        console.log("---- HEALTH CHECK ERROR ENDS----")
        // console.log(error)
        // console.log(error.message)
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma','no-cache')

        .status(503)
        .json({
            status: 'Error',
            message:'The healthcheck has failed - Check Db Connection',
        });
    }
});

app.listen(PORT, () => {
    console.log(`The Server is running on port https://localhost:${PORT}`);
});
