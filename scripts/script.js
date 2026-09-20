let tasks = JSON.parse(localStorage.getItem("tasks")) || []

// Load old tasks saved in localStorage
function loadTasks() {
    tasks.forEach(task => {
        let priority_level = "High"
        if (task.priority === "low") {
            priority_level = "Low"
        } else if (task.priority === "medium") {
            priority_level = "Medium"
        }

        createTaskDiv(
            task.id,
            task.name,
            task.priority,
            priority_level,
            task.due_date
        )
    })
}

// Save tasks in localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// Delete task (div and localStorage) and save the new task table to localStorage
function deleteTask() {
    const deleteButtons = document.querySelectorAll(".delete");

    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const deletedTask = e.target.closest(".task");
            const taskID = deletedTask.id;

            tasks = tasks.filter(task => task.id !== taskID);

            deletedTask.remove();
            saveTasks();
        });
    });
}

// Clear Text input / Priority Selector / Date Input of the task Creator
function clearTaskCreator() {
    let select = document.getElementById("newTask__priority")
    let input = document.querySelectorAll(".taskCreator__inputGroup input")

    select.selectedIndex = 0
    input.forEach(element => {
        element.value = ""
    })
}

// Listen "click" on buttons to hide/show Task creator frame
function initTaskCreatorDisplayer() {
    const taskCreatorFrame = document.getElementById("taskCreator__frame")
    const taskCreatorButton = document.getElementById("createTask__button")
    const cancelButton = document.getElementById("cancel-button")

    function toggleDisplay() {
        taskCreatorButton.classList.toggle("active")
        taskCreatorFrame.classList.toggle("hide")
        clearTaskCreator()
    }

    taskCreatorButton.addEventListener("click", () => {
        toggleDisplay()
    })

    cancelButton.addEventListener("click", () => {
        toggleDisplay()
    })
}

// Verify all required fields are set
function verifyNewTaskInput(name, priority) {
    const taskErrorName = document.getElementById("taskError_name")
    const taskErrorPriority = document.getElementById("taskError_priority")

    if (name.value === "") {
        taskErrorName.classList.remove("hide")
        return false
    } else {
        taskErrorName.classList.add("hide")
    }

    if (priority.value === "") {
        taskErrorPriority.classList.remove("hide")
        return false
    } else {
        taskErrorPriority.classList.add("hide")
    }
    return true
}

// Create new task in "Active Task" div and store it in localStorage
function createTask(taskName, taskPriority, taskDate) {
    let newTaskid = Date.now().toString()
    if (taskDate) {
        taskDate = taskDate.split("-").reverse().join("/")
    } else {
        taskDate = "No date"
    }

    let priority = "High"
    if (taskPriority === "low") {
        priority = "Low"
    } else if (taskPriority === "medium") {
        priority = "Medium"
    }

    let newTask = {
        id: newTaskid,
        name: taskName,
        priority: taskPriority,
        due_date: taskDate,
        completed: false,
    }
    tasks.push(newTask)

    createTaskDiv(
        newTaskid, 
        taskName, 
        taskPriority, 
        priority, 
        taskDate)

    saveTasks()
}

// Div creator
function createTaskDiv(id, name, priorityClass, priority, date) {
    const taskCategory = document.getElementById("activeTasksCategory")
    let newTaskDiv = document.createElement("div")
    newTaskDiv.className = "task"
    newTaskDiv.id = id
    
    newTaskDiv.innerHTML = `
        <button class="delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2 6H22M10 11V16M14 11V16M4 6H20L18.42 20.22C18.3658 20.7094 18.1331 21.1616 17.7663 21.49C17.3994 21.8184 16.9244 22 16.432 22H7.568C7.07564 22 6.60056 21.8184 6.23375 21.49C5.86693 21.1616 5.63416 20.7094 5.58 20.22L4 6ZM7.345 3.147C7.50675 2.80397 7.76271 2.514 8.083 2.31091C8.4033 2.10782 8.77474 2 9.154 2H14.846C15.2254 1.99981 15.5971 2.10755 15.9176 2.31064C16.2381 2.51374 16.4942 2.80381 16.656 3.147L18 6H6L7.345 3.147Z" stroke="#FF7174" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <p class="task__name">${name}</p>
        <div class="task__priorityBadge">
            <p class="${priorityClass}">${priority}</p>
        </div>
        <p>${date}</p>
        <div class="checkbox-wrapper">
            <input type="checkbox" id="task-${id}">
            <label for="task-${id}" class="check-box">
        </div>`

    taskCategory.appendChild(newTaskDiv)
}

// Init Task Creator
function initTaskCreator() {
    const newTaskForm = document.getElementById("taskCreator__frame")
    let taskNameInput = document.getElementById("newTask__name")
    let taskPriorityInput = document.getElementById("newTask__priority")
    let taskDueDateInput = document.getElementById("date__picker")
    
    newTaskForm.addEventListener("submit", (event) => {
        event.preventDefault()
        if (verifyNewTaskInput(taskNameInput, taskPriorityInput)) {

            createTask(
                taskNameInput.value, 
                taskPriorityInput.value, 
                taskDueDateInput.value)

            clearTaskCreator()
        }
    })

}

function main() {
    loadTasks()
    initTaskCreatorDisplayer()
    initTaskCreator()
    deleteTask()
}