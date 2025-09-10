// API base URL
// const API_URL = "http://localhost:8080/api/tasks";
// const API_URL = "http://backend:8080/api/tasks";
const API_URL = window.API_URL || "http://localhost:8080/api/tasks";

let editModal; // Bootstrap modal instance

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  // Handle form submission for creating a new task
  document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const now = new Date();
    const task = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      status: document.getElementById("status").value || "YET_TO_START",
      createdAt: now.toISOString().split(".")[0], // "2025-09-10T18:40:21"
      completedAt: null,
    };

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    if (res.ok) {
      document.getElementById("taskForm").reset();
      loadTasks();
    } else {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      alert("Error: " + JSON.stringify(err));
    }
  });

  // Setup Bootstrap modal instance for edit dialog
  const modalEl = document.getElementById("editModal");
  editModal = new bootstrap.Modal(modalEl);

  // Handle edit form submission
  document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("editId").value;
    const updatedTask = {
      title: document.getElementById("editTitle").value,
      description: document.getElementById("editDescription").value,
      status: document.getElementById("editStatus").value,
    };

    // If status is set to DONE, record completion time
    if (updatedTask.status === "DONE") {
      const now = new Date();
      updatedTask.completedAt = now.toISOString().split(".")[0];
    }

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (res.status === 200) {
      editModal.hide();
      loadTasks();
    } else if (res.status === 404) {
      alert("Update failed: Task not found");
    } else {
      const err = await res.text();
      alert("Update failed: " + res.status + " " + err);
    }
  });
});

// Load tasks and render table
async function loadTasks() {
  const res = await fetch(API_URL);
  const tbody = document.getElementById("taskBody");

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Failed to load tasks (status ${res.status})</td></tr>`;
    return;
  }

  const tasks = await res.json();
  tbody.innerHTML = "";

  if (!Array.isArray(tasks) || tasks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="text-center">No tasks found</td></tr>`;
    return;
  }

  tasks.forEach((task, index) => {
    const actionButtons = `
      <button class="btn btn-sm btn-warning me-2" onclick="openEditModal(${
        task.id
      })">Edit</button>
      ${
        task.status === "DONE"
          ? `<button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>`
          : `<button class="btn btn-sm btn-danger" disabled title="The Task has not been completed yet">Delete</button>`
      }
    `;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${task.id}</td>
      <td>${escapeHtml(task.title || "")}</td>
      <td>${escapeHtml(task.description || "")}</td>
      <td>${formatStatus(task.status)}</td>
      <td>${task.createdAt ? formatDate(task.createdAt) : "-"}</td>
      <td>${task.completedAt ? formatDate(task.completedAt) : "-"}</td>
      <td>${actionButtons}</td>
    `;
    tbody.appendChild(row);
  });
}

// Open edit modal and populate fields
async function openEditModal(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) {
    alert("Failed to fetch task: " + res.status);
    return;
  }

  const task = await res.json();
  document.getElementById("editId").value = task.id;
  document.getElementById("editTitle").value = task.title || "";
  document.getElementById("editDescription").value = task.description || "";
  document.getElementById("editStatus").value = task.status || "YET_TO_START";

  editModal.show();
}

// Delete task (only enabled if status is DONE)
async function deleteTask(id) {
  console.log("Attempting to delete task with ID:", id);

  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  if (res.status === 204) {
    console.log("Task deleted successfully");
    loadTasks();
  } else if (res.status === 404) {
    alert("Delete failed: Task not found");
  } else {
    const errMsg = await res.text();
    alert("Delete failed: " + res.status + " " + errMsg);
  }
}

// Friendly display for backend enums
// Friendly display for backend enums with Bootstrap colors
function formatStatus(status) {
  switch (status) {
    case "YET_TO_START":
      return `<span class="badge bg-secondary">Yet to Start</span>`;
    case "IN_PROGRESS":
      return `<span class="badge bg-primary">In Progress</span>`;
    case "DONE":
      return `<span class="badge bg-success">Done</span>`;
    default:
      return `<span class="badge bg-dark">${status}</span>`;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // fallback if parsing fails

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Simple HTML escape
function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
