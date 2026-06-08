const BASE_URL = "https://lms-backend-n36s.onrender.com";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (!token || role !== "admin") {
    window.location.href = "index.html";
}

/* SAFE FETCH */
async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
                ...(options.headers || {})
            }
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) return [];
        return data || [];
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
    if (section === "approvedUsersSection") loadApprovedUsers("student"); // default
    if (section === "rejectedSection") loadRejectedUsers?.();
    if (section === "dashboardSection") updateStats();
}

/* ---------------- PENDING USERS ---------------- */
async function loadUsers() {
    const users = await safeFetch(`${BASE_URL}/api/users/`);

    const pendingUsers = users.filter(u =>
        !u.is_approved && u.status !== "rejected"
    );

    const box = document.getElementById("users");

    box.innerHTML = pendingUsers.length
        ? pendingUsers.map(u => `
            <div class="card-box mb-3">
                <h5>${u.username} (${u.role})</h5>
                <p>Email: ${u.email || "N/A"}</p>
                <button onclick="approveUser(${u.id})">Approve</button>
                <button onclick="rejectUser(${u.id})">Reject</button>
            </div>
        `).join("")
        : "<p>No pending requests</p>";
}

/* ---------------- APPROVED USERS (NEW FEATURE) ---------------- */
async function loadApprovedUsers(type = "student") {
    const users = await safeFetch(`${BASE_URL}/api/users/`);

    const approvedUsers = users.filter(u => u.is_approved);

    const filtered = approvedUsers.filter(u => u.role === type);

    const box = document.getElementById("approvedUsersBox");

    if (!box) return;

    box.innerHTML = filtered.length
        ? filtered.map(u => `
            <div class="card-box mb-3">
                <h5>${u.username}</h5>
                <p>Role: ${u.role}</p>
                <p>Email: ${u.email || "N/A"}</p>
            </div>
        `).join("")
        : `<p>No approved ${type}s found</p>`;
}

/* TAB BUTTON HANDLERS */
function showApprovedStudents() {
    loadApprovedUsers("student");
}

function showApprovedTeachers() {
    loadApprovedUsers("teacher");
}

/* ---------------- APPROVE / REJECT ---------------- */
async function approveUser(id) {
    await fetch(`${BASE_URL}/api/users/${id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ is_approved: true, is_active: true })
    });

    loadUsers();
    updateStats();
}

async function rejectUser(id) {
    await fetch(`${BASE_URL}/api/users/${id}/`, {
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

    loadUsers();
    updateStats();
}

/* ---------------- STATS ---------------- */
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

/* ---------------- LOGOUT ---------------- */
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}