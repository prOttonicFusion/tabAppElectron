const { ipcRenderer } = require("electron");

// Request main.ts to init balance display and user selector
ipcRenderer.send("request-init-data");

// If new user data is sent from main.ts
ipcRenderer.on("render-balance", (event, args) => {
  const balance = args;
  document.getElementById("balance-display").innerHTML = balance;
});

ipcRenderer.on("render-logs", (event, args) => {
  const logContainer = document.getElementById("log-container");
  logContainer.innerHTML = null;
  const logs = args.reverse();
  const currencySymbol = "€";
  for (let i = 0; i < logs.length; i++) {
    const entry = `<div class="log-entry">
        <span class="log-timestamp">${logs[i].timestamp}</span>
        <span class="log-transaction">${logs[i].transact} ${currencySymbol}</span>
    </div>`;
    logContainer.innerHTML += entry;
  }
});

// Generate user selector dropdown
ipcRenderer.on("populate-user-selector", (event, userList) => {
  populateUserDropdown(userList);
});

// Handle user selections
document.getElementById("user-selector").addEventListener("click", () => {
  const user = getSelectedUser();
  console.log("Selected: ", user);
  requestUserData(user);
});

// Handle clicks on add-user button
document.getElementById("add-user-button").addEventListener("click", () => {
  ipcRenderer.send("add-user");
});

// Handle clicks on button for accepting transactions
document.getElementById("accept-button").addEventListener("click", () => {
  let transaction = getTransactionValue();
  const user = getSelectedUser();
  if (transaction) {
    ipcRenderer.send("accept-transaction", [{ user, transaction }]);
  }
  resetInputFields();
});

function populateUserDropdown(userList) {
  const dropdown = document.getElementById("user-selector");
  for (var i = dropdown.options.length - 1; i >= 1; i--) {
    dropdown.remove(i);
  }
  for (var j = 1; j < userList.length; j++) {
    dropdown.options.add(new Option(userList[j]));
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

function getSelectedUser() {
  const selector = document.getElementById("user-selector");
  return selector.options[selector.selectedIndex].text;
}

function resetInputFields() {
  document.getElementById("recharge-input").value = "";
  document.getElementById("price-input").value = "";
}

function requestUserData(userName) {
  ipcRenderer.send("request-userdata", userName);
}
