const API_URL = "/api/tasks";

// Load all tasks
async function loadTasks() {

    try {

        const response = await axios.get(API_URL);

        displayTasks(response.data);

    } catch (error) {

        console.error("Error loading tasks:", error);

        alert("Unable to load tasks. Check the server.");

    }
}


// Display tasks in three columns
function displayTasks(tasks) {

    const pending = document.getElementById("pendingTasks");
    const ongoing = document.getElementById("ongoingTasks");
    const completed = document.getElementById("completedTasks");

    pending.innerHTML = "";
    ongoing.innerHTML = "";
    completed.innerHTML = "";

    tasks.forEach(task => {

        const card = document.createElement("div");
        card.className = "task-card";

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "No description";

        const actions = document.createElement("div");
        actions.className = "task-actions";

        if (task.status === "Pending") {

            actions.appendChild(
                createButton("Mark as Ongoing", () => {
                    updateTask(task.id, "Ongoing");
                })
            );

        }

        if (task.status === "Ongoing") {

            actions.appendChild(
                createButton("Mark as Completed", () => {
                    updateTask(task.id, "Completed");
                })
            );

        }

        actions.appendChild(
            createButton("Delete Task", () => {
                deleteTask(task.id);
            }, "delete-btn")
        );

        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(actions);

        if (task.status === "Pending") {
            pending.appendChild(card);
        }

        else if (task.status === "Ongoing") {
            ongoing.appendChild(card);
        }

        else if (task.status === "Completed") {
            completed.appendChild(card);
        }

    });

    showEmptyMessage(pending);
    showEmptyMessage(ongoing);
    showEmptyMessage(completed);

}


// Create action buttons
function createButton(text, callback, className = "") {

    const button = document.createElement("button");

    button.textContent = text;
    button.className = className;

    button.addEventListener("click", callback);

    return button;
}


// Show empty message
function showEmptyMessage(container) {

    if (container.children.length === 0) {

        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "No tasks available";

        container.appendChild(message);

    }

}


// Add new task
async function addTask() {

    const title = document.getElementById("taskTitle").value.trim();

    const description = document.getElementById("taskDescription").value.trim();

    if (!title) {

        alert("Please enter a task title");

        return;

    }

    try {

        await axios.post(API_URL, {
            title: title,
            description: description
        });

        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDescription").value = "";

        loadTasks();

    } catch (error) {

        alert(error.response?.data?.message || "Error adding task");

    }

}


// Update task status
async function updateTask(id, status) {

    try {

        await axios.put(`${API_URL}/${id}`, {
            status: status
        });

        loadTasks();

    } catch (error) {

        alert("Error updating task");

    }

}


// Delete task
async function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {

        await axios.delete(`${API_URL}/${id}`);

        loadTasks();

    } catch (error) {

        alert("Error deleting task");

    }

}


// Load tasks when page opens
loadTasks();
