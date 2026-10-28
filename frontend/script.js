
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


// Display success and error messages
function showMessage(text, type = "success") {
    message.textContent = text;
    message.className = `message ${type}`;
}


// Send API requests and handle errors
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

    // DELETE may return 204 No Content.
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
}


// Load all tasks from FastAPI
async function loadTasks() {
    taskList.textContent = "Loading tasks...";
    refreshButton.disabled = true;

    try {
        const data = await apiRequest(API_URL);

        // Support either a list or an object containing tasks.
        const tasks = Array.isArray(data)
            ? data
            : Array.isArray(data?.tasks)
                ? data.tasks
                : null;

        if (!tasks) {
            throw new Error("Unexpected task response from backend.");
        }

        renderTasks(tasks);
        updateStatistics(tasks);
    } catch (error) {
        taskList.textContent =
            "Unable to load tasks. Check the backend connection.";

        showMessage(error.message, "error");
        console.error("Load tasks error:", error);
    } finally {
        refreshButton.disabled = false;
    }
}


// Display task cards
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

        const title = document.createElement("h3");
        title.textContent = task.title || "Untitled Task";

        const employee = document.createElement("p");
        const employeeLabel = document.createElement("strong");
        employeeLabel.textContent = "Employee: ";
        employee.append(employeeLabel, task.employee_name || "Not assigned");

        const description = document.createElement("p");
        description.className = "task-description";

        const descriptionLabel = document.createElement("strong");
        descriptionLabel.textContent = "Description: ";

        description.append(
            descriptionLabel,
            task.description || "No description"
        );

        const allowedStatuses = [
            "pending",
            "in_progress",
            "completed"
        ];

        const status = allowedStatuses.includes(task.status)
            ? task.status
            : "pending";

        const statusBadge = document.createElement("span");
        statusBadge.className = `task-status status-${status}`;
        statusBadge.textContent = status.replace("_", " ");

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editTask(task);
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.append(editButton, deleteButton);

        card.append(
            title,
            employee,
            description,
            statusBadge,
            actions
        );

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


// Create or update a task
taskForm.addEventListener("submit", async event => {
    event.preventDefault();

    const taskData = {
        title: titleInput.value.trim(),
        employee_name: employeeInput.value.trim(),
        description: descriptionInput.value.trim(),
        status: statusInput.value
    };

    if (!taskData.title || !taskData.employee_name) {
        showMessage(
            "Task title and employee name are required.",
            "error"
        );
        return;
    }

    const isEditing = editingTaskId !== null;

    const url = isEditing
        ? `${API_URL}${editingTaskId}`
        : API_URL;

    submitButton.disabled = true;
    cancelButton.disabled = true;

    try {
        await apiRequest(url, {
            method: isEditing ? "PUT" : "POST",
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


// Load selected task into the form
function editTask(task) {
    editingTaskId = task.id;

    titleInput.value = task.title || "";
    employeeInput.value = task.employee_name || "";
    descriptionInput.value = task.description || "";
    statusInput.value = task.status || "pending";

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
    if (taskId == null) {
        showMessage("Task ID is missing.", "error");
        return;
    }

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

        if (String(editingTaskId) === String(taskId)) {
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


// Refresh task list
refreshButton.addEventListener("click", loadTasks);


// Load tasks when the page opens
loadTasks();
