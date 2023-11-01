/**
 * Toggles the attributes and events of the header based on the window width
 *
 * @function handleHeader
 */
const eventMap = new Map();
const windowWidth = window.innerWidth;
let areMobileEventsAdded;
if (windowWidth < 960 && areMobileEventsAdded === undefined) {
  areMobileEventsAdded = false;
}

function handleHeader() {
  // Selects the header
  const logo = document.querySelector(".logo");
  const nav = document.querySelector("nav");
  const navItems = document.querySelectorAll(".menu > li");
  // if in mobile view
  if (window.innerWidth < 960 && !areMobileEventsAdded) {
    if (logo) {
      // If it is, we remove the attributes from the logo link if they exist.
      logo.removeAttribute("hx-target");
      logo.removeAttribute("hx-get");
      logo.removeAttribute("hx-swap");
      logo.removeAttribute("hx-push-url");
      // and add a click event to toggle the navigation visibility.
      const boundHandleClick = handleClick.bind(nav);
      logo.addEventListener("click", boundHandleClick);
      // store the event in a map to be able to remove it later.
      eventMap.set(logo, boundHandleClick);
    }
    if (navItems) {
      // we also add eventListeners to the links to close the navigation when clicked.
      navItems.forEach((item) => {
        const boundHandleClick = handleClick.bind(nav);
        item.addEventListener("click", boundHandleClick);
        // store the event in a map to be able to remove it later.
        eventMap.set(item, boundHandleClick);
      });
    areMobileEventsAdded = true;
    }
  } else {
    if (areMobileEventsAdded) {
      // if in desktop view
      if (logo) {
        // we set the attributes to the logo to link to accueil.
        logo.setAttribute("hx-target", "main");
        logo.setAttribute("hx-get", "/data_index");
        logo.setAttribute("hx-swap", "show:window:top");
        logo.setAttribute("hx-push-url", "/");
        // and removes the click event from the logo.
        const boundHandleClick = eventMap.get(nav);
        if (boundHandleClick) {
          logo.removeEventListener("click", boundHandleClick);
          eventMap.delete(logo);
        }
        logo.removeEventListener("click", handleClick.bind(nav));
      }
      if (navItems) {
        // we also remove the eventListeners to the individual links
        navItems.forEach((item) => {
          const boundHandleClick = eventMap.get(item);
          if (boundHandleClick) {
            item.removeEventListener("click", boundHandleClick);
            eventMap.delete(item);
          }
        });
      }
      areMobileEventsAdded = false;
    }
  }
}

function toggleVisibility(item) {
  if (item.classList.contains("slide-in")) {
    item.classList.remove("slide-in");
    item.classList.add("slide-out");
  } else {
    item.classList.remove("slide-out");
    item.classList.add("slide-in");
  }
}

function handleClick() { toggleVisibility(this);}

// Binds event listeners for load and resize to handleHeader function.
window.addEventListener("load", handleHeader);
// Debounce the resize event to avoid calling handleHeader too often.
let resizeTimer;
window.addEventListener("resize", () => {
  // hide the navigation when resizing
  const nav = document.querySelector("nav");
  nav && nav.classList.add("slide-out");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(handleHeader, 200);
});

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
  if (isOutsideDialog(dialogDimensions, event)) {
    panier.close();
    document.body.classList.remove("no-scroll");
  }
});

function isOutsideDialog(rectangle, event) {
  const top = rectangle.top > event.clientY;
  const bottom = rectangle.bottom < event.clientY;
  const left = rectangle.left > event.clientX;
  const right = rectangle.right < event.clientX;
  return top || bottom || left || right;
}

// Preview modal window
const preview = document.querySelector("#preview");
preview.addEventListener("DOMContentLoaded", () => openPreview());
preview.addEventListener("htmx:afterSwap", () => openPreview());

// when the preview button is clicked, show the modal
function openPreview() {
  document.querySelector("#preview-button").addEventListener("click", () => {
    const preview = document.querySelector("#preview");
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
    closeModal(preview);
  });
}

function closeModal(modal) {
  modal.addEventListener("click", (event) => {
    const dialogDimensions = modal.getBoundingClientRect();
    // Close modal if user clicks outside the dialog
    if (isOutsideDialog(dialogDimensions, event)) {
      modal.close();
      document.body.classList.remove("no-scroll");
    }
  });
}

// Adds a click event to the preview modal for closing.

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
