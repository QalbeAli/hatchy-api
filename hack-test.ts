for (let i = 0; i < 10; i++) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer");
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "receiverEmail": "email@gmail.com",
    "voucherAmounts": [
      1
    ],
    "voucherIds": [
      ""
    ]
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch("http://localhost:3001/vouchers/transfer", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));

}