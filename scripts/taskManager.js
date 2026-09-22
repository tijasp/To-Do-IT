import { loadStoredTasks, saveTasks } from "./localstorage.js"
import { renderTasks } from "./taskRenderer.js"

// Create task in list and in local storage
export function createTask(taskName, taskPriority, taskDate) {
    const tasks = loadStoredTasks()
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