export function loadStoredTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || []
}

export function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

export function loadSavedTheme() {
    const root = document.documentElement
    const storedPreference = localStorage.getItem("theme") || "light"

    root.setAttribute("data-theme", storedPreference)
}

export function saveTheme(theme) {
    localStorage.setItem("theme", theme)
}

export function loadSavedSortMode() {
    const storedPreference = localStorage.getItem("sortMode") || "sortBy-priority"
    return storedPreference
}

export function saveSortMode(sortMode) {
    localStorage.setItem("sortMode", sortMode)
}