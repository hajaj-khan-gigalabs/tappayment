const router = require("express").Router();
const axios = require("axios");

router.post("/chargeRequest", async (req, res) => {
  console.log("sssssssssssssss: ", process.env.HOST);
  var params = req.body.params;
  const response = await axios
    .post(
      "https://api.tap.company/v2/charges",
      {
        amount: params.amount,
        currency: params.currency,
        threeDSecure: true,
        save_card: false,
        metadata: { udf1: "test 1", udf2: "test 2" },
        reference: { transaction: params.reference, order: params.reference },
        customer: {
          first_name: req.body.card.name,
          email: "test@test.com",
          phone: { country_code: "965", number: "50000000" },
        },
        merchant: { id: "4516775" },
        source: { id: req.body.id },
        post: { url: "https://tap-payment.herokuapp.com/api/token/postCharge" },
        redirect: {
          url: "https://tap-payment.herokuapp.com/transction",
        },
      },
      {
        headers: { authorization: "Bearer sk_test_7gPAojt2bMQZH4lBURKOur8T" },
      }
    )
    .then((response) => {
      console.log("Resuest Response", response.data);
      return res.status(200).json(response.data);
    })
    .catch((err) => {
      console.log("Resuest Error", err);
      return res.status(400).json(err);
    });

  //write code to store transaction locally.
});

module.exports = router;
