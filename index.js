const express = require("express");
const router = require("./app");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { default: mongoose } = require("mongoose");
//middleware
app.use(cors());
require("dotenv").config();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

//mongoose connect
const mongoConnect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/tooltip");
    // await mongoose.connect(
    //   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ocircleo.zgezjlp.mongodb.net/tooltip?retryWrites=true&w=majority`
    // );

    const db = mongoose.connection;

    db.on("error", () => {
      console.log("mongod db connection error");
    });
    db.once("open", () => console.log("connected to mongodb successfully"));
  } catch (error) {
    console.log(error);
  }
};
mongoConnect();

//route
app.use("/", router);
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

//listener
app.listen(port, () => {
  console.log("App is running at http://localhost:" + port);
});
