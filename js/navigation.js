// NAVBAR

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

// CATEGORY FETCH

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

    catDropdown.innerHTML = "";

    for (let i = 0; i < results.length; i++) {
      if (results[i].name === "Uncategorized") {
        continue;
      }

      if (i === 1) {
        catDropdown.innerHTML += `<div class="tag-dropdown"></div>`;
      }
      catDropdown.innerHTML += `<p class="nav-link category${i}">${results[i].name}</p>`;
    }

    // TAG FETCH

    const tagLabel = document.querySelector(".category0");
    const tagDropdown = document.querySelector(".tag-dropdown");

    tagLabel.addEventListener("click", () => {
      catDropdown.classList.toggle("category-active");
      tagDropdown.classList.toggle("tag-active");
    });

    const tagURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/tags?_embed&acf_format=standard";

    const tagResponse = await fetch(tagURL);
    const tagResults = await tagResponse.json();

    tagDropdown.innerHTML = "";

    for (let c = 0; c < tagResults.length; c++) {
      tagDropdown.innerHTML += `<a href="/blog-list.html?tag=${tagResults[c].id}" class="nav-link">${tagResults[c].name}</a>`;
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getCategories();
