const label = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");

label.addEventListener("click", () => {
  searchDropdown.classList.remove("search-active");
  catDropdown.classList.remove("category-active");
  navbar.classList.toggle("hamburger-active");
});

const searchIcon = document.querySelector(".search-icon");
const searchDropdown = document.querySelector(".search-dropdown");

searchIcon.addEventListener("click", () => {
  navbar.classList.remove("hamburger-active");
  catDropdown.classList.remove("category-active");
  searchDropdown.classList.toggle("search-active");
});

const catLabel = document.querySelector(".category-label");
const catDropdown = document.querySelector(".category-dropdown");

catLabel.addEventListener("click", () => {
  searchDropdown.classList.remove("search-active");
  catDropdown.classList.toggle("category-active");
});

const catURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/categories?_embed&acf_format=standard";

async function getCategories() {
  try {
    const response = await fetch(catURL);
    const results = await response.json();

    console.log(results);

    catDropdown.innerHTML = "";

    for (let i = 0; i < results.length; i++) {
      catDropdown.innerHTML += `<a href="/blog-list.html?category=${results[i].name}" class="nav-link">${results[i].name}</a>`;
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getCategories();
