// header
const handleHeader = () => {
  const header = document.querySelector("header > div > img:nth-child(1)");
  if (window.innerWidth < 960) {
    if (header) {
      header.removeAttribute("hx-target");
      header.removeAttribute("hx-get");
      header.removeAttribute("hx-swap");
      header.removeAttribute("hx-push-url");
      header.onclick = () => console.log("clicked");
    }
  } else {
    if (header) {
      header.setAttribute("hx-target", "main");
      header.setAttribute("hx-get", "/content_accueil");
      header.setAttribute("hx-swap", "show:window:top");
      header.setAttribute("hx-push-url", "/");
    }
  }
};

window.addEventListener("load", handleHeader);
window.addEventListener("resize", handleHeader);

// modal window
const modal = document.querySelector("#modal");

document.addEventListener("DOMContentLoaded", () => {
  const modalButton = document.querySelector("#modal-button");
  modalButton.addEventListener("click", () => modal.showModal());
});

// modal background close
modal.addEventListener("click", (event) => {
  const dialogDimensions = modal.getBoundingClientRect();
  if (
    dialogDimensions.top > event.clientY ||
    dialogDimensions.bottom < event.clientY ||
    dialogDimensions.left > event.clientX ||
    dialogDimensions.right < event.clientX
  ) {
    modal.close();
  }
});
