const BASE_URL = "https://lms-backend-n36s.onrender.com";

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${BASE_URL}/api/token/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json().catch(() => ({}));

        console.log("Backend response:", data);

        if (!response.ok) {
            document.getElementById("error").innerText =
                data.detail || "Login failed";
            return;
        }

        if (data.access) {
            localStorage.setItem("token", data.access);

            const role =
                username.includes("teacher")
                    ? "teacher"
                    : username.includes("admin")
                    ? "admin"
                    : "student";

            localStorage.setItem("role", role);

            window.location.href =
                role === "student"
                    ? "student-dashboard.html"
                    : role === "teacher"
                    ? "teacher-dashboard.html"
                    : "admin-dashboard.html";
        }

    }catch (error) {
    console.error(error);
    document.getElementById("error").innerText = "Server not responding";
     }
}