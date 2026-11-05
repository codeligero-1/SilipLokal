(() => {
    const products = [
        { productId: "handmade", productName: "Product details coming soon", brandName: "Brand profile pending", productCategory: "Handmade goods", brandId: "handmade-brand", destinationUrl: "#catalogue" },
        { productId: "cafe", productName: "Product details coming soon", brandName: "Brand profile pending", productCategory: "Independent cafés", brandId: "cafe-brand", destinationUrl: "#catalogue" },
        { productId: "apparel", productName: "Product details coming soon", brandName: "Brand profile pending", productCategory: "Local apparel", brandId: "apparel-brand", destinationUrl: "#catalogue" },
        { productId: "pantry", productName: "Product details coming soon", brandName: "Brand profile pending", productCategory: "Pantry goods", brandId: "pantry-brand", destinationUrl: "#catalogue" },
        { productId: "personal-care", productName: "Product details coming soon", brandName: "Brand profile pending", productCategory: "Personal care", brandId: "personal-care-brand", destinationUrl: "#catalogue" }
    ];

    // Populate this list only with customer-submitted reviews approved for publication.
    const reviews = [];
    let carouselObservers = [];

    function element(tag, className, text) {
        const node = document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text) {
            node.textContent = text;
        }

        return node;
    }

    function placeholderImage(label) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" role="img"><rect width="640" height="640" rx="32" fill="#dedbd7"/><rect x="76" y="76" width="488" height="488" rx="28" fill="#e9e6e2" stroke="#bdb8b2" stroke-width="4"/><circle cx="190" cy="190" r="44" fill="none" stroke="#bdb8b2" stroke-width="4"/><path d="M116 480 290 304l244 242" fill="none" stroke="#bdb8b2" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><text x="320" y="600" text-anchor="middle" fill="#746b63" font-family="Arial,sans-serif" font-size="22">${label}</text></svg>`;
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }

    function addProductCards(track) {
        products.forEach(product => {
            const link = element("a", "product-card");
            link.href = product.destinationUrl;
            link.dataset.page = "catalogue";
            link.dataset.productId = product.productId;
            link.dataset.brandId = product.brandId;
            link.setAttribute("aria-label", `${product.productCategory}; product and brand details coming soon. Browse the catalogue.`);

            const imageFrame = element("span", "product-image-frame");
            const image = element("img", "product-image");
            image.src = placeholderImage("Illustrative placeholder");
            image.alt = `Illustrative placeholder for ${product.productCategory}; product image coming soon`;
            image.loading = "lazy";
            imageFrame.append(image);

            const name = element("span", "product-name", product.productName);
            const brand = element("span", "product-brand", product.brandName);
            const category = element("span", "product-category", product.productCategory);
            link.append(imageFrame, name, brand, category);
            track.append(link);
        });
    }

    function renderRating(rating) {
        const stars = element("span", "review-rating");
        stars.setAttribute("role", "img");
        stars.setAttribute("aria-label", `${rating} out of 5 stars`);

        for (let starIndex = 1; starIndex <= 5; starIndex += 1) {
            stars.append(element("span", starIndex <= rating ? "star is-filled" : "star", "★"));
        }

        return stars;
    }

    function showReviewDialog(review, dialog, content) {
        content.replaceChildren();

        const title = element("h2", "review-dialog-title", review.customerName);
        title.id = "review-dialog-title";
        const reviewText = element("p", "review-dialog-text", review.fullReview);
        const rating = renderRating(review.rating);
        const date = element("time", "review-date", review.date);

        if (review.dateValue) {
            date.dateTime = review.dateValue;
        }

        content.append(title, rating, reviewText, date);
        dialog.showModal();
    }

    function addReviewCards(track, dialog, dialogContent) {
        if (reviews.length === 0) {
            const emptyState = element("article", "review-empty-state");
            const image = element("img", "review-empty-image");
            image.src = placeholderImage("Review image");
            image.alt = "Illustrative placeholder for a customer review";
            image.loading = "lazy";

            const message = element("div", "review-empty-copy");
            message.append(
                element("h3", "review-customer-name", "Customer reviews coming soon"),
                element("p", "review-preview", "Verified customer experiences will be featured here once reviews are available.")
            );
            emptyState.append(image, message);
            track.append(emptyState);
            return;
        }

        reviews.forEach(review => {
            const card = element("article", "review-card");
            const customer = element("div", "review-customer");
            const avatar = element("img", "review-avatar");
            avatar.src = review.profileImage || placeholderImage("Customer");
            avatar.alt = review.profileImage ? `${review.customerName}'s profile` : "Customer profile placeholder";
            avatar.loading = "lazy";
            customer.append(avatar, element("span", "review-customer-name", review.customerName));

            const image = element("img", "review-image");
            image.src = review.image || placeholderImage("Customer photo");
            image.alt = review.imageAlt || "Customer-submitted product photo";
            image.loading = "lazy";

            const preview = element("p", "review-preview", review.preview);
            const readMore = element("button", "review-read-more", "Read More");
            readMore.type = "button";
            readMore.addEventListener("click", () => showReviewDialog(review, dialog, dialogContent));

            card.append(customer, image, renderRating(review.rating), preview, readMore);
            track.append(card);
        });
    }

    function setupCarousel(carousel, track, nextButton, itemSelector) {
        if (!carousel || !track || !nextButton) {
            console.error("Homepage showcase carousel markup is incomplete.");
            return;
        }

        function updateButton() {
            const canScroll = track.scrollWidth > track.clientWidth + 1;
            nextButton.hidden = !canScroll;
            nextButton.disabled = !canScroll;
        }

        nextButton.addEventListener("click", () => {
            const item = track.querySelector(itemSelector);
            if (!item) {
                return;
            }

            const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
            const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
            track.scrollBy({
                left: atEnd ? -track.scrollLeft : item.getBoundingClientRect().width + gap,
                behavior: "smooth"
            });
        });

        track.addEventListener("scroll", updateButton, { passive: true });
        const observer = new ResizeObserver(updateButton);
        observer.observe(track);
        carouselObservers.push(observer);
        updateButton();
    }

    function initialize() {
        document.querySelectorAll("[data-home-showcase]").forEach(section => {
            if (section.dataset.initialized === "true") {
                return;
            }

            const productCarousel = section.querySelector("[data-product-carousel]");
            const productTrack = section.querySelector("[data-product-track]");
            const productNext = section.querySelector("[data-product-next]");
            const reviewCarousel = section.querySelector("[data-review-carousel]");
            const reviewTrack = section.querySelector("[data-review-track]");
            const reviewNext = section.querySelector("[data-review-next]");
            const dialog = section.querySelector("[data-review-dialog]");
            const dialogContent = section.querySelector("[data-review-dialog-content]");

            if (!productTrack || !reviewTrack || !dialog || !dialogContent) {
                console.error("Homepage showcase markup is incomplete.");
                return;
            }

            section.dataset.initialized = "true";
            addProductCards(productTrack);
            addReviewCards(reviewTrack, dialog, dialogContent);
            setupCarousel(productCarousel, productTrack, productNext, ".product-card");
            setupCarousel(reviewCarousel, reviewTrack, reviewNext, ".review-card");
        });
    }

    document.addEventListener("page:loaded", event => {
        carouselObservers.forEach(observer => observer.disconnect());
        carouselObservers = [];

        if (event.detail.page === "home") {
            initialize();
        }
    });
})();
