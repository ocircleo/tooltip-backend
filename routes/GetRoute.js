const express = require("express");
const { JwtVerifyFunction, AuthorizeUser } = require("./AuthRoute");
const AppModel = require("../models/AppModel");
const { ReturnMessage } = require("../functions/Utls");
const FileModel = require("../models/FileModel");
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

GetRoute.get("/name-check", JwtVerifyFunction, async (req, res) => {
  res.send(ReturnMessage(true, "App name is not Available"));
});
GetRoute.get("/name-check/:name", JwtVerifyFunction, async (req, res) => {
  let result, message;
  let { name } = req.params;
  result = await AppModel.findOne({ name:{ $regex: new RegExp(name, "i") } });
  console.log("search results",result);
  if (result) message = ReturnMessage(true, "App name already registered");
  else message = ReturnMessage(false, "App name is available");
  res.send(message);
});
GetRoute.get("/app-detail/:name", async (req, res) => {
  let result, message;
  let { name } = req.params;
  result = await AppModel.findOne({ name: { $regex: new RegExp(name, "i") } });
  console.log(result);
  if (result) message = ReturnMessage(false, "App found", result);
  else message = ReturnMessage(true, "App not found");
  res.send(message);
});
GetRoute.get("/file-detail/:id", async (req, res) => {
  let result, message;
  let { id } = req.params;
  result = await FileModel.findById(id);
  if (result) message = ReturnMessage(false, "File Found", result);
  else message = ReturnMessage(true, "App not found");
  res.send(message);
});
GetRoute.get("/myApps", JwtVerifyFunction, AuthorizeUser, async (req, res) => {
  console.log("Hitting my A[[]] route");
  let result, user;
  user = req.user;
  result = await AppModel.find({ publisher_email: user.email });
  res.send(ReturnMessage(false, "no message", result ? result : []));
});
GetRoute.get("/myFiles", JwtVerifyFunction, AuthorizeUser, async (req, res) => {
  console.log("Hitting my files route");
  let result, user;
  user = req.user;
  result = await FileModel.find({ publisher_email: user.email });
  res.send(ReturnMessage(false, "no message", result ? result : []));
});
module.exports = GetRoute;
