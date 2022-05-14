const form = document.querySelector(".contact-form");

const userName = document.querySelector("#your-name");
const userNameError = document.querySelector("#your-name-error");

const emailForm = document.querySelector("#your-email");
const emailError = document.querySelector("#email-error");

const subjectForm = document.querySelector("#your-subject");
const subjectError = document.querySelector("#subject-error");

const messageForm = document.querySelector("#your-message");
const messageError = document.querySelector("#message-error");

const validatorContainer = document.querySelector(".validator-container");

function validateForm(evt) {
  evt.preventDefault();

  if (checkLength(userName.value, 5)) {
    userNameError.style.display = "none";
  } else {
    userNameError.style.display = "block";
  }

  if (validateEmail(emailForm.value)) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }

  if (checkLength(subjectForm.value, 15)) {
    subjectError.style.display = "none";
  } else {
    subjectError.style.display = "block";
  }

  if (checkLength(messageForm.value, 25)) {
    messageError.style.display = "none";
  } else {
    messageError.style.display = "block";
  }

  // Form validated message
  if (checkLength(userName.value, 5) && validateEmail(emailForm.value) && checkLength(subjectForm.value, 15) && checkLength(messageForm.value, 25)) {
    validatorContainer.style.display = "block";
  }

  const formElement = evt.target;

  let dataObj = new FormData(formElement);

  const contactURL = "https://pretzl.one/foodforthought/wp-json/contact-form-7/v1/contact-forms/181/feedback";
  fetch(contactURL, {
    method: "POST",
    body: dataObj,
  })
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
}

form.addEventListener("submit", validateForm);

function checkLength(value, char) {
  return value.trim().length > char;
}

// Taken from video "Simple form validation" from Noroff JS1 Module 4 lesson 4.
function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  return patternMatches;
}
