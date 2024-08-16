const express = require("express");
const { JwtVerifyFunction, AuthorizeUser } = require("./AuthRoute");
const AppModel = require("../models/AppModel");
const { ReturnMessage } = require("../functions/Utls");
const UserRoute = express.Router();
//Main Routes

//need testing
UserRoute.post( "/register-app",JwtVerifyFunction,AuthorizeUser,async (req, res) => {

    let result, newApp, email;
    let { name, description, iconUrl, os, version, orgName } = req.body;
    email = req.decoded.email;

    try {
      //check if app name already taken
      result = await AppModel.findOne({ name: { $regex: new RegExp(name, "i") } });
      if (result) return res.send(ReturnMessage(true, "App name already registered"));

      //generates new app and saves it to db
      newApp = new AppModel( NewAppGenerator(name, description, iconUrl, os, version, orgName, email));
      result = await newApp.save();
      if (result) return res.send(ReturnMessage(false, "App register successful", result));
      res.send(ReturnMessage(true, "App register failed"));

    } catch (error) {
      res.send(ReturnMessage(true, "App register failed", error));
    }
  }
);
//tested
UserRoute.put("/update-app-info",JwtVerifyFunction, AuthorizeUser, async (req, res) => {
    let  data  = req.body;
    let { name } = data;
    let result, email_authenticity = false;

    try {
      //finds the app info from db and verifies the publisher email with the requested email
      result = await AppModel.findOne({ name: { $regex: new RegExp(name, "i") } });
      if (!result) return res.send(ReturnMessage(true,"No app found by the name"+ name)) 
        email_authenticity = result.publisher_email == req.user.email;
      if (!email_authenticity) return res.send(ReturnMessage(true, "user email does not match with publisher email"));

      //if email matches updates the app data
      let filteredObj = filterObject(["downloads","publisher_email","date_registered","name"],data)
       result = await AppModel.findOneAndUpdate({ name: name }, filteredObj, { new: true});
      if (!result) return res.send(ReturnMessage(true, "Update failed"));
       res.send(ReturnMessage(false, "Updated successfully", result));

    } catch (error) {
      res.send(ReturnMessage(true, "Update failed", error));
    }
  }
);
UserRoute.put("/publish-app",JwtVerifyFunction, AuthorizeUser, async (req, res, next) => {
    let { name } = req.body;
    let result, email_authenticity = false;
    try {
      //finds the app info from db and verifies the publisher email with the requested email
      result = await AppModel.findOne({ name: { $regex: new RegExp(name, "i") } });
      if (result) email_authenticity = result.publisher_email == req.decoded.email;
      if (!email_authenticity) return res.send(ReturnMessage(true, "Publisher email and user email does not match"));

      //if email matches updates the app data
      result = await AppModel.findOneAndUpdate(
        { name: name },
        { published_status: "published" },
        { new: true }
      );
      console.log("Published : ",result);
      if (result) return res.send(ReturnMessage(false, "Update successfully", result));
       res.send(ReturnMessage(true, "Update failed"));
    } catch (error) {
      res.send(ReturnMessage(true, "Update failed", error));
    }
  }
);
UserRoute.put("/update-file-privacy", JwtVerifyFunction, (req, res, next) => {
  console.log("hitting: " + req.path);
  res.send({ path: req.path });
});
UserRoute.post("/send-message", (req, res, next) => {
  console.log("hitting: " + req.path);
  res.send({ path: req.path });
});
UserRoute.post("/upload-file", async (req, res) => {
  if (req.file) {
    res.json(ReturnMessage(false, "file uploaded successfully"));
  } else {
    res.status(400).json(ReturnMessage(true, "No file uploaded"));
  }
});
UserRoute.delete("/delete-app",JwtVerifyFunction,AuthorizeUser,async (req,res)=>{
  let {_id} = req.body;
  let result = await AppModel.findByIdAndDelete(_id)
  if(!result) res.send(ReturnMessage(true,"An error Happened"))
   res.send(ReturnMessage(false,"successfully deleted file",result));
})
module.exports = UserRoute;

function NewAppGenerator(
  name,
  description,
  iconUrl,
  os,
  version,
  orgName,
  email
) {
  return {
    name: name,
    fileName: "null",
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
    publisher_email: email,
    last_updated: Date.now(),
    downloads: 0,
    latest: true,
    type: "null",
    size: 0
  };
}
function filterObject (array,obj){
  let filteredObj = {}
  for (let key in obj) {
    if (array.includes(key)) continue;
    filteredObj[key] = obj[key]
  }
  return filteredObj
}