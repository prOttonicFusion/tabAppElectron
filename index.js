const { ipcRenderer } = require("electron");

// Request main.ts to init balance display and user selector
ipcRenderer.send("request-init-data");

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

// Generate user selector dropdown
ipcRenderer.on("populate-user-selector", (event, userList) => {
  populateUserDropdown(userList);
});

function populateUserDropdown(userList) {
  const dropdown = document.getElementById("user-selector");

  for (var i = 0; i < userList.length; i++) {
    dropdown.options.add(new Option(userList[i]));
  }
}

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
