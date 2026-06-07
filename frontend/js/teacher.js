const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

const BASE_URL = "http://127.0.0.1:8081";

if (!token || role !== "teacher") {
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
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
                ...(options.headers || {})
            }
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            console.error("API Error:", data);
            return [];
        }

        return Array.isArray(data) ? data : [];

    } catch (err) {
        console.error("Network error:", err);
        return [];
    }
}

/* =========================
   NAVIGATION
========================= */
function showSection(section) {

    ["dashboardSection", "assignmentsSection", "submissionsSection"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

    const active = document.getElementById(section);
    if (active) active.style.display = "block";

    if (section === "assignmentsSection") loadAssignments();
    if (section === "submissionsSection") loadSubmissions();
}

/* =========================
   CREATE ASSIGNMENT
========================= */
async function createAssignment() {

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const deadline = document.getElementById("deadline").value;
    const total_marks = document.getElementById("total_marks").value;

    if (!title || !deadline) {
        alert("Title and deadline required");
        return;
    }

    const res = await fetch(`${BASE_URL}/api/assignment/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            title,
            description,
            deadline,
            total_marks: Number(total_marks || 0)
        })
    });

    if (res.ok) {
        alert("Assignment created");
        loadAssignments();
        updateStats();
    } else {
        alert("Failed to create assignment");
    }
}

/* =========================
   LOAD ASSIGNMENTS
========================= */
async function loadAssignments() {

    const data = await safeFetch(`${BASE_URL}/api/assignment/`);
    const box = document.getElementById("assignments");

    if (!data.length) {
        box.innerHTML = "<p>No assignments found</p>";
        return;
    }

    box.innerHTML = data.map(a => `
        <div class="card-box mb-2">
            <h5>${a.title}</h5>
            <p>${a.description || ""}</p>
            <p><b>Deadline:</b> ${a.deadline}</p>
            <p><b>Total Marks:</b> ${a.total_marks}</p>
        </div>
    `).join("");
}

/* =========================
   LOAD SUBMISSIONS (NO GRADING UI)
========================= */
async function loadSubmissions() {

    const data = await safeFetch(`${BASE_URL}/api/submissions/`);
    const box = document.getElementById("submissions");

    if (!data.length) {
        box.innerHTML = "<p>No submissions found</p>";
        return;
    }

    box.innerHTML = data.map(s => {

        const fileUrl = s.submission_file
            ? (s.submission_file.startsWith("http")
                ? s.submission_file
                : BASE_URL + s.submission_file)
            : null;

        return `
        <div class="card-box mb-3">

            <h5>
                Student: ${s.student_username || "Unknown"}
                (ID: ${s.student_id || "N/A"})
            </h5>

            <p><b>Assignment:</b> ${s.assignment_title || "N/A"}</p>
            <p><b>Status:</b> ${s.status || "N/A"}</p>

            <p>
                <b>File:</b>
                ${fileUrl ? `<a href="${fileUrl}" target="_blank">Download</a>` : "No file"}
            </p>

            <hr>

            <p><b>Marks:</b> ${s.marks ?? "Not graded"}</p>
            <p><b>Remarks:</b> ${s.remarks ?? "No remarks"}</p>

            <div style="margin-top:10px">

                <input id="marks-${s.id}" type="number" placeholder="Marks" />
                <input id="remarks-${s.id}" type="text" placeholder="Remarks" />

                <button onclick="gradeSubmission(${s.id})">
                    Submit Review
                </button>

            </div>

        </div>
        `;
    }).join("");
}

/* =========================
   UPDATE REVIEW (ONLY MARKS + REMARKS)
========================= */
async function gradeSubmission(id) {

    const marks = document.getElementById(`marks-${id}`).value;
    const remarks = document.getElementById(`remarks-${id}`).value;

    const res = await fetch(`${BASE_URL}/api/submissions/update-status/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
            submission_id: id,
            marks,
            remarks
        })
    });

    if (res.ok) {
        await res.json();
        alert("Updated successfully");
        loadSubmissions();
        updateStats();
    } else {
        alert("Failed to update");
    }
}

/* =========================
   STATS
========================= */
async function updateStats() {

    const assignments = await safeFetch(`${BASE_URL}/api/assignment/`);
    const submissions = await safeFetch(`${BASE_URL}/api/submissions/`);

    document.getElementById("totalAssignments").innerText = assignments.length;

    document.getElementById("pending").innerText =
        submissions.filter(s => !s.marks).length;
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    updateStats();
    loadAssignments();
    loadSubmissions();
});

/* =========================
   LOGOUT
========================= */
function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}