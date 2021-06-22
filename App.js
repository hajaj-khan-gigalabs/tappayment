require("dotenv").config();
const express = require("express");
const cors = require("cors");

const path = require("path");
// Create global app object
var app = express();

app.use(cors());
// Normal express config defaults
app.use(express.json());
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  console.log('Welcome To App')
  res.sendFile(path.join(__dirname + "/views/Card.html"));
});

app.get("/transction", function (req, res) {
  console.log('Welcome To Transction Page')
  console.log('88888888888888888888888888888888888',req);
  return res.send(req);
  console.log('***************************************',req.body)
  res.sendFile(path.join(__dirname + "/views/Transction.html"));
});
//Routes

app.use("/api/token", require("./Token"));
app.use("/api/serverCharge", require("./Charge"));

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error("Not Found Error");
  err.status = 404;
  next(err);
});

// production error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// finally, let's start our server...
var server = app.listen(process.env.PORT || 3001, () => {
  console.log("Listening on port " + server.address().port);
});
