require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors")
const indexRouter = require("./routes/index");

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use('/api/auth', require('./routes/auth'))

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((e) => {
    console.log("Wrong..!, "+ e);
  });

module.exports = app;
