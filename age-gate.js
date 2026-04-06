document.getElementById("btn-entrar").addEventListener("click", () => {
    localStorage.setItem("velvet_18", "true");
    document.getElementById("age-gate").style.display = "none";
});

document.getElementById("btn-salir").addEventListener("click", () => {
    window.location.href = "https://google.com";
});

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("velvet_18") === "true") {
        const gate = document.getElementById("age-gate");
        if (gate) gate.style.display = "none";
    }
});
