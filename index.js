const express = require("express");
const router = require("./app");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const path = require("path");
const { default: mongoose } = require("mongoose");
//middleware
// const allowedOrigins = [
//   "https://tooltipstore.vercel.app",
//   "https://another-allowed-origin.com",
// ];
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };
app.use(cors());
require("dotenv").config();
app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ limit: "300mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
//mongoose connect
 
let uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@ocircleo.zgezjlp.mongodb.net/tooltip?retryWrites=true&w=majority`;
// await mongoose.connect("mongodb://localhost:27017/tooltip");
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas", err);
  });

//route
app.use("/", pathMiddleware, router);
app.use("*", pathMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "404.html"));
});

//listener
app.listen(port, () => {
  console.log("App is running at http://localhost:" + port);
});

function pathMiddleware(req, res, next) {
  const path = req.path;
  let method = req.method;
  let date = new Date();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let time = hour + ":" + (minutes < 10 ? "0" + minutes : minutes);
  if (path == "/favicon.ico") return next();
  console.log({ path, method, time });
  next();
}
