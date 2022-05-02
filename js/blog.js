const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

// if the id is null, then redirect to the home page
if (id === null) {
  location.href = "/";
}

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/posts/";

const detailsURL = baseURL + id + "?_embed&acf_format=standard";

const blogContent = document.querySelector(".blog-page-content");

const pageTitle = document.querySelector("title");
const pageHeading = document.querySelector(".page-heading");

const blogBanner = document.querySelector(".blog-page-banner");

async function fetchSingleRecipe() {
  try {
    const response = await fetch(detailsURL);
    const result = await response.json();

    console.log(result);
    blogContent.innerHTML = "";

    pageTitle.innerText = result.title.rendered + " | Food For Thought";
    pageHeading.innerText = result.title.rendered;
    blogBanner.innerHTML = `<img src="${result.acf.banner_image}" alt="${result.title.rendered}" class="blog-page-banner-image" />`;

    const date = result.date;
    const dateFix = date.split("T")[0];

    blogContent.innerHTML = `
    <div class="blog-page-card blog-description blog-grid1">
        <h3>Description</h3>
        <p>${result.acf.description}</p>
    </div>
    <div class="blog-page-card blog-recipe blog-grid2">
        <h3>Description</h3>
        <p>${result.acf.recipe}</p>
    </div>
    <div class="blog-page-card blog-about blog-grid3">
        <h3>About</h3>
        <div class="blog-author-info">
            <img src="${result._embedded.author[0].avatar_urls[96]}" alt="${result._embedded.author[0].name} avatar image" class="user-profile-image"/>
            <div>
              <h4 class="author-name-title">${result._embedded.author[0].name}</h4>
              <p>${result._embedded.author[0].description}</p>
            </div>
        </div>
        <div class="blog-post-info">
            <p>Posted: ${dateFix}</p>
            <p>Categories: ${result._embedded["wp:term"]["0"]["0"].name}</p>
            <p>Tags: ${result._embedded["wp:term"]["1"]["0"].name}, ${result._embedded["wp:term"]["1"]["1"].name}, ${result._embedded["wp:term"]["1"]["2"].name}</p>
        </div>
    </div>
    <div class="blog-page-card blog-similar blog-grid4">
        <h3>Similar Posts<h3>
    </div>`;
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

fetchSingleRecipe();
