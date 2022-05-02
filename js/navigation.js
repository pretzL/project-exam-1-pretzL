const label = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");

label.addEventListener("click", () => {
  searchDropdown.classList.remove("search-active");
  navbar.classList.toggle("hamburger-active");
});

const searchIcon = document.querySelector(".search-icon");
const searchDropdown = document.querySelector(".search-dropdown");

searchIcon.addEventListener("click", () => {
  navbar.classList.remove("hamburger-active");
  searchDropdown.classList.toggle("search-active");
});
