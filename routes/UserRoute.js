const express = require("express");
const { JwtVerifyFunction, AuthorizeUser } = require("./AuthRoute");
const AppModel = require("../models/AppModel");
const { ReturnMessage } = require("../functions/Utls");
const UserRoute = express.Router();

//Main Routes

//need testing
UserRoute.post("/register-app-name", JwtVerifyFunction, AuthorizeUser, async (req, res) => {
  let result, newApp;
  let { name, description, iconUrl, os, version, orgName } = req.body;
  try {
    //check if app name already taken
    result = await AppModel.findOne({ name: name });
    if (result) return res.send(ReturnMessage(true, "App name already registered"));

    //generates new app and saves it to db
    newApp = new AppModel(NewAppGenerator(name, description, iconUrl, os, version, orgName));
    result = await newApp.save();
    if (result) return res.send(ReturnMessage(false, "App register successful", result));
    else res.send(ReturnMessage(true, "App register failed"));
  } catch (error) {
    res.send(ReturnMessage(true, "App register failed", error));
  }
});
//need testing
UserRoute.put("/update-app-info",JwtVerifyFunction, AuthorizeUser, async (req, res) =>{
    let {data} = req.body;
    let {name} = data
    let result,email_authenticity = false;
    try{
    //finds the app info from db and verifies the publisher email with the requested email
    result = await AppModel.findOne({name:name})
    if(result) email_authenticity = result.publisher_email == req.user.email 
    if(!email_authenticity) return res.send(ReturnMessage(true,"Unauthorized access"));
    //if email matches updates the app data
    if(data?.downloads) data.downloads = result.downloads;
    result = await AppModel.findOneAndUpdate({name: name},data,{new:true})
    if(result) return res.send(ReturnMessage(false,"Update successfully",result));
    else res.send(ReturnMessage(true,"Update failed"))

  }catch(error){
    res.send(ReturnMessage(true,"Update failed",error))
  }
    
  }
);
UserRoute.put("/publish-app", JwtVerifyFunction,AuthorizeUser ,async(req, res, next) => {
  let {name} = req.body;
  let result,email_authenticity = false;
  try{
  //finds the app info from db and verifies the publisher email with the requested email
  result = await AppModel.findOne({name:name})
  if(result) email_authenticity = result.publisher_email == req.user.email 
  if(!email_authenticity) return res.send(ReturnMessage(true,"Unauthorized access"));
  //if email matches updates the app data
  result = await AppModel.findOneAndUpdate({name: name},data,{new:true})
  if(result) return res.send(ReturnMessage(false,"Update successfully",result));
  else res.send(ReturnMessage(true,"Update failed"))

}catch(error){
  res.send(ReturnMessage(true,"Update failed",error))
}
});
UserRoute.put("/update-file-privacy", JwtVerifyFunction, (req, res, next) => {
  console.log("hitting: " + req.path);
  res.send({ path: req.path });
});
UserRoute.post("/send-message", (req, res, next) => {
  console.log("hitting: " + req.path);
  res.send({ path: req.path });
});
module.exports = UserRoute;

function NewAppGenerator(name, description, iconUrl, os, version, orgName) {
  return {
    name: name,
    date_registered: Date.now(),
    description: description,
    price: 0,
    icon: iconUrl,
    images: [],
    tutorial_video: "",
    file_url: "",
    os: os,
    version: version,
    organization: orgName,
    org_url: "null",
    published_by: "null",
    published_status: "pending",
    dev_email: "null",
    publisher_email: "null",
    last_updated: Date.now(),
    downloads: 0,
    latest: true,
  };
}
