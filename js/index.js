const carouselContainer = document.querySelector(".carousel-container");

const previousArticles = document.querySelector(".previous-articles-list");
const whatsNew = document.querySelector(".whats-new-list");
const whatPeopleLove = document.querySelector(".what-people-love-list");

// FETCH

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts?_embed";

async function getRecipes() {
  try {
    const response = await fetch(baseURL);
    const results = await response.json();

    console.log(results);

    carouselContainer.innerHTML = "";
    whatsNew.innerHTML = "";
    whatPeopleLove.innerHTML = "";

    for (let i = 0; i < results.length; i++) {
      const date = results[i].date;
      const dateFix = date.split("T")[0];

      carouselContainer.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card">
        <img src="${results[i]._embedded["wp:featuredmedia"]["0"].source_url}" class="card-image" alt="${results[i].title.rendered}"/>
        <h3>${results[i].title.rendered}</h3>
        <p>Posted: ${dateFix}</p>
        </a>`;

      previousArticles.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="previous-articles-link">${results[i].title.rendered}, ${dateFix}</a>`;

      whatsNew.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card-small">
      <img src="${results[i]._embedded["wp:featuredmedia"]["0"].source_url}" class="card-image" alt="${results[i].title.rendered}"/>
      <div class="card-small-text">
      <h3>${results[i].title.rendered}</h3>
      <p>${dateFix}</p>
      </div></a>`;

      whatPeopleLove.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card-small">
      <img src="${results[i]._embedded["wp:featuredmedia"]["0"].source_url}" class="card-image" alt="${results[i].title.rendered}"/>
      <div class="card-small-text">
      <h3>${results[i].title.rendered}</h3>
      <p>${dateFix}</p>
      </div></a>`;
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getRecipes();

// CAROUSEL
