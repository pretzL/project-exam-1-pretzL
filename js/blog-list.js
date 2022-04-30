const blogList = document.querySelector(".blog-list-container");

// FETCH

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts?_embed";

async function getRecipes() {
  try {
    const response = await fetch(baseURL);
    const results = await response.json();

    console.log(results);

    blogList.innerHTML = "";

    for (let i = 0; i < results.length; i++) {
      const date = results[i].date;
      const dateFix = date.split("T")[0];

      const gridClass = "blog-list-grid" + (i + 1);

      blogList.innerHTML += `<a href="/blog.html?id=${results[i].id}" class="card blog-card ${gridClass}">
        <img src="${results[i]._embedded["wp:featuredmedia"]["0"].source_url}" class="card-image" alt="${results[i].title.rendered}"/>
        <h3>${results[i].title.rendered}</h3>
        <p>Posted: ${dateFix}</p>
        </a>`;
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getRecipes();
