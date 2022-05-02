const baseURL = "https://pretzl.one/foodforthought/wp-json/wp/v2/search";

const queryString = document.location.search;

const params = new URLSearchParams(queryString);

const search = params.get("search");

const searchContainer = document.querySelector(".search-content");
const searchTitle = document.querySelector(".search-title");

async function getSearch() {
  try {
    searchContainer.innerHTML = "";
    errorContainer.innerHTML = "";

    const url = baseURL + "?search=" + search + "&acf_format=standard&context=embed&_embed";

    const response = await fetch(url);
    const results = await response.json();

    console.log(results);

    searchTitle.innerText = `Search Term: "${search}"`;

    for (let i = 0; i < results.length; i++) {
      if (results.length === 0) {
        errorContainer.innerHTML = errorMessage("We don't recognize that recipe");
        errorContainer.style.display = "block";
      }
      if (results.length < 1) {
        errorContainer.innerHTML = errorMessage("Please be more specific");
        errorContainer.style.display = "block";
      }

      const date = results[i]._embedded.self[0].date;
      const dateFix = date.split("T")[0];

      searchContainer.innerHTML += `<a href="/blog.html?id=${results[i]._embedded.self[0].id}" class="card">
      <img src="${results[i]._embedded.self[0].acf.banner_image}" class="card-image" alt="${results[i]._embedded.self[0].title.rendered}"/>
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
