const authorOfContent = document.querySelector(".author-of-content");

// FETCH

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts?author=1&_embed&acf_format=standard&per_page=20";

async function getAuthorRecipes() {
  try {
    const response = await fetch(baseURL);
    const results = await response.json();

    console.log(results);

    for (let i = 0; i < results.length; i++) {
      const date = results[i].date;
      const dateFix = date.split("T")[0];

      if (i === 8) {
        break;
      }

      authorOfContent.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card-small">
      <img src="${results[i].acf.banner_image}" class="card-image" alt="${results[i].title.rendered}"/>
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

getAuthorRecipes();
