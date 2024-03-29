const { configDotenv } = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const user = require("./routes/user.route")
const auth = require("./routes/auth.route");
const cookieParser = require('cookie-parser')
const app = express();
require("dotenv").config();
app.use(bodyParser.json());
app.use(cookieParser())
mongoose  
  .connect(
    process.env.MONGO_URL
  )
  .then(() => {
    console.log("Database connection successfull");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(3000, () => {
  console.log("app is running");
});

app.use("/api/user",user);
app.use("/api/auth",auth);