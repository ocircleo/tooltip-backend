const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const AuthRoute = express.Router();
const bcrypt = require("bcrypt");
const { ReturnMessage } = require("../functions/Utls");

//middle were for authentication with jwt

function JwtVerifyFunction(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res
      .status(404)
      .send({ error: true, message: "unauthorized Access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res
        .status(404)
        .send({ error: true, message: "unauthorized Access" });
    }
    req.decoded = decoded;
    next();
  });
}


//tested
AuthRoute.put("/auto_login", JwtVerifyFunction, async (req, res) => {
  let passwordCheck, result, token;
  let { email, key } = req.decoded;
try{
  //checks if any user is available by the email
  result = await UserModel.findOne({ email: email });
  if (!result) return res.send(ReturnMessage(true, "No user found by this email"));
  //checks the password
  passwordCheck = key == result.password;
  if (!passwordCheck) return res.send(ReturnMessage(true, "False Password"));
  //if password matches sends the result
  token = SignJwtFunction({ email, key: result.password });
  res.cookie("accessToken", token).send(ReturnMessage(false,"Login Successful",result));
}catch(error) {
  res.send(ReturnMessage(true, error.message));
}
});
//tested
AuthRoute.put("/login", async (req, res) => {
  let passwordCheck, result, token,finalResPonse;
  let { email, password } = req.body;
try{
  //checks if there is an user by the email
  result = await UserModel.findOne({ email: email });
  if (!result) return res.send(ReturnMessage(true, "No user found by this email"));
  passwordCheck = await BcryptComparer(result.password, password);
  //checks if the passwords matches
  if (!passwordCheck) return res.send(ReturnMessage(true, "False Password"));
 //if password matches sends the result
  token = SignJwtFunction({ email, key: result.password });
  finalResPonse = ReturnMessage(false, "Authenticated user", result)
  finalResPonse.cookie = token
  return res.cookie("accessToken", token).send(finalResPonse);
}catch(error){
  res.send(ReturnMessage(true, error.message,))
}
});
//tested
AuthRoute.post("/register", async (req, res, next) => {
  let hashedPassword, token, result, newUser,finalResPonse;
  let { name, email, password } = req.body;
  try{
  //checks if there is an user by the email
  result = await UserModel.findOne({ email: email });
  if (result) return res.send(ReturnMessage(true, "User already exists by this email"));
  //hashes the password and save user to db
  hashedPassword = await BcryptHasher(password);
  newUser = new UserModel(newUserGenerator(name, email, hashedPassword));
  result = await newUser.save();
  token = SignJwtFunction({ email, key: hashedPassword }); //generates a jwt token
  finalResPonse = ReturnMessage(false, "User created successfully", result);
  finalResPonse.cookie = token
  res.cookie("accessToken", token).send(finalResPonse);
  }catch(error){
    res.send(ReturnMessage(true, error.message));
  }
});
module.exports = { AuthRoute, JwtVerifyFunction, AuthorizeUser };

//Utility function for clean code 
function newUserGenerator(name, email, password, phone = "00000000000") {
  return {
    name: name,
    email: email,
    password: password,
    role: "user",
    profileImage: "https://tooltip-backend.vercel.app/assets/profile.jpg",
    phone: phone,
    country: "Bangladesh",
    city: "Dhaka",
    address: " Dhaka",
    wishlist: [],
    comments: [],
    history: [],
    verified: false,
    paymentHistory: [],
  };
}
function BcryptHasher(text) {
  return bcrypt.hash(text, 10);
}
function BcryptComparer(hashedText, normalText) {
  return bcrypt.compare(normalText, hashedText);
}
function SignJwtFunction(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3d",
  });
}
async function AuthorizeUser(req, res, next) {
  //check if email and password matches and continues while injecting user info in request
  let { email, key } = req.decoded;
  let result = await UserModel.findOne({ email: email });
  if (!result?.email)
    return res.status(404).send(ReturnMessage("User not Found", 404));
  if (result.password == key) {
    req.user = result;
    next();
  }
}

