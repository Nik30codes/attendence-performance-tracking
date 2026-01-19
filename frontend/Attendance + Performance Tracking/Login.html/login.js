document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    const loginBtn = document.getElementById("loginBtn");

    errorMsg.textContent = "";

    // Simple validation
    if (email === "" || password === "") {
        errorMsg.textContent = "All fields are required.";
        return;
    }

    // Simulated authentication (replace with backend later)
    loginBtn.textContent = "Signing in...";
    loginBtn.disabled = true;

    setTimeout(() => {
        if (email === "admin@gmail.com" && password === "admin123") {

            // Store login state (optional)
            localStorage.setItem("isLoggedIn", "true");

            // Redirect to home page
            window.location.href = "http://127.0.0.1:5500/Homepage.html/homeindex.html";

        } else {
            errorMsg.textContent = "Invalid email or password.";
            loginBtn.textContent = "Login";
            loginBtn.disabled = false;
        }
    }, 1200);
});
