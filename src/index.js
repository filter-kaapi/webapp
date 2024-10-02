const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const healthzRoute = require('./routes/healthz.js')
const userRoute = require('./routes/userRoutes.js')

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
});


app.use("/healthz", healthzRoute);



app.use("/v1", userRoute);

// Middleware written to capture routse not written above
// Keep app.use at the end of all routes. 
// app.use((req, res) => {
//   res
//     .status(404)
//     .set("Cache-Control", "no-cache, no-store, must-revalidate")
//     .set("Pragma", "no-cache")
//     .end()
// });

app.listen(PORT, () => {
  console.log(`The Server is running on port https://localhost:${PORT}`);
});
module.exports = app;