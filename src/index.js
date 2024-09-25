const express = require('express');
const sequelize = require('./models/models.js');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/healthz', async (req, res) => {

    try {
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

    } catch (error) {
        console.log("---- HEALTH CHECK ERROR STARTS----")
        console.error('Health check failed:', error.message);  
        console.log("---- HEALTH CHECK ERROR ENDS----")
        
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        .set('Pragma','no-cache')

        .status(503)
        .json({
            status: 'Error',
            message:'Connection Unsucessful: healthcheck has failed - Check Db Connection',
        });
    }
});
app.all('/healthz', (req,res) =>{
    res.status(405)
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma','no-cache')
    .json({
        status:'error',
        message: 'Method Not Allowed: only GET requests supported'
    });

});

app.use('*', (req,res)=>{
    res.status(405)
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma','no-cache')
    .json({
        status: 'error',
        message:`${req.method}: This method is not allowed for this endpoint.`,
});
});

app.use((req, res) => {
    res.status(404)
       .set('Cache-Control', 'no-cache, no-store, must-revalidate')
       .set('Pragma', 'no-cache')
       .json({
         status: 'error',
         message: 'Error 404: The resource does not exist.',
       });
  });
app.listen(PORT, () => {
    console.log(`The Server is running on port https://localhost:${PORT}`);
});
