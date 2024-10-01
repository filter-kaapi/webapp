// This file includes all the healthz API checkpoints.
// 1. Allows only GET request
// 2. Allows no queries to be passed. 
// 3. Any other method apart from GET gives a 405 Error. 

const express = require("express");
const router = express.Router();
const sequelize = require("../database/sequelize");

router
  .get("/", async (req, res) => {
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
  .all("/", (req, res) => {
    res
      .status(405) // Method Not Allowed
      .set("Cache-Control", "no-cache, no-store, must-revalidate")
      .set("Pragma", "no-cache")
      .end();
  });



module.exports = router;