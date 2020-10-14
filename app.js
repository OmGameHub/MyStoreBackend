require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();

// DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log("DB CONNECTED FAIL", err);
  });


// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// PORT
const port = process.env.PORT || 8000;

// starting a server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
