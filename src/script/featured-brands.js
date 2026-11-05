const featuredBrandColors = [
    ["#ded4c9", "#f0e9e1"],
    ["#d9d4c8", "#eee9de"],
    ["#d7cbd0", "#efe4e8"],
    ["#d9d1c2", "#f0eadc"],
    ["#cdd5cb", "#e7ede5"],
    ["#d5cdc2", "#eee8df"],
    ["#d2d0d9", "#e9e7ef"],
    ["#d9cfc5", "#f0e7df"]
];

const featuredBrandRecords = [
    {
        brandId: "handmade-accessories",
        brandName: "Brand name coming soon",
        category: "Handmade accessories",
        description: "A placeholder for a Filipino maker of handcrafted accessories. Add a verified business name, story, and product details here.",
        destinationUrl: "#catalogue"
    },
    {
        brandId: "independent-cafe",
        brandName: "Brand name coming soon",
        category: "Independent café",
        description: "A placeholder for an independent Filipino café. Add verified information about its menu, location, and story here.",
        destinationUrl: "#catalogue"
    },
    {
        brandId: "local-apparel",
        brandName: "Brand name coming soon",
        category: "Local apparel",
        description: "A placeholder for a Filipino clothing label. Add its verified business details, approach, and featured pieces here.",
        destinationUrl: "#catalogue"
    },
    {
        brandId: "pantry-goods",
        brandName: "Brand name coming soon",
        category: "Pantry goods",
        description: "A placeholder for a Filipino food producer. Add verified product information, ingredients, and business details here.",
        destinationUrl: "#catalogue"
    },
    {
        brandId: "personal-care",
        brandName: "Brand name coming soon",
        category: "Personal care",
        description: "A placeholder for a Filipino personal-care business. Add verified product details and the maker's story here.",
        destinationUrl: "#catalogue"
    },
    {
        brandId: "home-and-decor",
        brandName: "Brand name coming soon",
        category: "Home and decor",
        description: "A placeholder for a Filipino homewares business. Add verified information about its products and craft here.",
        destinationUrl: "#catalogue"
    },
    {
        brandId: "creative-services",
        brandName: "Brand name coming soon",
        category: "Creative services",
        description: "A placeholder for a Filipino creative studio. Add verified services, portfolio details, and contact information here.",
        destinationUrl: "#catalogue"
    },
    {
        brandId: "specialty-food",
        brandName: "Brand name coming soon",
        category: "Specialty food and drink",
        description: "A placeholder for a Filipino specialty food or drink business. Add verified products and business details here.",
        destinationUrl: "#catalogue"
    }
];

function createBrandPlaceholder(index, isLogo = false) {
    const [background, foreground] = featuredBrandColors[index % featuredBrandColors.length];
    const size = isLogo ? "160" : "640";
    const inset = isLogo ? "22" : "56";
    const frame = isLogo ? "116" : "528";
    const radius = isLogo ? "18" : "34";
    const circle = isLogo ? "42" : "96";
    const circleX = isLogo ? "54" : "150";
    const circleY = isLogo ? "55" : "158";
    const mountain = isLogo
        ? "M27 116 73 72l60 57"
        : "M74 480 266 288l298 270";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" rx="${isLogo ? 12 : 28}" fill="${background}"/><rect x="${inset}" y="${inset}" width="${frame}" height="${frame}" rx="${radius}" fill="${foreground}" stroke="#a9a39c" stroke-width="3"/><circle cx="${circleX}" cy="${circleY}" r="${circle}" fill="none" stroke="#a9a39c" stroke-width="3"/><path d="${mountain}" fill="none" stroke="#a9a39c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const featuredBrands = featuredBrandRecords.map((brand, index) => ({
    ...brand,
    brandLogo: createBrandPlaceholder(index, true),
    featuredImage: createBrandPlaceholder(index)
}));

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}

