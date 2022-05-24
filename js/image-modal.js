// FROM https://webdesign.tutsplus.com/tutorials/how-to-build-flexible-modal-dialogs-with-html-css-and-javascript--cms-33500

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
