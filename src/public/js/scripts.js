// Purpose: Contains all the scripts used in the project.
// NAVIGATION ------------------------------------------------------------------
{
  const eventMap = new Map();
  let areMobileEventsAdded = false;

  function handleHeader() {
    // Selects the header
    const logo = document.querySelector(".logo");
    const nav = document.querySelector("nav");
    const navItems = document.querySelectorAll(".menu > li");
    // if in mobile view
    if (window.innerWidth < 960 && !areMobileEventsAdded) {
      if (logo) {
        // check if an event has already been added to the logo.
        const boundHandleClick = eventMap.get(logo);
        if (!boundHandleClick) {
          const boundHandleClick = handleClick.bind(nav);
          // If it is, we add a click event to toggle the navigation visibility.
          logo.addEventListener("click", boundHandleClick);
          // store the event in a map to be able to remove it later.
          eventMap.set(logo, boundHandleClick);
        }
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
      if (window.innerWidth > 960 && areMobileEventsAdded) {
        // if in desktop view
        if (logo) {
          // we remove the click event from the logo.
          const boundHandleClick = eventMap.get(logo);
          if (boundHandleClick) {
            logo.removeEventListener("click", boundHandleClick);
            eventMap.delete(logo);
          }
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
    item.classList.toggle("slide-out");
    item.classList.toggle("slide-in");
  }

  function handleClick() { toggleVisibility(this);}

// Binds event listeners for load and resize to handleHeader function.
  window.addEventListener("load", handleHeader);

// Debounce the resize event to avoid calling handleHeader too often.
  let resizeTimer;
  window.addEventListener("resize", () => {
    // disable transitions when resizing to avoid weird behavior
    const nav = document.querySelector("nav");
    nav && nav.classList.add("disable-transition");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (nav) {
        nav.classList.remove("disable-transition");
      }
      handleHeader();
    }, 100);
  });
}
// MODAL WINDOWS ---------------------------------------------------------------
{
// define the area outside a modal
  function isOutsideDialog(modal, event) {
    const top = modal.top > event.clientY;
    const bottom = modal.bottom < event.clientY;
    const left = modal.left > event.clientX;
    const right = modal.right < event.clientX;
    return top || bottom || left || right;
  }

// Panier modal window
  document.addEventListener("DOMContentLoaded", () => {
    // Select button and associated modal.
    const panier = document.querySelector("#panier");
    const panierButton = document.querySelector("#panier-button");
    panierButton.addEventListener("click", (event) => {
      panier.showModal();
      document.body.classList.add("no-scroll");
      // new document level click event to close the modal
      setTimeout(() => {
        document.addEventListener("click", function closeModal(event) {
          if (isOutsideDialog(panier.getBoundingClientRect(), event)) {
            panier.close();
            document.body.classList.remove("no-scroll");
            // remove the event listener
            document.removeEventListener("click", closeModal);
          }
        });
      }, 100);
    });
  });

// Launch book preview modals with either a full page load or htmx swap
  document.addEventListener("DOMContentLoaded", () => launchPreviewModal());
  document.addEventListener("htmx:afterSwap", () => launchPreviewModal());

  function launchPreviewModal() {
    // Select button and associated modal.
    const preview = document.querySelector("#preview");
    const previewButton = document.querySelector("#preview-button");
    previewButton.addEventListener("click", () => {
      // Before showing the modal, adjust its position to the center of the viewport
      const top = window.innerHeight / 2 - preview.offsetHeight / 2 + window.scrollY;
      const left = window.innerWidth / 2 - preview.offsetWidth / 2 + window.scrollX;
      preview.style.top = `${ top }px`;
      preview.style.left = `${ left }px`;
      // show the modal
      preview.showModal();
      document.body.classList.add("no-scroll");
      activatePreview();
      // new document level click event to close the modal
      setTimeout(() => {
        document.addEventListener("click", function closeModal(event) {
          if (isOutsideDialog(preview.getBoundingClientRect(), event)) {
            preview.close();
            document.body.classList.remove("no-scroll");
            // remove the event listener
            document.removeEventListener("click", closeModal);
          }
        });
      }, 100);
      // disable scrolling on the body
      // delay activation of preview navigation until it is loaded
    });
  }

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
}

// SCROLLING -------------------------------------------------------------------
{
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
}

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
