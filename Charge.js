const router = require("express").Router();
const axios = require("axios");

router.post("/chargeRequest", async (req, res) => {
  const response = await axios
    .post(
      "https://api.tap.company/v2/charges",
      {
        amount: 1,
        currency: "KWD",
        threeDSecure: true,
        save_card: false,
        description: "Test Description",
        statement_descriptor: "Sample",
        metadata: { udf1: "test 1", udf2: "test 2" },
        reference: { transaction: "txn_0001", order: "ord_0001" },
        receipt: { email: false, sms: false },
        customer: {
          first_name: "test",
          middle_name: "test",
          last_name: "test",
          email: "test@test.com",
          phone: { country_code: "965", number: "50000000" },
        },
        merchant: { id: "4516775" },
        source: { id: req.body.id },
        post: { url: "http://localhost:3001/token/postCharge" },
        redirect: {
          url: "http://127.0.0.1:5500/payment-integration-react/src/RedirectPage.html",
        },
      },
      {
        headers: { authorization: "Bearer sk_live_fI60BOR3UTmyqpgbPSxwEWY7" },
      }
    )
    .then((response) => {
      console.log("Resuest Response", response.data);
      return res.status(200).json(response.data);
    })
    .catch((err) => {
      console.log("Resuest Error", err);
      return res.status(200).json(err);
    });

  //write code to store transaction locally.
});

module.exports = router;
