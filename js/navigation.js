const label = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");

label.addEventListener("click", () => {
  navbar.classList.toggle("hamburger-active");
});
