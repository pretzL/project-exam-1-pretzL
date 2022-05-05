// FROM https://webdesign.tutsplus.com/tutorials/how-to-build-flexible-modal-dialogs-with-html-css-and-javascript--cms-33500

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
