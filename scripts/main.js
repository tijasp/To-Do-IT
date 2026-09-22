import { loadSavedTheme } from "./localstorage.js"
import { renderTasks } from "./taskRenderer.js"
import { initEventListeners } from "./eventListeners.js"

// run the script
loadSavedTheme()
renderTasks()
initEventListeners()