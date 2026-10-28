


const API_URL = "http://127.0.0.1:8000/api/tasks/";

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");

const titleInput = document.getElementById("title");
const employeeInput = document.getElementById("employee_name");
const descriptionInput = document.getElementById("description");
const statusInput = document.getElementById("status");

const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");
const refreshButton = document.getElementById("refreshButton");

let editingTaskId = null;


// Show success or error messages
function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;
}


// Make user-provided text safe to display as HTML
function escapeHTML(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value ?? "").replace(/[&<>"']/g, character => {
        return characters[character];
    });
}


// Send a request and handle API errors
async function apiRequest(url, options = {}) {
    const response = await fetch(url, options);

    if (!response.ok) {
        let errorMessage = `Request failed (${response.status})`;

        try {
            const errorData = await response.json();

            if (typeof errorData.detail === "string") {
                errorMessage = errorData.detail;
            } else if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail
                    .map(item => item.msg || "Invalid input")
                    .join(", ");
            }
        } catch {
            // Keep the default error message.
        }

        throw new Error(errorMessage);
    }

    return response.json();
}


// Get all tasks from FastAPI

async function loadTasks() {
    taskList.textContent = "Loading tasks...";

    try {
        const tasks = await apiRequest(API_URL);

        renderTasks(tasks);
        updateStatistics(tasks);
    } catch (error) {
        taskList.textContent =
            "Unable to load tasks. Check that the backend is running.";

        showMessage(error.message, "error");
        console.error("Load tasks error:", error);
    }
}


// Display all tasks
function renderTasks(tasks) {
    taskList.replaceChildren();

    if (tasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-message";
        emptyMessage.textContent =
            "No tasks found. Create your first task!";

        taskList.appendChild(emptyMessage);
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement("article");
        card.className = "task-card";

        const status = [
            "pending",
            "in_progress",
            "completed"
        ].includes(task.status)
            ? task.status
            : "pending";

        card.innerHTML = `
            <h3>${escapeHTML(task.title)}</h3>

            <p>
                <strong>Employee:</strong>
                ${escapeHTML(task.employee_name)}
            </p>

            <p class="task-description">
                <strong>Description:</strong>
                ${escapeHTML(task.description || "No description")}
            </p>

            <span class="task-status status-${status}">
                ${escapeHTML(status.replace("_", " "))}
            </span>

            <div class="task-actions">
                <button type="button" class="edit-button">
                    Edit
                </button>

                <button type="button" class="delete-button">
                    Delete
                </button>
            </div>
        `;

        card.querySelector(".edit-button").addEventListener("click", () => {
            editTask(task);
        });

        card.querySelector(".delete-button").addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(card);
    });
}


// Update dashboard counters

function updateStatistics(tasks) {
    document.getElementById("totalTasks").textContent = tasks.length;

    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => task.status === "pending").length;

    document.getElementById("progressTasks").textContent =
        tasks.filter(task => task.status === "in_progress").length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.status === "completed").length;
}


// Create or update a task when the form is submitted

taskForm.addEventListener("submit", async event => {
    event.preventDefault();

    const taskData = {
        title: titleInput.value.trim(),
        employee_name: employeeInput.value.trim(),
        description: descriptionInput.value.trim() || null,
        status: statusInput.value
    };

    if (!taskData.title || !taskData.employee_name) {
        showMessage("Title and employee name are required.", "error");
        return;
    }

    const isEditing = editingTaskId !== null;

    const url = isEditing
        ? `${API_URL}${editingTaskId}`
        : API_URL;

    const method = isEditing ? "PUT" : "POST";

    submitButton.disabled = true;
    cancelButton.disabled = true;

    try {
        await apiRequest(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        });

        resetForm();

        await loadTasks();

        showMessage(
            isEditing
                ? "Task updated successfully!"
                : "Task created successfully!",
            "success"
        );
    } catch (error) {
        showMessage(error.message, "error");
        console.error("Save task error:", error);
    } finally {
        submitButton.disabled = false;
        cancelButton.disabled = false;
    }
});


// Load a task into the form for editing
function editTask(task) {
    editingTaskId = task.id;

    titleInput.value = task.title;
    employeeInput.value = task.employee_name;
    descriptionInput.value = task.description || "";
    statusInput.value = task.status;

    formTitle.textContent = "Update Task";
    submitButton.textContent = "Save Changes";
    cancelButton.hidden = false;

    showMessage("Edit the task details and save your changes.");

    document.querySelector(".panel").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Delete a task
async function deleteTask(taskId) {
    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
        return;
    }

    try {
        await apiRequest(`${API_URL}${taskId}`, {
            method: "DELETE"
        });

        if (editingTaskId === taskId) {
            resetForm();
        }

        await loadTasks();

        showMessage("Task deleted successfully!", "success");
    } catch (error) {
        showMessage(error.message, "error");
        console.error("Delete task error:", error);
    }
}


// Reset the form
function resetForm() {
    taskForm.reset();

    editingTaskId = null;

    formTitle.textContent = "Create New Task";
    submitButton.textContent = "Add Task";
    cancelButton.hidden = true;
}


// Cancel editing
cancelButton.addEventListener("click", () => {
    resetForm();
    showMessage("Editing cancelled.");
});


// Reload tasks
refreshButton.addEventListener("click", loadTasks);


// Load tasks when the page opens
loadTasks();


