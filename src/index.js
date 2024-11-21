const express = require("express");
const app = express();
require('dotenv').config();
const { connectToDatabase, sequelize } = require('./database/sequelize.js');

const client = require('./metrics/metrics.js');


const PORT = process.env.PORT;
const healthzRoute = require('./routes/healthz.js')
const userRoute = require('./routes/userRoutes.js')



app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
});

app.use((req, res, next) => {
  client.increment(`api.${req.method}.${req.originalUrl.replace(/\//g, '.')}`);
  const start = Date.now();

  res.on('finish', () => {
    client.timing(`response_time.${req.method}.${req.originalUrl.replace(/\//g, '.')}`, Date.now() - start);
  });

  next();
});



app.use("/healthz", healthzRoute);
app.use("/demotest", healthzRoute);

app.use("/v1", userRoute);



// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to database first
    await connectToDatabase();

    // Test the database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Only start the server if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;