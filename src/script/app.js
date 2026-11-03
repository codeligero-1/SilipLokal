const app = document.getElementById("app");

async function loadPage(page) {

    try {
        const response = await fetch(`pages/${page}.html`);

        if (!response.ok) {
            throw new Error("Page not found");
        }

        const content = await response.text();

        app.innerHTML = content;

    } catch (error) {
        app.innerHTML = "<h2>Page not found</h2>";
        console.error(error);
    }
}


// Navigation functionality
document.querySelectorAll("[data-page]").forEach(link => {

    link.addEventListener("click", (event) => {

        event.preventDefault();

        const page = link.dataset.page;

        loadPage(page);

        history.pushState({ page }, "", `#${page}`);

    });

});


// Load initial page
const initialPage = location.hash.slice(1) || "home";

loadPage(initialPage);