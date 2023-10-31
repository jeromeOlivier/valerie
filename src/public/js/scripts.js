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
      header.addEventListener('click', () => {});
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

// Binds event listeners for load and resize to handleHeader function.
window.addEventListener("load", handleHeader);
window.addEventListener("resize", handleHeader);

// Panier modal window
const panier = document.querySelector("#panier");
document.addEventListener("DOMContentLoaded", () => {
  // Selects the modal button and adds an event lister for click.
  const modalButton = document.querySelector("#panier-button");
  modalButton.addEventListener("click", () => {
    panier.showModal();
    activatePreview();
    document.body.classList.add("no-scroll");
  });
});

// Adds a click event to the modal for closing.
panier.addEventListener("click", (event) => {
  const dialogDimensions = panier.getBoundingClientRect();
  // Close modal if user clicks outside the dialog
  if (
    dialogDimensions.top > event.clientY ||
    dialogDimensions.bottom < event.clientY ||
    dialogDimensions.left > event.clientX ||
    dialogDimensions.right < event.clientX
  ) {
    panier.close();
    document.body.classList.remove("no-scroll");
  }
});

// Preview modal window
const preview = document.querySelector("#preview");
document.addEventListener("DOMContentLoaded", () => {
  // Selects the modal button and adds an event lister for click.
  const previewButton = document.querySelector("#preview-button");
  // when the preview button is clicked, show the modal
  previewButton.addEventListener("click", () => {
    // Before showing the modal, adjust its position to the center of the viewport
    const top = window.innerHeight / 2 - preview.offsetHeight / 2 + window.scrollY;
    const left = window.innerWidth / 2 - preview.offsetWidth / 2 + window.scrollX;
    preview.style.top = `${ top }px`;
    preview.style.left = `${ left }px`;
    // show the modal
    preview.showModal();
    // disable scrolling on the body
    document.body.classList.add("no-scroll");
    // delay activation of preview navigation until it is loaded
    setTimeout(() => activatePreview(), 100);
  });
});

// Adds a click event to the preview modal for closing.
preview.addEventListener("click", (event) => {
  const dialogDimensions = preview.getBoundingClientRect();
  // Close modal if user clicks outside the dialog
  if (
    dialogDimensions.top > event.clientY ||
    dialogDimensions.bottom < event.clientY ||
    dialogDimensions.left > event.clientX ||
    dialogDimensions.right < event.clientX
  ) {
    preview.close();
    document.body.classList.remove("no-scroll");
  }
});

// Add click events to the preview modal to change the image
function activatePreview() {
  console.log("activatePreview");
  const buttons = document.querySelectorAll("#next, #prev");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      // if the button clicked is the next button, offset is 1, else -1
      const offset = button.id === "next" ? 1 : -1;
      // get the list of images and the current image
      const listOfImages = document.querySelectorAll("#preview > ul > li > img");
      // get the current image
      const current = document.querySelector(".active");
      // get the index of the current image and add the offset
      const currentIndex = [...listOfImages].indexOf(current);
      let newIndex = currentIndex + offset;
      console.log(newIndex);
      // if the new index is out of bounds, wrap around
      if (newIndex < 0) newIndex = listOfImages.length - 1;
      if (newIndex > listOfImages.length - 1) newIndex = 0;

      // remove the active class from the current image and add it to the new one
      listOfImages[currentIndex].classList.remove("active");
      listOfImages[newIndex].classList.add("active");
    });
  });
}

// Navigation
let resizeTimer;
const logo = document.querySelector(".logo");
const nav = document.querySelector("nav");
const navItems = document.querySelectorAll(".menu > li");

// Click events for navigation
logo.addEventListener("click", function() {
  if (nav.classList.contains("slide-in")) {
    nav.classList.remove("slide-in");
    nav.classList.add("slide-out");
  } else {
    nav.classList.remove("slide-out");
    nav.classList.add("slide-in");
  }
});

// Adds a click event for navigation
navItems.forEach((item) => {
  item.addEventListener("click", function() {
    if (nav.classList.contains("slide-in")) {
      nav.classList.remove("slide-in");
      nav.classList.add("slide-out");
    }
  });
});

// Adds a resize event for navigation
window.addEventListener("resize", function() {
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

// Check if the user has set their system to use reduced motion
const scroller = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const scroller = document.querySelector(".scroller__inner");

  if (scroller && !prefersReducedMotion) {
    scroller.setAttribute("data-animated", "true");
    const items = Array.from(scroller.children);
    items.forEach((item) => {
      const duplicate = item.cloneNode(true);
      duplicate.setAttribute("aria-hidden", "true");
      scroller.appendChild(duplicate);
    });
  }
};

// initialize brand scroller on page load and after each htmx swap
scroller();
document.body.addEventListener("htmx:afterSwap", scroller);

// add 'loaded' class to images on load from htmx swap
document.body.addEventListener("htmx:afterSwap", function() {
  const images = document.querySelectorAll(".img-fade");
  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.onload = function() { this.classList.add("loaded"); };
    }
  });
});

// add 'loaded' class to book-covers on load from initial page load
const bookCovers = document.querySelectorAll(".img-fade");
bookCovers.forEach((cover) => {
  if (cover.complete) {
    cover.classList.add("loaded");
  } else {
    cover.onload = function() { this.classList.add("loaded"); };
  }
});
