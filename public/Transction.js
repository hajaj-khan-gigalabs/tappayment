let apiUrl = "https://tap-payment.herokuapp.com/api";
// let apiUrl = "http://localhost:3000/api";

async function postToServer() {
  //?amount=37375&currency=SAR&reference=MDQ-INV-0574&identifier=0197cbbf-a56d-4946-a98a-b4b346ead7d6&providerKey=1&signature=44bb9357e6428d6ea3d3c6c04a834859830429b648a40007fe23ead14b1c2822&returnUrl=https%3a%2f%2falmashtal.spaces.nexudus.com%2fen%2fcallbacks%2fhostedPagePaymentsComplete%3finvoiceId%3d1415932075%26providerKey%3d1
  var queryDict = {};
  await location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      queryDict[item.split("=")[0]] = item.split("=")[1];
    });
  let result = { params: queryDict };

  console.log("DATA SEND TO SERVER", result);
  // code for geting params fromn url

  axios
    .post(apiUrl + "/serverCharge/checkCharge", result)
    .then((res) => {
      console.log("Charge Responce: ", res);
      // if (res.data.redirectUrl) {
      //   window.location.href = res.data.redirectUrl;
      // }
    })
    .catch((err) => console.error("error from server : ", err));
}

postToServer();
