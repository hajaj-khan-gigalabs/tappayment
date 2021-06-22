//pass your public key from tap's dashboard
var tap = Tapjsli("pk_test_qZypCznEF3QklDJdPGbj2tTS");
let apiUrl = "https://tap-payment.herokuapp.com/api";
// let apiUrl = "http://localhost:3000/api";


let parentSite = "https://www.google.com";

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
      errorElement.style.display = "block";
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
  //?amount=37375&currency=SAR&reference=MDQ-INV-0574&identifier=0197cbbf-a56d-4946-a98a-b4b346ead7d6&providerKey=1&signature=44bb9357e6428d6ea3d3c6c04a834859830429b648a40007fe23ead14b1c2822&returnUrl=https%3a%2f%2falmashtal.spaces.nexudus.com%2fen%2fcallbacks%2fhostedPagePaymentsComplete%3finvoiceId%3d1415932075%26providerKey%3d1
  var queryDict = {};
  await location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      queryDict[item.split("=")[0]] = item.split("=")[1];
    });
  result.params = queryDict;
  console.log("DATA SEND TO SERVER", result);
  // code for geting params fromn url

  axios
    .post(apiUrl + "/serverCharge/chargeRequest", result)
    .then((res) => {
      console.log("Charge Responce: ", res);
      console.log("Redirect To returnUrl with charge Response");
      // if (res.status === 200) {
      //   window.location.assign(parentSite + "?chareId=" + res.data.id);
      // }
    })
    .catch((err) => console.error("error from server : ", err));
}
