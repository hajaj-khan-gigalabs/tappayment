const router = require("express").Router();
const axios = require("axios");
const crypto = require("crypto");
const requestSecretToken = process.env.TAPSECRETKEY;
const appSecret = process.env.NEXUDUSSECRETKEY;

router.post("/chargeRequest", async (req, res) => {
  var params = req.body.params;
  const response = await axios
    .post(
      "https://api.tap.company/v2/charges",
      {
        amount: params.amount,
        currency: params.currency,
        threeDSecure: true,
        save_card: false,
        description: "Test description",
        metadata: {
          identifier: params.identifier,
        },
        reference: { transaction: params.reference, order: params.reference },
        customer: {
          first_name: req.body.card.name,
          email: "test@test.com",
          phone: {
            country_code: "965",
            number: "50000000",
          },
        },
        merchant: {
          id: "4516775",
        },
        source: {
          id: req.body.id,
        },
        post: {
          url: decodeURIComponent(params.returnUrl),
        },
        redirect: {
          url: process.env.HOST + "/transction",
        },
      },
      {
        headers: { authorization: "Bearer " + requestSecretToken },
      }
    )
    .then(async (response) => {
      console.log("Resuest Response", response.data);
      let returnURL = await decodeURIComponent(params.returnUrl);
      let ResponceString, hash;
      switch (response.data.status) {
        case "INITIATED":
          return res
            .status(200)
            .json({ redirectUrl: response.data.transaction.url });
        case "CAPTURED ":
          ResponceString =
            "OK|" + response.data.amount * 100 + "|" + params.identifier;
          hash = crypto
            .createHmac("sha256", appSecret)
            .update(ResponceString)
            .digest("hex");
          return res.status(200).json({
            redirectUrl:
              returnURL +
              "&amount=" +
              response.data.amount +
              "&signature=" +
              hash +
              "&result=OK",
          });
        default:
          ResponceString =
            "FAIL|" + response.data.amount * 100 + "|" + params.identifier;
          hash = crypto
            .createHmac("sha256", appSecret)
            .update(ResponceString)
            .digest("hex");
          return res.status(200).json({
            redirectUrl:
              returnURL +
              "&amount=" +
              response.data.amount +
              "&signature=" +
              hash +
              "&result=FAIL",
          });
      }
    })
    .catch(async (err) => {
      console.log("Resuest Error", err);
      let returnURL = await decodeURIComponent(params.returnUrl);
      let ResponceString =
        "FAIL|" + params.amount * 100 + "|" + params.identifier;
      const hash = crypto
        .createHmac("sha256", appSecret)
        .update(ResponceString)
        .digest("hex");
      return res.status(400).json({
        redirectUrl:
          returnURL +
          "&amount=" +
          params.amount +
          "&signature=" +
          hash +
          "&result=FAIL",
      });
    });
});

router.post("/checkCharge", async (req, res) => {
  var params = req.body.params;
  const response = await axios
    .get("https://api.tap.company/v2/charges/" + params.tap_id, {
      headers: { authorization: "Bearer " + requestSecretToken },
    })
    .then(async (response) => {
      console.log("Resuest Response", response);
      let returnURL = await decodeURIComponent(response.data.post.url);
      let ResponceString, hash;
      switch (response.data.status) {
        case "INITIATED":
          return res
            .status(200)
            .json({ redirectUrl: response.data.transaction.url });
        case "CAPTURED":
          ResponceString =
            "OK|" +
            response.data.amount * 100 +
            "|" +
            response.data.metadata.identifier;
          hash = crypto
            .createHmac("sha256", appSecret)
            .update(ResponceString)
            .digest("hex");
          return res.status(200).json({
            redirectUrl:
              returnURL +
              "&amount=" +
              response.data.amount +
              "&signature=" +
              hash +
              "&result=OK",
          });
        default:
          ResponceString =
            "FAIL|" +
            response.data.amount * 100 +
            "|" +
            response.data.metadata.identifier;

          hash = crypto
            .createHmac("sha256", appSecret)
            .update(ResponceString)
            .digest("hex");

          return res.status(200).json({
            redirectUrl:
              returnURL +
              "&amount=" +
              response.data.amount +
              "&signature=" +
              hash +
              "&result=FAIL",
          });
      }
    })
    .catch(async (err) => {
      console.log("Resuest Error", err);
      return res.status(400).json({ err: err });
    });
});

module.exports = router;
