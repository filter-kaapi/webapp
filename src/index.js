const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const healthzRoute = require('./routes/healthz.js')

app.use("/healthz", healthzRoute);

// Middleware written to capture routse not written above
// Keep app.use at the end of all routes. 
app.use((req, res) => {
  res
    .status(404)
    .set("Cache-Control", "no-cache, no-store, must-revalidate")
    .set("Pragma", "no-cache")
    .end()
});

app.listen(PORT, () => {
  console.log(`The Server is running on port https://localhost:${PORT}`);
});
