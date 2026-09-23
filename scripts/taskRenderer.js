import { loadStoredTasks, loadSavedSortMode } from "./localstorage.js"
import { sortTasks, updateTaskCounter, verifyDate, updateStats } from "./utils.js"

// Deletes and recreates all tasks based on the sorting method to ensure an up-to-date task list. And then update de task counter
export function renderTasks() {
    let tasks = loadStoredTasks()
    let taskSortMode = loadSavedSortMode()
    const oldTasks = document.querySelectorAll(".task")

    oldTasks.forEach(task => task.remove())

    tasks = sortTasks(taskSortMode)

    if (self.innerWidth <= 768) {
        tasks.forEach(task => {
            createTaskDivMobile(
                task.id,
                task.name,
                task.priority,
                task.due_date,
                task.completed
            )
        })
    } else {
        tasks.forEach(task => {
            createTaskDiv(
                task.id,
                task.name,
                task.priority,
                task.due_date,
                task.completed
            )
        })
    }
    

    updateTaskCounter()
    updateStats()
}

// Add a task to the HTML
function createTaskDiv(id, name, priority, date, status) {
    let taskCategory = ""
    const newTaskDiv = document.createElement("div")
    let checkedAttribute = ""
    let dateStatusClass = ""
    newTaskDiv.className = "task"
    newTaskDiv.id = id
    
    if (status) {
        checkedAttribute = "checked"
        taskCategory = document.getElementById("completedTasksCategory")
    } else {
        taskCategory = document.getElementById("activeTasksCategory")
    }

    if (taskCategory.classList.contains("hidden")) {
        newTaskDiv.className = "task hide"
    }

    if (priority === "Nothing") priority = "N/A"

    if (taskCategory === document.getElementById("activeTasksCategory")) {
        dateStatusClass = `class="${verifyDate(date)}"`
    }
    
    newTaskDiv.innerHTML = `
        <button class="delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2 6H22M10 11V16M14 11V16M4 6H20L18.42 20.22C18.3658 20.7094 18.1331 21.1616 17.7663 21.49C17.3994 21.8184 16.9244 22 16.432 22H7.568C7.07564 22 6.60056 21.8184 6.23375 21.49C5.86693 21.1616 5.63416 20.7094 5.58 20.22L4 6ZM7.345 3.147C7.50675 2.80397 7.76271 2.514 8.083 2.31091C8.4033 2.10782 8.77474 2 9.154 2H14.846C15.2254 1.99981 15.5971 2.10755 15.9176 2.31064C16.2381 2.51374 16.4942 2.80381 16.656 3.147L18 6H6L7.345 3.147Z" stroke="#FF7174" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <p class="task__name">${name}</p>
        <div class="task__priorityBadge">
            <p class="${priority}">${priority}</p>
        </div>
        <p ${dateStatusClass}>${date}</p>
        <div class="checkbox-wrapper-13">
            <input type="checkbox" ${checkedAttribute}>
        </div>`

    taskCategory.appendChild(newTaskDiv)
}

// Add a task to the HTML (mobile format)
function createTaskDivMobile(id, name, priority, date, status) {
    let taskCategory = ""
    const newTaskDiv = document.createElement("div")
    let checkedAttribute = ""
    let dateStatusClass = ""
    newTaskDiv.className = "task"
    newTaskDiv.id = id
    
    if (status) {
        checkedAttribute = "checked"
        taskCategory = document.getElementById("completedTasksCategory")
    } else {
        taskCategory = document.getElementById("activeTasksCategory")
    }

    if (taskCategory.classList.contains("hidden")) {
        newTaskDiv.className = "task hide"
    }

    if (priority === "Nothing") priority = ""
    if (date === "No date") date = ""
    
    if (taskCategory === document.getElementById("activeTasksCategory")) {
        dateStatusClass = `class="${verifyDate(date)}"`
    }

    newTaskDiv.innerHTML = `
        <button class="delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2 6H22M10 11V16M14 11V16M4 6H20L18.42 20.22C18.3658 20.7094 18.1331 21.1616 17.7663 21.49C17.3994 21.8184 16.9244 22 16.432 22H7.568C7.07564 22 6.60056 21.8184 6.23375 21.49C5.86693 21.1616 5.63416 20.7094 5.58 20.22L4 6ZM7.345 3.147C7.50675 2.80397 7.76271 2.514 8.083 2.31091C8.4033 2.10782 8.77474 2 9.154 2H14.846C15.2254 1.99981 15.5971 2.10755 15.9176 2.31064C16.2381 2.51374 16.4942 2.80381 16.656 3.147L18 6H6L7.345 3.147Z" stroke="#FF7174" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
        <div class="taskInfos">
            <p class="task__name">${name}</p>
            <div class="secondary_infos">
            <div class="task__priorityBadge">
                <p class="${priority}">${priority}</p>
            </div>
                <p ${dateStatusClass}>${date}</p>
            </div>
        </div>
        <div class="checkbox-wrapper-13">
            <input type="checkbox" ${checkedAttribute}>
        </div>`

    taskCategory.appendChild(newTaskDiv)
}