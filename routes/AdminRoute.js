const express = require("express");
const { JwtVerifyFunction } = require("./AuthRoute");
const AdminRoute = express.Router();
AdminRoute.get("/messages", (req, res, next) => {
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
AdminRoute.put("/hide-messages", JwtVerifyFunction, (req, res, next) => {
  console.log("hitting: " + req.path);
  res.send({ path: req.path });
});
AdminRoute.delete("/delete-messages", JwtVerifyFunction, (req, res, next) => {
  console.log("hitting: " + req.path);
  res.send({ path: req.path });
});
module.exports = AdminRoute;
