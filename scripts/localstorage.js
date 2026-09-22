// Retrieves the tasks saved in localStorage
export function loadStoredTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || []
}

// Save actual tasks in localStorage
export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

// Retrieves the theme saved in localStorage
export function loadSavedTheme() {
    const root = document.documentElement
    const storedPreference = localStorage.getItem("theme") || "light"

    root.setAttribute("data-theme", storedPreference)
}

// Save actual theme in localStorage
export function saveTheme(theme) {
    localStorage.setItem("theme", theme)
}

// Retrieves the sort mode saved in localStorage
export function loadSavedSortMode() {
    const storedPreference = localStorage.getItem("sortMode") || "sortBy-priority"
    return storedPreference
}

// Save actual sort mode in localStorage
export function saveSortMode(sortMode) {
    localStorage.setItem("sortMode", sortMode)
}