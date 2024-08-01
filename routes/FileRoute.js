const express = require("express");
const { JwtVerifyFunction } = require("./AuthRoute");
const FileRoute = express.Router();
FileRoute.post("/upload-file", JwtVerifyFunction, (req, res, next) => {
  //can contain any type of file may be image or others file path will told by user from front end
  console.log("hitting : " + req.path);
  res.send({ path: req.path });
});
FileRoute.delete("/delete-file", JwtVerifyFunction, (req, res, next) => {
  console.log("hitting: " + req.path);
  res.send({ path: req.path });
});
module.exports = FileRoute;
