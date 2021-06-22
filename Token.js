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
  return res.status(200).json({ status: "check" });
});

module.exports = router;
