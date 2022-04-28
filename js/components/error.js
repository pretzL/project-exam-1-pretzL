const errorContainer = document.querySelector(".error-container");

function errorMessage(message = "Unknown error") {
  return `<div class="error">${message}</div>`;
}
