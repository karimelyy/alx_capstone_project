document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const categoryInput = document.getElementById("categoryInput");
    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeInput");
    const priorityInput = document.getElementById("priorityInput");
    const taskList = document.getElementById("taskList");
    const searchButton = document.getElementById("searchButton");

    // Load tasks from local storage when the page loads
    loadTasks();

    taskForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        
        const task = taskInput.value.trim();
        const category = categoryInput.value.trim();
        const date = dateInput.value;
        const time = timeInput.value;
        const priority = priorityInput.value;

        if (task === "") {
            alert("Please enter a task.");
            return;
        }

        const taskItem = createTaskElement(task, category, date, time, priority);
        taskList.appendChild(taskItem);

        // Save tasks to local storage
        saveTasks();

        // Clear input fields
        taskInput.value = "";
        categoryInput.value = "";
        dateInput.value = "";
        timeInput.value = "";
        priorityInput = "";
    });

    // Function to create a task element
    function createTaskElement(task, category, date, time, priority) {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        taskItem.dataset.priority = priority;
        taskItem.innerHTML = `
            <span><strong>Task:</strong> ${task}</span>
            <span><strong>Category:</strong> ${category}</span>
            <span><strong>Date:</strong> ${date}</span>
            <span><strong>Time:</strong> ${time}</span>
            <span><strong>Priority:</strong> ${priority}</span>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Delete</button>
        `;
        return taskItem;
    }

    // Function to save tasks to local storage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => task.innerHTML);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks) {
            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.classList.add("task-item");
                taskItem.innerHTML = task;
                taskList.appendChild(taskItem);
            });
        }
    }

    taskList.addEventListener("click", function(event) {
        const target = event.target;
        if (target.classList.contains("complete-btn")) {
            const taskItem = target.parentElement;
            taskItem.classList.toggle("completed");
            // Save tasks to local storage after completion
            saveTasks();
        } else if (target.classList.contains("delete-btn")) {
            const taskItem = target.parentElement;
            // Apply animations for removing task
            taskItem.style.opacity = "0";
            setTimeout(() => {
                taskItem.remove();
                // Save tasks to local storage after deletion
                saveTasks();
            }, 300);
        }
    });

    // Search and filtering functionality
    const searchInput = document.getElementById("searchInput");
    const filterCategory = document.getElementById("filterCategory");
    const filterPriority = document.getElementById("filterPriority");

    searchInput.addEventListener("input", function() {
        filterTasks();
    });

    filterCategory.addEventListener("change", function() {
        filterTasks();
    });

    filterPriority.addEventListener("change", function() {
        filterTasks();
    });

    searchButton.addEventListener("click", function() {
        filterTasks();
    });

    function filterTasks() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = filterCategory.value;
        const priority = filterPriority.value;

        const tasks = document.querySelectorAll(".task-item");
        tasks.forEach(task => {
            const taskText = task.textContent.toLowerCase();
            const taskCategory = task.querySelector("span:nth-child(2)").textContent.toLowerCase().replace("category:", "").trim();
            const taskPriority = task.querySelector("span:nth-child(5)").textContent.toLowerCase().replace("priority:", "").trim();
            
            if (
                (taskText.includes(searchTerm) || searchTerm === "") &&
                (taskCategory === category || category === "") &&
                (taskPriority === priority || priority === "")
            ) {
                task.style.display = "block";
            } else {
                task.style.display = "none";
            }
        });
    }
    // Function to display notification for the task
    function showNotification(task) {
        if (!("Notification" in window)) {
            console.log("This browser does not support desktop notification");
        } else if (Notification.permission === "granted") {
            const notification = new Notification("Task Reminder", {
                body: task,
                icon: "notification-icon.png" // Path to notification icon
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    const notification = new Notification("Task Reminder", {
                        body: task,
                        icon: "notification-icon.png" // Path to notification icon
                    });
                }
            });
        }
    }
});
