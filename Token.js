var http = require("https");

const router = require("express").Router();

router.post("/postCharge", (req, res) => {
  console.log(
    "********************************* Before Printing*****************************************"
  );
  console.log(req);
  console.log(res);
  console.log(
    "********************************* After Printing*****************************************"
  );
});

module.exports = router;
