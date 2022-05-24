const searchForm = document.querySelector(".searchbar-pos");
const input = document.querySelector("#search");

function validateForm(searchForm) {
  searchForm.preventDefault();
  // Pass users' search word into the URL and forward to search page where the value is handled
  location.href = "/search.html?search=" + input.value;
}

searchForm.addEventListener("submit", validateForm);
