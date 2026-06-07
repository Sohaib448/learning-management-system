const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const BASE_URL = "https://lms-backend-n36s.onrender.com";

if (!token || role !== "student") {
    window.location.href = "index.html";
}

/* SAFE FETCH */
async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Authorization": "Bearer " + token,
                ...(options.headers || {})
            }
        });

        if (!res.ok) return [];

        return await res.json();

    } catch {
        return [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showSection("dashboardSection");
    loadAssignments();
    loadStudentSubmissions();
    updateStats();
});

/* NAVIGATION */
function showSection(section) {
    ["dashboardSection", "assignmentsSection", "submissionsSection"]
        .forEach(id => document.getElementById(id).style.display = "none");

    document.getElementById(section).style.display = "block";
}

/* ASSIGNMENTS */
async function loadAssignments() {

    const assignments = await safeFetch(`${BASE_URL}/api/assignment/`);
    const submissions = await safeFetch(`${BASE_URL}/api/submissions/`);

    const submittedSet = new Set(submissions.map(s => s.assignment));

    const pending = assignments.filter(a => !submittedSet.has(a.id));

    const box = document.getElementById("assignments");

    box.innerHTML = pending.map(a => `
        <div class="card-box mb-3">
            <h5>${a.title}</h5>
            <p>${a.description || ""}</p>

            <input type="file" id="file-${a.id}">
            <button onclick="submitAssignment(${a.id})">Submit</button>
        </div>
    `).join("");
}

/* SUBMIT */
async function submitAssignment(id) {

    const file = document.getElementById(`file-${id}`).files[0];
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("assignment", id);
    formData.append("submission_file", file);

    const res = await fetch(`${BASE_URL}/api/submissions/`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    });

    if (res.ok) {
        loadAssignments();
        loadStudentSubmissions();
        updateStats();
    }
}

/* SUBMISSIONS */
async function loadStudentSubmissions() {

    const data = await safeFetch(`${BASE_URL}/api/submissions/`);
    const box = document.getElementById("submissions");

    box.innerHTML = data.length ? data.map(s => `
        <div class="card-box mb-3">
            <h5>${s.assignment_title || "Assignment"}</h5>
            <p>Status: ${s.status}</p>
            <p>Marks: ${s.marks ?? "Pending"}</p>
            <p>Remarks: ${s.remarks ?? "Pending"}</p>
        </div>
    `).join("") : "<p>No submissions</p>";
}

/* STATS */
async function updateStats() {
    const assignments = await safeFetch(`${BASE_URL}/api/assignment/`);
    const submissions = await safeFetch(`${BASE_URL}/api/submissions/`);

    document.getElementById("totalAssignments").innerText = assignments.length;
    document.getElementById("submitted").innerText = submissions.length;
    document.getElementById("pending").innerText = assignments.length - submissions.length;
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}