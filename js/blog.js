// CONTAINERS

const blogContent = document.querySelector(".blog-page-content");

const pageTitle = document.querySelector("title");
const pageHeading = document.querySelector(".page-heading");

const blogBanner = document.querySelector(".blog-page-banner");

// QUERY STRINGS

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const id = params.get("id");

// if the id is null, then redirect to the home page
if (id === null) {
  location.href = "/";
}

// URLS

const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/";

const detailsURL = baseURL + "posts/" + id + "?_embed&acf_format=standard";

const commentsURL = baseURL + "comments" + `?post=${id}` + "&_embed&acf_format=standard";

// ITEMS FUNCTION

async function fetchSingleRecipe() {
  try {
    const response = await fetch(detailsURL);
    const result = await response.json();

    blogContent.innerHTML = "";

    // ADD PAGE META DATA

    pageTitle.innerText = result.title.rendered + " | Food For Thought";
    pageHeading.innerText = result.title.rendered;
    blogBanner.innerHTML = `<div class="blog-page-banner-image open-modal" data-open="modal1" style="background-image: url(${result.acf.banner_image})"></div>`;

    // MAKE DATE PRETTIER

    const date = result.date;
    const dateFix = date.split("T")[0];

    // ADD THE CONTENT

    blogContent.innerHTML = `
    <div class="blog-page-card blog-description blog-grid1">
        <h3>Description</h3>
        <p>${result.acf.description}</p>
    </div>
    <div class="blog-page-card blog-recipe blog-grid2">
        <h3>Recipe</h3>
        <p class="blog-recipe-ingredients">${result.acf.ingredients}</p>
        <p class="blog-recipe">${result.acf.recipe}</p>
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
        <h3>Similar Posts</h3>
        <div class="blog-similar-content"></div>
    </div>`;

    // COMMENTS

    const commentsContainer = document.querySelector(".blog-comments-container");

    const commentsResponse = await fetch(commentsURL);
    const commentsResult = await commentsResponse.json();

    commentsContainer.innerHTML = "";

    if (commentsResult.length === 0) {
      commentsContainer.innerHTML = `<div class="missing-comments">No comments yet... Post your thoughts!</div>`;
    }

    for (let c = 0; c < commentsResult.length; c++) {
      const date = commentsResult[c].date;
      const dateFix = date.split("T")[0];
      const timeFix = date.split("T")[1];

      commentsContainer.innerHTML += `
      <div class="blog-user-comment">
      <h4 class="comment-grid1">${commentsResult[c].author_name}</h4>
      <p class="user-comment-date comment-grid2">${dateFix}, ${timeFix}</p>
      ${commentsResult[c].content.rendered}
      </div>`;

      // GET ALL COMMENTS AND ADD THE GRID CLASS TO DISPLAY PROPERLY
      const userComment = document.querySelectorAll(".blog-user-comment");

      userComment.forEach((comment) => {
        comment.firstElementChild.nextElementSibling.nextElementSibling.classList.add("comment-grid3");
      });
    }

    // SUGGESTED POSTS BASED ON THE VIEWED POSTS TAGS
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

    console.log(suggestedPosts);

    // IF THERE ARE NO SIMILAR POSTS, CHECKING FOR 1 SINCE THE ARRAY WILL ALWAYS RETURN THE POST THE USER IS VIEWING.

    if (suggestedPosts.length === 1) {
      suggestedContent.innerHTML = "<p>Sadly, no other posts match this post...</p>";
    }

    for (let c = 0; c < suggestedPosts.length; c++) {
      const date = suggestedPosts[c].date;
      const dateFix = date.split("T")[0];

      // DONT ADD THE SAME POST AS THE ONE USER IS VIEWING
      if (result.id === suggestedPosts[c].id) {
        continue;
      }

      if (c === 5) {
        break;
      }

      suggestedContent.innerHTML += `<a href="/blog.html?id=${suggestedPosts[c].id}" class="card-small">
      <div class="card-image" style="background-image: url(${suggestedPosts[c].acf.card_image})"></div>
      <div class="card-small-text">
      <h4>${suggestedPosts[c].title.rendered}</h4>
      <p>${dateFix}</p>
      </div></a>`;
    }

    // MODAL FROM https://webdesign.tutsplus.com/tutorials/how-to-build-flexible-modal-dialogs-with-html-css-and-javascript--cms-33500

    const openModal = document.querySelectorAll("[data-open]");
    const modalContent = document.querySelector(".modal-content");
    const modalText = document.querySelector(".modal-text");

    // Handle the modal itself and add the content
    openModal.forEach((modal) => {
      modal.addEventListener("click", function () {
        // Get the correct element
        const modalId = this.dataset.open;
        // Get the content to display in the modal
        const stringContent = modal.outerHTML;
        modalContent.innerHTML = stringContent;
        // Checking if the modal is an actual image with an alt tag or if it's a background-image without an alt tag.
        if (modal.alt !== undefined) {
          modalText.innerHTML = modal.alt;
        } else {
          modalText.innerHTML = result.title.rendered;
        }
        // Display the modal
        document.getElementById(modalId).classList.add("modal-active");
      });
    });

    // Handling modal close
    const closeModal = document.querySelector(".close-modal");
    // Clicking the close button inside the modal
    closeModal.addEventListener("click", function () {
      this.parentElement.parentElement.classList.remove("modal-active");
    });
    // Clicking outside of the modal
    document.addEventListener("click", (e) => {
      if (e.target === document.querySelector(".modal.modal-active")) {
        document.querySelector(".modal.modal-active").classList.remove("modal-active");
      }
    });
    // Pressing the Esc key
    document.addEventListener("keyup", (e) => {
      if (e.key === "Escape" && document.querySelector(".modal.modal-active")) {
        document.querySelector(".modal.modal-active").classList.remove("modal-active");
      }
    });
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

fetchSingleRecipe();

// Comments section
const form = document.querySelector(".blog-comments-form");

const userName = document.querySelector("#user-name");
const userNameError = document.querySelector("#user-name-error");

const emailValue = document.querySelector("#email");
const emailError = document.querySelector("#email-error");

const message = document.querySelector("#message");
const messageError = document.querySelector("#message-error");

const validatorContainer = document.querySelector(".validator-container");

function handleSubmit(evt) {
  evt.preventDefault();

  // Comments form validation
  if (checkLength(userName.value, 4)) {
    userNameError.style.display = "none";
  } else {
    userNameError.style.display = "block";
  }

  if (validateEmail(emailValue.value)) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }

  if (checkLength(message.value, 9)) {
    messageError.style.display = "none";
  } else {
    messageError.style.display = "block";
  }

  // Form validated message
  if (checkLength(userName.value, 4) && validateEmail(emailValue.value) && checkLength(message.value, 10)) {
    validatorContainer.style.display = "block";

    // PASSING THE COMMENT CONTENT TO WORDPRESS
    // Partially from https://www.tetchi.ca/how-to-post-comments-using-the-wordpress-rest-api

    const [postId, name, email, comment] = evt.target.elements;

    postId.value = id;

    const dataObj = JSON.stringify({
      post: postId.value,
      author_name: name.value,
      author_email: email.value,
      content: comment.value,
    });
    // Using a ghost-user type setup and passing the users' input information as a comment
    const commentURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/comments";
    fetch(commentURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("commentuser" + ":" + "TrVl BnDa vF6W 9SxM ANpt oaPD"),
      },
      body: dataObj,
    })
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
  }
}

form.addEventListener("submit", handleSubmit);
// Form length check
function checkLength(value, char) {
  return value.trim().length > char;
}

// Check email, taken from video "Simple form validation" from Noroff JS1 Module 4 lesson 4.
function validateEmail(email) {
  const regEx = /\S+@\S+\.\S+/;
  const patternMatches = regEx.test(email);
  return patternMatches;
}
