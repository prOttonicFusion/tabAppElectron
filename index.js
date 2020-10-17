const { ipcRenderer } = require("electron");

document.getElementById("add-user-button").addEventListener("click", () => {
  ipcRenderer.send("add-user");
});

document.getElementById("accept-button").addEventListener("click", () => {
  let transaction = getTransactionValue();
  if (transaction) {
    ipcRenderer.send("accept-transaction", [{ user: "test", transaction }]);
  }
  resetInputFields();
});

function getTransactionValue() {
  let price = Number(document.getElementById("price-input").value);
  let deposit = Number(document.getElementById("recharge-input").value);
  var value = 0.0;
  if (price) {
    value -= price;
  }
  if (deposit) {
    value += deposit;
  }
  return value;
}

function resetInputFields() {
  document.getElementById("recharge-input").value = "";
  document.getElementById("price-input").value = "";
}
