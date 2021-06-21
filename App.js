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
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  console.log("sssssssssssss: ", path.join("/views/Card.html"));
  res.sendFile(path.join(__dirname + "/views/Card.html"));
});

app.get("tap", (req, res) => {
  res.render("ejsCard");
});
//Routes
app.use("/api/serverCharge", require("./Charge"));

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error("Not Found Error");
  err.status = 404;
  next(err);
});

// production error handler
// no stacktraces leaked to user
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
