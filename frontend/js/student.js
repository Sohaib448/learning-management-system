const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const BASE_URL = "http://127.0.0.1:8081";

if (!token || role !== "student") {
    window.location.href = "index.html";
}

/* =========================
   SAFE FETCH
========================= */
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

    } catch (err) {
        console.error(err);
        return [];
    }
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    showSection("dashboardSection");
    loadAssignments();
    loadStudentSubmissions();
    updateStats();
});

/* =========================
   NAVIGATION
========================= */
function showSection(section) {
    ["dashboardSection", "assignmentsSection", "submissionsSection"]
        .forEach(id => document.getElementById(id).style.display = "none");

    document.getElementById(section).style.display = "block";
}

/* =========================
   ASSIGNMENTS
========================= */
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
            <p><b>Deadline:</b> ${a.deadline}</p>

            <input type="file" id="file-${a.id}" class="form-control mb-2">

            <button onclick="submitAssignment(${a.id})">
                Submit
            </button>
        </div>
    `).join("");
}

/* =========================
   SUBMIT
========================= */
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
    } else {
        alert("Submission failed");
    }
}

/* =========================
   STUDENT SUBMISSIONS (SHOW MARKS + REMARKS)
========================= */
async function loadStudentSubmissions() {

    const data = await safeFetch(`${BASE_URL}/api/submissions/`);
    const box = document.getElementById("submissions");

    if (!data.length) {
        box.innerHTML = "<p>No submissions</p>";
        return;
    }

    box.innerHTML = data.map(s => `
        <div class="card-box mb-3">

            <h5>${s.assignment_title || "Assignment"}</h5>
            <p><b>Status:</b> ${s.status}</p>

            <p><b>Marks:</b> ${s.marks ?? "Pending"}</p>
            <p><b>Remarks:</b> ${s.remarks ?? "Pending"}</p>

        </div>
    `).join("");
}

/* =========================
   STATS
========================= */
async function updateStats() {

    const assignments = await safeFetch(`${BASE_URL}/api/assignment/`);
    const submissions = await safeFetch(`${BASE_URL}/api/submissions/`);

    const submitted = submissions.length;
    const pending = assignments.length - submitted;

    document.getElementById("totalAssignments").innerText = assignments.length;
    document.getElementById("submitted").innerText = submitted;
    document.getElementById("pending").innerText = pending;
}

/* =========================
   LOGOUT
========================= */
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}