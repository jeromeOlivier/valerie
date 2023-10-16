/**
 * Handles the behavior of the header based on the window width.
 *
 * @function handleHeader
 */
const handleHeader = () => {
  // Selects the header
  const header = document.querySelector("header > div > img:nth-child(1)");
  // Checks if the window width is less than 960
  if (window.innerWidth < 960) {
    if (header) {
      // If yes, it removes the attributes
      header.removeAttribute("hx-target");
      header.removeAttribute("hx-get");
      header.removeAttribute("hx-swap");
      header.removeAttribute("hx-push-url");
      // and adds an onclick event.
      header.onclick = () => console.log("clicked");
    }
  } else {
    if (header) {
      // If not, it sets the attributes.
      header.setAttribute("hx-target", "main");
      header.setAttribute("hx-get", "/content_accueil");
      header.setAttribute("hx-swap", "show:window:top");
      header.setAttribute("hx-push-url", "/");
    }
  }
};

// Adds event listeners for load and resize
window.addEventListener("load", handleHeader);
window.addEventListener("resize", handleHeader);

// Modal window
const modal = document.querySelector("#modal");
document.addEventListener("DOMContentLoaded", () => {
  // Selects the modal button and adds an event lister for click.
  const modalButton = document.querySelector("#modal-button");
  modalButton.addEventListener("click", () => modal.showModal());
});

// Adds a click event to the modal for closing.
modal.addEventListener("click", (event) => {
  const dialogDimensions = modal.getBoundingClientRect();
  // Close modal if user clicks outside the dialog
  if (
    dialogDimensions.top > event.clientY ||
    dialogDimensions.bottom < event.clientY ||
    dialogDimensions.left > event.clientX ||
    dialogDimensions.right < event.clientX
  ) {
    modal.close();
  }
});

// Navigation
let resizeTimer;
const logo = document.querySelector(".logo");
const nav = document.querySelector("nav");

// Click events for navigation
logo.addEventListener("click", function () {
  if (nav.classList.contains("slide-in")) {
    nav.classList.remove("slide-in");
    nav.classList.add("slide-out");
  } else {
    nav.classList.remove("slide-out");
    nav.classList.add("slide-in");
  }
});

// Adds a resize event for navigation
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer); // Clear any existing timeout to avoid conflicts
  nav.classList.add("no-transition"); // Temporarily stop transitions

  // After a brief delay, allow transitions again
  resizeTimer = setTimeout(() => {
    nav.classList.remove("no-transition");
  }, 10);

  // If the window is wide (e.g., desktop view)
  if (window.innerWidth > 960) {
    // Make sure navigation isn't hidden or sliding
    nav.classList.remove("hide");
    nav.classList.remove("slide-in");
    nav.classList.remove("slide-out");
  } else {
    // Else, if the window is narrow (e.g., mobile view)
    // Hide navigation and reset any sliding
    nav.classList.remove("slide-in");
    nav.classList.remove("slide-out");
    nav.classList.add("hide");
  }
});