function initializeFeaturedBrands() {
    document.querySelectorAll("[data-featured-brands]").forEach(section => {
        if (section.dataset.initialized === "true") {
            return;
        }

        const gallery = section.querySelector("[data-brand-gallery]");
        const carousel = section.querySelector("[data-featured-carousel]");
        const card = section.querySelector("[data-featured-card]");
        const previousButton = section.querySelector("[data-carousel-previous]");
        const nextButton = section.querySelector("[data-carousel-next]");

        if (!gallery || !carousel || !card || !previousButton || !nextButton) {
            console.error("Featured brand carousel markup is incomplete.");
            return;
        }

        section.dataset.initialized = "true";
        gallery.setAttribute("role", "group");
        gallery.setAttribute("aria-label", "Choose a featured brand");
        carousel.setAttribute("aria-roledescription", "carousel");

        const slide = createElement("article", "featured-slide");
        slide.setAttribute("role", "group");
        slide.setAttribute("aria-roledescription", "slide");

        const image = createElement("img", "featured-image");
        image.loading = "lazy";
        image.width = 640;
        image.height = 640;

        const details = createElement("div", "featured-details");
        const category = createElement("p", "featured-category");
        const name = createElement("h3", "featured-name");
        const description = createElement("p", "featured-description");
        const exploreLink = createElement("a", "featured-link", "Explore the catalogue");
        exploreLink.href = "#catalogue";
        exploreLink.dataset.page = "catalogue";

        details.append(category, name, description, exploreLink);
        slide.append(image, details);

        const pagination = createElement("div", "carousel-pagination");
        pagination.setAttribute("role", "group");
        pagination.setAttribute("aria-label", "Choose a featured brand");

        const logoButtons = featuredBrands.map((brand, index) => {
            const button = createElement("button", "brand-logo-button");
            button.type = "button";
            button.dataset.brandIndex = String(index);
            button.setAttribute("aria-label", `Show ${brand.category}`);

            const logo = createElement("img", "brand-logo");
            logo.src = brand.brandLogo;
            logo.alt = `Placeholder image for ${brand.category}`;
            logo.width = 80;
            logo.height = 80;

            button.append(logo);
            button.addEventListener("click", () => showBrand(index));
            gallery.append(button);

            const dot = createElement("button", "carousel-dot");
            dot.type = "button";
            dot.dataset.brandIndex = String(index);
            dot.setAttribute("aria-label", `Show featured brand ${index + 1}: ${brand.category}`);
            dot.addEventListener("click", () => showBrand(index));
            pagination.append(dot);

            return button;
        });

        card.append(slide, pagination);

        let activeIndex = 0;

        function showBrand(index) {
            activeIndex = (index + featuredBrands.length) % featuredBrands.length;
            const brand = featuredBrands[activeIndex];

            slide.classList.remove("is-changing");
            image.src = brand.featuredImage;
            image.alt = `Illustrative placeholder for ${brand.category}`;
            category.textContent = brand.category;
            name.textContent = brand.brandName;
            description.textContent = brand.description;
            slide.setAttribute("aria-label", `${activeIndex + 1} of ${featuredBrands.length}: ${brand.category}`);
            exploreLink.href = brand.destinationUrl;

            void slide.offsetWidth;
            slide.classList.add("is-changing");

            logoButtons.forEach((button, buttonIndex) => {
                const isActive = buttonIndex === activeIndex;
                button.classList.toggle("is-active", isActive);

                if (isActive) {
                    button.setAttribute("aria-current", "true");
                } else {
                    button.removeAttribute("aria-current");
                }

                pagination.children[buttonIndex].setAttribute("aria-current", String(isActive));
            });

            if (showBrand.timeout) {
                clearTimeout(showBrand.timeout);
            }

            showBrand.timeout = setTimeout(() => {
                slide.classList.remove("is-changing");
            }, 220);
        }

        previousButton.addEventListener("click", () => showBrand(activeIndex - 1));
        nextButton.addEventListener("click", () => showBrand(activeIndex + 1));

        carousel.addEventListener("keydown", event => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showBrand(activeIndex - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                showBrand(activeIndex + 1);
            }
        });

        showBrand(0);
    });
}

document.addEventListener("page:loaded", event => {
    if (event.detail.page === "home") {
        initializeFeaturedBrands();
    }
});
