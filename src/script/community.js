(() => {
    const ratings = [
        { value: "all", label: "All reviews" },
        { value: "5", label: "5 stars" },
        { value: "4", label: "4 stars" },
        { value: "3", label: "3 stars" },
        { value: "2", label: "2 stars" },
        { value: "1", label: "1 star" }
    ];

    // Load only published reviews from a connected service; no review records exist in this static app.
    const reviews = [];
    const helpfulVotes = new Set();
    let activeRating = "all";
    let searchQuery = "";
    let initializedPage = null;
    let previewUrls = [];

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

    function createPlaceholderImage(alt) {
        const image = createElement("img", "review-card-image");
        image.src = "assets/about-image-placeholder.svg";
        image.alt = alt;
        image.loading = "lazy";
        return image;
    }

    function createRating(rating) {
        const stars = createElement("span", "review-card-stars");
        stars.setAttribute("role", "img");
        stars.setAttribute("aria-label", `${rating} out of 5 stars`);

        for (let value = 1; value <= 5; value += 1) {
            stars.append(createElement("span", value <= rating ? "is-filled" : "", value <= rating ? "★" : "☆"));
        }

        return stars;
    }

    function createReviewCard(review) {
        const card = createElement("article", "review-card");
        card.dataset.reviewId = review.id;

        const image = createPlaceholderImage(review.imageAlt || "Review photo placeholder");
        const titleRow = createElement("div", "review-card-heading");
        const business = createElement("h2", "review-business-name", review.businessName);
        const stars = createRating(review.rating);
        titleRow.append(business, stars);

        const category = createElement("p", "review-card-category", review.category || "Community review");
        const body = createElement("p", "review-card-copy", review.text);
        const footer = createElement("div", "review-card-footer");
        const author = createElement("span", "review-author", `${review.reviewerName} · ${review.date}`);
        const helpful = createElement("button", "review-helpful-button");
        helpful.type = "button";
        helpful.setAttribute("aria-pressed", String(helpfulVotes.has(review.id)));
        helpful.setAttribute("aria-label", helpfulVotes.has(review.id) ? "Remove helpful vote" : "Mark review helpful");
        helpful.append(
            createElement("span", "helpful-heart", helpfulVotes.has(review.id) ? "♥" : "♡"),
            createElement("span", "helpful-label", "Helpful"),
            createElement("span", "helpful-count", String(review.helpfulCount + (helpfulVotes.has(review.id) ? 1 : 0)))
        );
        helpful.addEventListener("click", () => {
            if (helpfulVotes.has(review.id)) {
                helpfulVotes.delete(review.id);
            } else {
                helpfulVotes.add(review.id);
            }
            card.replaceWith(createReviewCard(review));
        });

        footer.append(author, helpful);
        card.append(image, titleRow, category, body, footer);
        return card;
    }

    function renderReviews(grid, emptyState) {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
        const matchingReviews = reviews.filter(review => {
            const matchesRating = activeRating === "all" || String(review.rating) === activeRating;
            const searchableText = [
                review.businessName,
                review.reviewerName,
                review.category,
                review.title,
                review.text
            ].join(" ").toLocaleLowerCase();

            return matchesRating && searchableText.includes(normalizedQuery);
        });

        grid.replaceChildren(...matchingReviews.map(createReviewCard));
        emptyState.hidden = matchingReviews.length > 0;
        emptyState.querySelector("h2").textContent = reviews.length === 0
            ? "No published reviews yet"
            : "No reviews match your search";
        emptyState.querySelector("p").textContent = reviews.length === 0
            ? "Customer reviews will appear here after they are submitted and approved. No sample testimonials are shown."
            : "Try another search term or rating filter.";
    }

    function renderFilters(container, grid, emptyState) {
        container.replaceChildren(...ratings.map(rating => {
            const button = createElement("button", "review-filter-button");
            button.type = "button";
            button.dataset.ratingFilter = rating.value;
            button.setAttribute("aria-pressed", String(activeRating === rating.value));

            if (rating.value !== "all") {
                button.append(createElement("span", "filter-star", "★"));
            }
            button.append(createElement("span", "", rating.label));

            button.addEventListener("click", () => {
                activeRating = rating.value;
                renderFilters(container, grid, emptyState);
                renderReviews(grid, emptyState);
            });
            return button;
        }));
    }

    function updateImagePreviews(files, preview) {
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        previewUrls = [];
        preview.replaceChildren();

        Array.from(files).filter(file => file.type.startsWith("image/")).forEach(file => {
            const url = URL.createObjectURL(file);
            previewUrls.push(url);
            const image = createElement("img", "review-upload-preview");
            image.src = url;
            image.alt = `Preview of ${file.name}`;
            preview.append(image);
        });
    }

    function initialize(section) {
        if (initializedPage === section) {
            return;
        }

        activeRating = "all";
        searchQuery = "";

        const filterContainer = section.querySelector("[data-review-filters]");
        const searchInput = section.querySelector("[data-review-search]");
        const grid = section.querySelector("[data-review-grid]");
        const dialog = section.querySelector("[data-review-dialog]");
        const openButton = section.querySelector("[data-open-review]");
        const form = section.querySelector("[data-review-form]");
        const formMessage = section.querySelector("[data-review-form-message]");
        const emptyState = createElement("div", "review-empty-state");
        const emptyTitle = createElement("h2", "review-empty-title");
        const emptyCopy = createElement("p", "review-empty-copy");
        const ratingPicker = section.querySelector("[data-rating-picker]");
        const ratingValue = section.querySelector("[data-rating-value]");
        const description = section.querySelector("#review-description");
        const characterCount = section.querySelector("[data-character-count]");
        const imageInput = section.querySelector("#review-images");
        const imagePreview = section.querySelector("[data-image-preview]");

        if (!filterContainer || !searchInput || !grid || !dialog || !openButton || !form
            || !formMessage || !ratingPicker || !ratingValue || !description
            || !characterCount || !imageInput || !imagePreview) {
            console.error("Community page markup is incomplete.");
            return;
        }

        initializedPage = section;
        emptyState.append(emptyTitle, emptyCopy);
        renderFilters(filterContainer, grid, emptyState);
        renderReviews(grid, emptyState);
        grid.after(emptyState);

        searchInput.addEventListener("input", () => {
            searchQuery = searchInput.value;
            renderReviews(grid, emptyState);
        });

        openButton.addEventListener("click", () => {
            form.reset();
            ratingValue.value = "";
            form.querySelectorAll("[data-rating]").forEach(button => {
                button.setAttribute("aria-checked", "false");
                button.classList.remove("is-selected");
            });
            formMessage.textContent = "";
            characterCount.textContent = "0 / 1200";
            updateImagePreviews([], imagePreview);
            dialog.showModal();
        });

        ratingPicker.addEventListener("click", event => {
            const button = event.target.closest("[data-rating]");
            if (!button) {
                return;
            }

            ratingValue.value = button.dataset.rating;
            ratingPicker.querySelectorAll("[data-rating]").forEach(star => {
                const ratingNumber = Number(star.dataset.rating);
                star.setAttribute("aria-checked", String(ratingNumber === Number(ratingValue.value)));
                star.classList.toggle("is-selected", ratingNumber <= Number(ratingValue.value));
            });
        });

        ratingPicker.addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
                return;
            }

            const direction = event.key === "ArrowRight" ? 1 : -1;
            const currentRating = Number(ratingValue.value) || 0;
            const nextRating = Math.max(1, Math.min(5, currentRating + direction));
            const nextButton = ratingPicker.querySelector(`[data-rating="${nextRating}"]`);
            nextButton.focus();
            nextButton.click();
            event.preventDefault();
        });

        description.addEventListener("input", () => {
            characterCount.textContent = `${description.value.length} / 1200`;
        });

        imageInput.addEventListener("change", () => {
            const files = Array.from(imageInput.files);
            const invalidFile = files.find(file => !file.type.startsWith("image/"));
            if (invalidFile) {
                formMessage.textContent = "Choose image files only.";
                imageInput.value = "";
                updateImagePreviews([], imagePreview);
                return;
            }

            formMessage.textContent = "";
            updateImagePreviews(files, imagePreview);
        });

        form.addEventListener("submit", event => {
            event.preventDefault();
            formMessage.textContent = "";

            if (!form.reportValidity()) {
                return;
            }

            if (!ratingValue.value) {
                formMessage.textContent = "Select a star rating before continuing.";
                ratingPicker.querySelector("[data-rating='5']").focus();
                return;
            }

            formMessage.textContent = "Sign in to submit a review. Authenticated review submission is not available in this preview.";
        });
    }

    document.addEventListener("page:loaded", event => {
        if (event.detail.page === "community") {
            const section = document.querySelector("[data-community-page]");
            if (section) {
                initialize(section);
            }
            return;
        }

        previewUrls.forEach(url => URL.revokeObjectURL(url));
        previewUrls = [];
        initializedPage = null;
    });
})();
