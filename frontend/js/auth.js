async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const BASE_URL = "https://lms-backend-n36s.onrender.com";

    try {
        const response = await fetch(`${BASE_URL}/api/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        console.log("Backend response:", data);

        if (data.access) {

            localStorage.setItem("token", data.access);

            const role =
                username.includes("teacher")
                    ? "teacher"
                    : username.includes("admin")
                    ? "admin"
                    : "student";

            localStorage.setItem("role", role);

            if (role === "student") {
                window.location.href = "student-dashboard.html";
            } else if (role === "teacher") {
                window.location.href = "teacher-dashboard.html";
            } else {
                window.location.href = "admin-dashboard.html";
            }

        } else {
            document.getElementById("error").innerText =
                data.detail || "Invalid login";
        }

    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("error").innerText = "Server error";
    }
}