import { loadStoredTasks, saveTheme } from "./localstorage.js"

// Change Theme and save it in localStorage
export function toggleDarkMode() {
    const root = document.documentElement
    const currentTheme = root.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    root.setAttribute("data-theme", newTheme)
    saveTheme(newTheme)
}

// When called, it update the tasks counter of the Category lists
export function updateTaskCounter() {
    const tasks = loadStoredTasks()
    const activeCounter = document.getElementById("activeTask__Counter")
    const completedCounter = document.getElementById("completedTask__Counter")

    let activeTasks = 0
    let completedTasks = 0

    tasks.forEach((element) => {
        if (element.completed) {
            completedTasks ++
        } else {
            activeTasks ++
        }
    })

    activeCounter.textContent = activeTasks
    completedCounter.textContent = completedTasks
}

// Reset all inputs and selectors in the task creation frame
export function clearTaskCreator() {
    const select = document.getElementById("newTask__priority")
    const input = document.querySelectorAll(".taskCreator__inputGroup input")

    select.selectedIndex = 0
    input.forEach(element => {
        element.value = ""
    })
}

// Verify all required fields of inputs are'nt null
export function verifyNewTaskInput(name, priority) {
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

// Detects the sort type and re-sorts using the other method. For example, with a priority-based sort, tasks with the same priority will be sorted by due date.
export function sortTasks(sortingMode) {
    let tasks = loadStoredTasks()
    if (sortingMode === "sortBy-priority") {
        tasks = sortByDate(tasks)
        tasks = sortByPriority(tasks)
    } else {
        tasks = sortByPriority(tasks)
        tasks = sortByDate(tasks)
    }
    return tasks
}

// Sort tasks by Priority (High: fist, Low: last)
function sortByPriority(taskList) {
    const priorityOrder = {
        Low: 1,
        Medium: 2,
        High: 3
    };
    taskList.sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    return taskList
}

// Sort tasks by Due Date
function sortByDate(taskList) {
    const tasks = loadStoredTasks()
    taskList.sort((a, b) => {
        return convertDateFormat(a.due_date) - convertDateFormat(b.due_date);
    });
    return taskList
}

// Convert date format to sort it easier
function convertDateFormat(date) {
    const [day, month, year] = date.split("/");
    if (date === "No date") return new Date(3000, 0, 1)
    return new Date(year, month - 1, day);
}