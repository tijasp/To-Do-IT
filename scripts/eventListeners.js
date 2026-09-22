import { loadStoredTasks, saveTasks , loadSavedSortMode, saveSortMode} from "./localstorage.js"
import { toggleDarkMode, clearTaskCreator, verifyNewTaskInput, updateTaskCounter } from "./utils.js"
import { createTask } from "./taskManager.js"
import { renderTasks } from "./taskRenderer.js"

// Change the theme when you click on theme toggle button
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

// Hide/Display Tasks category by clicking arrows
function initCategoryDisplayer() {
    let arrowButtons = document.querySelectorAll(".arrowCategoryButton")

    arrowButtons.forEach(arrow => {
        arrow.addEventListener("click", (e) => {
            const currentArrowButton = e.target.closest(".arrowCategoryButton")
            currentArrowButton.classList.toggle("rotated")

            const choosedCategory = e.target.closest(".task_category")
            const taskListToEdit = choosedCategory.querySelectorAll(".task")
            taskListToEdit.forEach(child => {
                child.classList.toggle("hide")
            })
        })
    })
}

// Display/Hide the task creator frame
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

// Verify all required infos are set, create task, and clear inputs
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
                taskDueDateInput.value
            )

            clearTaskCreator()
        }
    })
}

// Delete a task from list and save localstorage after
function initTaskDeleteButton() {
    const categories = [
        document.getElementById("activeTasksCategory"),
        document.getElementById("completedTasksCategory")
    ]

    categories.forEach(category => {
        category.addEventListener("click", (e) => {
            const deleteButton = e.target.closest(".delete")
            if (!deleteButton) return

            const deletedTask = deleteButton.closest(".task")
            const taskID = deletedTask.id

            let tasks = loadStoredTasks()
            tasks = tasks.filter(task => task.id !== taskID)

            deletedTask.remove()
            saveTasks(tasks)
            updateTaskCounter()
        })
    })
}

// Change the task status in tasks table, save it to local storage and display the task in the good category and update the task counter
function initTaskStatusChange() {
    const tasksCategories = document.querySelectorAll(".task_category")

    tasksCategories.forEach(category => {
        category.addEventListener("input", (e) => {
            if (!e.target.matches('input[type="checkbox"]')) return

            const tasks = loadStoredTasks()
            const updatedTask = e.target.closest(".task")
            let taskID = updatedTask.id
            const task = tasks.find(task => task.id === taskID);

            if (e.target.checked) {
                task.completed = true
            } else {
                task.completed = false
            }

            saveTasks(tasks)
            updateTaskCounter()
            renderTasks()
        })
    })
}

// Init Event listener on "Sort By" radio buttons
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

// Delete all tasks with status "Completed" and save new task list
function initDeleteAllTasksButton() {
    const deleteAllButton = document.getElementById("deleteAllTasks__button")

    deleteAllButton.addEventListener("click", () => {
        let tasks = loadStoredTasks()
        tasks = tasks.filter(task => task.completed === false)
        saveTasks(tasks)
        renderTasks()
    })
}


// Create all Event Listeners of the script
export function initEventListeners() {
    initThemeToggler()
    initCategoryDisplayer()
    initTaskCreatorDisplayer()
    initTaskCreator()
    initTaskDeleteButton()
    initTaskStatusChange()
    initTaskSorting()
    initDeleteAllTasksButton()
}