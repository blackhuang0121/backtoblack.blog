const inputEl = document.querySelector(".input");

const bodyEl = document.querySelector("body");

inputEl.checked = JSON.parse(localStorage.getItem("mode"));

updateBody();

function updateBody() {
    if (inputEl.checked) {
        bodyEl.style.background = "black";
    } else {
        bodyEl.style.background = "white";
    }
}

inputEl.addEventListener("input", () => {
    updateBody();
    updateLocalStorage();
});

function updateLocalStorage() {
    localStorage.setItem("mode", JSON.stringify(inputEl.checked));
}

const bars = document.querySelector(".fa-bars");
const sidebar = document.querySelector(".sidebar");
const closingButton = document.querySelector(".fa-times");

bars.addEventListener("click", () => {
    sidebar.classList.toggle("show-sidebar");
});

closingButton.addEventListener("click", () => {
    sidebar.classList.remove("show-sidebar");
});