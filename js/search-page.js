// QUERY STRINGS
const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const search = params.get("search");

const searchContainer = document.querySelector(".search-content");
const searchTitle = document.querySelector(".search-title");

// URLs
const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/search";

const url = baseURL + "?search=" + search + "&acf_format=standard&context=embed&_embed&per_page=20";

const imageURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/media" + "?_embed&per_page=100";

async function getSearch() {
  try {
    const response = await fetch(url);
    const results = await response.json();

    searchContainer.innerHTML = "";
    errorContainer.innerHTML = "";

    // UPDATE HEADING TITLE TO WHAT THE USER SEARCHED FOR
    searchTitle.innerText = `Search Term: "${search}"`;

    // HANDLE IF THE SEARCH YIELDS NO RESULTS
    if (results.length === 0) {
      errorContainer.innerHTML = errorMessage("No posts match your search results... Try again!");
      errorContainer.style.display = "block";
    }

    for (let i = 0; i < results.length; i++) {
      if (results[i].title === "Sample Page") {
        continue;
      }

      // Get the image ID
      const cardID = results[i]._embedded.self[0].acf.card_image;

      // Pass image ID into a new fetch URL in order to get images for each card
      const imageURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/media/" + cardID + "?_embed";

      const imageResponse = await fetch(imageURL);
      const imageResults = await imageResponse.json();

      const date = results[i]._embedded.self[0].date;
      const dateFix = date.split("T")[0];

      // Display the searched results
      searchContainer.innerHTML += `<a href="/blog.html?id=${results[i]._embedded.self[0].id}" class="card">
      <div class="card-image" style="background-image: url(${imageResults.source_url})"></div>
      <h3>${results[i]._embedded.self[0].title.rendered}</h3>
      <p>Posted: ${dateFix}</p>
      </a>`;
    }
  } catch (error) {
    console.log(error);
    errorContainer.innerHTML = errorMessage("An error occurred when calling the API, error: " + error);
  }
}

getSearch();
