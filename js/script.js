function loadHTML(elementId, url) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadHTML("header-placeholder", "components/header.html");
  loadHTML("footer-placeholder", "components/footer.html");
});
