import { loadStoredTasks, saveTasks } from "./localstorage.js"
let tasks = loadStoredTasks()
let taskSortMode = "priority";

// Recreates all tasks to put them in the right place
function renderTasks() {
    const oldTasks = document.querySelectorAll(".task");

    oldTasks.forEach(task => task.remove());

    if (taskSortMode === "priority") {
        sortByPriority();
    } else {
        sortByDate();
    }

    tasks.forEach(task => {
        createTaskDiv(
            task.id,
            task.name,
            task.priority,
            task.due_date,
            task.completed
        );
    });

    updateTaskCounter();
}

// When called, it update the tasks counter of the Category lists
function updateTaskCounter() {
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
function clearTaskCreator() {
    const select = document.getElementById("newTask__priority")
    const input = document.querySelectorAll(".taskCreator__inputGroup input")

    select.selectedIndex = 0
    input.forEach(element => {
        element.value = ""
    })
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

// Verify all required fields of inputs are'nt null
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

// Create task in list and in local storage
function createTask(taskName, taskPriority, taskDate) {
    const newTaskid = Date.now().toString()
    if (taskDate) {
        taskDate = taskDate.split("-").reverse().join("/")
    } else {
        taskDate = "No date"
    }

    const newTask = {
        id: newTaskid,
        name: taskName,
        priority: taskPriority,
        due_date: taskDate,
        completed: false,
    }
    tasks.push(newTask);

    saveTasks(tasks);
    renderTasks();
}

// Create HTML code to display the new task in the list
function createTaskDiv(id, name, priority, date, status) {
    let taskCategory = ""
    const newTaskDiv = document.createElement("div")
    let checkedAttribute = ""
    newTaskDiv.className = "task"
    newTaskDiv.id = id
    
    if (status) {
        checkedAttribute = "checked"
        taskCategory = document.getElementById("completedTasksCategory")
    } else {
        taskCategory = document.getElementById("activeTasksCategory")
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
        <p>${date}</p>
        <div class="checkbox-wrapper-13">
            <input type="checkbox" ${checkedAttribute}>
        </div>`

    taskCategory.appendChild(newTaskDiv)
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

            console.log(taskID)

            tasks = tasks.filter(task => task.id !== taskID)

            deletedTask.remove()
            saveTasks(tasks)
            updateTaskCounter()
        })
    })
}

// Change the task status in tasks table, save it to local storage and display the task in the good category and update the task counter
function initTaskStatusChange() {
    let tasksCategories = document.querySelectorAll(".task_category")

    tasksCategories.forEach(category => {
        category.addEventListener("input", (e) => {
            if (!e.target.matches('input[type="checkbox"]')) return

            const updatedTask = e.target.closest(".task")
            const taskID = updatedTask.id
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

// Sort tasks in Priority order + Task creation date. The fist task displayed is the first high priority task your created
function sortByPriority() {
    const priorityOrder = {
        Low: 1,
        Medium: 2,
        High: 3
    };
    tasks.sort((a, b) => {
        return a.id - b.id;
    });
    tasks.sort((a, b) => {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

// Convert the stored date value in other format to sort it easier
function convertDateFormat(date) {
    const [day, month, year] = date.split("/");
    if (date === "No date") return new Date(3000, 0, 1)
    return new Date(year, month - 1, day);
}

function sortByDate() {
    tasks.sort((a, b) => {
        return convertDateFormat(a.due_date) - convertDateFormat(b.due_date);
    });
}

// Init Event listener on "Sort By" radio buttons
function initTaskSorting() {
    const sortRadioButtons = document.querySelectorAll('input[name="sort__choice"]')

    sortRadioButtons.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const sortingMode = e.target.id;
            console.log(sortingMode)

            if (sortingMode === "sortBy-priority") {
                taskSortMode = "priority";
            } else if (sortingMode === "sortBy-dueDate") {
                taskSortMode = "dueDate";
            }
            
            renderTasks();
        })
    })
}

// run the script
function main() {
    renderTasks()
    initCategoryDisplayer()
    initTaskCreatorDisplayer()
    initTaskCreator()
    initTaskDeleteButton()
    initTaskStatusChange()
    initTaskSorting()
}

main()