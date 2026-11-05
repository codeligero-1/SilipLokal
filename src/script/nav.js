const navLinks = document.querySelector(".page-links");
const navIndicator = navLinks?.querySelector(".nav-indicator");
const accountLink = document.querySelector(".account-link");
const themePicker = document.querySelector(".theme-picker");
const themeToggle = document.getElementById("themeToggle");
const themeMenu = document.getElementById("themeMenu");
const themeLabel = document.getElementById("themeLabel");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const mobileNavigation = window.matchMedia("(max-width: 768px)");
const pageNames = ["home", "about", "faq", "terms", "catalogue", "flea", "community", "login", "signup"];

function setMenuOpen(isOpen) {
    navMenu.classList.toggle("is-open", isOpen);
    navMenu.setAttribute("aria-hidden", String(!isOpen));
    navMenu.inert = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}

function updateNavigationLayout() {
    if (mobileNavigation.matches) {
        setMenuOpen(menuToggle.getAttribute("aria-expanded") === "true");
        return;
    }

    navMenu.classList.remove("is-open");
    navMenu.setAttribute("aria-hidden", "false");
    navMenu.inert = false;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

function moveNavIndicator(link) {
    if (!link || !navIndicator) {
        if (navIndicator) {
            navIndicator.style.opacity = "0";
        }
        return;
    }

    navIndicator.style.width = `${link.offsetWidth}px`;
    navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
    navIndicator.style.opacity = "1";
}

function setCurrentPage(page) {
    const isAuthPage = page === "login" || page === "signup";
    document.body.classList.toggle("is-auth-page", isAuthPage);
    document.getElementById("header").hidden = isAuthPage;
    document.getElementById("footer").hidden = isAuthPage;

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

    const isAccountPage = isAuthPage;
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

document.addEventListener("click", event => {
    const link = event.target.closest("[data-page]");

    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
    }

    const page = link.dataset.page;

    if (!pageNames.includes(page)) {
        return;
    }

    event.preventDefault();
    history.pushState({ page }, "", `#${page}`);
    setCurrentPage(page);
    if (mobileNavigation.matches) {
        setMenuOpen(false);
    }
    window.loadPage(page);
});

menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

navLinks?.addEventListener("pointerover", event => {
    const link = event.target.closest("[data-page]");

    if (link) {
        navLinks.classList.add("is-hovering");
        moveNavIndicator(link);
    }
});

navLinks?.addEventListener("pointerleave", () => {
    navLinks.classList.remove("is-hovering");
    navIndicator?.style.setProperty("opacity", "0");
});

navLinks?.addEventListener("focusin", event => {
    const link = event.target.closest("[data-page]");

    if (link) {
        navLinks.classList.add("is-hovering");
        moveNavIndicator(link);
    }
});

navLinks?.addEventListener("focusout", event => {
    if (!navLinks.contains(event.relatedTarget)) {
        navLinks.classList.remove("is-hovering");
        navIndicator?.style.setProperty("opacity", "0");
    }
});

window.addEventListener("resize", () => {
    moveNavIndicator(navLinks?.querySelector('[aria-current="page"]'));
});

themeToggle?.addEventListener("click", () => {
    const isExpanded = themeToggle.getAttribute("aria-expanded") === "true";
    themeMenu.hidden = isExpanded;
    themeToggle.setAttribute("aria-expanded", String(!isExpanded));

    if (!isExpanded) {
        themeMenu.querySelector('[aria-selected="true"]').focus();
    }
});

themeMenu?.addEventListener("click", event => {
    const option = event.target.closest("[data-theme-option]");

    if (!option) {
        return;
    }

    setTheme(option.dataset.themeOption);
    closeThemeMenu(true);
});

themeMenu?.addEventListener("keydown", event => {
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
    if (themePicker && !themePicker.contains(event.target) && themeMenu && !themeMenu.hidden) {
        closeThemeMenu();
    }

    if (mobileNavigation.matches && navMenu && menuToggle
        && !navMenu.contains(event.target) && !menuToggle.contains(event.target)
        && menuToggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && themeMenu && !themeMenu.hidden) {
        closeThemeMenu(true);
    }

    if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
        menuToggle.focus();
    }
});

setTheme("light");
updateNavigationLayout();
mobileNavigation.addEventListener("change", updateNavigationLayout);

window.addEventListener("popstate", () => {
    const page = location.hash.slice(1) || "home";
    setCurrentPage(page);
    if (mobileNavigation.matches) {
        setMenuOpen(false);
    }
    window.loadPage(page);
});

const initialPage = location.hash.slice(1) || "home";
setCurrentPage(initialPage);
window.loadPage(initialPage);