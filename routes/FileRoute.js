const express = require("express");
const { JwtVerifyFunction, AuthorizeUser } = require("./AuthRoute");
const multer = require("multer");
const { ReturnMessage } = require("../functions/Utls");
const FileModel = require("../models/FileModel");
const FileRoute = express.Router();
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });
FileRoute.post("/upload-file", JwtVerifyFunction, AuthorizeUser, FileToDb);
FileRoute.delete("/delete-file", JwtVerifyFunction,AuthorizeUser, async(req, res, next) => {
  let {_id} = req.body;
 let result = await FileModel.findByIdAndDelete(_id)
 if(!result) res.send(ReturnMessage(true,"An error Happened"))
  res.send(ReturnMessage(false,"successfully deleted file",result));
});
module.exports = { FileRoute };

async function FileToDb(req, res, next) {
  let { url, size, type,name } = req.body;
  let data = {
    url: url,
    publisher_email: req.user.email,
    size: size,
    type: type,
    state: "published",
    name: name
  };
  let newFile = new FileModel(data);
  let result = await newFile.save();
  if (!result)
    return res.send(ReturnMessage(true, "File uploaded failed", result));
  res.send(ReturnMessage(false, "File uploaded", result));
}


