const translation = require("./src/localization/translation-selector.js").translation;

document.getElementById("add-user-title").innerHTML =
  translation["add-user-title"];
document.getElementById("name-input-label").innerHTML =
  translation["name-input-label"];
document.getElementById("initial-balance-input-label").innerHTML =
  translation["initial-balance-input-label"];
document.getElementById("accept-user-button").innerHTML =
  translation["accept-button"];
document.getElementById("cancel-user-button").innerHTML =
  translation["cancel-button"];
