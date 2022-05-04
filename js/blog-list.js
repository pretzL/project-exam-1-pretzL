const blogList = document.querySelector(".blog-list-wrapper");

// FETCH

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const cat = params.get("category");

const fullCategory = "/?categories=" + cat;

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts";

let fullURL = baseURL + "?_embed&acf_format=standard&per_page=100";

if (cat !== null) {
  fullURL = baseURL + fullCategory + "&_embed&acf_format=standard&per_page=20";
}

async function getRecipes() {
  try {
    const response = await fetch(fullURL);
    const results = await response.json();

    blogList.innerHTML = "";

    if (results.length === 0) {
      errorContainer.innerHTML = `There are no blogs in this category yet...`;
    }

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

      const itemContainer = document.querySelector(`.container${i}`);

      if (i > 0) {
        itemContainer.classList.add("blog-hidden");
      }

      const items = grid[i];

      for (let c = 0; c < items.length; c++) {
        const date = items[c].date;
        const dateFix = date.split("T")[0];

        const gridClass = "blog-list-grid" + (i + 1);

        itemContainer.innerHTML += `<a href="/blog.html?id=${items[c].id}" class="card blog-card ${gridClass}">
              <img src="${items[c].acf.banner_image}" class="card-image" alt="${items[c].title.rendered}"/>
              <h3>${items[c].title.rendered}</h3>
              <p>Posted: ${dateFix}</p>
              </a>`;
      }
      itemContainer.innerHTML += `<button class="btn blog-button${i}">View more</button>`;

      const blogButton = document.querySelector(`.blog-button0`);

      blogButton.addEventListener("click", () => {
        if (blogButton.innerHTML === "View more") {
          blogButton.innerHTML = "View less";
        } else {
          blogButton.innerHTML = "View more";
        }

        itemContainer.classList.toggle("blog-hidden");
      });
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getRecipes();
