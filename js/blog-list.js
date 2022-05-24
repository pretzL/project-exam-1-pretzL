const blogList = document.querySelector(".blog-list-wrapper");

// FETCH

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const cat = params.get("category");

const fullCategory = "?categories=" + cat;

// BASE URL FOR LIST FETCH

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts";

let fullURL = baseURL + "?_embed&acf_format=standard&per_page=100";

// IF THERE IS A CATEGORY

if (cat !== null) {
  fullURL = baseURL + fullCategory + "&_embed&acf_format=standard&per_page=100";
}

const tag = params.get("tag");

const fullTag = "?tags=" + tag;

// IF THERE IS A TAG

if (tag !== null) {
  fullURL = baseURL + fullTag + "&_embed&acf_format=standard&per_page=100";
}

async function getRecipes() {
  try {
    const response = await fetch(fullURL);
    const results = await response.json();

    blogList.innerHTML = "";

    if (results.length === 0) {
      errorContainer.innerHTML = `There are no blogs in this category yet...`;
    }

    // PARTIALLY FROM https://www.javascripttutorial.net/javascript-array-reduce/ , PARTIALLY FROM https://stackoverflow.com/a/37826698
    // Split array on the 10th iteration, format into separate containers to create view more/view less system
    if (results.length > 0) {
      const grid = results.reduce(
        (prev, val, idx) => {
          if (idx % 10 === 0 && idx !== 0) prev.push([]);
          prev[prev.length - 1].push(val);
          return prev;
        },
        [[]]
      );

      for (let i = 0; i < grid.length; i++) {
        blogList.innerHTML += `<div class="blog-list-container container${i}"></div>`;

        // Add container number for easier fetching later on in view more/view less
        const itemContainer = document.querySelector(`.container${i}`);

        // Add the hidden class if this is not the first container
        if (i > 0) {
          itemContainer.classList.add("blog-hidden");
        }

        // Get the items within each 10th array iteration to create the content cards
        const items = grid[i];

        for (let c = 0; c < items.length; c++) {
          const date = items[c].date;
          const dateFix = date.split("T")[0];

          const gridClass = "blog-list-grid" + (c + 1);

          itemContainer.innerHTML += `<a href="/blog.html?id=${items[c].id}" class="card blog-card ${gridClass}">
                <div class="card-image" style="background-image: url(${items[c].acf.card_image})"></div>
                <h3>${items[c].title.rendered}</h3>
                <p>Posted: ${dateFix}</p>
                <p>Category: ${items[c]._embedded["wp:term"]["0"]["0"].name}</p>
                </a>`;
        }

        // ONLY ADD VIEW MORE/VIEW LESS BUTTON IF ARRAY IS FULL
        if (items.length === 10) {
          itemContainer.innerHTML += `<button class="btn blog-list-button blog-button blog-list-grid11">View more</button>`;
        }
      }
    }
    // VIEW MORE

    document.addEventListener("click", (e) => {
      let blogButton;
      if (e.target.matches(".blog-button")) {
        blogButton = e.target;
      } else {
        blogButton = e.target.closest(".blog-button");
      }

      if (blogButton.innerHTML === "View more") {
        blogButton.innerHTML = "View less";
      } else {
        blogButton.innerHTML = "View more";
      }

      e.target.parentElement.nextElementSibling.classList.toggle("blog-hidden");
    });
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getRecipes();
