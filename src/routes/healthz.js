// This file includes all the healthz API checkpoints.
// 1. Allows only GET request
// 2. Allows no queries to be passed. 
// 3. Any other method apart from GET gives a 405 Error. 

const express = require("express");
const router = express.Router();
const sequelize = require("../database/sequelize");
const client = require('../../metrics/metrics');

router
  .get("/", async (req, res) => {
    client.increment('api.healthz');
    const start = Date.now();
    try {
      if (req.method == "HEAD") {
        console.log(req.method)
        return res.status(405).end();

      }
      if (Object.keys(req.body).length > 0) {
        console.log(req.body)
        return res.status(405).end();

      }
      if (Object.keys(req.query).length > 0) {
        return res
          .status(400)
          .set("Cache-Control", "no-cache, no-store, must-revalidate")
          .set("Pragma", "no-cache")
          .end();
      }
      await sequelize.authenticate();
      client.timing('api.user.get_self.response_time', Date.now() - start);  // Track response time
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
    if (Object.keys(req.body).length > 0) {
      console.log(req.body)
      return res.status(405).end();

    }
    res
      .status(405) // Method Not Allowed
      .set("Cache-Control", "no-cache, no-store, must-revalidate")
      .set("Pragma", "no-cache")
      .end();
  });


module.exports = router;