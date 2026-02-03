// loadNavbar
document.addEventListener("DOMContentLoaded", () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");

    fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            navbarPlaceholder.innerHTML = data;
        })
        .catch(error => {
            console.error("Failed to load navbar:", error);
        });
});
