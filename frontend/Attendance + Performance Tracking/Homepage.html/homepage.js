// Protect home page (user must be logged in)
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "../login.html";
}

// Navigation handler
function goTo(path) {
    window.location.href = path;
}

// Logout handler
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("isLoggedIn");
        window.location.href = "../login.html/loginpage.html";
    });
});
