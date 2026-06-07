const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const BASE_URL = "https://lms-backend-n36s.onrender.com";

if (!token || role !== "admin") {
    window.location.href = "index.html";
}

/* SAFE FETCH */
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
        } catch {
            return [];
        }

    } catch (err) {
        console.error(err);
        return [];
    }
}

/* SECTION CONTROL */
function showSection(section) {
    ["dashboardSection", "usersSection", "approvedUsersSection", "rejectedSection"]
        .forEach(id => document.getElementById(id).style.display = "none");

    document.getElementById(section).style.display = "block";

    if (section === "usersSection") loadUsers();
    if (section === "approvedUsersSection") loadApprovedUsers("student");
    if (section === "rejectedSection") loadRejectedUsers?.();
    if (section === "dashboardSection") updateStats();
}

/* LOAD USERS */
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

    box.innerHTML = pendingUsers.map(u => `
        <div class="card-box mb-3">
            <h5>${u.username} (${u.role})</h5>
            <p>Email: ${u.email || "N/A"}</p>

            <button onclick="approveUser(${u.id})">Approve</button>
            <button onclick="rejectUser(${u.id})">Reject</button>
        </div>
    `).join("");
}

/* APPROVE */
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

/* REJECT */
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

/* STATS */
async function updateStats() {
    const users = await safeFetch(`${BASE_URL}/api/users/`);

    const approved = users.filter(u => u.is_approved);
    const pending = users.filter(u => !u.is_approved && u.status !== "rejected");

    document.getElementById("totalUsers").innerText = approved.length;
    document.getElementById("teachers").innerText = approved.filter(u => u.role === "teacher").length;
    document.getElementById("students").innerText = approved.filter(u => u.role === "student").length;
    document.getElementById("pendingUsers").innerText = pending.length;
}

document.addEventListener("DOMContentLoaded", updateStats);

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}