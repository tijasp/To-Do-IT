(function () {
    const root = document.documentElement;

    function init() {
        const storedPreference = localStorage.getItem("theme") || "light";
        root.setAttribute("data-theme", storedPreference);
    }
    init();

    document.addEventListener("DOMContentLoaded", function () {
        const togglers = document.querySelectorAll("[data-theme-toggler]");
        togglers.forEach((toggler) => {
            toggler.addEventListener("click", toggleDarkMode);
        });
    });

    function toggleDarkMode() {
        const currentTheme = root.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    }
})();