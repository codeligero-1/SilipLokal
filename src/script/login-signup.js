(() => {
    function initializeAuthPage() {
        const form = document.querySelector("[data-auth-form]");
        const message = document.querySelector("[data-auth-message]");

        if (!form || !message) {
            return;
        }

        form.addEventListener("invalid", event => {
            const field = event.target;
            if (field.validity.valueMissing) {
                message.textContent = `Please enter your ${field.name === "email" ? "e-mail address" : field.name}.`;
            } else if (field.validity.typeMismatch) {
                message.textContent = "Please enter a valid e-mail address.";
            } else if (field.validity.tooShort) {
                message.textContent = `${field.name === "password" ? "Password" : "Username"} is too short.`;
            } else {
                message.textContent = `Please check the ${field.name} field.`;
            }
        }, true);

        form.addEventListener("input", () => {
            message.textContent = "";
        });

        form.addEventListener("submit", event => {
            event.preventDefault();
            message.textContent = form.dataset.authForm === "signup"
                ? "Account creation is unavailable because authentication is not connected. Your information was not sent or saved."
                : "Sign-in is unavailable because authentication is not connected. Your credentials were not sent or saved.";
        });
    }

    document.addEventListener("page:loaded", event => {
        if (event.detail.page === "login" || event.detail.page === "signup") {
            initializeAuthPage();
        }
    });
})();
