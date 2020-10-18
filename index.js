const { ipcRenderer } = require("electron");

// Handle clicks on add-user button
document.getElementById("add-user-button").addEventListener("click", () => {
  ipcRenderer.send("add-user");
});

// Handle clicks on button for accepting transactions
document.getElementById("accept-button").addEventListener("click", () => {
  let transaction = getTransactionValue();
  if (transaction) {
    ipcRenderer.send("accept-transaction", [{ user: "Otto", transaction }]);
  }
  resetInputFields();
});

// If a changed balance is sent from main.ts
ipcRenderer.on("set-balance", (event, args) => {
  const balance = args;
  console.log(balance);
  document.getElementById("balance-display").innerHTML = balance;
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

function requestUserBalance() {
  const name = "Otto";
  ipcRenderer.send("request-balance", name);
}
