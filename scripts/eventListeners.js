import { loadSavedSortMode, saveSortMode} from "./localstorage.js"
import { toggleDarkMode, clearTaskCreator, updateTaskCounter, categoryDisplayer, toggleDisplay, deleteTask, deleteCompletedTasks, displayMobileSettings } from "./utils.js"
import { createTask, taskStatusChange } from "./taskManager.js"
import { renderTasks } from "./taskRenderer.js"

// Change the Dark/Light theme when you click on the toggler
function initThemeToggler() {
    document.addEventListener("DOMContentLoaded", () => {
        const togglers = document.querySelectorAll("[data-theme-toggler]")
        togglers.forEach((toggler) => {
            toggler.addEventListener("click", () => {
                toggleDarkMode()
            })
        });
    });
}

// Shows/hides task categories (Active/Completed) when clicking the arrow
function initCategoryDisplay() {
    let arrowButtons = document.querySelectorAll(".arrowCategoryButton")

    arrowButtons.forEach(arrow => {
        arrow.addEventListener("click", (e) => {
            categoryDisplayer(e)
        })
    })
}

// Shows/hides task creator frame when clicking the "Create task" button or "Cancel" button
function initTaskCreatorDisplay() {
    const buttons = [
        document.getElementById("createTask__button"),
        document.getElementById("cancel-button")
    ]

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            clearTaskCreator()
            toggleDisplay()
        })
    })
}

// Launches createTask() function after the task creation form is submitted
function initTaskCreation() {
    const newTaskForm = document.getElementById("taskCreator__frame")
    
    newTaskForm.addEventListener("submit", (event) => {
        event.preventDefault()
        createTask()
    })
}

// Deletes a task when the delete button is clicked
function initTaskDelete() {
    const categories = [
        document.getElementById("activeTasksCategory"),
        document.getElementById("completedTasksCategory")
    ]

    categories.forEach(category => {
        category.addEventListener("click", (e) => {
            const clickedButton = e.target.closest("button")

            if (!clickedButton) return
            if (!clickedButton.classList.contains("delete")) return

            deleteTask(clickedButton)
        })
    })
}

// Detects a change in a task's status after the corresponding checkbox is clicked. The task counter is updated, and the tasks are sorted into their respective categories
function initTaskStatus() {
    const tasksCategories = document.querySelectorAll(".task_category")

    tasksCategories.forEach(category => {
        category.addEventListener("input", (e) => {
            if (!e.target.matches('input[type="checkbox"]')) return

            taskStatusChange(e.target)
            updateTaskCounter()
            renderTasks(e.target.closest("task_category"))
        })
    })
}

// Detects the change in sorting mode. Then sorts the tasks according to the sorting mode
function initTaskSorting() {
    let taskSortMode = loadSavedSortMode()
    const sortRadioButtons = document.querySelectorAll('input[name="sort__choice"]')
    const radioDueDate = document.getElementById("sortBy-dueDate")

    if (taskSortMode === "sortBy-dueDate") radioDueDate.checked = true

    sortRadioButtons.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const sortingMode = e.target.id;

            taskSortMode = sortingMode
            saveSortMode(sortingMode)
            renderTasks()
        })
    })
}

// Deletes all completed tasks after clicking the respective button.
function initDeleteCompletedTasks() {
    const deleteAllButton = document.getElementById("deleteAllTasks__button")

    deleteAllButton.addEventListener("click", () => {
        deleteCompletedTasks()
        renderTasks()
    })
}

function initMobileSettings() {
    const settingsButton = document.getElementById("mobileParameters")

    settingsButton.addEventListener("click", () => {
        displayMobileSettings()
    })
}

function initTaskCreatorDisplayMobile() {
    const button = document.getElementById("createTaskMobile")

    button.addEventListener("click", () => {
        clearTaskCreator()
        toggleDisplay()
    })
}

function windowResize() {
    let isMobile = window.innerWidth <= 768

    window.addEventListener("resize", () => {
        const isNowMobile = window.innerWidth <= 768

        if (isNowMobile !== isMobile) {
            isMobile = isNowMobile
            renderTasks()
        }
    })
}

// Run all the evenListeners of this file.
export function initEventListeners() {
    initThemeToggler()
    initCategoryDisplay()
    initTaskCreatorDisplay()
    initTaskCreation()
    initTaskDelete()
    initTaskStatus()
    initTaskSorting()
    initDeleteCompletedTasks()
    initMobileSettings()
    initTaskCreatorDisplayMobile()
    windowResize()
}