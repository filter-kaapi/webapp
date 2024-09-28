const express = require("express");
const sequelize = require("./models/models.js");
const app = express();
const PORT = process.env.PORT || 8080;

app
  .route("/healthz")
  .get(async (req, res) => {
    try {
      if (Object.keys(req.query).length > 0) {
        return res
          .status(400)
          .set("Cache-Control", "no-cache, no-store, must-revalidate")
          .set("Pragma", "no-cache")
          .end();
      }
      await sequelize.authenticate();

      res
        .set("Cache-Control", "no-cache, no-store, must-revalidate")
        .set("Pragma", "no-cache")
        .status(200)
        .end();
    } catch (error) {
      console.log("---- HEALTH CHECK ERROR STARTS----");
      console.error("Health check failed:", error.message);
      console.log("---- HEALTH CHECK ERROR ENDS----");

      res
        .set("Cache-Control", "no-cache, no-store, must-revalidate")
        .set("Pragma", "no-cache")

        .status(503)
        .end();
    }
  })
  .all(async (req, res) => {
    res
      .status(405)
      .set("Cache-Control", "no-cache, no-store, must-revalidate")
      .set("Pragma", "no-cache")
      .end();
  });

app.use((req, res) => {
  res
    .status(404)
    .set("Cache-Control", "no-cache, no-store, must-revalidate")
    .set("Pragma", "no-cache")
    .json({
      status: "error",
      message: "Error 404: The resource does not exist.",
    });
});

app.listen(PORT, () => {
  console.log(`The Server is running on port https://localhost:${PORT}`);
});
