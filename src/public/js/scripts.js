// Purpose: Contains all the scripts used in the project.

/* CONSTANTS AND VARIABLES */
const TIMEOUT_DURATION = 350;
const MOBILE_VIEW_WIDTH = 960;
const RESIZE_WAIT_DURATION = 200;

const logo = document.querySelector(".logo");
const nav = document.querySelector("nav");
const navItems = document.querySelectorAll(".menu > li");

const eventMap = new Map();
const modalEventMap = new Map();
const bookPathSet = new Set(["/manuel/word", "/manuel/excel", "/manuel/powerpoint", "/manuel/outlook"]);

let areMobileEventsAdded = false;

function isValidBook(path) { return bookPathSet.has(path); }

// functions activated depending on browser url
function evaluatePathAndUpdateUI(path) {
    updateCartDotState();
    if (isValidBook(path)) {
        createPreviewModalEventListeners();
        createCanadaPostIconToggle();
    } else if (path === "/") {
        createBrandScroller();
        removePreviewModalEventListener();
    }
    if (path === "/panier") {
        removePreviewModalEventListener();
        ifCartIsEmptyDisableButton();
    } else if (path === "/caisse") {
        ifCheckoutFormIsNotCompleteDisableButton();
    }
}

function handleEventCreation() {
    const currentPath = window.location.pathname;
    evaluatePathAndUpdateUI(currentPath);
}

/**
 * Registers an event to be executed after the DOM has finished loading.
 *
 * This method calls the `adjustMobileNavigationUI` function and then uses
 * the `setTimeout` function to schedule the `handleEventCreation` function
 * to be executed after a specified duration.
 *
 * @return {undefined} This method does not return any value.
 */
function registerEventAfterDOMLoad() {
    adjustMobileNavigationUI();
    setTimeout(handleEventCreation, TIMEOUT_DURATION);
}

/**
 * Adjusts the mobile navigation UI based on the current view and event status.
 *
 * @return {undefined}
 */
function adjustMobileNavigationUI() {
    const mobileViewActivated = isMobileView();

    if (mobileViewActivated && !areMobileEventsAdded) {
        createMobileEvents();
    }

    if (!mobileViewActivated && areMobileEventsAdded) {
        removeMobileEvents();
    }
}

// general event listeners for page load and htmx DOM swaps
document.addEventListener("DOMContentLoaded", registerEventAfterDOMLoad());
document.addEventListener("htmx:afterSwap", () => {
    setTimeout(() => handleEventCreation(), TIMEOUT_DURATION)
});
window.addEventListener("resize", () => {
    temporarilyDisableTransitionOfMobileMenu()
}, adjustMobileNavigationUI());

// MOBILE NAVIGATION MENU
function isMobileView() { return window.innerWidth < MOBILE_VIEW_WIDTH; }

function handleNavItemClick() { return toggleTransitionOfMobileMenu(nav); }

function createMobileEvents() {
    if (logo) {
        logo.addEventListener("click", handleNavItemClick);
        eventMap.set(logo, handleNavItemClick);
    }
    navItems.forEach((item) => {
        item.addEventListener("click", handleNavItemClick);
        eventMap.set(item, handleNavItemClick);
    });
    areMobileEventsAdded = true;
}

function removeMobileEvents() {
    if (logo) {
        logo.removeEventListener("click", handleNavItemClick);
        eventMap.delete(logo);
    }
    navItems.forEach((item) => item.removeEventListener("click", handleNavItemClick));
    areMobileEventsAdded = false;
}

let resizeTimer;

function temporarilyDisableTransitionOfMobileMenu() {
    const nav = document.querySelector("nav");
    nav && nav.classList.add("disable_transition");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (nav) {
            nav.classList.remove("disable_transition");
        }
        adjustMobileNavigationUI();
    }, RESIZE_WAIT_DURATION);
}

function toggleTransitionOfMobileMenu(item) {
    item.classList.toggle("slide_out");
    item.classList.toggle("slide_in");
}

// BOOK PREVIEW MODAL
function locatePreviewButton() {
    return document.querySelector("#preview-button");
}

function createPreviewModalEventListeners() {
    const previewButton = locatePreviewButton();
    const preview = document.querySelector("dialog#preview");
    const previewButtonClickHandler = () => {
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
                    document.removeEventListener("click", closeModalHandler);
                }
            };
            document.addEventListener("click", closeModalHandler);
            // storing the closeModal event
            modalEventMap.set(document, closeModalHandler);
        }, RESIZE_WAIT_DURATION);
    };

    previewButton.addEventListener("click", previewButtonClickHandler);
    // storing the preview click event
    modalEventMap.set(previewButton, previewButtonClickHandler);
}

function removePreviewModalEventListener() {
    const previewButton = locatePreviewButton();
    modalEventMap.delete(previewButton);
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

// define the area outside a modal
function checkClickOutsideModal(modal, event) {
    const top = modal.top > event.clientY;
    const bottom = modal.bottom < event.clientY;
    const left = modal.left > event.clientX;
    const right = modal.right < event.clientX;
    return top || bottom || left || right;
}

// SCROLLING OF BRANDS
function createBrandScroller() {
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
}

// TOGGLE CANADA POST ANIMATION
function createCanadaPostIconToggle() {
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

// CART ICON
function updateCartDotState() {
    const quantityOfCartItems = getQuantityOfCartItemsFromCookie();
    const cartDot = document.querySelector("#cherry");
    if (quantityOfCartItems > 0) {
        cartDot.classList.remove("invisible");
    } else {
        cartDot.classList.add("invisible");
    }
}

function getQuantityOfCartItemsFromCookie() {
    const cookieName = "items=";
    // is there a better way of getting cookies? count number of times "title" appears in cookie?
    const cookies = decodeURIComponent(document.cookie).split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            const items = JSON.parse(cookie.substring(cookieName.length));
            return items.length;
        }
    }
    return 0;
}

// CART
function ifCartIsEmptyDisableButton() {
    const cartButton = document.querySelector("button");
    cartButton.disabled = getQuantityOfCartItemsFromCookie() === 0;
}

// CHECKOUT
function ifCheckoutFormIsNotCompleteDisableButton() {
    const form = document.querySelector("form");
    const inputs = Array.from(document.querySelectorAll("input"));
    const checkoutButton = document.querySelector("button");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = document.querySelector("#email");
    const confirmEmail = document.querySelector("#confirm_email");

    form.addEventListener("input", (event) => {
        const isFormFilled = inputs.every(input => input.value.trim() !== "");
        const isEmailsValid = emailRegex.test(email.value.trim())
            && emailRegex.test(confirmEmail.value.trim())
            && (confirmEmail.value.trim() === email.value.trim());
        checkoutButton.disabled = !(isFormFilled && isEmailsValid);
    });
}
