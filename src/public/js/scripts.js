// Purpose: Contains all the scripts used in the project.
// NAVIGATION ------------------------------------------------------------------
const eventMap = new Map();
let areMobileEventsAdded = false;

// OBSERVER
function updateUI(path) {
    console.log("inside updateUI. the path is:", path);
    const books = new Set(["/word", "/excel", "/powerpoint", "/outlook"]);
    if (books.has(path)) {
        console.log("inside updateUI has path");
        adjustNavigationUI();
        launchPreviewModal();
        toggleCanadaPostIconVisibility();
        updateCartDotState();
    } else if (path === "/") {
        console.log("inside updateUI path /");
        adjustNavigationUI();
        applyScrollingEffectToBrands();
        updateCartDotState();
        removePreviewModalEventListeners();
    } else if (path === "/cart") {
        console.log("inside updateUI path /cart");
        adjustNavigationUI();
        removePreviewModalEventListeners();
        updateCartDotState();
    }
}

const observer = new MutationObserver(() => {
    const path = window.location.pathname;
    updateUI(path);
    observer.disconnect();
});

observer.observe(document, { childList: true, subtree: true });

// EVENT LISTENERS
// for full page load
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const path = window.location.pathname;
        updateUI(path);
    }, 250);
});

// for htmx swap
document.addEventListener("htmx:afterSwap", () => {
    setTimeout(() => {
        const path = window.location.pathname;
        console.log("path", path);
        updateUI(path);
    }, 250);
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
                const boundHandleClick = function() {
                    toggleVisibility(nav);
                };
                // If it is, we add a click event to toggle the navigation visibility.
                logo.addEventListener("click", boundHandleClick);
                // store the event in a map to be able to remove it later.
                eventMap.set(logo, boundHandleClick);
            }
        }
        if (navItems) {
            // we also add eventListeners to the links to close the navigation when clicked.
            navItems.forEach((item) => {
                const boundHandleClick = function() {
                    toggleVisibility(nav);
                };
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

let resizeTimer;

function disableTransition() {
    const nav = document.querySelector("nav");
    nav && nav.classList.add("disable_transition");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (nav) {
            nav.classList.remove("disable_transition");
        }
        adjustNavigationUI();
    }, 100);
}

function toggleVisibility(item) {
    item.classList.toggle("slide_out");
    item.classList.toggle("slide_in");
}

// MODAL
const modalEventMap = new Map();

function launchPreviewModal() {
    // Select button and associated modal.
    const previewButton = document.querySelector("#preview-button");

    const previewButtonClickHandler = () => {
        const preview = document.querySelector("dialog#preview");
        preview.showModal();
        document.body.style.overflow = "hidden";
        navigatePreviewModal();
        // new document level click event to close the modal
        setTimeout(() => {
            const closeModalHandler = (event) => {
                if (checkClickOutsideModal(preview.getBoundingClientRect(), event)) {
                    preview.close();
                    document.body.style.overflow = "auto";
                    // remove event listener
                    document.removeEventListener("click", closeModal);
                }
            };
            document.addEventListener("click", closeModalHandler);
            // storing the closeModal event
            modalEventMap.set(document, closeModalHandler);
        }, 100);
    };

    previewButton.addEventListener("click", previewButtonClickHandler);
    // storing the preview click event
    modalEventMap.set(previewButton, previewButtonClickHandler);
}

// Add click events to the preview modal to change the image
function navigatePreviewModal() {
    const buttons = document.querySelectorAll("#next, #prev");

    buttons.forEach((button) => {
        const previewModalNavHandler = () => {
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
        };

        button.addEventListener("click", previewModalNavHandler);
        // storing the events
        modalEventMap.set(button, previewModalNavHandler);
    });
}

function removePreviewModalEventListeners() {
    // removing te added event listeners
    for (const [element, handler] of modalEventMap) {
        element.removeEventListener("click", handler);
    }
    // clearing the map
    modalEventMap.clear();
}

// define the area outside a modal
function checkClickOutsideModal(modal, event) {
    const top = modal.top > event.clientY;
    const bottom = modal.bottom < event.clientY;
    const left = modal.left > event.clientX;
    const right = modal.right < event.clientX;
    return top || bottom || left || right;
}

// SCROLLING
// Check if the user has set their system to use reduced motion
const applyScrollingEffectToBrands = () => {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const scroller = document.querySelector(".scroller_inner");
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
    const invisible = getTotalQuantityFromCookie();
    const cartDot = document.querySelector("#cherry");
    console.log("invisible", invisible);
    if (invisible > 0) {
        cartDot.classList.remove("invisible");
    } else {
        cartDot.classList.add("invisible");
    }
}

document.addEventListener("click", () => {
    const addToCart = document.querySelector("#add_to_cart");
    addToCart.addEventListener("click", () => {
        updateCartDotState();
    });
    const deleteButton = document.querySelectorAll(".delete");
    deleteButton.forEach((button) => {
        button.addEventListener("click", () => {
            updateCartDotState();
        });
    });
});

// CART HELPER FUNCTION
function getTotalQuantityFromCookie() {
    const cookieName = "items=";
    // is there a better way of getting cookies? count number of times "title" appears in cookie?
    const array = decodeURIComponent(document.cookie);
    console.log(array);
    if (array === "" || array === "items=[]") {
        return 0;
    }
    const amount = array
        .slice(cookieName.length)
        .split(";")
        .map(cookie => cookie.trim());
    console.log(amount);
    return amount.length;
}
