import { saveTasks, loadStoredTasks, saveTheme } from "./localstorage.js"

// Switch the theme and save it to localStorage
export function toggleDarkMode() {
    const root = document.documentElement
    const currentTheme = root.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"
    root.setAttribute("data-theme", newTheme)
    saveTheme(newTheme)
}

// Counts the number of active and completed tasks and updates the task counter.
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

// Reset the task creator's inputs and error messages.
export function clearTaskCreator() {
    const select = document.getElementById("newTask__priority")
    const input = document.querySelectorAll(".taskCreator__inputGroup input")
    const taskErrorName = document.getElementById("taskError_name")

    taskErrorName.classList.add("hide")

    select.selectedIndex = 0
    input.forEach(element => {
        element.value = ""
    })
}

// Check that all required inputs are filled in. Otherwise, display an error message explaining the issue.
export function verifyNewTaskInput(name) {
    const taskErrorName = document.getElementById("taskError_name")

    if (name.value === "") {
        taskErrorName.classList.remove("hide")
        return false
    } else {
        taskErrorName.classList.add("hide")
        return true
    }
}

// Rotate the arrow button and hide/show the desired category.
export function categoryDisplayer(clickedArrow) {
    const currentArrowButton = clickedArrow.target.closest(".arrowCategoryButton")
    const choosedCategory = clickedArrow.target.closest(".task_category")
    const taskListToEdit = choosedCategory.querySelectorAll(".task")

    choosedCategory.classList.toggle("hidden")
    currentArrowButton.classList.toggle("rotated")

    taskListToEdit.forEach(child => {
        child.classList.toggle("hide")
    })
}

export function toggleDisplay() {
    const taskCreatorFrame = document.getElementById("taskCreator__frame")
    const taskCreatorButton = document.getElementById("createTask__button")
    const taskCreatorMobileButton = document.getElementById("createTaskMobile")

    taskCreatorButton.classList.toggle("active")
    taskCreatorFrame.classList.toggle("hide")

    taskCreatorMobileButton.classList.toggle("createTaskMobile")
    taskCreatorMobileButton.classList.toggle("mobile")
    taskCreatorMobileButton.classList.toggle("hide")
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

/// Removes the task from the list and the "tasks" array. Then, saves the current tasks and updates the task counter.
export function deleteTask(clickedButton) {
    const deletedTask = clickedButton.closest(".task")
    const taskID = deletedTask.id

    let tasks = loadStoredTasks()
    tasks = tasks.filter(task => task.id !== taskID)

    deletedTask.remove()
    saveTasks(tasks)
    updateTaskCounter()
}

// Deletes all completed tasks
export function deleteCompletedTasks() {
    let tasks = loadStoredTasks()
    tasks = tasks.filter(task => task.completed === false)
    saveTasks(tasks)
}

export function displayMobileSettings() {
    const elementsToToggle = [
        document.getElementById("mobileParameters"),
        document.querySelector(".mobileTasksOptions")
    ]
    const settingIcon = document.getElementById("settingsIcon")
    settingIcon.classList.toggle("blackFilled")

    elementsToToggle.forEach(element => {
        element.classList.toggle("mobileTempHide")
    })
}

export function verifyDate(date) {
    if (date || date != "No date") {
        let taskDate = convertDateFormat(date)

        let today = new Date()
        today.setHours(0, 0, 0, 0)

        let thisWeek = new Date()
        thisWeek.setDate(thisWeek.getDate() + 7)

        if (taskDate < today) {
            return "High"
        } else if (taskDate <= thisWeek) {
            return "Medium"
        }
    } else return ""
}

export function updateStats(){
    updateProgressBar()
    updateDateStats()
}

// Sort tasks from highest to lowest priority.
function sortByPriority(taskList) {
    const priorityOrder = {
        Nothing: 1,
        Low: 2,
        Medium: 3,
        High: 4
    }
    taskList.sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
    return taskList
}

// Sort the tasks from the nearest due date to the farthest.
function sortByDate(taskList) {
    taskList.sort((a, b) => {
        return convertDateFormat(a.due_date) - convertDateFormat(b.due_date)
    })
    return taskList
}

// Convert due date format to sort it easier
function convertDateFormat(date) {
    const [day, month, year] = date.split("/")
    if (date === "No date") return new Date(3000, 0, 1)
    return new Date(year, month - 1, day)
}

function updateProgressBar() {
    const tasks = loadStoredTasks()
    const progressBar = document.querySelectorAll(".progress-bar")
    const completedTasks = tasks.filter(task => task.completed === true).length
    const progressPercent = completedTasks * 100 / tasks.length

    progressBar.forEach(bar =>
        bar.style = `width: ${progressPercent}%;`
    )
}

function updateDateStats() {
    const tasks = loadStoredTasks()
    const upcomingCounter = document.getElementById("upcomingCount")
    const overdueCounter = document.getElementById("overdueCount")
    let upcommingCount = 0
    let overdueCount = 0

    tasks.forEach(task => {
        if (task.completed == false) {
            let taskDate = convertDateFormat(task.due_date)
            let today = new Date()
            let thisWeek = new Date()
            today.setHours(0, 0, 0, 0)
            thisWeek.setDate(thisWeek.getDate() + 7)

            if (taskDate < today) {
                overdueCount ++
            } else if (taskDate <= thisWeek) {
                upcommingCount ++
            }
        }
    })
    
    upcomingCounter.textContent = upcommingCount
    overdueCounter.textContent = overdueCount
}