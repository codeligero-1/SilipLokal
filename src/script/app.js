const app = document.getElementById("app");
const pagesDirectory = new URL("../pages/", document.currentScript.src);
const pages = {
    home: "home",
    about: "aboutus",
    catalogue: "catalogue",
    flea: "flea",
    community: "community",
    login: "login",
    signup: "signup"
};
let latestRequest = 0;

async function loadPage(page) {
    const fileName = pages[page];

    if (!app) {
        console.error('Page container with id "app" was not found.');
        return;
    }

    if (!fileName) {
        app.innerHTML = "<h2>Page not found</h2>";
        return;
    }

    const requestId = ++latestRequest;

    try {
        const response = await fetch(new URL(`${fileName}.html`, pagesDirectory));

        if (!response.ok) {
            throw new Error(`Could not load the "${page}" page (${response.status}).`);
        }

        const content = await response.text();

        if (requestId === latestRequest) {
            app.innerHTML = content;
        }
    } catch (error) {
        if (requestId === latestRequest) {
            app.innerHTML = "<h2>Page could not be loaded</h2>";
            console.error(error);
        }
    }
}

window.loadPage = loadPage;
