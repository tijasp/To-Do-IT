import { loadStoredTasks, saveTasks } from "./localstorage.js"
import { verifyNewTaskInput, clearTaskCreator } from "./utils.js"
import { renderTasks } from "./taskRenderer.js"

// If all required fields are filled in, a task is created in the "tasks" array and saved to localStorage. Then, the tasks are re-rendered in the HTML, and the input fields in the task creator are cleared
export function createTask() {
    let taskNameInput = document.getElementById("newTask__name")
    let taskPriorityInput = document.getElementById("newTask__priority")
    let taskDueDateInput = document.getElementById("date__picker")

    if (verifyNewTaskInput(taskNameInput, taskPriorityInput)) {
        const tasks = loadStoredTasks()
        const newTaskid = Date.now().toString()
        let taskDate = taskDueDateInput.value

        if (taskDate) {
            taskDate = taskDate.split("-").reverse().join("/")
        } else {
            taskDate = "No date"
        }
    
        const newTask = {
            id: newTaskid,
            name: taskNameInput.value,
            priority: taskPriorityInput.value,
            due_date: taskDate,
            completed: false,
        }

        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();
        clearTaskCreator()
    }
}

// Changes the status of a task in the "tasks" array, then saves
export function taskStatusChange(clickedCheckbox) {
    const tasks = loadStoredTasks()
    const updatedTask = clickedCheckbox.closest(".task")
    let taskID = updatedTask.id
    const task = tasks.find(task => task.id === taskID);
    
    if (clickedCheckbox.checked) {
        task.completed = true
    } else {
        task.completed = false
    }
    
    saveTasks(tasks)
}