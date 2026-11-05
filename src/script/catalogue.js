(() => {
    const categories = [
        { id: "cafes", label: "Local Cafes", icon: "M5 10h14l-1.5 10h-11L5 10Zm2-3h10v3H7V7Zm3 0V4h4v3" },
        { id: "anik-anik", label: "Local Anik-Anik Shops", icon: "m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3Z" },
        { id: "creative-services", label: "Local Creative Services", icon: "m4 17 10-10 3 3L7 20H4v-3Zm11-11 2-2 4 4-2 2" },
        { id: "handmade", label: "Handmade Accessories", icon: "M5 7h14v12H5zM8 7V5a4 4 0 0 1 8 0v2m-4 5v3" },
        { id: "apparel", label: "Local Apparel", icon: "m8 4 4 2 4-2 5 4-3 4-2-1v9H8v-9l-2 1-3-4 5-4Z" },
        { id: "pantry", label: "Pantry Goods", icon: "M7 4h10l1 4v12H6V8l1-4Zm-1 4h12m-8 4h4" },
        { id: "personal-care", label: "Personal Care", icon: "M9 4h6v4H9zM8 8h8l2 3v9H6v-9l2-3Zm1 6h6" },
        { id: "home-and-decor", label: "Home and Decor", icon: "m3 11 9-7 9 7v9h-6v-6H9v6H3v-9Z" },
        { id: "specialty-food", label: "Specialty Food and Drink", icon: "M7 4h10v3H7zM8 7v12h8V7m-8 3h8m-5 3h2" },
        { id: "all", label: "All Recommended Shops", icon: "M4 5h16M4 12h16M4 19h16" }
    ];

    const recommendedCategories = categories.filter(category => category.id !== "all").map(category => category.id);
    const categoryLabels = new Map(categories.map(category => [category.id, category.label]));
    const recommendedPerPage = 10;
    const totalPages = 3;
    const initialCategoryCount = 3;
    const extraCategoryCount = 3;

    function createElement(tag, className, text) {
        const node = document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text) {
            node.textContent = text;
        }

        return node;
    }

    function shopDescription(categoryId) {
        return `${categoryLabels.get(categoryId)} business details and description coming soon.`;
    }

    function createShop(categoryId, id) {
        return {
            id,
            categoryId,
            name: "Brand Name coming soon",
            description: shopDescription(categoryId)
        };
    }

    const recommendedShops = Array.from({ length: recommendedPerPage * totalPages }, (_, index) => {
        const categoryId = recommendedCategories[index % recommendedCategories.length];
        return createShop(categoryId, `recommended-${index + 1}`);
    });

    const categoryShops = Object.fromEntries(
        ["cafes", "anik-anik", "creative-services"].map(categoryId => [
            categoryId,
            Array.from({ length: initialCategoryCount + extraCategoryCount }, (_, index) =>
                createShop(categoryId, `${categoryId}-${index + 1}`)
            )
        ])
    );

    function createPlaceholderImage(altText) {
        const image = createElement("img", "catalogue-placeholder-image");
        image.src = "assets/about-image-placeholder.svg";
        image.alt = altText;
        image.loading = "lazy";
        return image;
    }

    function openShopDetails(shop, dialog, content) {
        content.replaceChildren();

        const title = createElement("h2", "shop-dialog-title", shop.name);
        title.id = "shop-dialog-title";
        const category = createElement("p", "shop-dialog-category", categoryLabels.get(shop.categoryId));
        const description = createElement(
            "p",
            "shop-dialog-description",
            `${shop.description} Verified shop information and profile details will be added when available.`
        );
        content.append(title, category, createPlaceholderImage(`Placeholder image for ${categoryLabels.get(shop.categoryId)}`), description);
        dialog.showModal();
    }

    function createShopCard(shop, cardType, dialog, dialogContent) {
        const card = createElement("article", `catalogue-shop-card ${cardType}`);
        card.dataset.shopId = shop.id;
        card.dataset.categoryId = shop.categoryId;
        const image = createPlaceholderImage(`Placeholder image for ${categoryLabels.get(shop.categoryId)}`);
        const name = createElement("h3", "catalogue-shop-name", shop.name);
        const description = createElement("p", "catalogue-shop-description", shop.description);
        const detailsButton = createElement("button", "catalogue-shop-details");
        detailsButton.type = "button";
        detailsButton.setAttribute("aria-label", `Open details for ${shop.name} in ${categoryLabels.get(shop.categoryId)}`);
        detailsButton.append(
            createElement("span", "details-button-label", "View shop details"),
            createElement("span", "details-button-arrow", "›")
        );
        detailsButton.addEventListener("click", () => openShopDetails(shop, dialog, dialogContent));
        card.append(image, name, description, detailsButton);
        return card;
    }

    function createCategoryButton(category, activeCategory, onSelect) {
        const button = createElement("button", "catalogue-category-button");
        button.type = "button";
        button.dataset.categoryFilter = category.id;
        button.setAttribute("aria-label", category.label);
        button.setAttribute("aria-pressed", String(category.id === activeCategory));
        button.title = category.label;

        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        icon.setAttribute("viewBox", "0 0 24 24");
        icon.setAttribute("aria-hidden", "true");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", category.icon);
        icon.append(path);
        button.append(icon);
        button.addEventListener("click", () => onSelect(category.id));
        return button;
    }

    function initialize(section) {
        const categoriesNav = section.querySelector("[data-catalogue-categories]");
        const recommendedGrid = section.querySelector("[data-recommended-grid]");
        const pagination = section.querySelector("[data-catalogue-pagination]");
        const dialog = section.querySelector("[data-shop-dialog]");
        const dialogContent = section.querySelector("[data-shop-dialog-content]");

        if (!categoriesNav || !recommendedGrid || !pagination || !dialog || !dialogContent) {
            console.error("Catalogue page markup is incomplete.");
            return;
        }

        let currentPage = 1;
        let activeCategory = "all";

        function getVisibleShops() {
            const shops = activeCategory === "all"
                ? recommendedShops
                : recommendedShops.filter(shop => shop.categoryId === activeCategory);

            if (activeCategory === "all") {
                const startIndex = (currentPage - 1) * recommendedPerPage;
                return shops.slice(startIndex, startIndex + recommendedPerPage);
            }

            return shops.slice((currentPage - 1) * recommendedPerPage, currentPage * recommendedPerPage);
        }

        function renderRecommended() {
            recommendedGrid.replaceChildren(
                ...getVisibleShops().map(shop => createShopCard(shop, "recommended-shop-card", dialog, dialogContent))
            );

            categoriesNav.replaceChildren(...categories.map(category =>
                createCategoryButton(category, activeCategory, categoryId => {
                    activeCategory = categoryId;
                    currentPage = 1;
                    renderRecommended();
                })
            ));

            const visibleCount = activeCategory === "all"
                ? totalPages
                : Math.max(1, Math.ceil(recommendedShops.filter(shop => shop.categoryId === activeCategory).length / recommendedPerPage));
            const pagesToShow = activeCategory === "all" ? totalPages : visibleCount;

            pagination.replaceChildren(...Array.from({ length: pagesToShow }, (_, index) => {
                const pageNumber = index + 1;
                const button = createElement("button", "catalogue-page-button", String(pageNumber));
                button.type = "button";
                button.setAttribute("aria-label", `Page ${pageNumber}`);
                if (pageNumber === currentPage) {
                    button.setAttribute("aria-current", "page");
                }
                button.addEventListener("click", () => {
                    currentPage = pageNumber;
                    renderRecommended();
                });
                return button;
            }));
        }

        renderRecommended();

        section.querySelectorAll("[data-category-grid]").forEach(grid => {
            const categoryId = grid.dataset.categoryGrid;
            const shops = categoryShops[categoryId];

            if (!shops) {
                console.error(`Unknown catalogue category: ${categoryId}`);
                return;
            }

            const renderCategory = () => {
                const viewMore = section.querySelector(`[data-view-more="${categoryId}"]`);
                const expanded = viewMore?.getAttribute("aria-expanded") === "true";
                const visibleShops = expanded ? shops : shops.slice(0, initialCategoryCount);
                grid.replaceChildren(...visibleShops.map(shop =>
                    createShopCard(shop, "category-shop-card", dialog, dialogContent)
                ));
            };

            const viewMore = section.querySelector(`[data-view-more="${categoryId}"]`);
            if (!viewMore) {
                console.error(`Catalogue category "${categoryId}" is missing its View More button.`);
                return;
            }

            viewMore.addEventListener("click", () => {
                const expanded = viewMore.getAttribute("aria-expanded") !== "true";
                viewMore.setAttribute("aria-expanded", String(expanded));
                viewMore.querySelector("span:first-child").textContent = expanded ? "Show Less" : "View More";
                renderCategory();
            });

            renderCategory();
        });
    }

    document.addEventListener("page:loaded", event => {
        if (event.detail.page === "catalogue") {
            document.querySelectorAll("[data-catalogue]").forEach(section => {
                if (section.dataset.initialized === "true") {
                    return;
                }

                section.dataset.initialized = "true";
                initialize(section);
            });
        }
    });
})();
