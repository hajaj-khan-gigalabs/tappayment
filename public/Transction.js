let apiUrl = "https://www.minmaxopt.com/api";
// let apiUrl = "http://localhost:3000/api";

async function postToServer() {
  var queryDict = {};
  await location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
      queryDict[item.split("=")[0]] = item.split("=")[1];
    });
  let result = { params: queryDict };
  // code for geting params fromn url

  axios
    .post(apiUrl + "/serverCharge/checkCharge", result)
    .then((res) => {
      console.log("Transcation Responce: ", res);
      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      }
    })
    .catch((err) => console.error("error from server : ", err));
}

postToServer();
