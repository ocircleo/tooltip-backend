const express = require("express");
const router = express.Router();
const path = require("path");
const os = require("os");
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "welcome.html"));
});
router.get("/server-status", (req, res) => {
  let status = {
    type: os.type(),
    platform: os.platform(),
    hostname: os.hostname(),
    uptime: os.uptime(),
    loadavg: os.loadavg(),
    totalmem: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + "GB",
    freemem: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + "GB",
    cpus: os.cpus(),
  };
  res.json(status);
});

module.exports = router;
