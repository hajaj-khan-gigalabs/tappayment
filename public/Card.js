//pass your public key from tap's dashboard
var tap = Tapjsli("pk_live_OHQUgMAmBfpnv1ol65Sty3xX");
let apiUrl = "https://www.minmaxopt.com/api";
// let apiUrl = "http://localhost:3000/api";

var elements = tap.elements({});
var style = {
  base: {
    color: "#535353",
    lineHeight: "18px",
    fontFamily: "sans-serif",
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "rgba(0, 0, 0, 0.26)",
      fontSize: "15px",
    },
  },
  invalid: {
    color: "red",
  },
};
// input labels/placeholders
var labels = {
  cardNumber: "Card Number",
  expirationDate: "MM/YY",
  cvv: "CVV",
  cardHolder: "Card Holder Name",
};
//payment options
var paymentOptions = {
  currencyCode: ["KWD", "USD", "SAR"],
  labels: labels,
  TextDirection: "ltr",
  paymentAllowed: ["VISA", "MASTERCARD", "MADA", "AMEX"],
};
//create element, pass style and payment options
var card = elements.create("card", { style: style }, paymentOptions);
//mount element
card.mount("#element-container");

// Handle form submission
var form = document.getElementById("form-container");
form.addEventListener("submit", function (event) {
  event.preventDefault();

  tap.createToken(card).then(function (result) {
    postToServer(result);
    if (result.error) {
      // Inform the user if there was an error
      var errorElement = document.getElementById("error-handler");
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server
      var errorElement = document.getElementById("success");
      // errorElement.style.display = "block";
      var tokenElement = document.getElementById("token");
      tokenElement.textContent = result.id;
    }
  });
});

card.addEventListener("change", function (event) {
  if (event.BIN) {
    console.log(event.BIN);
  }
  var displayError = document.getElementById("card-errors");
  if (event.error) {
    displayError && displayError.textContent
      ? (displayError.textContent = event.error.message)
      : "";
  }
});

async function postToServer(result) {
  var queryDict = {};
  await location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      queryDict[item.split("=")[0]] = item.split("=")[1];
    });
  result.params = queryDict;

  // code for geting params fromn url

  axios
    .post(apiUrl + "/serverCharge/chargeRequest", result)
    .then((res) => {
      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      }
    })
    .catch((err) => console.error("error from server : ", err));
}
