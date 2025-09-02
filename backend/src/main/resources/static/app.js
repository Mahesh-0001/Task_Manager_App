// const API_URL = "http://localhost:8080/api/tasks";
// const API_URL = "http://backend:8080/api/tasks";
const API_URL = window.API_URL || "http://localhost:8080/api/tasks";

let editModal; // bootstrap modal instance

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  // Handle form submission for creating a new task
  document.getElementById("taskForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const task = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      status: document.getElementById("status").value,
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

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      alert("Update failed: " + JSON.stringify(err));
      return;
    }

    editModal.hide();
    loadTasks();
  });
});

// Load tasks and render table
async function loadTasks() {
  const res = await fetch(API_URL);
  if (!res.ok) {
    document.getElementById(
      "taskBody"
    ).innerHTML = `<tr><td colspan="6">Failed to load tasks (status ${res.status})</td></tr>`;
    return;
  }
  const tasks = await res.json();

  const tbody = document.getElementById("taskBody");
  tbody.innerHTML = "";

  if (!Array.isArray(tasks) || tasks.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center">No tasks found</td></tr>`;
    return;
  }

  tasks.forEach((task, index) => {
    const actionButtons = `
      <button class="btn btn-sm btn-warning me-2" onclick="openEditModal(${task.id})">Edit</button>
      <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">Delete</button>
    `;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td> <!-- Serial Number -->
      <td>${task.id}</td>   <!-- Unique Backend ID -->
      <td>${escapeHtml(task.title || "")}</td>
      <td>${escapeHtml(task.description || "")}</td>
      <td>${task.status}</td>
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
  document.getElementById("editStatus").value = task.status || "PENDING";

  editModal.show();
}

// Delete task (no confirmation)
async function deleteTask(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    alert("Delete failed: " + res.status);
    return;
  }
  loadTasks();
}

// Utility: simple HTML escaper to avoid injection when rendering
function escapeHtml(unsafe) {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
