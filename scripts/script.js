// Clear Text input / Priority Selector / Date Input of the task Creator
function clearInputs() {
    const select = document.getElementById("newTask__priority")
    const input = document.querySelectorAll(".taskCreator__inputGroup input")

    select.selectedIndex = 0;
    input.forEach(element => {
        element.value = ""
    });
}

// Listen "click" on buttons to hide/show Task creator frame
function initTaskCreatorDisplayer() {
    const taskCreatorFrame = document.getElementById("taskCreator__frame")
    const taskCreatorButton = document.getElementById("createTask__button")
    const cancelButton = document.getElementById("cancel-button")

    function toggleDisplay() {
        taskCreatorButton.classList.toggle("active")
        taskCreatorFrame.classList.toggle("hide");
        clearInputs()
    }

    taskCreatorButton.addEventListener("click", () => {
        toggleDisplay()
    })

    cancelButton.addEventListener("click", () => {
        toggleDisplay()
    })
}

function main() {
    initTaskCreatorDisplayer()
}