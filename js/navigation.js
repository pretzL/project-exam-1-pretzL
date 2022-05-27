// NAVBAR

const label = document.querySelector(".menu-icon");
const navbar = document.querySelector(".navbar");
// When clicking the hamburger icon, make sure no other dropdown is visible
label.addEventListener("click", () => {
  searchDropdown.classList.remove("search-active");
  catDropdown.classList.remove("category-active");
  navbar.classList.toggle("hamburger-active");
});

const searchIcon = document.querySelector(".search-icon");
const searchDropdown = document.querySelector(".search-dropdown");
// When clicking the search icon, make sure no other dropdown is visible
searchIcon.addEventListener("click", () => {
  navbar.classList.remove("hamburger-active");
  catDropdown.classList.remove("category-active");
  searchDropdown.classList.toggle("search-active");
});

// CATEGORY FETCH

const catLabel = document.querySelector(".category-label");
const catDropdown = document.querySelector(".category-dropdown");
// When clicking a category, make sure no other dropdown is visible
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
      // Uncategorized is always returned as part of default WordPress, we don't want it to show since no post will ever not have a category
      if (results[i].name === "Uncategorized") {
        continue;
      }

      // Add a wrapper at the start of the dropdown for tags
      if (i === 1) {
        catDropdown.innerHTML += `<div class="tag-dropdown"></div>`;
      }

      // Add each category with a category number for easier handling later
      catDropdown.innerHTML += `<p class="nav-link category-button category${i}">${results[i].name}</p>`;

      // When a category is clicked, we want to forward to the category fetch on blog-lists.html, but if it's recipes, we want to display the tags instead
      const catButton = document.querySelectorAll(".category-button");
      catButton.forEach((button) => {
        button.addEventListener("click", () => {
          if (button.innerHTML !== "Recipes") {
            location.href = `/blog-list.html?category=${results[i].id}`;
          }
        });
      });
    }

    // TAG FETCH

    const tagLabel = document.querySelector(".category0");
    const tagDropdown = document.querySelector(".tag-dropdown");

    // Due to previous code, clicking tag dropdown will make category hidden. To avoid a lot of re-writing, we instead make sure to re-toggle it.
    tagLabel.addEventListener("click", () => {
      catDropdown.classList.toggle("category-active");
      tagDropdown.classList.toggle("tag-active");
    });

    const tagURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/tags?_embed&acf_format=standard";

    const tagResponse = await fetch(tagURL);
    const tagResults = await tagResponse.json();

    tagDropdown.innerHTML = "";

    for (let c = 0; c < tagResults.length; c++) {
      // Add a button to select all recipe tags
      if (c === 0) {
        tagDropdown.innerHTML += `<a href="/blog-list.html?category=3" class="nav-link">All</a>`;
      }

      tagDropdown.innerHTML += `<a href="/blog-list.html?tag=${tagResults[c].id}" class="nav-link">${tagResults[c].name}</a>`;
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getCategories();
