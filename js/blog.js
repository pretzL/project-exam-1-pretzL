const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

// if the id is null, then redirect to the home page
if (id === null) {
  location.href = "/";
}

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/";

const detailsURL = baseURL + "posts/" + id + "?_embed&acf_format=standard";

const blogContent = document.querySelector(".blog-page-content");

const pageTitle = document.querySelector("title");
const pageHeading = document.querySelector(".page-heading");

const blogBanner = document.querySelector(".blog-page-banner");

async function fetchSingleRecipe() {
  try {
    const response = await fetch(detailsURL);
    const result = await response.json();

    blogContent.innerHTML = "";

    pageTitle.innerText = result.title.rendered + " | Food For Thought";
    pageHeading.innerText = result.title.rendered;
    blogBanner.innerHTML = `<img src="${result.acf.banner_image}" alt="${result.title.rendered}" class="blog-page-banner-image open-modal" data-open="modal1" />`;

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
            <img src="${result._embedded.author[0].avatar_urls[96]}" alt="${result._embedded.author[0].name} avatar image" class="user-profile-image open-modal" data-open="modal1" />
            <div>
              <h4 class="author-name-title">${result._embedded.author[0].name}</h4>
              <p>${result._embedded.author[0].description}</p>
            </div>
        </div>
        <div class="blog-post-info">
            <p>Posted: ${dateFix}</p>
            <p>Categories: ${result._embedded["wp:term"]["0"]["0"].name}</p>
            <p>Tags: ${result._embedded["wp:term"]["1"]["0"].name}, ${result._embedded["wp:term"]["1"]["1"].name}</p>
        </div>
    </div>
    <div class="blog-page-card blog-similar blog-grid4">
        <h3>Similar Posts<h3>
        <div class="blog-similar-content"></div>
    </div>`;

    // SUGGESTED
    let tag1;
    let tag2;

    for (let i = 0; i < result.tags.length; i++) {
      tag1 = result.tags[0];
      tag2 = result.tags[1];
    }

    const suggestedURL = baseURL + `posts?tags=${tag1},${tag2}` + "&_embed&acf_format=standard";

    const suggestedContent = document.querySelector(".blog-similar-content");

    suggestedContent.innerHTML = "";

    const suggestedResponse = await fetch(suggestedURL);
    const suggestedPosts = await suggestedResponse.json();

    for (let c = 0; c < suggestedPosts.length; c++) {
      const date = suggestedPosts[c].date;
      const dateFix = date.split("T")[0];

      if (result.id === suggestedPosts[c].id) {
        continue;
      }

      if (c === 5) {
        break;
      }

      suggestedContent.innerHTML += `<a href="/blog.html?id=${suggestedPosts[c].id}" class="card-small">
      <img src="${suggestedPosts[c].acf.banner_image}" class="card-image" alt="${suggestedPosts[c].title.rendered}"/>
      <div class="card-small-text">
      <h4>${suggestedPosts[c].title.rendered}</h4>
      <p>${dateFix}</p>
      </div></a>`;
    }

    // MODAL

    const openModal = document.querySelectorAll("[data-open]");
    const modalContent = document.querySelector(".modal-content");
    const modalText = document.querySelector(".modal-text");

    for (const modal of openModal) {
      modal.addEventListener("click", function () {
        const modalId = this.dataset.open;
        const stringContent = modal.outerHTML;
        modalContent.innerHTML = stringContent;
        modalText.innerHTML = modal.alt;
        document.getElementById(modalId).classList.add("is-visible");
      });
    }

    const closeModal = document.querySelector(".close-modal");

    closeModal.addEventListener("click", function () {
      this.parentElement.parentElement.classList.remove("is-visible");
    });

    document.addEventListener("click", (e) => {
      if (e.target === document.querySelector(".modal.is-visible")) {
        document.querySelector(".modal.is-visible").classList.remove("is-visible");
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape" && document.querySelector(".modal.is-visible")) {
        document.querySelector(".modal.is-visible").classList.remove("is-visible");
      }
    });
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

fetchSingleRecipe();
