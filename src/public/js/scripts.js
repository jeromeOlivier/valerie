// Purpose: Contains all the scripts used in the project.
// NAVIGATION ------------------------------------------------------------------
const eventMap = new Map();
let areMobileEventsAdded = false;

// EVENT LISTENERS
// for full page load
document.addEventListener("DOMContentLoaded", () => {
    adjustNavigationUI();
    launchCartModal();
    launchPreviewModal();
    updateCartDotState();
    updateCartDotState();
    applyScrollingEffectToBrands();
    toggleCanadaPostIconVisibility();
});

// for htmx swap
document.addEventListener("htmx:afterSwap", () => {
    applyScrollingEffectToBrands();
    launchPreviewModal();
    updateCartDotState();
    toggleCanadaPostIconVisibility();
});

// for resize
window.addEventListener("resize", () => {
    disableTransition();
});

// NAVIGATION
// Adjusts the navigation UI based on the screen size.
function adjustNavigationUI() {
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
                const boundHandleClick = toggleVisibility.bind(nav);
                // If it is, we add a click event to toggle the navigation visibility.
                logo.addEventListener("click", boundHandleClick);
                // store the event in a map to be able to remove it later.
                eventMap.set(logo, boundHandleClick);
            }
        }
        if (navItems) {
            // we also add eventListeners to the links to close the navigation when clicked.
            navItems.forEach((item) => {
                const boundHandleClick = toggleVisibility.bind(nav);
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

// NAVIGATION HELPER FUNCTIONS
let resizeTimer;

function disableTransition() {
    const nav = document.querySelector("nav");
    nav && nav.classList.add("disable-transition");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (nav) {
            nav.classList.remove("disable-transition");
        }
        adjustNavigationUI();
    }, 100);
}

function toggleVisibility(item) {
    item.classList.toggle("slide-out");
    item.classList.toggle("slide-in");
}

// MODAL
function launchCartModal() {
    // Select button and associated modal.
    const cart = document.querySelector("#cart");
    const cartButton = document.querySelector("#cart-button");
    cartButton.addEventListener("click", (event) => {
        cart.showModal();
        document.body.classList.add("no-scroll");
        // new document level click event to close the modal
        setTimeout(() => {
            document.addEventListener("click", function closeModal(event) {
                if (checkClickOutsideModal(cart.getBoundingClientRect(), event)) {
                    cart.close();
                    document.body.classList.remove("no-scroll");
                    // remove the event listener
                    document.removeEventListener("click", closeModal);
                }
            });
        }, 100);
    });
}

function launchPreviewModal() {
    // Select button and associated modal.
    const previewButton = document.querySelector("#preview-button");
    previewButton.addEventListener("click", () => {
        const preview = document.querySelector("dialog#preview");
        preview.showModal();
        document.body.style.overflow = "hidden";
        navigatePreviewModal();
        // new document level click event to close the modal
        setTimeout(() => {
            document.addEventListener("click", function closeModal(event) {
                if (checkClickOutsideModal(preview.getBoundingClientRect(), event)) {
                    preview.close();
                    document.body.style.overflow = "auto";
                    // remove event listener
                    document.removeEventListener("click", closeModal);
                }
            });
        }, 100);
    });
}

// MODAL HELPER FUNCTIONS
// define the area outside a modal
function checkClickOutsideModal(modal, event) {
    const top = modal.top > event.clientY;
    const bottom = modal.bottom < event.clientY;
    const left = modal.left > event.clientX;
    const right = modal.right < event.clientX;
    return top || bottom || left || right;
}

// Add click events to the preview modal to change the image
function navigatePreviewModal() {
    const buttons = document.querySelectorAll("#next, #prev");
    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            // if the button clicked is the next button, offset is 1, else -1
            const offset = button.id === "next" ? 1 : -1;
            // get the list of images and the current image
            const images = document.querySelectorAll("#preview > ul > li > img");
            // get the current image
            const current = document.querySelector(".active");
            // get the index of the current image and add the offset
            const currentIndex = [...images].indexOf(current);
            let newIndex = currentIndex + offset;
            // if the new index is out of bounds, wrap around
            if (newIndex < 0) newIndex = images.length - 1;
            if (newIndex > images.length - 1) newIndex = 0;
            // remove the active class from the current image and add it to the new one
            images[currentIndex].classList.remove("active");
            images[newIndex].classList.add("active");
        });
    });
}

// SCROLLING
// Check if the user has set their system to use reduced motion
const applyScrollingEffectToBrands = () => {
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

// TOGGLE CANADA POST
function toggleCanadaPostIconVisibility() {
    const canadaPost = document.querySelector("#post-logo");
    const pdfButton = document.querySelector("#pdf-format-tab");
    const paperButton = document.querySelector("#papier-format-tab");
    pdfButton.addEventListener("click", () => {
        canadaPost.classList.add("hide-post");
        canadaPost.classList.remove("show-post");
    });
    paperButton.addEventListener("click", () => {
        canadaPost.classList.remove("hide-post");
        canadaPost.classList.add("show-post");
    });
}

// CART
// update the cart dot state on click
function updateCartDotState() {
    const total = getTotalQuantityFromCookie();
    const cartDot = document.querySelector("#cherry");
    if (total > 0) {
        cartDot.classList.remove("invisible");
    } else {
        cartDot.classList.add("invisible");
    }
}

// CART HELPER FUNCTION
function getTotalQuantityFromCookie() {
    const cookieName = "items=";
    const decodedCookies = decodeURIComponent(document.cookie);
    const cookies = decodedCookies.split(";").map(cookie => cookie.trim());
    let totalQuantity = 0;

    for (const cookie of cookies) {
        if (cookie.startsWith(cookieName)) {
            try {
                const items = JSON.parse(cookie.slice(cookieName.length));
                totalQuantity = items.reduce((accumulatedQuantity, item) => accumulatedQuantity + item.quantity, 0);
            } catch (e) {
                console.error(e);
            }
        }
    }

    return totalQuantity;
}
