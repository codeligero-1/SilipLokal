(() => {
    const exampleEvents = [
        {
            id: "hey-market-davao",
            name: "Hey Market Davao",
            description: "Example listing name from the design reference. Event schedule, venue, and organizer details are not yet confirmed."
        },
        {
            id: "flea-market-davao",
            name: "Flea Market Davao",
            description: "Example listing name from the design reference. Event schedule, venue, and organizer details are not yet confirmed."
        },
        {
            id: "upcoming-market-3",
            name: "Upcoming Flea Market",
            description: "Placeholder event listing. Confirmed event information will be added when it is available."
        },
        {
            id: "upcoming-market-4",
            name: "Upcoming Flea Market",
            description: "Placeholder event listing. Confirmed event information will be added when it is available."
        }
    ];

    let locationCardDismissed = false;
    let initializedPage = null;

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

    function openEventDetails(event, dialog, content) {
        content.replaceChildren();

        const title = createElement("h2", "event-dialog-title", event.name);
        title.id = "event-dialog-title";
        const note = createElement(
            "p",
            "event-dialog-note",
            "This is a placeholder listing, not a confirmed event. Dates, times, venue, vendors, and other event details have not been provided."
        );
        content.append(title, note);
        dialog.showModal();
    }

    function renderEvents(grid, dialog, dialogContent) {
        grid.replaceChildren(...exampleEvents.map(event => {
            const card = createElement("article", "flea-event-card");
            card.dataset.eventId = event.id;

            const image = createElement("img", "flea-event-image");
            image.src = "assets/flea-event-placeholder.svg";
            image.alt = "Placeholder image for flea market event";
            image.loading = "lazy";

            const information = createElement("div", "flea-event-information");
            const title = createElement("h3", "flea-event-name", event.name);
            const status = createElement("p", "flea-event-status", "Example listing · unconfirmed");
            const description = createElement("p", "flea-event-description", event.description);
            const more = createElement("button", "flea-event-more");
            more.type = "button";
            more.append(
                createElement("span", "flea-event-more-label", "View More"),
                createElement("span", "flea-event-more-arrow", "›")
            );
            more.setAttribute("aria-label", `View details for ${event.name}`);
            more.addEventListener("click", () => openEventDetails(event, dialog, dialogContent));

            information.append(title, status, description, more);
            card.append(image, information);
            return card;
        }));
    }

    function initialize(section) {
        if (initializedPage === section) {
            return;
        }

        const locationCard = section.querySelector("[data-location-card]");
        const locationClose = section.querySelector("[data-location-close]");
        const locationForm = section.querySelector("[data-location-form]");
        const locationInput = section.querySelector("[data-location-input]");
        const locationMessage = section.querySelector("[data-location-message]");
        const eventGrid = section.querySelector("[data-flea-event-grid]");
        const eventDialog = section.querySelector("[data-event-dialog]");
        const eventDialogContent = section.querySelector("[data-event-dialog-content]");

        if (!locationCard || !locationClose || !locationForm || !locationInput
            || !locationMessage || !eventGrid || !eventDialog || !eventDialogContent) {
            console.error("Flea Markets page markup is incomplete.");
            return;
        }

        initializedPage = section;
        renderEvents(eventGrid, eventDialog, eventDialogContent);

        if (!locationCardDismissed) {
            locationCard.hidden = false;
        }

        locationClose.addEventListener("click", () => {
            locationCardDismissed = true;
            locationCard.hidden = true;
        });

        locationForm.addEventListener("submit", event => {
            event.preventDefault();
            const location = locationInput.value.trim();

            if (!location) {
                locationMessage.textContent = "Enter a location to continue.";
                locationInput.setAttribute("aria-invalid", "true");
                locationInput.focus();
                return;
            }

            locationInput.removeAttribute("aria-invalid");
            locationMessage.textContent = "Location search feature coming soon!";
        });

        locationInput.addEventListener("input", () => {
            if (locationInput.value.trim()) {
                locationInput.removeAttribute("aria-invalid");
                locationMessage.textContent = "";
            }
        });
    }

    document.addEventListener("page:loaded", event => {
        if (event.detail.page === "flea") {
            const section = document.querySelector("[data-flea-page]");
            if (section) {
                initialize(section);
            }
            return;
        }

        initializedPage = null;
    });
})();
