const app = document.getElementById("app");
const pagesDirectory = new URL("../pages/", document.currentScript.src);
const navLinks = document.querySelector(".page-links");
const navIndicator = navLinks?.querySelector(".nav-indicator");
const accountLink = document.querySelector(".account-link");
const themePicker = document.querySelector(".theme-picker");
const themeToggle = document.getElementById("themeToggle");
const themeMenu = document.getElementById("themeMenu");
const themeLabel = document.getElementById("themeLabel");
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

function moveNavIndicator(link) {
    if (!link || !navIndicator) {
        if (navIndicator) {
            navIndicator.style.opacity = "0";
        }
        return;
    }

    navIndicator.style.width = `${link.offsetWidth}px`;
    navIndicator.style.height = `${link.offsetHeight}px`;
    navIndicator.style.top = `${link.offsetTop}px`;
    navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
    navIndicator.style.opacity = "1";
}

function setCurrentPage(page) {
    if (!navLinks) {
        return;
    }

    const activeLink = navLinks.querySelector(`[data-page="${page}"]`);

    navLinks.querySelectorAll("[data-page]").forEach(link => {
        const isCurrent = link === activeLink;
        link.classList.toggle("active", isCurrent);

        if (isCurrent) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    const isAccountPage = page === "login" || page === "signup";
    accountLink?.classList.toggle("active", isAccountPage);

    if (isAccountPage) {
        accountLink?.setAttribute("aria-current", "page");
    } else {
        accountLink?.removeAttribute("aria-current");
    }

    activeLink?.scrollIntoView({ block: "nearest", inline: "nearest" });
    moveNavIndicator(activeLink);
}

function setTheme(theme) {
    document.body.dataset.theme = theme;
    themeLabel.textContent = `${theme === "dark" ? "Dark" : "Light"} mode`;

    themeMenu.querySelectorAll("[data-theme-option]").forEach(option => {
        option.setAttribute("aria-selected", String(option.dataset.themeOption === theme));
    });
}

function closeThemeMenu(returnFocus = false) {
    themeMenu.hidden = true;
    themeToggle.setAttribute("aria-expanded", "false");

    if (returnFocus) {
        themeToggle.focus();
    }
}

async function loadPage(page) {
    setCurrentPage(page);
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

document.addEventListener("click", event => {
    const link = event.target.closest("[data-page]");

    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }

    const page = link.dataset.page;

    if (!pages[page]) {
        return;
    }

    event.preventDefault();
    history.pushState({ page }, "", `#${page}`);
    loadPage(page);
});

navLinks?.addEventListener("pointerover", event => {
    const link = event.target.closest("[data-page]");

    if (link) {
        moveNavIndicator(link);
    }
});

navLinks?.addEventListener("pointerleave", () => {
    moveNavIndicator(navLinks.querySelector('[aria-current="page"]'));
});

navLinks?.addEventListener("focusin", event => {
    const link = event.target.closest("[data-page]");

    if (link) {
        moveNavIndicator(link);
    }
});

navLinks?.addEventListener("focusout", event => {
    if (!navLinks.contains(event.relatedTarget)) {
        moveNavIndicator(navLinks.querySelector('[aria-current="page"]'));
    }
});

window.addEventListener("resize", () => {
    moveNavIndicator(navLinks?.querySelector('[aria-current="page"]'));
});

themeToggle.addEventListener("click", () => {
    const isExpanded = themeToggle.getAttribute("aria-expanded") === "true";
    themeMenu.hidden = isExpanded;
    themeToggle.setAttribute("aria-expanded", String(!isExpanded));

    if (!isExpanded) {
        themeMenu.querySelector('[aria-selected="true"]').focus();
    }
});

themeMenu.addEventListener("click", event => {
    const option = event.target.closest("[data-theme-option]");

    if (!option) {
        return;
    }

    setTheme(option.dataset.themeOption);
    closeThemeMenu(true);
});

themeMenu.addEventListener("keydown", event => {
    const options = Array.from(themeMenu.querySelectorAll("[data-theme-option]"));
    const currentIndex = options.indexOf(document.activeElement);

    if (event.key === "Escape") {
        closeThemeMenu(true);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = (currentIndex + direction + options.length) % options.length;
        options[nextIndex].focus();
    }
});

document.addEventListener("click", event => {
    if (!themePicker.contains(event.target) && !themeMenu.hidden) {
        closeThemeMenu();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !themeMenu.hidden) {
        closeThemeMenu(true);
    }
});

setTheme("light");

window.addEventListener("popstate", () => {
    loadPage(location.hash.slice(1) || "home");
});

loadPage(location.hash.slice(1) || "home");
