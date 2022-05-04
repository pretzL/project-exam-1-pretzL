const carouselContainer = document.querySelector(".carousel-container");

const previousArticles = document.querySelector(".previous-articles-list");
const whatsNew = document.querySelector(".whats-new-list");
const whatPeopleLove = document.querySelector(".what-people-love-list");

// FETCH

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts?_embed&acf_format=standard&per_page=20";

let itemCount;

async function getRecipes() {
  try {
    const response = await fetch(baseURL);
    const results = await response.json();

    carouselContainer.innerHTML = "";
    whatsNew.innerHTML = "";
    whatPeopleLove.innerHTML = "";

    for (let c = 0; c < results.length; c++) {
      const date = results[c].date;
      const dateFix = date.split("T")[0];

      carouselContainer.innerHTML += `<a href="/blog.html?id=${results[c].id}" class="card">
        <img src="${results[c].acf.banner_image}" class="card-image" alt="${results[c].title.rendered}"/>
        <h3>${results[c].title.rendered}</h3>
        <p>Posted: ${dateFix}</p>
        </a>`;
    }

    for (let a = 0; a < results.length; a++) {
      const date = results[a].date;
      const dateFix = date.split("T")[0];

      if (a === 10) {
        break;
      }

      previousArticles.innerHTML += `<a href="/blog.html?id=${results[a].id}" class="previous-articles-link">${results[a].title.rendered}, ${dateFix}</a>`;
    }

    for (let i = 0; i < results.length; i++) {
      const date = results[i].date;
      const dateFix = date.split("T")[0];

      if (i === 5) {
        break;
      }

      whatsNew.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card-small">
      <img src="${results[i].acf.banner_image}" class="card-image" alt="${results[i].title.rendered}"/>
      <div class="card-small-text">
      <h3>${results[i].title.rendered}</h3>
      <p>${dateFix}</p>
      </div></a>`;

      whatPeopleLove.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card-small">
      <img src="${results[i].acf.banner_image}" class="card-image" alt="${results[i].title.rendered}"/>
      <div class="card-small-text">
      <h3>${results[i].title.rendered}</h3>
      <p>${dateFix}</p>
      </div></a>`;
    }

    itemCount = results.length;
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getRecipes();

// CAROUSEL

document.addEventListener("click", (e) => {
  let carouselButton;
  if (e.target.matches(".arrow")) {
    carouselButton = e.target;
  } else {
    carouselButton = e.target.closest(".arrow");
  }

  if (carouselButton != null) {
    moveCarousel(carouselButton);
  }
});

function moveCarousel(button) {
  const carouselContainer = document.querySelector(".carousel-container");
  const carouselIndex = parseInt(getComputedStyle(carouselContainer).getPropertyValue("--carousel-index"));
  if (button.classList.contains("left-arrow")) {
    carouselContainer.style.setProperty("--carousel-index", carouselIndex - 1);
  }

  if (button.classList.contains("right-arrow")) {
    carouselContainer.style.setProperty("--carousel-index", carouselIndex + 1);
  }
}
