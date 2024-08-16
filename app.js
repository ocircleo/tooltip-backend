const express = require("express");
const path = require("path");
const os = require("os");
const GetRoute = require("./routes/GetRoute");
const UserRoute = require("./routes/UserRoute");
const AdminRoute = require("./routes/AdminRoute");
const { AuthRoute } = require("./routes/AuthRoute");
const { FileRoute } = require("./routes/FileRoute");
const router = express.Router();
//static routes
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
router.get("/profileImage", (req, res) => {
  res.sendFile(path.join(__dirname, ""));
});

// main routes for the app

router.use("/get", GetRoute);
router.use("/auth", AuthRoute);
router.use("/user", UserRoute);
router.use("/admin", AdminRoute);
router.use("/file", FileRoute);
router.get("/test", async (req, res) => {
  obj = {
    name: "invoice",
    description: "This is a test app",
    icon: "https://example.com/icon.png",
    publisher_email: "example@gmail.com",
    publish_date: "salman",
    size: 102,
  };
  let filteredObj = {}
  let inclusion = ["publisher_email", "publish_date"];
  for (let key in obj) {
    if (inclusion.includes(key)) continue;
    filteredObj[key] = obj[key]
  }
console.log(filteredObj);
  res.send({ m: true });
});
module.exports = router;
