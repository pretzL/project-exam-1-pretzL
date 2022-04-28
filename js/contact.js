const form = document.querySelector(".contact-form");

const userName = document.querySelector("#user-name");
const userNameError = document.querySelector("#user-name-error");

const email = document.querySelector("#email");
const emailError = document.querySelector("#email-error");

const subject = document.querySelector("#subject");
const subjectError = document.querySelector("#subject-error");

const message = document.querySelector("#message");
const messageError = document.querySelector("#message-error");

const validatorContainer = document.querySelector(".validator-container");

function validateForm(form) {
  form.preventDefault();

  if (checkLength(userName.value, 4)) {
    userNameError.style.display = "none";
  } else {
    userNameError.style.display = "block";
  }

  if (validateEmail(email.value)) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }

  if (checkLength(subject.value, 14)) {
    subjectError.style.display = "none";
  } else {
    subjectError.style.display = "block";
  }

  if (checkLength(message.value, 24)) {
    messageError.style.display = "none";
  } else {
    messageError.style.display = "block";
  }

  // Form validated message
  if (checkLength(userName.value, 4) && validateEmail(email.value) && checkLength(subject.value, 14) && checkLength(message.value, 24)) {
    validatorContainer.style.display = "block";
  }
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
