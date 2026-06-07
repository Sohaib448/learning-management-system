const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const BASE_URL = "https://lms-backend-n36s.onrender.com";

if (!token || role !== "teacher") {
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

        return Array.isArray(data) ? data : [];

    } catch {
        return [];
    }
}

/* NAV */
function showSection(section) {
    ["dashboardSection", "assignmentsSection", "submissionsSection"]
        .forEach(id => document.getElementById(id).style.display = "none");

    document.getElementById(section).style.display = "block";

    if (section === "assignmentsSection") loadAssignments();
    if (section === "submissionsSection") loadSubmissions();
}

/* CREATE ASSIGNMENT */
async function createAssignment() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const deadline = document.getElementById("deadline").value;

    const res = await fetch(`${BASE_URL}/api/assignment/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ title, description, deadline })
    });

    if (res.ok) {
        loadAssignments();
        updateStats();
    }
}

/* LOAD ASSIGNMENTS */
async function loadAssignments() {

    const data = await safeFetch(`${BASE_URL}/api/assignment/`);
    const box = document.getElementById("assignments");

    box.innerHTML = data.length ? data.map(a => `
        <div class="card-box mb-2">
            <h5>${a.title}</h5>
            <p>${a.description || ""}</p>
        </div>
    `).join("") : "<p>No assignments</p>";
}

/* SUBMISSIONS */
async function loadSubmissions() {

    const data = await safeFetch(`${BASE_URL}/api/submissions/`);
    const box = document.getElementById("submissions");

    box.innerHTML = data.length ? data.map(s => `
        <div class="card-box mb-3">
            <h5>${s.student_username}</h5>
            <p>Marks: ${s.marks ?? "Not graded"}</p>
        </div>
    `).join("") : "<p>No submissions</p>";
}

/* STATS */
async function updateStats() {

    const assignments = await safeFetch(`${BASE_URL}/api/assignment/`);

    document.getElementById("totalAssignments").innerText = assignments.length;
}

document.addEventListener("DOMContentLoaded", () => {
    updateStats();
    loadAssignments();
    loadSubmissions();
});

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}