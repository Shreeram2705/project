const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const filePath = path.join(__dirname, "data", "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Read tasks from JSON file
function getTasks() {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Save tasks into JSON file
function saveTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// GET all tasks
app.get("/api/tasks", (req, res) => {
    res.json(getTasks());
});

// ADD new task
app.post("/api/tasks", (req, res) => {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const tasks = getTasks();

    const newTask = {
        id: Date.now(),
        title: title.trim(),
        description: (description || "").trim(),
        status: "Pending"
    };

    tasks.push(newTask);
    saveTasks(tasks);

    res.status(201).json(newTask);
});

// UPDATE task status
app.put("/api/tasks/:id", (req, res) => {
    const tasks = getTasks();

    const task = tasks.find(
        t => t.id === Number(req.params.id)
    );

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const allowedStatuses = [
        "Pending",
        "Ongoing",
        "Completed"
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid task status"
        });
    }

    task.status = status;

    saveTasks(tasks);

    res.json(task);
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
    let tasks = getTasks();

    const updatedTasks = tasks.filter(
        t => t.id !== Number(req.params.id)
    );

    if (tasks.length === updatedTasks.length) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    saveTasks(updatedTasks);

    res.json({
        message: "Task deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
