async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:8081/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        console.log("Backend response:", data);

        if (data.access) {

            localStorage.setItem("token", data.access);

            // IMPORTANT: role must come from backend OR decoded token
            // temporary fallback:
            const role = username.includes("teacher") ? "teacher" : "student";

            localStorage.setItem("role", role);

            if (role === "student") {
                window.location.href = "student-dashboard.html";
            } else {
                window.location.href = "teacher-dashboard.html";
            }

        } else {
            document.getElementById("error").innerText =
                data.detail || "Invalid login";
        }

    } catch (error) {
        console.error("Login error:", error);
    }
}