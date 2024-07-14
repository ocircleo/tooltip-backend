const express = require("express");
const router = require("./app");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const path = require("path");
//middleware
app.use(cors());
require("dotenv").config();
app.use(express.static(path.join(__dirname, "public")));

//route
app.use("/", router);
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

//listener
app.listen(port, () => {
  console.log("App is running at http://localhost:" + port);
});
