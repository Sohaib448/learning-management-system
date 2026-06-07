const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const BASE_URL = "http://127.0.0.1:8081";

// =========================
// AUTH CHECK
// =========================
if (!token || role !== "admin") {
    window.location.href = "index.html";
}

// =========================
// SAFE FETCH
// =========================
async function safeFetch(url) {
    try {
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const text = await res.text();

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Invalid JSON Response:", text);
            return [];
        }

    } catch (err) {
        console.error("Network Error:", err);
        return [];
    }
}

// =========================
// SECTION CONTROL
// =========================
function showSection(section) {

    document.getElementById("dashboardSection").style.display = "none";
    document.getElementById("usersSection").style.display = "none";
    document.getElementById("approvedUsersSection").style.display = "none";
    document.getElementById("rejectedSection").style.display = "none";

    document.getElementById(section).style.display = "block";

    if (section === "usersSection") loadUsers();
    if (section === "approvedUsersSection") loadApprovedUsers("student");
    if (section === "rejectedSection") loadRejectedUsers();
    if (section === "dashboardSection") updateStats();
}

// =========================
// LOAD PENDING USERS
// =========================
async function loadUsers() {

    const users = await safeFetch(`${BASE_URL}/api/users/`);

    const pendingUsers = users.filter(u =>
        !u.is_approved && u.status !== "rejected"
    );

    const box = document.getElementById("users");

    if (!pendingUsers.length) {
        box.innerHTML = "<p>No pending requests</p>";
        return;
    }

    box.innerHTML = pendingUsers.map(u => {

        if (u.role === "student") {
            return `
                <div class="card-box mb-3">
                    <h5>${u.username} (Student)</h5>
                    <p>Email: ${u.email || "N/A"}</p>
                    <p>Roll No: ${u.roll_no || "N/A"}</p>
                    <p>Father: ${u.father_name || "N/A"}</p>
                    <p>Section: ${u.section || "N/A"}</p>
                    <p>Shift: ${u.shift || "N/A"}</p>
                    <p>Phone: ${u.phone || "N/A"}</p>

                    <button class="btn btn-success btn-sm"
                        onclick="approveUser(${u.id})">Approve</button>

                    <button class="btn btn-danger btn-sm"
                        onclick="rejectUser(${u.id})">Reject</button>
                </div>
            `;
        }

        if (u.role === "teacher") {
            return `
                <div class="card-box mb-3">
                    <h5>${u.username} (Teacher)</h5>
                    <p>Email: ${u.email || "N/A"}</p>
                    <p>Name: ${u.first_name || ""} ${u.last_name || ""}</p>
                    <p>Subject: ${u.subject || "N/A"}</p>
                    <p>Father: ${u.father_name || "N/A"}</p>
                    <p>Shift: ${u.shift || "N/A"}</p>
                    <p>Phone: ${u.phone || "N/A"}</p>

                    <button class="btn btn-success btn-sm"
                        onclick="approveUser(${u.id})">Approve</button>

                    <button class="btn btn-danger btn-sm"
                        onclick="rejectUser(${u.id})">Reject</button>
                </div>
            `;
        }

        return "";
    }).join("");
}

// =========================
// APPROVE USER
// =========================
async function approveUser(id) {

    const res = await fetch(`${BASE_URL}/api/users/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            is_approved: true,
            is_active: true
        })
    });

    if (res.ok) {
        loadUsers();
        updateStats();
    }
}

// =========================
// REJECT USER (FIXED)
// =========================
async function rejectUser(id) {

    const res = await fetch(`${BASE_URL}/api/users/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            is_approved: false,
            is_active: false,
            status: "rejected"
        })
    });

    if (res.ok) {
        loadUsers();
        updateStats();
    }
}

// =========================
// APPROVED USERS
// =========================
async function loadApprovedUsers(roleType) {

    const users = await safeFetch(`${BASE_URL}/api/users/`);

    const approved = users.filter(u =>
        u.is_approved && u.role === roleType
    );

    const box = document.getElementById("approvedUsers");

    if (!approved.length) {
        box.innerHTML = "<p>No approved users found</p>";
        return;
    }

    box.innerHTML = approved.map(u => {

        if (roleType === "student") {
            return `
                <div class="card-box mb-2">
                    <h5>${u.username}</h5>
                    <p>Roll No: ${u.roll_no || "N/A"}</p>
                    <p>Section: ${u.section || "N/A"}</p>
                    <p>Email: ${u.email || "N/A"}</p>
                </div>
            `;
        }

        if (roleType === "teacher") {
            return `
                <div class="card-box mb-2">
                    <h5>${u.username}</h5>
                    <p>${u.first_name || ""} ${u.last_name || ""}</p>
                    <p>Subject: ${u.subject || "N/A"}</p>
                    <p>Email: ${u.email || "N/A"}</p>
                </div>
            `;
        }

        return "";
    }).join("");
}

// =========================
// STATS
// =========================
async function updateStats() {

    const users = await safeFetch(`${BASE_URL}/api/users/`);

    const approved = users.filter(u => u.is_approved);
    const pending = users.filter(u =>
        !u.is_approved && u.status !== "rejected"
    );

    document.getElementById("totalUsers").innerText = approved.length;
    document.getElementById("teachers").innerText = approved.filter(u => u.role === "teacher").length;
    document.getElementById("students").innerText = approved.filter(u => u.role === "student").length;
    document.getElementById("pendingUsers").innerText = pending.length;
}

// =========================
// INIT
// =========================
document.addEventListener("DOMContentLoaded", updateStats);

// =========================
// LOGOUT
// =========================
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}