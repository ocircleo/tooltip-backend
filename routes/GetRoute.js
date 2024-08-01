const express = require("express");
const { JwtVerifyFunction } = require("./AuthRoute");
const { NameAvailability } = require("../functions/userFunctions");
const GetRoute = express.Router();
//Main Apis
GetRoute.get("/popular-apps", (req, res, next) => {
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
GetRoute.get("/load-more-apps", (req, res, next) => {
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
GetRoute.get("/load-only", (req, res, next) => {
  // this will take a query params like type="apps" and page like page="10" each page will have 24 elements
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
GetRoute.get("/search", (req, res, next) => {
  // takes in a query params text="app name"
  //performs a string search
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
GetRoute.get("/app/:app_name", (req, res, next) => {
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
GetRoute.get("/file/:url", (req, res, next) => {
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
GetRoute.get("/blogs", (req, res, next) => {
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});

GetRoute.get("/name-check/:name", JwtVerifyFunction, async (req, res) => {
  let result, message;
  let { name } = req.params;
  result = await AppModel.findOne({ name: name });
  if (result) message = ReturnMessage(true, "App name already registered");
  else message = ReturnMessage(false, "App name is available");
  res.send(message);
});
module.exports = GetRoute;
