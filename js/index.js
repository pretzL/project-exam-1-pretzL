const carouselContainer = document.querySelector(".carousel-container");

const previousArticles = document.querySelector(".previous-articles-list");
const whatsNew = document.querySelector(".whats-new-list");
const whatPeopleLove = document.querySelector(".what-people-love-list");

// FETCH

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts?_embed&acf_format=standard&per_page=20";

async function getRecipes() {
  try {
    const response = await fetch(baseURL);
    const results = await response.json();

    carouselContainer.innerHTML = "";
    whatsNew.innerHTML = "";
    whatPeopleLove.innerHTML = "";

    // CAROUSEL ITEMS CONTAINER

    for (let c = 0; c < results.length; c++) {
      const date = results[c].date;
      const dateFix = date.split("T")[0];

      carouselContainer.innerHTML += `<a href="/blog.html?id=${results[c].id}" class="card">
        <div class="card-image" style="background-image: url(${results[c].acf.card_image})"></div>
        <h3>${results[c].title.rendered}</h3>
        <p>Posted: ${dateFix}</p>
        <p>Category: ${results[c]._embedded["wp:term"]["0"]["0"].name}</p>
        </a>`;
    }

    // TEXT LINK ARTICLES CONTAINER

    for (let a = 0; a < results.length; a++) {
      const date = results[a].date;
      const dateFix = date.split("T")[0];

      if (a === 10) {
        break;
      }

      previousArticles.innerHTML += `<li><a href="/blog.html?id=${results[a].id}" class="previous-articles-link">${results[a].title.rendered}, ${dateFix}</a></li>`;
    }

    // NEWEST POSTS CONTAINER

    for (let i = 0; i < results.length; i++) {
      const date = results[i].date;
      const dateFix = date.split("T")[0];

      if (i === 5) {
        break;
      }

      whatsNew.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card-small">
      <div class="card-image" style="background-image: url(${results[i].acf.card_image})"></div>
      <div class="card-small-text">
      <h3>${results[i].title.rendered}</h3>
      <p>${dateFix}</p>
      </div></a>`;
    }

    // RANDOM POST ELEMENT, FROM https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array

    const randomContainer = document.querySelector(".random-element-container");

    const randomElement = Math.floor(Math.random() * results.length);

    const date = results[randomElement].date;
    const dateFix = date.split("T")[0];

    randomContainer.innerHTML = `<a href="/blog.html?id=${results[randomElement].id}" class="card">
    <div class="card-image" style="background-image: url(${results[randomElement].acf.card_image})"></div>
    <h3>${results[randomElement].title.rendered}</h3>
    <p>Posted: ${dateFix}</p>
    <p>Category: ${results[randomElement]._embedded["wp:term"]["0"]["0"].name}</p>
    </a>`;

    // POPULAR POSTS, SORTED BY MOST COMMENTS

    // Solution for top sorting from https://codereview.stackexchange.com/questions/176809/sorting-an-array-of-objects-by-a-property-which-may-be-missing

    let popPosts = [...results];

    function sort(array) {
      return array.sort((a, b) => {
        const aUndefined = a._embedded.replies == null ? 1 : 0;
        const bUndefined = b._embedded.replies == null ? 1 : 0;

        if (aUndefined || bUndefined) {
          return aUndefined - bUndefined;
        }

        return b._embedded.replies[0].length - a._embedded.replies[0].length;
      });
    }

    const sortedResults = sort(results);

    popPosts = [...sortedResults];

    for (let v = 0; v < popPosts.length; v++) {
      const date = popPosts[v].date;
      const dateFix = date.split("T")[0];

      if (v === 5) {
        break;
      }

      whatPeopleLove.innerHTML += `<a href="/blog.html?id=${popPosts[v].id}" class="card-small">
      <div class="card-image" style="background-image: url(${popPosts[v].acf.card_image})"></div>
      <div class="card-small-text">
      <h3>${popPosts[v].title.rendered}</h3>
      <p>${dateFix}</p>
      </div></a>`;
    }

    // CAROUSEL FROM https://www.youtube.com/watch?v=yq4BeRtUHbk

    // Handle button for carousel sliding
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

    // Carousel slide function, with infinite loop
    function moveCarousel(button) {
      const carouselContainer = document.querySelector(".carousel-container");
      const carouselIndex = parseInt(getComputedStyle(carouselContainer).getPropertyValue("--carousel-index"));
      const itemsPerScreen = parseInt(getComputedStyle(carouselContainer).getPropertyValue("--items-per-screen"));

      if (button.classList.contains("left-arrow")) {
        if (carouselIndex - 1 < 0) {
          carouselContainer.style.setProperty("--carousel-index", results.length / itemsPerScreen - 1);
        } else {
          carouselContainer.style.setProperty("--carousel-index", carouselIndex - 1);
        }
      }

      if (button.classList.contains("right-arrow")) {
        if (carouselIndex + 1 >= results.length / itemsPerScreen) {
          carouselContainer.style.setProperty("--carousel-index", 0);
        } else {
          carouselContainer.style.setProperty("--carousel-index", carouselIndex + 1);
        }
      }
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getRecipes();
